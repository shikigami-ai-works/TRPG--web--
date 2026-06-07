import type {
  ClueDefinition,
  ClueRevealCondition,
  ClueRevealTerm,
  ClueSourceReference,
  ScenarioPack,
  ScenarioRuntimeState,
  ClueCategory,
} from "../scenarios/types";

export type EvidenceCategory = ClueCategory;

export interface EvidenceEntry {
  id: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  source: string;
}

const FALLBACK_FLAG_EVIDENCE: Record<string, Omit<EvidenceEntry, "id">> = {
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

  const flagEntries = pack.clues.length ? deriveClueEvidenceEntries(pack, state) : deriveFallbackFlagEvidenceEntries(pack, state);
  entries.push(...flagEntries);

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
      source: formatLegacyEvidenceSource(pack, item.found_in_scene_id ?? "inventory"),
    });
  });

  return entries;
}

function deriveFallbackFlagEvidenceEntries(pack: ScenarioPack, state: ScenarioRuntimeState): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  Object.entries(FALLBACK_FLAG_EVIDENCE).forEach(([flag, entry]) => {
    if (state.flags[flag]) {
      entries.push({ ...entry, id: `flag:${flag}`, source: formatLegacyEvidenceSource(pack, entry.source) });
    }
  });

  return entries;
}

function deriveClueEvidenceEntries(pack: ScenarioPack, state: ScenarioRuntimeState): EvidenceEntry[] {
  return pack.clues
    .filter((clue) => isClueRevealed(clue.reveal, state))
    .map((clue) => ({
      id: formatClueEvidenceId(clue),
      title: clue.title,
      category: clue.category,
      description: clue.description,
      source: formatClueSources(pack, clue.sources),
    }));
}

function formatClueEvidenceId(clue: ClueDefinition): string {
  const revealTerm = getSingleRevealTerm(clue.reveal);
  if (revealTerm) {
    const revealId = getRevealTermId(revealTerm);
    if (revealId) {
      return `${revealId.kind}:${revealId.id}`;
    }
  }

  return `clue:${clue.id}`;
}

function isClueRevealed(reveal: ClueRevealCondition, state: ScenarioRuntimeState): boolean {
  if ("any" in reveal) {
    return reveal.any.some((term) => isRevealTermMet(term, state));
  }
  if ("all" in reveal) {
    return reveal.all.every((term) => isRevealTermMet(term, state));
  }

  return isRevealTermMet(reveal, state);
}

function isRevealTermMet(term: ClueRevealTerm, state: ScenarioRuntimeState): boolean {
  if ("flag" in term) {
    return state.flags[term.flag] === true;
  }
  if ("item" in term) {
    return state.inventory.includes(term.item);
  }
  if ("action" in term) {
    return state.usedActionIds.includes(term.action);
  }
  return state.usedActionIds.includes(term.check);
}

function getSingleRevealTerm(reveal: ClueRevealCondition): ClueRevealTerm | undefined {
  if ("any" in reveal) {
    return reveal.any.length === 1 ? reveal.any[0] : undefined;
  }
  if ("all" in reveal) {
    return reveal.all.length === 1 ? reveal.all[0] : undefined;
  }

  return reveal;
}

function getRevealTermId(term: ClueRevealTerm): { kind: "flag" | "item" | "action" | "check"; id: string } | undefined {
  if ("flag" in term) {
    return { kind: "flag", id: term.flag };
  }
  if ("item" in term) {
    return { kind: "item", id: term.item };
  }
  if ("action" in term) {
    return { kind: "action", id: term.action };
  }
  if ("check" in term) {
    return { kind: "check", id: term.check };
  }
  return undefined;
}

function formatClueSources(pack: ScenarioPack, sources: ClueSourceReference[]): string {
  const labels = sources.map((source) => formatClueSource(pack, source)).filter(Boolean);
  return labels.length ? unique(labels).join(" / ") : "出どころ未確認";
}

function formatClueSource(pack: ScenarioPack, source: ClueSourceReference): string {
  switch (source.type) {
    case "scene":
      return pack.scenes.find((scene) => scene.id === source.id)?.title ?? "出どころ未確認";
    case "item":
      return pack.items.find((item) => item.id === source.id)?.name ?? "出どころ未確認";
    case "action":
      return findActionLabel(pack, source.id) ?? "出どころ未確認";
    case "check":
      return findCheckLabel(pack, source.id) ?? "出どころ未確認";
    default:
      return "出どころ未確認";
  }
}

function findActionLabel(pack: ScenarioPack, actionId: string): string | undefined {
  for (const scene of pack.scenes) {
    const action = (scene.available_actions ?? []).find((candidate) => candidate.id === actionId);
    if (action) {
      return action.label;
    }
  }
  return undefined;
}

function findCheckLabel(pack: ScenarioPack, checkId: string): string | undefined {
  for (const scene of pack.scenes) {
    const check = (scene.checks ?? []).find((candidate) => candidate.id === checkId);
    if (check) {
      return check.label;
    }
  }
  return undefined;
}

function formatLegacyEvidenceSource(pack: ScenarioPack, sourceId: string): string {
  if (sourceId === "inventory") {
    return "所持品";
  }

  return pack.scenes.find((scene) => scene.id === sourceId)?.title ?? sourceId;
}

function unique(values: string[]): string[] {
  const seen: Record<string, true> = {};
  return values.filter((value) => {
    if (seen[value]) {
      return false;
    }
    seen[value] = true;
    return true;
  });
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
