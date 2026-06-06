import type { ScenarioPack, ScenarioRuntimeState } from "../scenarios/types";

export type EvidenceCategory = "confirmed" | "inference" | "testimony" | "polluted_memory" | "unverified";

export interface EvidenceEntry {
  id: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  source: string;
}

const FLAG_EVIDENCE: Record<string, Omit<EvidenceEntry, "id">> = {
  noticed_parallel_displacement: {
    title: "世界のズレ",
    category: "confirmed",
    description: "店名、掲示、ニュースの日付が探索者の世界と食い違っている。",
    source: "scene_001_parallel_arrival",
  },
  said_not_replacement: {
    title: "代わりではないという宣言",
    category: "testimony",
    description: "探索者は灯に、死んだ親友の代わりではないと伝えた。",
    source: "scene_001_parallel_arrival",
  },
  acted_as_dead_friend: {
    title: "親友本人としての振る舞い",
    category: "polluted_memory",
    description: "灯を落ち着かせるための振る舞いが、境界の認識を濁している。",
    source: "scene_001_parallel_arrival",
  },
  akari_regret_spoken: {
    title: "祝えなかった誕生日",
    category: "testimony",
    description: "灯は事故と、渡せなかった誕生日プレゼントへの未練を話した。",
    source: "scene_002_accident_trace",
  },
  gift_respected_unopened: {
    title: "未開封のまま残す判断",
    category: "confirmed",
    description: "誕生日プレゼントの中身を詮索しない選択が、灯の信頼を保っている。",
    source: "scene_002_accident_trace",
  },
  found_cult_recovery_trace: {
    title: "帰還の環の痕跡",
    category: "inference",
    description: "事故現場から一部の遺留品が不自然に消え、支援団体の名が浮かんだ。",
    source: "scene_002_accident_trace",
  },
  akari_rested_in_empty_house: {
    title: "空き家での休息",
    category: "testimony",
    description: "灯が少しだけ息をつける場所として、空き家が機能している。",
    source: "scene_003_empty_house",
  },
  dead_friend_home_respected: {
    title: "詮索しない距離",
    category: "confirmed",
    description: "死んだ親友の家を暴かない判断が、探索者と灯の距離を保った。",
    source: "scene_003_empty_house",
  },
  confirmed_empty_house_identity: {
    title: "空き家の正体",
    category: "confirmed",
    description: "表札、間取り、止まったカレンダーが、ここが平行世界側の探索者の家だと示している。",
    source: "scene_003_empty_house",
  },
};

export function deriveEvidenceEntries(pack: ScenarioPack, state: ScenarioRuntimeState): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  Object.entries(FLAG_EVIDENCE).forEach(([flag, entry]) => {
    if (state.flags[flag]) {
      entries.push({ ...entry, id: `flag:${flag}`, source: formatEvidenceSource(pack, entry.source) });
    }
  });

  state.inventory.forEach((itemId) => {
    const item = pack.items.find((candidate) => candidate.id === itemId);
    if (!item) {
      return;
    }
    entries.push({
      id: `item:${item.id}`,
      title: item.name,
      category: "confirmed",
      description: item.description,
      source: formatEvidenceSource(pack, item.found_in_scene_id ?? "inventory"),
    });
  });

  return entries;
}

function formatEvidenceSource(pack: ScenarioPack, sourceId: string): string {
  if (sourceId === "inventory") {
    return "所持品";
  }

  return pack.scenes.find((scene) => scene.id === sourceId)?.title ?? sourceId;
}

export function formatEvidenceCategory(category: EvidenceCategory): string {
  switch (category) {
    case "confirmed":
      return "確定";
    case "inference":
      return "推測";
    case "testimony":
      return "証言";
    case "polluted_memory":
      return "汚染記憶";
    case "unverified":
      return "未検証";
    default:
      return category;
  }
}
