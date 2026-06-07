import { getReachedEndings, type CompletedRunRecord } from "./storage";
import type { EndingDefinition, RewardDefinition, ScenarioPack } from "./types";

export type EndingProgressStatus = "reached" | "locked";

interface EndingProgressBase {
  endingId: string;
  endingType: string;
  status: EndingProgressStatus;
  title: string;
  description: string;
  unlocks: string[];
  rewards: string[];
}

export interface ReachedEndingProgressEntry extends EndingProgressBase {
  status: "reached";
  count: number;
  firstCompletedAt: string;
  latestCompletedAt: string;
  hiddenDescription?: string;
  latestRunSummary: {
    carryOutLabel: string;
    relationshipLabel: string;
    contaminationLabel: string;
  };
  unlockedTraceLabel?: string;
}

export interface LockedEndingProgressEntry extends EndingProgressBase {
  status: "locked";
}

export type EndingProgressEntry = ReachedEndingProgressEntry | LockedEndingProgressEntry;

export function buildEndingProgressEntries(pack: ScenarioPack, history: CompletedRunRecord[]): EndingProgressEntry[] {
  const scenarioHistory = history.filter((record) => record.scenarioId === pack.scenario.id);
  const reachedEndings = getReachedEndings(scenarioHistory);
  const reachedById = new Map(reachedEndings.map((ending) => [ending.endingId, ending]));
  const entries: EndingProgressEntry[] = [];

  orderEndingsForProgress(pack).forEach((ending) => {
    const reached = reachedById.get(ending.id);
    const latestRun = findLatestRunForEnding(scenarioHistory, ending.id);
    if (!reached && !ending.ending_tree?.visible_before_unlock) {
      return;
    }

    if (reached) {
      entries.push({
        endingId: ending.id,
        endingType: ending.ending_type,
        status: "reached",
        title: ending.title,
        description: ending.description,
        count: reached.count,
        firstCompletedAt: reached.firstCompletedAt,
        latestCompletedAt: reached.latestCompletedAt,
        hiddenDescription: ending.hidden_description,
        latestRunSummary: latestRun
          ? {
              carryOutLabel: formatCarryOutSummary(pack, latestRun),
              relationshipLabel: formatRelationshipSummary(pack, latestRun),
              contaminationLabel: formatContaminationSummary(latestRun),
            }
          : {
              carryOutLabel: "最新ランの持ち帰り記録はまだありません。",
              relationshipLabel: "最新ランの関係記録はまだありません。",
              contaminationLabel: "最新ランの境界状態はまだありません。",
            },
        unlockedTraceLabel: latestRun?.unlocks.length ? `記憶の痕跡 ${latestRun.unlocks.length}件` : undefined,
        unlocks: [...(latestRun?.unlocks ?? ending.unlocks ?? [])],
        rewards: (latestRun?.rewards ?? ending.rewards ?? []).map((reward) => formatReward(pack, reward)),
      });
      return;
    }

    entries.push({
      endingId: ending.id,
      endingType: ending.ending_type,
      status: "locked",
      title: ending.ending_tree?.blurred_title ?? "未確認の結末",
      description: ending.ending_tree?.route_hint ?? "まだ手がかりはありません。",
      unlocks: [],
      rewards: [],
    });
  });

  return entries;
}

function findLatestRunForEnding(history: CompletedRunRecord[], endingId: string): CompletedRunRecord | undefined {
  return history
    .filter((record) => record.endingId === endingId)
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))[0];
}

function orderEndingsForProgress(pack: ScenarioPack): EndingDefinition[] {
  const byId = new Map(pack.endings.map((ending) => [ending.id, ending]));
  const orderedIds = pack.scenario.ending_resolution_order ?? [];
  const ordered = orderedIds.map((endingId) => byId.get(endingId)).filter((ending): ending is EndingDefinition => Boolean(ending));
  const remaining = pack.endings.filter((ending) => !orderedIds.includes(ending.id));

  return [...ordered, ...remaining];
}

function formatReward(pack: ScenarioPack, reward: RewardDefinition): string {
  if (reward.description) {
    return reward.description;
  }

  const details = [
    formatRewardTypeLabel(reward.type),
    reward.npc_id ? formatNpcLabel(pack, reward.npc_id) : undefined,
    reward.item_ids?.map((itemId) => formatItemLabel(pack, itemId)).join(" / "),
    reward.amount !== undefined ? `${reward.amount}` : undefined,
    reward.max_count !== undefined ? `${reward.max_count}` : undefined,
  ].filter(Boolean);

  return details.length ? details.join(" / ") : "結末の痕跡";
}

function formatCarryOutSummary(pack: ScenarioPack, record: CompletedRunRecord): string {
  const groups = Object.entries(record.carryOutSelections).filter(([, itemIds]) => itemIds.length > 0);
  if (!groups.length) {
    return "今回は境界の向こうへ持ち出したものはありません。";
  }

  return groups
    .map(([groupId, itemIds]) => {
      const limit = pack.scenario.mechanics?.carry_out_groups?.find((group) => group.id === groupId)?.max_count_at_clear;
      return `${formatCarryGroupLabel(groupId)}: ${itemIds.map((itemId) => formatItemLabel(pack, itemId)).join(" / ")} (${itemIds.length}/${
        limit ?? "-"
      })`;
    })
    .join(" / ");
}

function formatRelationshipSummary(pack: ScenarioPack, record: CompletedRunRecord): string {
  const trustEntries = Object.entries(record.finalTrust);
  if (!trustEntries.length) {
    return "関係の記録は残っていません。";
  }

  return trustEntries.map(([npcId, value]) => `${formatNpcLabel(pack, npcId)}: ${formatTrustBand(value)}`).join(" / ");
}

function formatContaminationSummary(record: CompletedRunRecord): string {
  const contamination = record.finalCounters.boundary_contamination;
  if (contamination === undefined) {
    return "境界侵食値は記録されていません。";
  }

  return `境界: ${formatContaminationBand(contamination)} (${contamination})`;
}

function formatRewardTypeLabel(type: string): string {
  switch (type) {
    case "memory_fragment":
      return "記憶の断片";
    case "relationship_asset":
      return "関係のしるし";
    case "carry_out_choice":
      return "持ち帰りの余白";
    default:
      return "結末の痕跡";
  }
}

function formatCarryGroupLabel(groupId: string): string {
  if (groupId === "four_room_artifact") {
    return "四方のアーティファクト";
  }

  return "持ち帰りの品";
}

function formatNpcLabel(pack: ScenarioPack, npcId: string): string {
  return pack.npcs.find((npc) => npc.id === npcId)?.name ?? "関係の痕跡";
}

function formatItemLabel(pack: ScenarioPack, itemId: string): string {
  return pack.items.find((item) => item.id === itemId)?.name ?? "持ち帰りの痕跡";
}

function formatTrustBand(value: number): string {
  if (value >= 80) {
    return "同じ光を見ようとしている";
  }
  if (value >= 55) {
    return "隣にいても離れすぎていない";
  }
  if (value >= 30) {
    return "少しだけ言葉を預けている";
  }
  if (value > 0) {
    return "まだ警戒している";
  }
  return "関係は見えていない";
}

function formatContaminationBand(value: number): string {
  if (value >= 6) {
    return "危険";
  }
  if (value >= 3) {
    return "揺らぎ";
  }
  if (value >= 1) {
    return "微細";
  }
  return "安定";
}
