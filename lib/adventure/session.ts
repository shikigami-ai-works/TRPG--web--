import { DEFAULT_MVP_CHECK_PROFILE, rollScenarioCheck, type CheckRollResult, type PlayerCheckProfile } from "../scenarios/check-resolution";
import {
  applyStateChanges,
  canUseRequirements,
  evaluateRequirement,
  evaluateShortcut,
  resolveEnding,
} from "../scenarios/runtime";
import type {
  EndingDefinition,
  ScenarioPack,
  ScenarioRuntimeState,
  SceneActionDefinition,
  SceneCheckDefinition,
  SceneDefinition,
} from "../scenarios/types";
import { STAGE_14R_SLICE_END_SCENE_ID, STAGE_14R_SLICE_REQUIRED_FLAG, formatRollSummary, formatSkillLabel, formatStatLabel } from "./labels";

export interface AdventureSessionResult {
  state: ScenarioRuntimeState;
  event: string;
  sliceComplete?: boolean;
  roll?: CheckRollResult;
  ending?: EndingDefinition;
}

export function applyAdventureAction(
  pack: ScenarioPack,
  state: ScenarioRuntimeState,
  scene: SceneDefinition,
  action: SceneActionDefinition,
): AdventureSessionResult {
  if (action.once_per_run && state.usedActionIds.includes(action.id)) {
    return { state, event: "その行動はもう選んでいる。" };
  }

  if (!canUseRequirements(action.requirements, state, pack)) {
    return { state, event: "今はその行動を選べない。" };
  }

  let next = applyStateChanges(state, action.state_changes, pack);
  next = {
    ...next,
    lastChoiceId: action.id,
    usedActionIds: action.once_per_run ? addUnique(next.usedActionIds, action.id) : next.usedActionIds,
    log: [`${scene.title}: ${action.label}`, ...next.log].slice(0, 12),
  };

  if (action.type === "ending_choice") {
    const ending = resolveBySceneRules(pack, scene.id, next, action.id);
    if (ending) {
      next = {
        ...next,
        endingId: ending.id,
        log: [`エンディング判定: ${ending.title}`, ...next.log].slice(0, 12),
      };
      return { state: next, event: ending.title, ending };
    }
  }

  return { state: next, event: action.label };
}

export function rollAdventureCheck(
  pack: ScenarioPack,
  state: ScenarioRuntimeState,
  scene: SceneDefinition,
  check: SceneCheckDefinition,
  profile: PlayerCheckProfile = DEFAULT_MVP_CHECK_PROFILE,
  random: () => number = Math.random,
): AdventureSessionResult {
  if (state.usedActionIds.includes(check.id)) {
    return { state, event: "その判定はもう行っている。" };
  }

  if (!canUseRequirements(check.requirements, state, pack)) {
    return { state, event: "今はその判定を行えない。" };
  }

  const roll = rollScenarioCheck(check, profile, random);
  const branch = roll.success ? "success" : "failure";
  const outcome = check[branch];
  let next = applyStateChanges(state, outcome, pack);
  const resultLabel = roll.success ? "成功" : "失敗";
  const event = `${check.label}: ${resultLabel}`;

  next = {
    ...next,
    lastChoiceId: check.id,
    usedActionIds: addUnique(next.usedActionIds, check.id),
    log: [`${event} / ${formatCheckRoll(roll)}${outcome?.reveal_text ? ` / ${outcome.reveal_text}` : ""}`, ...next.log].slice(0, 12),
  };

  return { state: next, event, roll };
}

export function advanceAdventureScene(
  pack: ScenarioPack,
  state: ScenarioRuntimeState,
  sliceEndSceneId: string = STAGE_14R_SLICE_END_SCENE_ID,
  sliceRequiredFlag: string = STAGE_14R_SLICE_REQUIRED_FLAG,
): AdventureSessionResult {
  const current = pack.scenes.find((candidate) => candidate.id === state.sceneId);
  if (!current) {
    return { state, event: "現在の場面を見つけられない。" };
  }

  if (current.id === sliceEndSceneId) {
    if (!state.flags[sliceRequiredFlag]) {
      return { state, event: "灯が休める時間を作ってから進む。" };
    }

    return {
      state: {
        ...state,
        log: ["Stage 14R first playable slice complete", ...state.log].slice(0, 12),
      },
      event: "Scene 3までの縦切りを確認した。",
      sliceComplete: true,
    };
  }

  const nonDefaultRules = (current.next_scene_rules ?? []).filter((rule) => rule.condition !== "default");
  for (const rule of nonDefaultRules) {
    if (!evaluateRequirement(rule.condition, state, pack)) {
      continue;
    }
    const resolved = resolveSceneRule(pack, state, rule.next_scene_id, rule.ending_id, rule.resolve_ending);
    if (resolved) {
      return resolved;
    }
  }

  const defaultRule = (current.next_scene_rules ?? []).find((rule) => rule.condition === "default");
  if (defaultRule) {
    const resolved = resolveSceneRule(pack, state, defaultRule.next_scene_id, defaultRule.ending_id, defaultRule.resolve_ending);
    if (resolved) {
      return resolved;
    }
  }

  return { state, event: "次の場面はまだ定義されていない。" };
}

function resolveSceneRule(
  pack: ScenarioPack,
  state: ScenarioRuntimeState,
  nextSceneId?: string,
  endingId?: string,
  shouldResolveEnding?: boolean,
): AdventureSessionResult | undefined {
  if (nextSceneId) {
    const scene = pack.scenes.find((candidate) => candidate.id === nextSceneId);
    return {
      state: {
        ...state,
        sceneId: nextSceneId,
        lastChoiceId: undefined,
        log: [`場面移動: ${scene?.title ?? nextSceneId}`, ...state.log].slice(0, 12),
      },
      event: scene?.title ?? nextSceneId,
    };
  }

  if (endingId) {
    const ending = pack.endings.find((candidate) => candidate.id === endingId);
    return {
      state: {
        ...state,
        endingId,
        log: [`エンディング判定: ${ending?.title ?? endingId}`, ...state.log].slice(0, 12),
      },
      event: ending?.title ?? endingId,
      ending,
    };
  }

  if (shouldResolveEnding) {
    const ending = resolveEnding(pack, state);
    if (ending) {
      return {
        state: {
          ...state,
          endingId: ending.id,
          log: [`エンディング判定: ${ending.title}`, ...state.log].slice(0, 12),
        },
        event: ending.title,
        ending,
      };
    }
  }

  return undefined;
}

function resolveBySceneRules(
  pack: ScenarioPack,
  sceneId: string,
  state: ScenarioRuntimeState,
  actionId: string,
): EndingDefinition | undefined {
  const scene = pack.scenes.find((candidate) => candidate.id === sceneId);
  const rule = (scene?.next_scene_rules ?? []).find(
    (candidate) =>
      candidate.resolve_ending &&
      typeof candidate.condition === "string" &&
      evaluateShortcut(candidate.condition, { ...state, lastChoiceId: actionId }, pack, false),
  );
  return rule ? resolveEnding(pack, state) : undefined;
}

function formatCheckRoll(roll: CheckRollResult): string {
  return `${formatRollSummary(roll.total, roll.targetNumber, roll.success)} = ${formatStatLabel(roll.statId)} ${roll.statValue} + ${formatSkillLabel(
    roll.skillId,
  )} ${roll.skillValue} + d20 ${roll.dieRoll}`;
}

function addUnique(values: string[], value: string): string[] {
  return values.includes(value) ? values : [...values, value];
}
