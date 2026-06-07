import assert from "node:assert/strict";
import { before, test } from "node:test";

import { rollAdventureCheck, advanceAdventureScene, applyAdventureAction } from "../lib/adventure/session";
import { buildAdventureViewModel } from "../lib/adventure/view-model";
import { loadScenarioPack } from "../lib/scenarios/loader";
import { createInitialState, toggleCarryOutItem } from "../lib/scenarios/runtime";
import type { ScenarioPack } from "../lib/scenarios/types";
import type { ScenarioRuntimeState } from "../lib/scenarios/types";

const SCENARIO_DIRECTORY = "kimidake_ga_oboeteiru_jiko";

let pack: ScenarioPack;

before(async () => {
  pack = await loadScenarioPack(SCENARIO_DIRECTORY);
});

test("Adventure view model gates choices until scene text is read", () => {
  const state = createInitialState(pack);
  const beforeText = buildAdventureViewModel(pack, state, false);
  const afterText = buildAdventureViewModel(pack, state, true);

  assert.equal(beforeText.scene.id, "scene_001_parallel_arrival");
  assert.equal(beforeText.visibleChoices.length, 0);
  assert.ok(afterText.visibleChoices.some((choice) => choice.id === "say_not_replacement"));
  assert.ok(afterText.visibleChoices.some((choice) => choice.id === "check_parallel_displacement"));
});

test("Adventure log entries classify initial notes and scene transitions", () => {
  const initialView = buildAdventureViewModel(pack, createInitialState(pack), false);

  assert.equal(initialView.logEntries[0]?.kind, "note");
  assert.equal(initialView.logEntries[0]?.kindLabel, "記録");
  assert.equal(initialView.logEntries[0]?.text, "シナリオを開始した。");

  const moved = advanceAdventureScene(pack, createInitialState(pack)).state;
  const movedView = buildAdventureViewModel(pack, moved, false);

  assert.equal(movedView.logEntries[0]?.kind, "scene");
  assert.equal(movedView.logEntries[0]?.kindLabel, "場面");
  assert.doesNotMatch(movedView.logEntries[0]?.text ?? "", /場面移動/);
  assert.equal(movedView.logEntries[0]?.detail, "次の調査地点へ移動した。");
});

test("Adventure actions update state, log, and derived evidence without changing scenario data", () => {
  const state = createInitialState(pack);
  const scene = pack.scenes.find((candidate) => candidate.id === "scene_001_parallel_arrival");
  const action = scene?.available_actions?.find((candidate) => candidate.id === "say_not_replacement");
  assert.ok(scene);
  assert.ok(action);

  const result = applyAdventureAction(pack, state, scene, action);
  const view = buildAdventureViewModel(pack, result.state, true);

  assert.equal(result.state.flags.said_not_replacement, true);
  assert.equal(result.state.trust.minase_akari, 35);
  assert.ok(result.state.usedActionIds.includes("say_not_replacement"));
  const evidence = view.evidence.find((entry) => entry.id === "flag:said_not_replacement");
  assert.ok(evidence);
  assert.doesNotMatch(evidence.source, /^scene_/);
  assert.match(result.state.log[0], /自分は死んだ親友の代わりではない/);
  assert.equal(view.logEntries[0]?.kind, "action");
  assert.equal(view.logEntries[0]?.kindLabel, "行動");
  assert.match(view.logEntries[0]?.text ?? "", /自分は死んだ親友の代わりではない/);
});

test("Adventure checks roll once, apply the outcome, and become player log entries", () => {
  const state = createInitialState(pack);
  const scene = pack.scenes.find((candidate) => candidate.id === "scene_001_parallel_arrival");
  const check = scene?.checks?.find((candidate) => candidate.id === "check_parallel_displacement");
  assert.ok(scene);
  assert.ok(check);

  const result = rollAdventureCheck(pack, state, scene, check, undefined, () => 0.999999);
  const view = buildAdventureViewModel(pack, result.state, true);

  assert.equal(result.roll?.success, true);
  assert.equal(result.state.flags.noticed_parallel_displacement, true);
  assert.ok(result.state.usedActionIds.includes("check_parallel_displacement"));
  assert.match(result.state.log[0], /出目 20/);
  assert.doesNotMatch(result.state.log[0], /d20/);
  assert.equal(view.logEntries[0]?.kind, "check");
  assert.equal(view.logEntries[0]?.kindLabel, "判定");
  assert.match(view.logEntries[0]?.detail ?? "", /出目 20/);
  assert.ok(view.evidence.some((entry) => entry.id === "flag:noticed_parallel_displacement"));
  assert.ok(!view.visibleChoices.some((choice) => choice.id === "check_parallel_displacement"));
});

test("Adventure evidence follows the existing scene 2 and scene 3 flag contract", () => {
  const scene2 = pack.scenes.find((candidate) => candidate.id === "scene_002_accident_trace");
  const speakRegret = scene2?.available_actions?.find((candidate) => candidate.id === "let_akari_speak_regret");
  const respectGift = scene2?.available_actions?.find((candidate) => candidate.id === "respect_gift_unopened");
  assert.ok(scene2);
  assert.ok(speakRegret);
  assert.ok(respectGift);

  let state = { ...createInitialState(pack), sceneId: scene2.id };
  state = applyAdventureAction(pack, state, scene2, speakRegret).state;
  state = applyAdventureAction(pack, state, scene2, respectGift).state;

  const scene2View = buildAdventureViewModel(pack, state, true);
  assert.ok(scene2View.evidence.some((entry) => entry.id === "flag:akari_regret_spoken"));
  assert.ok(scene2View.evidence.some((entry) => entry.id === "flag:gift_respected_unopened"));

  const scene3 = pack.scenes.find((candidate) => candidate.id === "scene_003_empty_house");
  const respectHome = scene3?.available_actions?.find((candidate) => candidate.id === "respect_dead_friend_home");
  const emptyHouseCheck = scene3?.checks?.find((candidate) => candidate.id === "check_empty_house_context");
  assert.ok(scene3);
  assert.ok(respectHome);
  assert.ok(emptyHouseCheck);

  state = { ...state, sceneId: scene3.id };
  state = applyAdventureAction(pack, state, scene3, respectHome).state;
  state = rollAdventureCheck(pack, state, scene3, emptyHouseCheck, undefined, () => 0.999999).state;

  const scene3View = buildAdventureViewModel(pack, state, true);
  assert.ok(scene3View.evidence.some((entry) => entry.id === "flag:dead_friend_home_respected"));
  assert.ok(scene3View.evidence.some((entry) => entry.id === "flag:confirmed_empty_house_identity"));
  assert.equal(scene3View.status.memoryLabel, "違和感を覚えている");
});

test("Adventure scene advance follows existing YAML from scene 3 into scene 4", () => {
  const scene3 = pack.scenes.find((candidate) => candidate.id === "scene_003_empty_house");
  const restAction = scene3?.available_actions?.find((candidate) => candidate.id === "let_akari_rest_in_empty_house");
  assert.ok(scene3);
  assert.ok(restAction);

  const state = { ...createInitialState(pack), sceneId: scene3.id };
  const beforeRestView = buildAdventureViewModel(pack, state, true);
  const advanced = advanceAdventureScene(pack, state);

  assert.equal(beforeRestView.status.objectiveLabel, "灯が休める時間を作る");
  assert.equal(advanced.state.sceneId, "scene_004_returning_family");
  assert.equal(advanced.event, "迎えに来る家");

  const afterRest = applyAdventureAction(pack, state, scene3, restAction).state;
  const afterRestView = buildAdventureViewModel(pack, afterRest, true);

  assert.equal(afterRest.flags.akari_rested_in_empty_house, true);
  assert.equal(afterRestView.status.objectiveLabel, "灯が休める時間を作る");
});

test("Adventure scene advance no longer stops at the scene 3 Stage 14R completion gate", () => {
  const scene1 = advanceAdventureScene(pack, createInitialState(pack)).state;
  const scene2 = advanceAdventureScene(pack, scene1).state;
  const scene3 = pack.scenes.find((candidate) => candidate.id === "scene_003_empty_house");
  const restAction = scene3?.available_actions?.find((candidate) => candidate.id === "let_akari_rest_in_empty_house");
  assert.ok(scene3);
  assert.ok(restAction);
  const rested = applyAdventureAction(pack, scene2, scene3, restAction).state;
  const result = advanceAdventureScene(pack, rested);

  assert.equal(scene1.sceneId, "scene_002_accident_trace");
  assert.equal(scene2.sceneId, "scene_003_empty_house");
  assert.equal(result.state.sceneId, "scene_004_returning_family");
  assert.equal(result.event, "迎えに来る家");
});

test("Adventure view model hides final choices until regret is resolved", () => {
  const scene7 = pack.scenes.find((candidate) => candidate.id === "scene_007_return_fire");
  assert.ok(scene7);

  const beforeFarewell = { ...createInitialState(pack), sceneId: scene7.id };
  const beforeView = buildAdventureViewModel(pack, beforeFarewell, true);

  assert.ok(!beforeView.visibleChoices.some((choice) => choice.id === "choose_return_with_akari"));
  assert.ok(!beforeView.visibleChoices.some((choice) => choice.id === "choose_return_alone"));
  assert.ok(!beforeView.visibleChoices.some((choice) => choice.id === "choose_stay_with_akari"));

  const afterFarewell = {
    ...beforeFarewell,
    flags: {
      ...beforeFarewell.flags,
      regret_resolved: true,
    },
  };
  const afterView = buildAdventureViewModel(pack, afterFarewell, true);

  assert.ok(afterView.visibleChoices.some((choice) => choice.id === "choose_return_with_akari"));
  assert.ok(afterView.visibleChoices.some((choice) => choice.id === "choose_return_alone"));
  assert.ok(afterView.visibleChoices.some((choice) => choice.id === "choose_stay_with_akari"));
});

test("Adventure session can play from scene 4 through the true ending", () => {
  let state = createInitialState(pack);

  state = applyActionById(state, "scene_001_parallel_arrival", "say_not_replacement");
  state = rollCheckById(state, "scene_001_parallel_arrival", "check_parallel_displacement");
  state = advanceAdventureScene(pack, state).state;

  state = applyActionById(state, "scene_002_accident_trace", "let_akari_speak_regret");
  state = applyActionById(state, "scene_002_accident_trace", "respect_gift_unopened");
  state = rollCheckById(state, "scene_002_accident_trace", "check_cult_trace");
  state = advanceAdventureScene(pack, state).state;

  state = applyActionById(state, "scene_003_empty_house", "let_akari_rest_in_empty_house");
  state = applyActionById(state, "scene_003_empty_house", "respect_dead_friend_home");
  state = rollCheckById(state, "scene_003_empty_house", "check_empty_house_context");
  state = advanceAdventureScene(pack, state).state;

  assert.equal(state.sceneId, "scene_004_returning_family");

  state = applyActionById(state, "scene_004_returning_family", "protect_akari_without_possessing");
  state = applyActionById(state, "scene_004_returning_family", "stand_beside_akari_choice");
  state = rollCheckById(state, "scene_004_returning_family", "check_escape_returning_family");
  state = advanceAdventureScene(pack, state).state;

  assert.equal(state.sceneId, "scene_005_cult_facility");

  state = applyActionById(state, "scene_005_cult_facility", "recover_stolen_keyholder");
  state = applyActionById(state, "scene_005_cult_facility", "recover_birthday_gift");
  state = rollCheckById(state, "scene_005_cult_facility", "check_understand_cult_goal");
  state = advanceAdventureScene(pack, state).state;

  assert.equal(state.sceneId, "scene_006_four_rooms_ritual");

  state = applyActionById(state, "scene_006_four_rooms_ritual", "take_boundary_ember");
  state = applyActionById(state, "scene_006_four_rooms_ritual", "take_empty_nameplate");
  state = applyActionById(state, "scene_006_four_rooms_ritual", "take_stopped_pocket_watch");
  state = applyActionById(state, "scene_006_four_rooms_ritual", "disrupt_ritual");
  state = rollCheckById(state, "scene_006_four_rooms_ritual", "check_survive_relative_attack");
  state = applyActionById(state, "scene_006_four_rooms_ritual", "share_guilt_truthfully");
  state = rollCheckById(state, "scene_006_four_rooms_ritual", "check_hold_together_after_crime");
  state = rollCheckById(state, "scene_006_four_rooms_ritual", "check_defeat_makabe");
  state = applyActionById(state, "scene_006_four_rooms_ritual", "realize_return_ritual_reproduction");
  state = advanceAdventureScene(pack, state).state;

  assert.equal(state.sceneId, "scene_007_return_fire");

  const beforeRegretView = buildAdventureViewModel(pack, state, true);
  assert.ok(!beforeRegretView.visibleChoices.some((choice) => choice.id === "choose_return_with_akari"));

  state = applyActionById(state, "scene_007_return_fire", "refuse_unopened_gift_as_return_fuel");
  state = applyActionById(state, "scene_007_return_fire", "take_wedding_rings");
  state = applyActionById(state, "scene_007_return_fire", "return_artifacts_for_ritual");
  state = toggleCarryOutItem(state, "four_room_artifact", "boundary_ember");
  state = applyActionById(state, "scene_007_return_fire", "burn_keepsakes_as_farewell");
  state = applyActionById(state, "scene_007_return_fire", "promise_return_together");
  const endingResult = applyActionResultById(state, "scene_007_return_fire", "choose_return_with_akari");
  state = endingResult.state;

  const endingView = buildAdventureViewModel(pack, state, true);

  assert.equal(endingResult.ending?.id, "return_with_akari");
  assert.equal(state.endingId, "return_with_akari");
  assert.equal(endingView.ending?.title, "双つ灯の生還");
  assert.equal(endingView.endingTypeLabel, "トゥルー");
  assert.match(endingView.endingSummary?.outcomeLabel ?? "", /同じ灯/);
  assert.match(endingView.endingSummary?.carryOutLabel ?? "", /境界の火種/);
  assert.doesNotMatch(endingView.endingSummary?.carryOutLabel ?? "", /boundary_ember/);
  assert.match(endingView.endingSummary?.inspectionLabel ?? "", /証拠/);
  assert.deepEqual(
    endingView.replayHints.map((hint) => hint.family),
    ["branch", "evidence", "carry_out"],
  );
  const replayHintText = endingView.replayHints.map((hint) => [hint.label, hint.text, hint.detail].filter(Boolean).join(" ")).join(" ");
  assert.match(replayHintText, /別の感情ルート/);
  assert.match(replayHintText, /整理済みの手がかりは/);
  assert.match(replayHintText, /持ち帰り/);
  assert.doesNotMatch(
    replayHintText,
    /return_with_akari|return_without_akari|stay_with_akari|boundary_collapse|boundary_ember|empty_nameplate|choose_|check_|flag:|four_room_artifacts_carried_out|minase_akari|>=|<=|==|&&|\|\|/,
  );
  assert.equal(endingView.visibleChoices.length, 0);
  assert.equal(endingView.carryOutGroups[0]?.items.find((item) => item.id === "boundary_ember")?.disabled, true);
});

test("Adventure carry-out selections are visible and can steer over-limit return attempts to collapse", () => {
  let state = createInitialState(pack);

  state = {
    ...state,
    sceneId: "scene_007_return_fire",
    flags: {
      ...state.flags,
      makabe_gone: true,
      relatives_killed: true,
      ritual_reproduction_realized: true,
      gift_refused_as_return_fuel: true,
      ritual_reproduced: true,
      regret_resolved: true,
      shared_guilt: true,
    },
    inventory: ["boundary_ember", "empty_nameplate", "stopped_pocket_watch", "unopened_birthday_gift", "paired_lion_keyholder_stolen", "relatives_wedding_rings"],
    trust: {
      ...state.trust,
      minase_akari: 100,
    },
  };

  state = toggleCarryOutItem(state, "four_room_artifact", "boundary_ember");
  state = toggleCarryOutItem(state, "four_room_artifact", "empty_nameplate");

  const view = buildAdventureViewModel(pack, state, true);
  const group = view.carryOutGroups.find((candidate) => candidate.id === "four_room_artifact");

  assert.ok(group);
  assert.equal(group.selectedCount, 2);
  assert.equal(group.limit, 1);
  assert.match(group.warning ?? "", /制限/);
  assert.ok(group.items.some((item) => item.id === "boundary_ember" && item.selected));
  assert.ok(group.items.some((item) => item.id === "empty_nameplate" && item.selected));

  const endingResult = applyActionResultById(state, "scene_007_return_fire", "choose_return_with_akari");

  assert.equal(state.counters.four_room_artifacts_carried_out, 2);
  assert.equal(endingResult.ending?.id, "boundary_collapse");
  assert.equal(endingResult.state.endingId, "boundary_collapse");
});

function applyActionById(state: ScenarioRuntimeState, sceneId: string, actionId: string): ScenarioRuntimeState {
  return applyActionResultById(state, sceneId, actionId).state;
}

function applyActionResultById(state: ScenarioRuntimeState, sceneId: string, actionId: string) {
  const scene = findScene(sceneId);
  const action = scene.available_actions?.find((candidate) => candidate.id === actionId);
  assert.ok(action, `Missing action ${actionId}`);
  return applyAdventureAction(pack, state, scene, action);
}

function rollCheckById(state: ScenarioRuntimeState, sceneId: string, checkId: string): ScenarioRuntimeState {
  const scene = findScene(sceneId);
  const check = scene.checks?.find((candidate) => candidate.id === checkId);
  assert.ok(check, `Missing check ${checkId}`);
  return rollAdventureCheck(pack, state, scene, check, undefined, () => 0.999999).state;
}

function findScene(sceneId: string) {
  const scene = pack.scenes.find((candidate) => candidate.id === sceneId);
  assert.ok(scene, `Missing scene ${sceneId}`);
  return scene;
}
