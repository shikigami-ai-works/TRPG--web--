import { deriveEvidenceEntries, formatEvidenceCategory, type EvidenceEntry } from "./evidence";
import {
  formatActionTypeLabel,
  formatCarryGroupLabel,
  formatContaminationBand,
  formatEndingTypeLabel,
  formatMemoryBand,
  formatSceneTypeLabel,
  formatSkillLabel,
  formatTrustBand,
} from "./labels";
import { canUseRequirements, getCarryOutGroups, groupOwnedItems } from "../scenarios/runtime";
import type {
  ScenarioPack,
  ScenarioRuntimeState,
  EndingDefinition,
  SceneActionDefinition,
  SceneCheckDefinition,
  SceneDefinition,
} from "../scenarios/types";

export interface AdventureChoiceView {
  id: string;
  label: string;
  typeLabel: string;
  kind: "action" | "check";
  action?: SceneActionDefinition;
  check?: SceneCheckDefinition;
  detail: string;
  danger: boolean;
}

export interface AdventureStatusView {
  contamination: number;
  contaminationLabel: string;
  memoryLabel: string;
  trustValue: number;
  trustLabel: string;
  objectiveLabel: string;
  evidenceCount: number;
  logCount: number;
}

export interface AdventureCarryOutItemView {
  id: string;
  label: string;
  selected: boolean;
  disabled: boolean;
}

export interface AdventureCarryOutGroupView {
  id: string;
  label: string;
  selectedCount: number;
  limit?: number;
  warning?: string;
  items: AdventureCarryOutItemView[];
}

export interface AdventureEndingSummaryView {
  outcomeLabel: string;
  carryOutLabel: string;
  inspectionLabel: string;
}

export type AdventureReplayHintFamily = "branch" | "evidence" | "carry_out";

export interface AdventureReplayHintView {
  family: AdventureReplayHintFamily;
  label: string;
  text: string;
  detail?: string;
}

export type AdventureLogKind = "action" | "check" | "scene" | "ending" | "note";

export interface AdventureLogEntry {
  id: string;
  kind: AdventureLogKind;
  kindLabel: string;
  text: string;
  detail?: string;
}

export interface AdventureViewModel {
  scenarioTitle: string;
  scene: SceneDefinition;
  ending?: EndingDefinition;
  endingTypeLabel?: string;
  sceneIndex: number;
  sceneCount: number;
  sceneTypeLabel: string;
  npcs: string[];
  textPages: string[];
  visibleChoices: AdventureChoiceView[];
  evidence: EvidenceEntry[];
  log: string[];
  logEntries: AdventureLogEntry[];
  status: AdventureStatusView;
  endingSummary?: AdventureEndingSummaryView;
  replayHints: AdventureReplayHintView[];
  carryOutGroups: AdventureCarryOutGroupView[];
  canAdvanceScene: boolean;
}

export function buildAdventureViewModel(pack: ScenarioPack, state: ScenarioRuntimeState, textComplete: boolean): AdventureViewModel {
  const scene = findCurrentScene(pack, state);
  const sceneIndex = Math.max(0, pack.scenario.scenes.indexOf(scene.id));
  const evidence = deriveEvidenceEntries(pack, state);
  const trustValue = state.trust.minase_akari ?? 0;
  const contamination = state.counters.boundary_contamination ?? 0;
  const log = state.log.slice(0, 12);
  const ending = state.endingId ? pack.endings.find((candidate) => candidate.id === state.endingId) : undefined;
  const carryOutGroups = buildCarryOutGroups(pack, state, Boolean(ending));

  return {
    scenarioTitle: pack.scenario.title,
    scene,
    ending,
    endingTypeLabel: ending ? formatEndingTypeLabel(ending.ending_type) : undefined,
    sceneIndex,
    sceneCount: pack.scenario.scenes.length,
    sceneTypeLabel: formatSceneTypeLabel(scene.scene_type),
    npcs: (scene.npc_ids ?? [])
      .map((npcId) => pack.npcs.find((npc) => npc.id === npcId)?.name ?? npcId)
      .filter(Boolean),
    textPages: splitSceneText(scene.description),
    visibleChoices: textComplete && !ending ? buildVisibleChoices(pack, state, scene) : [],
    evidence,
    log,
    logEntries: formatAdventureLogEntries(log),
    status: {
      contamination,
      contaminationLabel: formatContaminationBand(contamination),
      memoryLabel: formatMemoryBand(state),
      trustValue,
      trustLabel: formatTrustBand(trustValue),
      objectiveLabel: formatObjectiveLabel(scene, ending),
      evidenceCount: evidence.length,
      logCount: state.log.length,
    },
    endingSummary: ending ? buildEndingSummary(ending, carryOutGroups) : undefined,
    replayHints: ending ? buildReplayHints(pack, state, ending, evidence, carryOutGroups) : [],
    carryOutGroups,
    canAdvanceScene: !ending && Boolean((scene.next_scene_rules ?? []).length),
  };
}

export function findCurrentScene(pack: ScenarioPack, state: ScenarioRuntimeState): SceneDefinition {
  return pack.scenes.find((candidate) => candidate.id === state.sceneId) ?? pack.scenes[0];
}

export function formatAdventureLogEntries(log: string[]): AdventureLogEntry[] {
  return log.map((entry, index) => formatAdventureLogEntry(entry, index));
}

export function splitSceneText(description: string): string[] {
  const sentences = splitJapaneseSentences(description);

  if (sentences.length > 1) {
    return sentences;
  }

  const text = description.trim();
  if (text.length <= 36) {
    return [text];
  }

  const splitAt = findSplitPoint(text);
  return [text.slice(0, splitAt).trim(), text.slice(splitAt).trim()].filter(Boolean);
}

function formatAdventureLogEntry(entry: string, index: number): AdventureLogEntry {
  const [primary, ...detailParts] = entry.split(" / ");
  const detail = detailParts.join(" / ") || undefined;

  if (primary.startsWith("場面移動:")) {
    return {
      id: `log:${index}:${entry}`,
      kind: "scene",
      kindLabel: "場面",
      text: primary.replace("場面移動:", "").trim(),
      detail: detail ?? "次の調査地点へ移動した。",
    };
  }

  if (primary.startsWith("エンディング判定:")) {
    return {
      id: `log:${index}:${entry}`,
      kind: "ending",
      kindLabel: "結末",
      text: primary.replace("エンディング判定:", "").trim(),
      detail,
    };
  }

  const checkMatch = primary.match(/^(.+):\s*(成功|失敗)$/);
  if (checkMatch) {
    return {
      id: `log:${index}:${entry}`,
      kind: "check",
      kindLabel: "判定",
      text: checkMatch[1],
      detail: [checkMatch[2], detail].filter(Boolean).join(" / "),
    };
  }

  const actionMatch = primary.match(/^(.+):\s*(.+)$/);
  if (actionMatch) {
    return {
      id: `log:${index}:${entry}`,
      kind: "action",
      kindLabel: "行動",
      text: actionMatch[2],
      detail: actionMatch[1],
    };
  }

  return {
    id: `log:${index}:${entry}`,
    kind: "note",
    kindLabel: "記録",
    text: primary,
    detail,
  };
}

function buildVisibleChoices(pack: ScenarioPack, state: ScenarioRuntimeState, scene: SceneDefinition): AdventureChoiceView[] {
  const actionChoices = (scene.available_actions ?? [])
    .filter((action) => action.type !== "check")
    .filter((action) => !isActionHidden(action, state, pack))
    .map((action): AdventureChoiceView => {
      return {
        id: action.id,
        label: action.label,
        typeLabel: formatActionTypeLabel(action.type),
        kind: "action",
        action,
        detail: action.once_per_run ? "一度だけ選べる" : "選択できる",
        danger: action.type === "danger" || action.type === "ending_choice",
      };
    });

  const checkChoices = (scene.checks ?? [])
    .filter((check) => !state.usedActionIds.includes(check.id))
    .filter((check) => canUseRequirements(check.requirements, state, pack))
    .map((check): AdventureChoiceView => {
      return {
        id: check.id,
        label: check.label,
        typeLabel: "判定",
        kind: "check",
        check,
        detail: `${formatSkillLabel(check.skill_or_art)} / 目標 ${check.target_number}`,
        danger: false,
      };
    });

  return [...actionChoices, ...checkChoices].slice(0, 4);
}

function buildCarryOutGroups(pack: ScenarioPack, state: ScenarioRuntimeState, disabled: boolean): AdventureCarryOutGroupView[] {
  return getCarryOutGroups(pack)
    .map((group): AdventureCarryOutGroupView => {
      const selected = state.carryOutSelections[group.id] ?? [];
      const limit = state.carryOutLimits[group.id] ?? group.max_count_at_clear;
      const owned = groupOwnedItems(pack, state, group.id);
      const selectedCount = selected.length;

      return {
        id: group.id,
        label: formatCarryGroupLabel(group.id),
        selectedCount,
        limit,
        warning: limit !== undefined && selectedCount > limit ? "持ち帰り制限を超えている。" : undefined,
        items: owned.map((itemId) => {
          const item = pack.items.find((candidate) => candidate.id === itemId);
          return {
            id: itemId,
            label: item?.name ?? itemId,
            selected: selected.includes(itemId),
            disabled,
          };
        }),
      };
    })
    .filter((group) => group.items.length > 0);
}

function buildEndingSummary(ending: EndingDefinition, carryOutGroups: AdventureCarryOutGroupView[]): AdventureEndingSummaryView {
  return {
    outcomeLabel: formatEndingOutcomeLabel(ending.id),
    carryOutLabel: formatCarryOutSummary(carryOutGroups),
    inspectionLabel: "証拠 / ログ / 状態の調査は終了後も確認できます",
  };
}

function buildReplayHints(
  pack: ScenarioPack,
  state: ScenarioRuntimeState,
  ending: EndingDefinition,
  evidence: EvidenceEntry[],
  carryOutGroups: AdventureCarryOutGroupView[],
): AdventureReplayHintView[] {
  return [
    buildBranchReplayHint(pack, ending),
    buildEvidenceReplayHint(evidence),
    buildCarryOutReplayHint(state, carryOutGroups),
  ].filter((hint): hint is AdventureReplayHintView => Boolean(hint));
}

function buildBranchReplayHint(pack: ScenarioPack, ending: EndingDefinition): AdventureReplayHintView | undefined {
  const visibleRouteHints = pack.endings
    .filter((candidate) => candidate.id !== ending.id)
    .map((candidate) => candidate.ending_tree?.route_hint)
    .filter((hint): hint is string => Boolean(hint))
    .slice(0, 2);

  if (!visibleRouteHints.length) {
    return undefined;
  }

  return {
    family: "branch",
    label: "別の感情ルート",
    text: "この結末とは違う感情の行き先が、まだ境界の向こうに残っている。",
    detail: visibleRouteHints.join(" / "),
  };
}

function buildEvidenceReplayHint(evidence: EvidenceEntry[]): AdventureReplayHintView {
  const categoryLabels = uniqueLabels(evidence.map((entry) => formatEvidenceCategory(entry.category)));
  const sourceLabels = uniqueLabels(evidence.map((entry) => entry.source)).slice(0, 3);

  return {
    family: "evidence",
    label: "この周回で見た手がかり",
    text: `整理済みの手がかりは${evidence.length}件。分類は${formatHintList(categoryLabels, "まだ整理前")}。`,
    detail: sourceLabels.length ? `出どころ: ${sourceLabels.join(" / ")}` : undefined,
  };
}

function buildCarryOutReplayHint(
  state: ScenarioRuntimeState,
  carryOutGroups: AdventureCarryOutGroupView[],
): AdventureReplayHintView {
  const selectedCount = Object.values(state.carryOutSelections).reduce((sum, itemIds) => sum + itemIds.length, 0);
  const overLimitGroups = carryOutGroups.filter(
    (group) => group.limit !== undefined && group.selectedCount > group.limit,
  );
  const selectableGroups = carryOutGroups.filter((group) => group.items.length > 1);

  if (overLimitGroups.length) {
    return {
      family: "carry_out",
      label: "持ち帰りの余白",
      text: "持ち帰ろうとした数が余白を超えて、帰路を揺らした可能性がある。",
      detail: overLimitGroups.map((group) => `${group.label}: ${group.selectedCount}/${group.limit}`).join(" / "),
    };
  }

  if (selectedCount > 0) {
    return {
      family: "carry_out",
      label: "持ち帰りの余白",
      text: `この周回で持ち帰ると決めたものは${selectedCount}件。次は別の一つを選ぶ余地がある。`,
      detail: selectableGroups.length ? selectableGroups.map((group) => group.label).join(" / ") : undefined,
    };
  }

  return {
    family: "carry_out",
    label: "持ち帰りの余白",
    text: "この周回では、境界の向こうへ持ち出したものはなかった。",
    detail: selectableGroups.length ? "別の周回では、持ち帰るものを選び直せる。" : undefined,
  };
}

function uniqueLabels(values: string[]): string[] {
  const seen: Record<string, true> = {};
  return values.filter((value) => {
    if (!value || seen[value]) {
      return false;
    }
    seen[value] = true;
    return true;
  });
}

function formatHintList(values: string[], fallback: string): string {
  return values.length ? values.join(" / ") : fallback;
}

function formatEndingOutcomeLabel(endingId: string): string {
  switch (endingId) {
    case "return_with_akari":
      return "ふたりは同じ灯を見て、境界を越えた。";
    case "return_without_akari":
      return "帰路は照らされたが、灯は向こう側に残った。";
    case "stay_with_akari":
      return "帰路よりも、灯のいる境界を選んだ。";
    case "boundary_collapse":
      return "持ち帰ろうとした願いが、帰路を崩した。";
    default:
      return "このランは結末に到達した。";
  }
}

function formatCarryOutSummary(carryOutGroups: AdventureCarryOutGroupView[]): string {
  if (!carryOutGroups.length) {
    return "持ち帰りの痕跡はまだ見つかっていない。";
  }

  const summaries = carryOutGroups.flatMap((group) => {
    const selectedItems = group.items.filter((item) => item.selected).map((item) => item.label);
    if (!selectedItems.length) {
      return [];
    }
    return [`${group.label}: ${selectedItems.join(" / ")} (${group.selectedCount}/${group.limit ?? "-"})`];
  });

  return summaries.length ? summaries.join(" / ") : "今回は境界の向こうへ持ち出したものはない。";
}

function isActionHidden(action: SceneActionDefinition, state: ScenarioRuntimeState, pack: ScenarioPack): boolean {
  if (action.once_per_run && state.usedActionIds.includes(action.id)) {
    return true;
  }

  return !canUseRequirements(action.requirements, state, pack);
}

function formatObjectiveLabel(scene: SceneDefinition, ending?: EndingDefinition): string {
  if (ending) {
    return "到達した結末を記録する";
  }

  switch (scene.id) {
    case "scene_001_parallel_arrival":
      return "灯と事故の違和感を追う";
    case "scene_002_accident_trace":
      return "事故現場と遺留品の空白を追う";
    case "scene_003_empty_house":
      return "灯が休める時間を作る";
    case "scene_004_returning_family":
      return "灯の選択を遮らず危機を抜ける";
    case "scene_005_cult_facility":
      return "帰還の環が縛った遺留品を取り戻す";
    case "scene_006_four_rooms_ritual":
      return "儀式を乱し、二人分の帰還条件を探す";
    case "scene_007_return_fire":
      return "送り火を終えて帰還か残留を選ぶ";
    default:
      return "灯と事故の違和感を追う";
  }
}

function findSplitPoint(text: string): number {
  const middle = Math.floor(text.length / 2);
  const delimiters = ["、", "，", " "];
  let best = -1;

  delimiters.forEach((delimiter) => {
    const before = text.lastIndexOf(delimiter, middle);
    const after = text.indexOf(delimiter, middle);
    [before, after].forEach((candidate) => {
      if (candidate > 0 && (best === -1 || Math.abs(candidate - middle) < Math.abs(best - middle))) {
        best = candidate + delimiter.length;
      }
    });
  });

  return best > 0 ? best : middle;
}

function splitJapaneseSentences(text: string): string[] {
  const sentences: string[] = [];
  let start = 0;

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "。") {
      continue;
    }
    const sentence = text.slice(start, index + 1).trim();
    if (sentence) {
      sentences.push(sentence);
    }
    start = index + 1;
  }

  const rest = text.slice(start).trim();
  if (rest) {
    sentences.push(rest);
  }

  return sentences;
}
