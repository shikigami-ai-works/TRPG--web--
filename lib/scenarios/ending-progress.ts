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
}

export interface LockedEndingProgressEntry extends EndingProgressBase {
  status: "locked";
}

export type EndingProgressEntry = ReachedEndingProgressEntry | LockedEndingProgressEntry;

export function buildEndingProgressEntries(pack: ScenarioPack, history: CompletedRunRecord[]): EndingProgressEntry[] {
  const reachedEndings = getReachedEndings(history);
  const reachedById = new Map(reachedEndings.map((ending) => [ending.endingId, ending]));
  const entries: EndingProgressEntry[] = [];

  orderEndingsForProgress(pack).forEach((ending) => {
    const reached = reachedById.get(ending.id);
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
        unlocks: [...(ending.unlocks ?? [])],
        rewards: (ending.rewards ?? []).map(formatReward),
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

function orderEndingsForProgress(pack: ScenarioPack): EndingDefinition[] {
  const byId = new Map(pack.endings.map((ending) => [ending.id, ending]));
  const orderedIds = pack.scenario.ending_resolution_order ?? [];
  const ordered = orderedIds.map((endingId) => byId.get(endingId)).filter((ending): ending is EndingDefinition => Boolean(ending));
  const remaining = pack.endings.filter((ending) => !orderedIds.includes(ending.id));

  return [...ordered, ...remaining];
}

function formatReward(reward: RewardDefinition): string {
  if (reward.description) {
    return reward.description;
  }

  const details = [
    reward.type,
    reward.npc_id,
    reward.item_ids?.join(", "),
    reward.amount !== undefined ? `${reward.amount}` : undefined,
    reward.max_count !== undefined ? `max ${reward.max_count}` : undefined,
  ].filter(Boolean);

  return details.length ? details.join(" / ") : reward.id;
}
