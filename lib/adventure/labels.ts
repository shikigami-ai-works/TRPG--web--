import type { ScenarioRuntimeState } from "../scenarios/types";

export const TARGET_SCENARIO_ID = "kimidake_ga_oboeteiru_jiko";

const ACTION_TYPE_LABELS: Record<string, string> = {
  conversation: "会話",
  story: "行動",
  danger: "危険",
  ending_choice: "最終選択",
};

const ENDING_TYPE_LABELS: Record<string, string> = {
  true: "トゥルー",
  good: "グッド",
  normal: "ノーマル",
  bad: "バッド",
  lost: "ロスト",
};

const SCENE_TYPE_LABELS: Record<string, string> = {
  intro: "導入",
  exploration: "探索",
  danger: "危機",
  climax: "山場",
  ending: "終幕",
};

const STAT_LABELS: Record<string, string> = {
  strength: "筋力",
  constitution: "体力",
  dexterity: "敏捷",
  appearance: "外見",
  intelligence: "知性",
  willpower: "意志",
  education: "教養",
  luck: "幸運",
  combat: "戦闘",
};

const SKILL_LABELS: Record<string, string> = {
  observe: "観察",
  listen: "聞き耳",
  search: "探索",
  persuade: "説得",
  occult: "オカルト",
  medicine: "医学",
  stealth: "隠密",
  combat: "戦闘",
  library_use: "図書館",
  dodge: "回避",
  sanity: "正気",
  melee_or_firearm: "近接/射撃",
  none: "なし",
};

const COUNTER_LABELS: Record<string, string> = {
  boundary_contamination: "境界侵食",
  boundary_contamination_limit: "侵食上限",
  four_room_artifacts_taken: "四方遺物取得",
  four_room_artifacts_returned: "四方遺物返却",
  four_room_artifacts_carried_out: "持ち帰り遺物",
};

const CARRY_GROUP_LABELS: Record<string, string> = {
  four_room_artifact: "四方アーティファクト",
};

export function formatActionTypeLabel(type: string): string {
  return ACTION_TYPE_LABELS[type] ?? type;
}

export function formatSceneTypeLabel(type: string): string {
  return SCENE_TYPE_LABELS[type] ?? type;
}

export function formatStatLabel(statId: string): string {
  return STAT_LABELS[statId] ?? statId;
}

export function formatSkillLabel(skillId: string): string {
  return SKILL_LABELS[skillId] ?? skillId;
}

export function formatCounterLabel(counterId: string): string {
  return COUNTER_LABELS[counterId] ?? counterId;
}

export function formatCarryGroupLabel(groupId: string): string {
  return CARRY_GROUP_LABELS[groupId] ?? groupId;
}

export function formatEndingTypeLabel(type: string): string {
  return ENDING_TYPE_LABELS[type] ?? type;
}

export function formatTrustBand(value: number): string {
  if (value >= 80) {
    return "同じ光を見ようとしている";
  }
  if (value >= 55) {
    return "隣にいても遠ざけない";
  }
  if (value >= 30) {
    return "少しだけ言葉を預けている";
  }
  if (value > 0) {
    return "まだ警戒している";
  }
  return "関係は見えていない";
}

export function formatContaminationBand(value: number): string {
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

export function formatMemoryBand(state: ScenarioRuntimeState): string {
  if (state.flags.regret_resolved) {
    return "輪郭が戻りつつある";
  }
  if ((state.counters.boundary_contamination ?? 0) >= 3) {
    return "記憶にざらつきがある";
  }
  if (state.flags.noticed_parallel_displacement || state.flags.confirmed_empty_house_identity) {
    return "違和感を覚えている";
  }
  return "まだ安定している";
}

export function formatRollSummary(total: number, targetNumber: number, success: boolean): string {
  return `${total} / 目標 ${targetNumber} ${success ? "成功" : "失敗"}`;
}
