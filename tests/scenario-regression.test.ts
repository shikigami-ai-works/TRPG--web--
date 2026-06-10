import assert from "node:assert/strict";
import { before, beforeEach, test } from "node:test";

import { loadScenarioPack } from "../lib/scenarios/loader";
import {
  DEFAULT_MVP_CHECK_PROFILE,
  clonePlayerCheckProfile,
  getCheckModifierBreakdown,
  rollScenarioCheck,
  updatePlayerCheckProfileValue,
} from "../lib/scenarios/check-resolution";
import {
  applyStateChanges,
  canUseRequirements,
  createInitialState,
  evaluateRequirement,
  resolveEnding,
  toggleCarryOutItem,
} from "../lib/scenarios/runtime";
import { buildEndingProgressEntries } from "../lib/scenarios/ending-progress";
import {
  appendCompletedRun,
  appendCompletedRunOnce,
  clearActiveRun,
  clearCheckProfile,
  getReachedEndings,
  loadActiveRun,
  loadCheckProfile,
  loadRunHistory,
  restoreRuntimeState,
  saveActiveRun,
  saveCheckProfile,
  type CompletedRunRecord,
} from "../lib/scenarios/storage";
import { buildBestRelationshipContactRecord, buildRelationshipContactRecordForRun } from "../lib/scenarios/relationship-contact-record";
import { validateScenarioPack } from "../lib/scenarios/validation";
import type {
  CheckOutcome,
  ConditionExpr,
  EndingDefinition,
  ScenarioPack,
  ScenarioRuntimeState,
  SceneActionDefinition,
  SceneCheckDefinition,
  StateChanges,
} from "../lib/scenarios/types";

const SCENARIO_DIRECTORY = "kimidake_ga_oboeteiru_jiko";
const SCENARIO_ID = "kimidake_ga_oboeteiru_jiko";
const ACTIVE_RUN_KEY = `trpg-web:v1:active-run:${SCENARIO_ID}`;
const CHECK_PROFILE_KEY = `trpg-web:v1:check-profile:${SCENARIO_ID}`;
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

test("rollScenarioCheck resolves stat, skill, d20, and target number", () => {
  const check = findCheck("check_parallel_displacement");
  const lowRoll = rollScenarioCheck({ ...check, target_number: 20 }, DEFAULT_MVP_CHECK_PROFILE, () => 0);
  const highRoll = rollScenarioCheck({ ...check, target_number: 20 }, DEFAULT_MVP_CHECK_PROFILE, () => 0.999999);

  assert.equal(lowRoll.statValue, 10);
  assert.equal(lowRoll.skillValue, 2);
  assert.equal(lowRoll.dieRoll, 1);
  assert.equal(lowRoll.total, 13);
  assert.equal(lowRoll.success, false);

  assert.equal(highRoll.dieRoll, 20);
  assert.equal(highRoll.total, 32);
  assert.equal(highRoll.success, true);
});

test("rollScenarioCheck uses the provided player check profile", () => {
  const check = findCheck("check_parallel_displacement");
  const customProfile = clonePlayerCheckProfile(DEFAULT_MVP_CHECK_PROFILE);
  customProfile.stats.intelligence = 4;
  customProfile.skills.observe = 3;

  const roll = rollScenarioCheck({ ...check, target_number: 16 }, customProfile, () => 0.4);

  assert.equal(roll.statValue, 4);
  assert.equal(roll.skillValue, 3);
  assert.equal(roll.dieRoll, 9);
  assert.equal(roll.total, 16);
  assert.equal(roll.success, true);
});

test("updatePlayerCheckProfileValue keeps profile edits numeric and isolated", () => {
  const original = clonePlayerCheckProfile(DEFAULT_MVP_CHECK_PROFILE);
  const updated = updatePlayerCheckProfileValue(original, "stats", "intelligence", "18");
  const emptied = updatePlayerCheckProfileValue(updated, "skills", "observe", "");
  const clamped = updatePlayerCheckProfileValue(emptied, "skills", "occult", "120");

  assert.equal(original.stats.intelligence, 10);
  assert.equal(updated.stats.intelligence, 18);
  assert.equal(emptied.skills.observe, 0);
  assert.equal(clamped.skills.occult, 99);
});

test("check modifier breakdown can fall back to skill ids when scenario data uses a skill-like related_stat", () => {
  const check = findCheck("check_defeat_makabe");
  const modifiers = getCheckModifierBreakdown(check, DEFAULT_MVP_CHECK_PROFILE);

  assert.equal(modifiers.statId, "combat");
  assert.equal(modifiers.statValue, 2);
  assert.equal(modifiers.skillId, "melee_or_firearm");
  assert.equal(modifiers.skillValue, 2);
});

test("resolveEnding matches true, normal, lost, and good routes from scenario data", () => {
  assert.equal(playReturnRoute({ carryTwoArtifacts: false, openGift: false }).ending?.id, "return_with_akari");
  assert.equal(playReturnRoute({ carryTwoArtifacts: false, openGift: true }).ending?.id, "return_without_akari");
  assert.equal(playReturnRoute({ carryTwoArtifacts: true, openGift: false }).ending?.id, "boundary_collapse");
  assert.equal(playStayRoute().ending?.id, "stay_with_akari");
});

test("wedding rings are retrieved only after Makabe is gone, ritual reproduction is realized, and the gift fuel idea is refused", () => {
  let state = playCommonRouteBeforeMakabe({ openGift: false });
  const refuseGiftFuel = findAction("refuse_unopened_gift_as_return_fuel");
  const takeRings = findAction("take_wedding_rings");

  assert.equal(canUseRequirements(takeRings.requirements, state, pack), false);
  assert.equal(canUseRequirements(refuseGiftFuel.requirements, state, pack), false);

  state = applySuccess(state, "check_defeat_makabe");
  assert.equal(state.flags.makabe_gone, true);
  assert.equal(canUseRequirements(takeRings.requirements, state, pack), false);

  state = applyAction(state, "realize_return_ritual_reproduction");
  assert.equal(canUseRequirements(takeRings.requirements, state, pack), false);
  assert.equal(canUseRequirements(refuseGiftFuel.requirements, state, pack), true);

  state = applyAction(state, "refuse_unopened_gift_as_return_fuel");
  assert.equal(canUseRequirements(takeRings.requirements, state, pack), true);
  assert.equal(canUseAction(takeRings, state), true);

  state = applyAction(state, "take_wedding_rings");
  assert.equal(takeRings.once_per_run, true);
  assert.equal(state.inventory.includes("relatives_wedding_rings"), true);
  assert.equal(state.inventory.filter((itemId) => itemId === "relatives_wedding_rings").length, 1);
  assert.equal(state.usedActionIds.includes("take_wedding_rings"), true);
  assert.equal(canUseRequirements(takeRings.requirements, state, pack), true);
  assert.equal(canUseAction(takeRings, state), false);

  const repeatedStateChanges = applyStateChanges(state, takeRings.state_changes, pack);
  assert.equal(repeatedStateChanges.inventory.filter((itemId) => itemId === "relatives_wedding_rings").length, 1);
});

test("scene 6 advances to return fire only after ritual reproduction is realized", () => {
  let state = playCommonRouteBeforeMakabe({ openGift: false });
  const scene = pack.scenes.find((candidate) => candidate.id === "scene_006_four_rooms_ritual");
  const returnFireRule = scene?.next_scene_rules?.find((rule) => rule.next_scene_id === "scene_007_return_fire");
  assert.ok(returnFireRule, "scene 6 should define a return fire transition");

  state = applySuccess(state, "check_defeat_makabe");
  assert.equal(state.flags.makabe_gone, true);
  assert.equal(evaluateRequirement(returnFireRule.condition, state, pack), false);

  state = applyAction(state, "realize_return_ritual_reproduction");
  assert.equal(state.flags.ritual_reproduction_realized, true);
  assert.equal(evaluateRequirement(returnFireRule.condition, state, pack), true);
});

test("scene 7 final choices unlock only after the farewell fire resolves regret", () => {
  let state = playCommonRouteBeforeMakabe({ openGift: false });
  state = applySuccess(state, "check_defeat_makabe");
  state = applyAction(state, "realize_return_ritual_reproduction");
  state = applyAction(state, "take_stopped_pocket_watch");
  state = applyAction(state, "refuse_unopened_gift_as_return_fuel");
  state = applyAction(state, "take_wedding_rings");

  const promiseReturnTogether = findAction("promise_return_together");
  const returnWithAkari = findAction("choose_return_with_akari");
  const returnAlone = findAction("choose_return_alone");
  const stayWithAkari = findAction("choose_stay_with_akari");

  assert.equal(canUseAction(promiseReturnTogether, state), false);
  assert.equal(canUseAction(returnWithAkari, state), false);
  assert.equal(canUseAction(returnAlone, state), false);
  assert.equal(canUseAction(stayWithAkari, state), false);

  state = applyAction(state, "return_artifacts_for_ritual");
  assert.equal(state.flags.ritual_reproduced, true);
  assert.equal(canUseAction(promiseReturnTogether, state), false);
  assert.equal(canUseAction(returnWithAkari, state), false);
  assert.equal(canUseAction(returnAlone, state), false);
  assert.equal(canUseAction(stayWithAkari, state), false);

  state = applyAction(state, "burn_keepsakes_as_farewell");
  assert.equal(state.flags.regret_resolved, true);
  assert.equal(canUseAction(promiseReturnTogether, state), true);
  assert.equal(canUseAction(returnWithAkari, state), true);
  assert.equal(canUseAction(returnAlone, state), true);
  assert.equal(canUseAction(stayWithAkari, state), true);
});

test("Makabe leaves the ritual scene even when the combat check fails", () => {
  let state = playCommonRouteBeforeMakabe({ openGift: false });

  state = applyFailure(state, "check_defeat_makabe");
  assert.equal(state.flags.makabe_gone, true);
  assert.equal(state.flags.cult_leader_defeated, false);
  assert.equal(state.counters.boundary_contamination, 1);

  state = applyAction(state, "realize_return_ritual_reproduction");
  state = applyAction(state, "take_stopped_pocket_watch");
  state = applyAction(state, "refuse_unopened_gift_as_return_fuel");
  state = applyAction(state, "take_wedding_rings");
  state = applyAction(state, "return_artifacts_for_ritual");
  assert.equal(state.flags.ritual_reproduced, true);
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
  broken.clues = [
    ...broken.clues,
    {
      id: "broken_clue",
      title: "Broken clue",
      category: "contradiction",
      description: "Broken clue should fail validation.",
      sources: [
        {
          type: "scene",
          id: "missing_scene",
        },
        {
          type: "npc",
          id: "minase_akari",
        },
      ],
      reveal: {
        any: [
          { flag: "missing_flag" },
          { item: "missing_item" },
          { action: "missing_action" },
          { check: "missing_check" },
        ],
      },
    } as unknown as (typeof broken.clues)[number],
    {
      id: "broken_clue",
      title: "Duplicate clue",
      category: "confirmed",
      description: "Duplicate clue id should fail validation.",
      sources: [
        {
          type: "scene",
          id: "scene_001_parallel_arrival",
        },
      ],
      reveal: {
        flag: "noticed_parallel_displacement",
      },
    },
  ];

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
  assert.equal(codes.has("DUPLICATE_ID"), true);
  assert.equal(codes.has("INVALID_CLUE_CATEGORY"), true);
  assert.equal(codes.has("INVALID_CLUE_SOURCE_TYPE"), true);
  assert.equal(codes.has("UNKNOWN_FLAG_ID"), true);
  assert.equal(codes.has("UNKNOWN_CHECK_ID"), true);
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

test("save/load persists player check profiles per scenario", () => {
  const profile = clonePlayerCheckProfile(DEFAULT_MVP_CHECK_PROFILE);
  profile.stats.intelligence = 7;
  profile.skills.observe = 5;

  const saved = saveCheckProfile(SCENARIO_ID, profile);
  assert.equal(saved?.scenarioId, SCENARIO_ID);
  assert.equal(typeof saved?.updatedAt, "string");

  const loaded = loadCheckProfile(SCENARIO_ID);
  assert.equal(loaded.stats.intelligence, 7);
  assert.equal(loaded.skills.observe, 5);
  assert.equal(loadCheckProfile("other_scenario").stats.intelligence, DEFAULT_MVP_CHECK_PROFILE.stats.intelligence);

  const roll = rollScenarioCheck({ ...findCheck("check_parallel_displacement"), target_number: 15 }, loaded, () => 0.1);
  assert.equal(roll.total, 15);
  assert.equal(roll.success, true);
});

test("loadCheckProfile falls back safely from corrupt or invalid profile data", () => {
  window.localStorage.setItem(CHECK_PROFILE_KEY, "{broken");
  assert.equal(loadCheckProfile(SCENARIO_ID).stats.intelligence, DEFAULT_MVP_CHECK_PROFILE.stats.intelligence);
  assert.equal(window.localStorage.getItem(CHECK_PROFILE_KEY), null);

  window.localStorage.setItem(
    CHECK_PROFILE_KEY,
    JSON.stringify({
      version: 999,
      scenarioId: SCENARIO_ID,
      profile: clonePlayerCheckProfile(DEFAULT_MVP_CHECK_PROFILE),
      updatedAt: "2026-05-28T00:00:00.000Z",
    }),
  );
  assert.equal(loadCheckProfile(SCENARIO_ID).skills.observe, DEFAULT_MVP_CHECK_PROFILE.skills.observe);
  assert.equal(window.localStorage.getItem(CHECK_PROFILE_KEY), null);

  window.localStorage.setItem(
    CHECK_PROFILE_KEY,
    JSON.stringify({
      version: 1,
      scenarioId: SCENARIO_ID,
      profile: {
        ...clonePlayerCheckProfile(DEFAULT_MVP_CHECK_PROFILE),
        stats: {
          intelligence: "18",
        },
        skills: {
          observe: "not-a-number",
          occult: 120,
        },
      },
      updatedAt: "2026-05-28T00:00:00.000Z",
    }),
  );
  const repaired = loadCheckProfile(SCENARIO_ID);
  assert.equal(repaired.stats.intelligence, 18);
  assert.equal(repaired.stats.dexterity, DEFAULT_MVP_CHECK_PROFILE.stats.dexterity);
  assert.equal(repaired.skills.observe, 0);
  assert.equal(repaired.skills.occult, 99);

  clearCheckProfile(SCENARIO_ID);
  assert.equal(window.localStorage.getItem(CHECK_PROFILE_KEY), null);
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

test("appendCompletedRunOnce records an ended run only once", () => {
  const route = playReturnRoute({ carryTwoArtifacts: false, openGift: false });
  assert.ok(route.ending);
  const endedState = { ...route.state, endingId: route.ending.id };

  const first = appendCompletedRunOnce(pack, endedState);
  const second = appendCompletedRunOnce(pack, first.state);
  const history = loadRunHistory(SCENARIO_ID);

  assert.ok(first.record?.runId);
  assert.equal(first.state.completedRunId, first.record?.runId);
  assert.equal(second.record, null);
  assert.equal(second.state.completedRunId, first.state.completedRunId);
  assert.equal(history.length, 1);
  assert.equal(history[0].endingId, "return_with_akari");
});

test("restart clears active run without deleting completed run history", () => {
  const initial = createInitialState(pack);
  const progressed = {
    ...initial,
    sceneId: "scene_004_returning_family",
    log: ["checkpoint", ...initial.log],
  };
  const route = playStayRoute();
  assert.ok(route.ending);

  assert.ok(saveActiveRun(SCENARIO_ID, progressed));
  const completed = appendCompletedRunOnce(pack, { ...route.state, endingId: route.ending.id });
  assert.ok(completed.record);

  clearActiveRun(SCENARIO_ID);

  assert.equal(loadActiveRun(SCENARIO_ID), null);
  assert.equal(loadRunHistory(SCENARIO_ID).length, 1);
  assert.equal(loadRunHistory(SCENARIO_ID)[0].endingId, "stay_with_akari");
});

test("storage unavailable does not block runtime progress or ended-run marking", () => {
  installUnavailableStorage();
  const initial = createInitialState(pack);
  const progressed = applyAction(initial, "say_not_replacement");
  const route = playReturnRoute({ carryTwoArtifacts: false, openGift: false });
  assert.ok(route.ending);

  const completed = appendCompletedRunOnce(pack, { ...route.state, endingId: route.ending.id });

  assert.equal(progressed.flags.said_not_replacement, true);
  assert.equal(saveActiveRun(SCENARIO_ID, progressed), null);
  assert.equal(completed.record, null);
  assert.equal(completed.state.completedRunId, `${SCENARIO_ID}:return_with_akari:unpersisted`);
  assert.equal(completed.state.endingId, "return_with_akari");
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
    createCompletedRunRecord("return_without_akari", "2026-05-27T12:30:00.000Z", {
      carryOutSelections: {
        four_room_artifact: ["empty_nameplate"],
      },
      finalCounters: {
        boundary_contamination: 1,
      },
      finalTrust: {
        minase_akari: 65,
      },
    }),
    createCompletedRunRecord("return_without_akari", "2026-05-27T11:00:00.000Z"),
    createCompletedRunRecord("return_without_akari", "2026-05-27T13:00:00.000Z", {
      scenarioId: "other_scenario",
    }),
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
  assert.equal(reached.rewards.length, 1);
  assert.match(reached.rewards[0], /記憶の断片/);
  assert.doesNotMatch(reached.rewards[0], /memory_fragment|minase_akari/);
  assert.match(reached.latestRunSummary.carryOutLabel, /四方のアーティファクト/);
  assert.doesNotMatch(reached.latestRunSummary.carryOutLabel, /empty_nameplate/);
  assert.match(reached.latestRunSummary.relationshipLabel, /65|隣/);
  assert.doesNotMatch(reached.latestRunSummary.relationshipLabel, /minase_akari/);
  assert.match(reached.latestRunSummary.contaminationLabel, /境界/);

  assert.equal(locked.status, "locked");
  assert.equal(locked.title, findEnding("return_with_akari").ending_tree?.blurred_title);
  assert.equal(locked.description, findEnding("return_with_akari").ending_tree?.route_hint);
  assert.notEqual(locked.title, findEnding("return_with_akari").title);
  assert.equal("hiddenDescription" in locked, false);
});

test("relationship contact records classify Akari clear traces without exposing raw ids", () => {
  const records = new Map(
    [
      createCompletedRunRecord("return_with_akari", "2026-05-27T10:00:00.000Z", {
        finalTrust: { minase_akari: 90 },
      }),
      createCompletedRunRecord("return_without_akari", "2026-05-27T11:00:00.000Z", {
        finalTrust: { minase_akari: 65 },
      }),
      createCompletedRunRecord("stay_with_akari", "2026-05-27T12:00:00.000Z", {
        finalTrust: { minase_akari: 80 },
      }),
      createCompletedRunRecord("boundary_collapse", "2026-05-27T13:00:00.000Z", {
        finalTrust: { minase_akari: 90 },
      }),
    ].map((record) => [record.endingId, buildRelationshipContactRecordForRun(pack, record)]),
  );

  const active = records.get("return_with_akari");
  const memory = records.get("return_without_akari");
  const shared = records.get("stay_with_akari");
  const lost = records.get("boundary_collapse");

  assert.equal(active?.category, "active_contact_record");
  assert.equal(memory?.category, "memory_contact_trace");
  assert.equal(shared?.category, "shared_boundary_record");
  assert.equal(lost?.category, "lost_relationship_trace");
  assert.match(active?.rewardLabels.join(" / ") ?? "", /関係のしるし/);
  assert.match(memory?.rewardLabels.join(" / ") ?? "", /記憶の断片/);
  assert.equal(lost?.trustLabel, undefined);
  assert.match(active?.eligibilityDetail ?? "", /到達済みの記録/);
  assert.match(active?.eligibilityDetail ?? "", /まだやりとりする欄ではありません/);
  assert.match(memory?.eligibilityDetail ?? "", /記憶と約束の痕跡/);
  assert.match(shared?.eligibilityDetail ?? "", /境界で灯のそばに残った縁/);
  assert.match(lost?.eligibilityDetail ?? "", /表示できません/);

  for (const record of Array.from(records.values())) {
    assertSafeRelationshipContactCopy(
      record.statusLabel,
      record.summary,
      record.detail,
      record.eligibilityDetail,
      record.trustLabel,
      ...record.rewardLabels,
    );
  }
});

test("best relationship contact record preserves the strongest Akari trace across history", () => {
  const history = [
    createCompletedRunRecord("boundary_collapse", "2026-05-27T14:00:00.000Z", {
      finalTrust: { minase_akari: 95 },
    }),
    createCompletedRunRecord("stay_with_akari", "2026-05-27T13:00:00.000Z", {
      finalTrust: { minase_akari: 80 },
    }),
    createCompletedRunRecord("return_without_akari", "2026-05-27T12:00:00.000Z", {
      finalTrust: { minase_akari: 65 },
    }),
    createCompletedRunRecord("return_with_akari", "2026-05-27T10:00:00.000Z", {
      finalTrust: { minase_akari: 90 },
    }),
  ];

  const best = buildBestRelationshipContactRecord(pack, history);

  assert.equal(best.category, "active_contact_record");
  assert.equal(best.sourceEndingId, "return_with_akari");
  assert.equal(best.completedAt, "2026-05-27T10:00:00.000Z");
  assertSafeRelationshipContactCopy(
    best.statusLabel,
    best.summary,
    best.detail,
    best.eligibilityDetail,
    best.trustLabel,
    ...best.rewardLabels,
  );

  const latestMemory = buildBestRelationshipContactRecord(pack, [
    createCompletedRunRecord("return_without_akari", "2026-05-27T11:00:00.000Z"),
    createCompletedRunRecord("return_without_akari", "2026-05-27T12:00:00.000Z"),
  ]);

  assert.equal(latestMemory.category, "memory_contact_trace");
  assert.equal(latestMemory.completedAt, "2026-05-27T12:00:00.000Z");

  const noRecord = buildBestRelationshipContactRecord(pack, [
    createCompletedRunRecord("return_with_akari", "2026-05-27T10:00:00.000Z", {
      scenarioId: "other_scenario",
    }),
  ]);

  assert.equal(noRecord.category, "no_record");
  assert.match(noRecord.eligibilityDetail, /到達済みの記録がまだない/);
  assert.equal(noRecord.rewardLabels.length, 0);
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
  let state = playCommonRoute({ openGift: false, reproduceRitual: true });
  state = applyAction(state, "burn_keepsakes_as_farewell");
  state = applyAction(state, "choose_stay_with_akari");

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
  let state = playCommonRouteBeforeMakabe({ openGift });
  state = applySuccess(state, "check_defeat_makabe");

  if (reproduceRitual) {
    state = applyAction(state, "realize_return_ritual_reproduction");
    state = applyAction(state, "take_stopped_pocket_watch");
    state = applyAction(state, "refuse_unopened_gift_as_return_fuel");
    state = applyAction(state, "take_wedding_rings");
    state = applyAction(state, "return_artifacts_for_ritual");
  }

  return state;
}

function playCommonRouteBeforeMakabe({ openGift }: { openGift: boolean }): ScenarioRuntimeState {
  let state = createInitialState(pack);

  state = applyAction(state, "say_not_replacement");
  state = applyAction(state, "let_akari_speak_regret");
  state = applyAction(state, "respect_gift_unopened");
  state = applySuccess(state, "check_cult_trace");
  state = applyAction(state, "let_akari_rest_in_empty_house");
  state = applyAction(state, "respect_dead_friend_home");
  state = applySuccess(state, "check_empty_house_context");
  state = applyAction(state, "protect_akari_without_possessing");
  state = applyAction(state, "stand_beside_akari_choice");
  state = applySuccess(state, "check_escape_returning_family");
  state = applyAction(state, "recover_stolen_keyholder");
  state = applyAction(state, "recover_birthday_gift");
  state = applySuccess(state, "check_understand_cult_goal");

  if (openGift) {
    state = applyAction(state, "open_birthday_gift");
  }

  state = applyAction(state, "take_boundary_ember");
  state = applyAction(state, "take_empty_nameplate");
  state = applyAction(state, "disrupt_ritual");
  state = applySuccess(state, "check_survive_relative_attack");
  state = applyAction(state, "share_guilt_truthfully");
  state = applySuccess(state, "check_hold_together_after_crime");

  return state;
}

function applyAction(state: ScenarioRuntimeState, actionId: string): ScenarioRuntimeState {
  const action = findAction(actionId);
  assert.equal(canUseAction(action, state), true, `${actionId} should be usable`);
  const changed = applyStateChanges(state, action.state_changes, pack);

  return {
    ...changed,
    lastChoiceId: action.id,
    usedActionIds: action.once_per_run ? [...changed.usedActionIds, action.id] : changed.usedActionIds,
  };
}

function canUseAction(action: SceneActionDefinition, state: ScenarioRuntimeState): boolean {
  if (action.once_per_run && state.usedActionIds.includes(action.id)) {
    return false;
  }

  return canUseRequirements(action.requirements, state, pack);
}

function applySuccess(state: ScenarioRuntimeState, checkId: string): ScenarioRuntimeState {
  const check = pack.scenes.flatMap((scene) => scene.checks ?? []).find((candidate) => candidate.id === checkId);
  assert.ok(check, `${checkId} should exist`);
  assert.equal(canUseRequirements(check.requirements, state, pack), true, `${checkId} requirements should be met`);
  return applyStateChanges(state, check.success as CheckOutcome | StateChanges | undefined, pack);
}

function applyFailure(state: ScenarioRuntimeState, checkId: string): ScenarioRuntimeState {
  const check = pack.scenes.flatMap((scene) => scene.checks ?? []).find((candidate) => candidate.id === checkId);
  assert.ok(check, `${checkId} should exist`);
  assert.equal(canUseRequirements(check.requirements, state, pack), true, `${checkId} requirements should be met`);
  return applyStateChanges(state, check.failure as CheckOutcome | StateChanges | undefined, pack);
}

function findAction(actionId: string): SceneActionDefinition {
  const action = pack.scenes.flatMap((scene) => scene.available_actions ?? []).find((candidate) => candidate.id === actionId);
  assert.ok(action, `${actionId} should exist`);
  return action;
}

function findCheck(checkId: string): SceneCheckDefinition {
  const check = pack.scenes.flatMap((scene) => scene.checks ?? []).find((candidate) => candidate.id === checkId);
  assert.ok(check, `${checkId} should exist`);
  return check;
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

function assertSafeRelationshipContactCopy(...texts: Array<string | undefined>): void {
  const combined = texts.filter(Boolean).join(" / ");
  assert.doesNotMatch(combined, /return_with_akari|return_without_akari|stay_with_akari|boundary_collapse/);
  assert.doesNotMatch(combined, /reward_|memory_fragment|relationship_asset|minase_akari/);
  assert.doesNotMatch(combined, /player_returns|npc_returns|unlock_conditions|contact_unlock_threshold/);
}

function createCompletedRunRecord(endingId: string, completedAt: string, overrides: Partial<CompletedRunRecord> = {}): CompletedRunRecord {
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
    ...overrides,
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

function installUnavailableStorage(): void {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      get localStorage(): Storage {
        throw new Error("localStorage blocked");
      },
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
