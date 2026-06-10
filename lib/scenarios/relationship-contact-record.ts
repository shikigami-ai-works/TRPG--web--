import type { CompletedRunRecord } from "./storage";
import type { RewardDefinition, ScenarioPack } from "./types";

export const DEFAULT_RELATIONSHIP_CONTACT_NPC_ID = "minase_akari";

export type RelationshipContactCategory =
  | "active_contact_record"
  | "memory_contact_trace"
  | "shared_boundary_record"
  | "lost_relationship_trace"
  | "no_record";

export interface RelationshipContactRecord {
  scenarioId: string;
  npcId: string;
  npcName: string;
  category: RelationshipContactCategory;
  statusLabel: string;
  summary: string;
  detail: string;
  eligibilityDetail: string;
  sourceEndingId?: string;
  sourceEndingTitle?: string;
  sourceRunId?: string;
  completedAt?: string;
  trustLabel?: string;
  rewardLabels: string[];
}

export function buildRelationshipContactRecordForRun(
  pack: ScenarioPack,
  record: CompletedRunRecord,
  npcId = DEFAULT_RELATIONSHIP_CONTACT_NPC_ID,
): RelationshipContactRecord {
  if (record.scenarioId !== pack.scenario.id) {
    return buildNoRecord(pack, npcId);
  }

  const ending = pack.endings.find((candidate) => candidate.id === record.endingId);
  if (!ending) {
    return buildNoRecord(pack, npcId);
  }

  const npcName = formatNpcLabel(pack, npcId);
  const category = classifyEndingRecord(record, ending.result ?? {}, npcId);
  if (category === "no_record") {
    return buildNoRecord(pack, npcId);
  }

  const trustLabel = category === "lost_relationship_trace" ? undefined : formatTrustLabel(npcName, record.finalTrust[npcId]);

  return {
    scenarioId: pack.scenario.id,
    npcId,
    npcName,
    category,
    ...formatCategoryCopy(category, ending.title),
    sourceEndingId: record.endingId,
    sourceEndingTitle: ending.title,
    sourceRunId: record.runId,
    completedAt: record.completedAt,
    trustLabel,
    rewardLabels: formatRelationshipRewards(pack, record.rewards, npcId),
  };
}

export function buildBestRelationshipContactRecord(
  pack: ScenarioPack,
  history: CompletedRunRecord[],
  npcId = DEFAULT_RELATIONSHIP_CONTACT_NPC_ID,
): RelationshipContactRecord {
  const records = history
    .filter((record) => record.scenarioId === pack.scenario.id)
    .map((record) => buildRelationshipContactRecordForRun(pack, record, npcId))
    .filter((record) => record.category !== "no_record");

  if (!records.length) {
    return buildNoRecord(pack, npcId);
  }

  return records.sort(compareRelationshipRecords)[0];
}

function classifyEndingRecord(
  record: CompletedRunRecord,
  result: Record<string, boolean>,
  npcId: string,
): RelationshipContactCategory {
  if (result.player_returns && result.npc_returns && result.relationship_asset_preserved) {
    return "active_contact_record";
  }

  if (result.player_stays_with_npc && result.relationship_asset_preserved) {
    return "shared_boundary_record";
  }

  if (
    result.player_returns &&
    result.npc_returns === false &&
    (result.npc_memory_inheritance || result.relationship_asset_preserved || hasNpcRelationshipReward(record.rewards, npcId))
  ) {
    return "memory_contact_trace";
  }

  if (result.relationship_asset_preserved === false || result.npc_memory_inheritance === false || record.endingType === "lost") {
    return "lost_relationship_trace";
  }

  return "no_record";
}

function compareRelationshipRecords(left: RelationshipContactRecord, right: RelationshipContactRecord): number {
  const rankDiff = categoryRank(left.category) - categoryRank(right.category);
  if (rankDiff !== 0) {
    return rankDiff;
  }

  return (right.completedAt ?? "").localeCompare(left.completedAt ?? "");
}

function categoryRank(category: RelationshipContactCategory): number {
  switch (category) {
    case "active_contact_record":
      return 1;
    case "shared_boundary_record":
      return 2;
    case "memory_contact_trace":
      return 3;
    case "lost_relationship_trace":
      return 4;
    case "no_record":
      return 5;
  }
}

function buildNoRecord(pack: ScenarioPack, npcId: string): RelationshipContactRecord {
  const npcName = formatNpcLabel(pack, npcId);

  return {
    scenarioId: pack.scenario.id,
    npcId,
    npcName,
    category: "no_record",
    statusLabel: "まだ記録されていない縁",
    summary: "灯との縁はまだ記録されていない。",
    detail: "クリア後の到達記録が増えると、ここに残った記憶や連絡先の痕跡を表示できる。",
    eligibilityDetail: "到達済みの記録がまだないため、この欄には灯との縁を表示していません。",
    rewardLabels: [],
  };
}

function formatCategoryCopy(
  category: Exclude<RelationshipContactCategory, "no_record">,
  endingTitle: string,
): Pick<RelationshipContactRecord, "statusLabel" | "summary" | "detail" | "eligibilityDetail"> {
  switch (category) {
    case "active_contact_record":
      return {
        statusLabel: "連絡先の痕跡が残っている",
        summary: "灯との縁が、帰還後の記録として残っている。",
        detail: `${endingTitle}。同じ灯を見て帰った記録。`,
        eligibilityDetail:
          "到達済みの記録から、帰還後にも縁の痕跡を表示してよいと判定しています。まだやりとりする欄ではありません。",
      };
    case "memory_contact_trace":
      return {
        statusLabel: "記憶の断片として残っている",
        summary: "灯は向こう側に残った。けれど、記憶の断片と約束の痕跡は残っている。",
        detail: `${endingTitle}。連絡先ではなく、戻る理由として残った縁。`,
        eligibilityDetail:
          "到達済みの記録から、記憶と約束の痕跡だけを表示しています。帰還後の連絡先そのものではありません。",
      };
    case "shared_boundary_record":
      return {
        statusLabel: "そばに残った記録",
        summary: "帰還ではなく、灯のいる境界に残った記録。",
        detail: `${endingTitle}。連絡先ではなく、そばに残った縁。`,
        eligibilityDetail:
          "到達済みの記録から、境界で灯のそばに残った縁として表示しています。戻った世界の連絡先ではありません。",
      };
    case "lost_relationship_trace":
      return {
        statusLabel: "この周回では残らなかった",
        summary: "この周回では、灯との連絡先の痕跡は残らなかった。",
        detail: `${endingTitle}。過去の到達記録がある場合だけ、別の記録として灯との縁を見返せる。`,
        eligibilityDetail:
          "この到達記録だけでは、灯との接触めいた痕跡を表示できません。過去の強い記録がある場合だけ別の縁として残ります。",
      };
  }
}

function formatRelationshipRewards(pack: ScenarioPack, rewards: RewardDefinition[], npcId: string): string[] {
  return rewards.filter((reward) => isRelationshipRewardForNpc(reward, npcId)).map((reward) => formatReward(pack, reward));
}

function hasNpcRelationshipReward(rewards: RewardDefinition[], npcId: string): boolean {
  return rewards.some((reward) => isRelationshipRewardForNpc(reward, npcId));
}

function isRelationshipRewardForNpc(reward: RewardDefinition, npcId: string): boolean {
  return reward.npc_id === npcId && (reward.type === "relationship_asset" || reward.type === "memory_fragment");
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

function formatTrustLabel(npcName: string, value: number | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return `${npcName}: ${formatTrustBand(value)}`;
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

function formatRewardTypeLabel(type: string): string {
  switch (type) {
    case "memory_fragment":
      return "記憶の断片";
    case "relationship_asset":
      return "関係のしるし";
    default:
      return "結末の痕跡";
  }
}

function formatNpcLabel(pack: ScenarioPack, npcId: string): string {
  return pack.npcs.find((npc) => npc.id === npcId)?.name ?? "関係の痕跡";
}

function formatItemLabel(pack: ScenarioPack, itemId: string): string {
  return pack.items.find((item) => item.id === itemId)?.name ?? "持ち帰りの痕跡";
}
