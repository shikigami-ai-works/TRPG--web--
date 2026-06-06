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
  assert.ok(view.evidence.some((entry) => entry.id === "flag:noticed_parallel_displacement"));
  assert.ok(!view.visibleChoices.some((choice) => choice.id === "check_parallel_displacement"));
});

test("Adventure scene advance stops Stage 14R at the scene 3 completion gate", () => {
  const scene1 = advanceAdventureScene(pack, createInitialState(pack)).state;
  const scene2 = advanceAdventureScene(pack, scene1).state;
  const result = advanceAdventureScene(pack, scene2);

  assert.equal(scene1.sceneId, "scene_002_accident_trace");
  assert.equal(scene2.sceneId, "scene_003_empty_house");
  assert.equal(result.sliceComplete, true);
  assert.equal(result.state.sceneId, "scene_003_empty_house");
});
