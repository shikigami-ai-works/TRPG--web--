import assert from "node:assert/strict";
import { before, test } from "node:test";

import { rollAdventureCheck, advanceAdventureScene, applyAdventureAction } from "../lib/adventure/session";
import { buildAdventureViewModel } from "../lib/adventure/view-model";
import { loadScenarioPack } from "../lib/scenarios/loader";
import { createInitialState } from "../lib/scenarios/runtime";
import type { ScenarioPack } from "../lib/scenarios/types";

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

test("Adventure slice completion requires giving Akari rest in scene 3", () => {
  const scene3 = pack.scenes.find((candidate) => candidate.id === "scene_003_empty_house");
  const restAction = scene3?.available_actions?.find((candidate) => candidate.id === "let_akari_rest_in_empty_house");
  assert.ok(scene3);
  assert.ok(restAction);

  const beforeRest = { ...createInitialState(pack), sceneId: scene3.id };
  const beforeRestView = buildAdventureViewModel(pack, beforeRest, true);
  const blocked = advanceAdventureScene(pack, beforeRest);

  assert.equal(beforeRestView.isSliceEndScene, true);
  assert.equal(beforeRestView.canCompleteSlice, false);
  assert.equal(beforeRestView.status.objectiveLabel, "灯が休める時間を作る");
  assert.equal(blocked.sliceComplete, undefined);
  assert.equal(blocked.state.sceneId, "scene_003_empty_house");

  const afterRest = applyAdventureAction(pack, beforeRest, scene3, restAction).state;
  const afterRestView = buildAdventureViewModel(pack, afterRest, true);
  const completed = advanceAdventureScene(pack, afterRest);

  assert.equal(afterRest.flags.akari_rested_in_empty_house, true);
  assert.equal(afterRestView.canCompleteSlice, true);
  assert.equal(afterRestView.status.objectiveLabel, "ここまでの記録を閉じる");
  assert.equal(completed.sliceComplete, true);
  assert.equal(completed.state.sceneId, "scene_003_empty_house");
  assert.equal(completed.event, "空き家で灯を休ませた。ここまでの調査を記録した。");
  assert.equal(completed.state.log[0], "空き家で灯を休ませ、ここまでの調査記録を閉じた。");
  assert.doesNotMatch(completed.state.log[0], /Stage 14R/);
});

test("Adventure scene advance stops Stage 14R at the scene 3 completion gate", () => {
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
  assert.equal(result.sliceComplete, true);
  assert.equal(result.state.sceneId, "scene_003_empty_house");
});
