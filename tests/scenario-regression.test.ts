import assert from "node:assert/strict";
import { before, beforeEach, test } from "node:test";

import { loadScenarioPack } from "../lib/scenarios/loader";
import {
  applyStateChanges,
  canUseRequirements,
  createInitialState,
  resolveEnding,
  toggleCarryOutItem,
} from "../lib/scenarios/runtime";
import { buildEndingProgressEntries } from "../lib/scenarios/ending-progress";
import {
  appendCompletedRun,
  clearActiveRun,
  getReachedEndings,
  loadActiveRun,
  loadRunHistory,
  restoreRuntimeState,
  saveActiveRun,
  type CompletedRunRecord,
} from "../lib/scenarios/storage";
import { validateScenarioPack } from "../lib/scenarios/validation";
import type {
  CheckOutcome,
  ConditionExpr,
  EndingDefinition,
  ScenarioPack,
  ScenarioRuntimeState,
  SceneActionDefinition,
  StateChanges,
} from "../lib/scenarios/types";

const SCENARIO_DIRECTORY = "kimidake_ga_oboeteiru_jiko";
const SCENARIO_ID = "kimidake_ga_oboeteiru_jiko";
const ACTIVE_RUN_KEY = `trpg-web:v1:active-run:${SCENARIO_ID}`;
const HISTORY_KEY = "trpg-web:v1:run-history";

let pack: ScenarioPack;

before(async () => {
  pack = await loadScenarioPack(SCENARIO_DIRECTORY);
});

beforeEach(() => {
  installMemoryStorage();
});

test("applyStateChanges updates flags, counters, trust, inventory, and carry-out counters", () => {
  const initial = createInitialState(pack);
  const changed = applyStateChanges(
    initial,
    {
      add_flags: ["noticed_parallel_displacement"],
      add_items: ["boundary_ember", "empty_nameplate", "boundary_ember"],
      counter_delta: {
        boundary_contamination: 2,
      },
      set_flags: {
        gift_opened: true,
      },
      trust_delta: {
        minase_akari: 999,
      },
    },
    pack,
  );

  assert.equal(changed.flags.noticed_parallel_displacement, true);
  assert.equal(changed.flags.gift_opened, true);
  assert.equal(changed.counters.boundary_contamination, 2);
  assert.equal(changed.trust.minase_akari, 100);
  assert.deepEqual(changed.inventory, ["boundary_ember", "empty_nameplate"]);
  assert.equal(initial.flags.noticed_parallel_displacement, false);

  const selected = toggleCarryOutItem(toggleCarryOutItem(changed, "four_room_artifact", "boundary_ember"), "four_room_artifact", "empty_nameplate");
  assert.deepEqual(selected.carryOutSelections.four_room_artifact, ["boundary_ember", "empty_nameplate"]);
  assert.equal(selected.counters.four_room_artifacts_carried_out, 2);

  const removed = applyStateChanges(
    selected,
    {
      remove_items: ["boundary_ember"],
    },
    pack,
  );

  assert.deepEqual(removed.inventory, ["empty_nameplate"]);
  assert.deepEqual(removed.carryOutSelections.four_room_artifact, ["empty_nameplate"]);
  assert.equal(removed.counters.four_room_artifacts_carried_out, 1);
});

test("toggleCarryOutItem toggles item ids and keeps four_room_artifacts_carried_out in sync", () => {
  const initial: ScenarioRuntimeState = {
    ...createInitialState(pack),
    inventory: ["boundary_ember", "empty_nameplate"],
  };

  const first = toggleCarryOutItem(initial, "four_room_artifact", "boundary_ember");
  assert.deepEqual(first.carryOutSelections.four_room_artifact, ["boundary_ember"]);
  assert.equal(first.counters.four_room_artifacts_carried_out, 1);

  const second = toggleCarryOutItem(first, "four_room_artifact", "empty_nameplate");
  assert.deepEqual(second.carryOutSelections.four_room_artifact, ["boundary_ember", "empty_nameplate"]);
  assert.equal(second.counters.four_room_artifacts_carried_out, 2);

  const third = toggleCarryOutItem(second, "four_room_artifact", "boundary_ember");
  assert.deepEqual(third.carryOutSelections.four_room_artifact, ["empty_nameplate"]);
  assert.equal(third.counters.four_room_artifacts_carried_out, 1);
});

test("resolveEnding matches true, normal, lost, and good routes from scenario data", () => {
  assert.equal(playReturnRoute({ carryTwoArtifacts: false, openGift: false }).ending?.id, "return_with_akari");
  assert.equal(playReturnRoute({ carryTwoArtifacts: false, openGift: true }).ending?.id, "return_without_akari");
  assert.equal(playReturnRoute({ carryTwoArtifacts: true, openGift: false }).ending?.id, "boundary_collapse");
  assert.equal(playStayRoute().ending?.id, "stay_with_akari");
});

test("validateScenarioPack accepts the bundled scenario data", () => {
  const result = validateScenarioPack(pack);

  assert.deepEqual(result.issues, []);
});

test("validateScenarioPack reports broken references, invalid conditions, and unreachable endings", () => {
  const broken = clonePack(pack);
  broken.scenario.scenes = [...broken.scenario.scenes, "missing_scene"];
  broken.scenario.endings = [...broken.scenario.endings, "missing_ending"];
  broken.scenario.ending_resolution_order = (broken.scenario.ending_resolution_order ?? []).filter(
    (endingId) => endingId !== "stay_with_akari",
  );
  broken.scenario.mechanics = {
    ...broken.scenario.mechanics,
    carry_out_groups: [
      {
        id: "four_room_artifact",
        item_ids: ["boundary_ember", "missing_item"],
        max_count_at_clear: 3,
        return_ritual_requires_returned_count: 4,
      },
    ],
  };
  broken.scenes[0] = {
    ...broken.scenes[0],
    next_scene_rules: [
      {
        condition: "choice:missing_action",
        next_scene_id: "missing_scene",
      },
      {
        condition: "default",
        next_scene_id: "scene_002_accident_trace",
        ending_id: "missing_ending",
      },
    ],
  };
  broken.items = broken.items.map((item) =>
    item.id === "empty_nameplate"
      ? {
          ...item,
          carry_out_group: "missing_group",
        }
      : item,
  );
  broken.endings[0] = {
    ...broken.endings[0],
    unlock_conditions: {
      all: [],
      any: [],
    } as unknown as ConditionExpr,
  };

  const result = validateScenarioPack(broken);
  const codes = new Set(result.issues.map((issue) => issue.code));

  assert.equal(result.errorCount > 0, true);
  assert.equal(codes.has("UNKNOWN_SCENE_ID"), true);
  assert.equal(codes.has("UNKNOWN_ENDING_ID"), true);
  assert.equal(codes.has("UNKNOWN_ACTION_ID"), true);
  assert.equal(codes.has("UNKNOWN_ITEM_ID"), true);
  assert.equal(codes.has("UNKNOWN_CARRY_OUT_GROUP_ID"), true);
  assert.equal(codes.has("INVALID_CONDITION_SHAPE"), true);
  assert.equal(codes.has("INVALID_NEXT_SCENE_RULE_TARGET"), true);
  assert.equal(codes.has("RETURN_REQUIREMENT_EXCEEDS_GROUP_SIZE"), true);
  assert.equal(codes.has("UNREACHABLE_ENDING"), true);
});

test("save/load restores active run state and rejects corrupt or mismatched saves", () => {
  const initial = createInitialState(pack);
  const progressed: ScenarioRuntimeState = {
    ...initial,
    sceneId: "scene_006_four_rooms_ritual",
    flags: {
      ...initial.flags,
      ritual_disrupted: true,
    },
    inventory: ["boundary_ember", "empty_nameplate"],
    lastChoiceId: "take_empty_nameplate",
    log: ["checkpoint", ...initial.log],
  };

  const saved = saveActiveRun(SCENARIO_ID, progressed);
  assert.equal(saved?.scenarioId, SCENARIO_ID);
  assert.equal(saved?.sceneId, "scene_006_four_rooms_ritual");
  assert.equal(typeof saved?.updatedAt, "string");

  const loaded = loadActiveRun(SCENARIO_ID);
  assert.equal(loaded?.sceneId, "scene_006_four_rooms_ritual");
  assert.deepEqual(loaded?.inventory, ["boundary_ember", "empty_nameplate"]);

  const restored = restoreRuntimeState(loaded!, initial);
  assert.equal(restored.sceneId, "scene_006_four_rooms_ritual");
  assert.equal(restored.flags.ritual_disrupted, true);
  assert.equal(restored.flags.akari_survives, true);
  assert.deepEqual(restored.inventory, ["boundary_ember", "empty_nameplate"]);

  clearActiveRun(SCENARIO_ID);
  assert.equal(loadActiveRun(SCENARIO_ID), null);

  window.localStorage.setItem(ACTIVE_RUN_KEY, "{broken");
  assert.equal(loadActiveRun(SCENARIO_ID), null);
  assert.equal(window.localStorage.getItem(ACTIVE_RUN_KEY), null);

  window.localStorage.setItem(ACTIVE_RUN_KEY, JSON.stringify({ ...saved, scenarioId: "other_scenario" }));
  assert.equal(loadActiveRun(SCENARIO_ID), null);
  assert.equal(window.localStorage.getItem(ACTIVE_RUN_KEY), null);
});

test("run history preserves duplicate completions and reached endings are deduplicated", () => {
  const trueRoute = playReturnRoute({ carryTwoArtifacts: false, openGift: false });
  const stayRoute = playStayRoute();

  const firstTrue = appendCompletedRun(pack, trueRoute.state, trueRoute.ending!);
  const secondTrue = appendCompletedRun(pack, trueRoute.state, trueRoute.ending!);
  const stay = appendCompletedRun(pack, stayRoute.state, stayRoute.ending!);

  assert.ok(firstTrue?.runId);
  assert.ok(secondTrue?.runId);
  assert.ok(stay?.runId);

  const history = loadRunHistory(SCENARIO_ID);
  assert.equal(history.length, 3);
  assert.equal(history[0].endingId, "stay_with_akari");
  assert.equal(loadRunHistory("other_scenario").length, 0);

  const reached = getReachedEndings(history);
  const byId = new Map(reached.map((ending) => [ending.endingId, ending]));

  assert.equal(byId.get("return_with_akari")?.count, 2);
  assert.equal(byId.get("stay_with_akari")?.count, 1);
  assert.equal(reached.length, 2);
});

test("ending progress entries show only visible locked endings before unlock", () => {
  const hiddenPack = clonePack(pack);
  hiddenPack.endings = hiddenPack.endings.map((ending) =>
    ending.id === "return_without_akari"
      ? {
          ...ending,
          ending_tree: {
            ...ending.ending_tree,
            visible_before_unlock: false,
          },
        }
      : ending,
  );

  const entries = buildEndingProgressEntries(hiddenPack, []);
  const returnWithAkari = findProgressEntry(entries, "return_with_akari");
  const originalEnding = findEnding("return_with_akari");

  assert.equal(entries.every((entry) => entry.status === "locked"), true);
  assert.equal(entries.some((entry) => entry.endingId === "return_without_akari"), false);
  assert.equal(returnWithAkari.title, "二人で帰る結末");
  assert.equal(returnWithAkari.description, originalEnding.ending_tree?.route_hint);
  assert.notEqual(returnWithAkari.title, originalEnding.title);
  assert.notEqual(returnWithAkari.description, originalEnding.description);
  assert.equal("hiddenDescription" in returnWithAkari, false);
  assert.deepEqual(returnWithAkari.unlocks, []);
  assert.deepEqual(returnWithAkari.rewards, []);
});

test("ending progress entries expose reached details and keep locked endings concealed", () => {
  const normalEnding = findEnding("return_without_akari");
  const history = [
    createCompletedRunRecord("return_without_akari", "2026-05-27T12:30:00.000Z"),
    createCompletedRunRecord("return_without_akari", "2026-05-27T11:00:00.000Z"),
  ];

  const entries = buildEndingProgressEntries(pack, history);
  const reached = findProgressEntry(entries, "return_without_akari");
  const locked = findProgressEntry(entries, "return_with_akari");

  assert.equal(reached.status, "reached");
  if (reached.status !== "reached") {
    assert.fail("return_without_akari should be reached");
  }
  assert.equal(reached.title, normalEnding.title);
  assert.equal(reached.description, normalEnding.description);
  assert.equal(reached.count, 2);
  assert.equal(reached.firstCompletedAt, "2026-05-27T11:00:00.000Z");
  assert.equal(reached.latestCompletedAt, "2026-05-27T12:30:00.000Z");
  assert.equal(reached.hiddenDescription, normalEnding.hidden_description);
  assert.deepEqual(reached.unlocks, normalEnding.unlocks);
  assert.deepEqual(reached.rewards, ["memory_fragment / minase_akari"]);

  assert.equal(locked.status, "locked");
  assert.equal(locked.title, findEnding("return_with_akari").ending_tree?.blurred_title);
  assert.equal(locked.description, findEnding("return_with_akari").ending_tree?.route_hint);
  assert.notEqual(locked.title, findEnding("return_with_akari").title);
  assert.equal("hiddenDescription" in locked, false);
});

function playReturnRoute({
  carryTwoArtifacts,
  openGift,
}: {
  carryTwoArtifacts: boolean;
  openGift: boolean;
}): { ending: EndingDefinition | undefined; state: ScenarioRuntimeState } {
  let state = playCommonRoute({ openGift, reproduceRitual: true });

  if (carryTwoArtifacts) {
    state = toggleCarryOutItem(state, "four_room_artifact", "boundary_ember");
    state = toggleCarryOutItem(state, "four_room_artifact", "empty_nameplate");
  }

  state = applyAction(state, "burn_keepsakes_as_farewell");
  state = applyAction(state, "promise_return_together");
  state = applySuccess(state, "check_final_boundary_stability");
  state = applyAction(state, "choose_return_with_akari");

  return {
    ending: resolveEnding(pack, state),
    state,
  };
}

function playStayRoute(): { ending: EndingDefinition | undefined; state: ScenarioRuntimeState } {
  const state = applyAction(playCommonRoute({ openGift: false, reproduceRitual: false }), "choose_stay_with_akari");

  return {
    ending: resolveEnding(pack, state),
    state,
  };
}

function playCommonRoute({
  openGift,
  reproduceRitual,
}: {
  openGift: boolean;
  reproduceRitual: boolean;
}): ScenarioRuntimeState {
  let state = createInitialState(pack);

  state = applyAction(state, "say_not_replacement");
  state = applyAction(state, "let_akari_speak_regret");
  state = applyAction(state, "respect_gift_unopened");
  state = applySuccess(state, "check_cult_trace");
  state = applyAction(state, "protect_akari_without_possessing");
  state = applySuccess(state, "check_survive_relative_attack");
  state = applyAction(state, "share_guilt_truthfully");
  state = applyAction(state, "take_wedding_rings");
  state = applySuccess(state, "check_hold_together_after_crime");
  state = applyAction(state, "recover_stolen_keyholder");
  state = applyAction(state, "recover_birthday_gift");

  if (openGift) {
    state = applyAction(state, "open_birthday_gift");
  }

  state = applySuccess(state, "check_understand_cult_goal");
  state = applyAction(state, "take_boundary_ember");
  state = applyAction(state, "take_empty_nameplate");
  state = applyAction(state, "disrupt_ritual");
  state = applySuccess(state, "check_defeat_makabe");

  if (reproduceRitual) {
    state = applyAction(state, "take_stopped_pocket_watch");
    state = applyAction(state, "return_artifacts_for_ritual");
  }

  return state;
}

function applyAction(state: ScenarioRuntimeState, actionId: string): ScenarioRuntimeState {
  const action = findAction(actionId);
  assert.equal(canUseRequirements(action.requirements, state, pack), true, `${actionId} requirements should be met`);
  const changed = applyStateChanges(state, action.state_changes, pack);

  return {
    ...changed,
    lastChoiceId: action.id,
    usedActionIds: action.once_per_run ? [...changed.usedActionIds, action.id] : changed.usedActionIds,
  };
}

function applySuccess(state: ScenarioRuntimeState, checkId: string): ScenarioRuntimeState {
  const check = pack.scenes.flatMap((scene) => scene.checks ?? []).find((candidate) => candidate.id === checkId);
  assert.ok(check, `${checkId} should exist`);
  assert.equal(canUseRequirements(check.requirements, state, pack), true, `${checkId} requirements should be met`);
  return applyStateChanges(state, check.success as CheckOutcome | StateChanges | undefined, pack);
}

function findAction(actionId: string): SceneActionDefinition {
  const action = pack.scenes.flatMap((scene) => scene.available_actions ?? []).find((candidate) => candidate.id === actionId);
  assert.ok(action, `${actionId} should exist`);
  return action;
}

function findEnding(endingId: string): EndingDefinition {
  const ending = pack.endings.find((candidate) => candidate.id === endingId);
  assert.ok(ending, `${endingId} should exist`);
  return ending;
}

function findProgressEntry(entries: ReturnType<typeof buildEndingProgressEntries>, endingId: string) {
  const entry = entries.find((candidate) => candidate.endingId === endingId);
  assert.ok(entry, `${endingId} should be visible in ending progress`);
  return entry;
}

function createCompletedRunRecord(endingId: string, completedAt: string): CompletedRunRecord {
  const ending = findEnding(endingId);

  return {
    version: 1,
    runId: `test:${endingId}:${completedAt}`,
    scenarioId: pack.scenario.id,
    scenarioTitle: pack.scenario.title,
    endingId: ending.id,
    endingTitle: ending.title,
    endingType: ending.ending_type,
    completedAt,
    finalTrust: {},
    finalCounters: {},
    finalInventory: [],
    carryOutSelections: {},
    unlocks: [...(ending.unlocks ?? [])],
    rewards: [...(ending.rewards ?? [])],
  };
}

function installMemoryStorage(): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: new MemoryStorage(),
    },
  });
}

function clonePack(source: ScenarioPack): ScenarioPack {
  return JSON.parse(JSON.stringify(source)) as ScenarioPack;
}

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
