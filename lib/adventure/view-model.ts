import { deriveEvidenceEntries, type EvidenceEntry } from "./evidence";
import {
  STAGE_14R_SLICE_REQUIRED_FLAG,
  STAGE_14R_SLICE_END_SCENE_ID,
  formatActionTypeLabel,
  formatContaminationBand,
  formatMemoryBand,
  formatSceneTypeLabel,
  formatSkillLabel,
  formatTrustBand,
} from "./labels";
import { canUseRequirements } from "../scenarios/runtime";
import type {
  ScenarioPack,
  ScenarioRuntimeState,
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
  isSliceEndScene: boolean;
  canCompleteSlice: boolean;
}

export function buildAdventureViewModel(pack: ScenarioPack, state: ScenarioRuntimeState, textComplete: boolean): AdventureViewModel {
  const scene = findCurrentScene(pack, state);
  const sceneIndex = Math.max(0, pack.scenario.scenes.indexOf(scene.id));
  const evidence = deriveEvidenceEntries(pack, state);
  const trustValue = state.trust.minase_akari ?? 0;
  const contamination = state.counters.boundary_contamination ?? 0;
  const log = state.log.slice(0, 12);

  const isSliceEndScene = scene.id === STAGE_14R_SLICE_END_SCENE_ID;
  const canCompleteSlice = isSliceEndScene && Boolean(state.flags[STAGE_14R_SLICE_REQUIRED_FLAG]);

  return {
    scenarioTitle: pack.scenario.title,
    scene,
    sceneIndex,
    sceneCount: pack.scenario.scenes.length,
    sceneTypeLabel: formatSceneTypeLabel(scene.scene_type),
    npcs: (scene.npc_ids ?? [])
      .map((npcId) => pack.npcs.find((npc) => npc.id === npcId)?.name ?? npcId)
      .filter(Boolean),
    textPages: splitSceneText(scene.description),
    visibleChoices: textComplete ? buildVisibleChoices(pack, state, scene) : [],
    evidence,
    log,
    logEntries: formatAdventureLogEntries(log),
    status: {
      contamination,
      contaminationLabel: formatContaminationBand(contamination),
      memoryLabel: formatMemoryBand(state),
      trustValue,
      trustLabel: formatTrustBand(trustValue),
      objectiveLabel: formatObjectiveLabel(isSliceEndScene, canCompleteSlice),
      evidenceCount: evidence.length,
      logCount: state.log.length,
    },
    isSliceEndScene,
    canCompleteSlice,
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

function isActionHidden(action: SceneActionDefinition, state: ScenarioRuntimeState, pack: ScenarioPack): boolean {
  if (action.once_per_run && state.usedActionIds.includes(action.id)) {
    return true;
  }

  return !canUseRequirements(action.requirements, state, pack);
}

function formatObjectiveLabel(isSliceEndScene: boolean, canCompleteSlice: boolean): string {
  if (isSliceEndScene) {
    return canCompleteSlice ? "ここまでの記録を閉じる" : "灯が休める時間を作る";
  }

  return "灯と事故の違和感を追う";
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
