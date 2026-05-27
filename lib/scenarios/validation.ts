import type {
  CheckOutcome,
  ConditionExpr,
  EndingDefinition,
  Requirement,
  RewardDefinition,
  ScenarioPack,
  SceneActionDefinition,
  SceneCheckDefinition,
  SceneDefinition,
  StateChanges,
} from "./types";

export type ScenarioValidationSeverity = "error" | "warning";

export interface ScenarioValidationIssue {
  severity: ScenarioValidationSeverity;
  code: string;
  path: string;
  message: string;
}

export interface ScenarioValidationResult {
  scenarioId: string;
  directory: string;
  issues: ScenarioValidationIssue[];
  errorCount: number;
  warningCount: number;
}

interface IdRef {
  id: string;
  path: string;
}

interface ValidationContext {
  pack: ScenarioPack;
  issues: ScenarioValidationIssue[];
  sceneIds: Set<string>;
  npcIds: Set<string>;
  itemIds: Set<string>;
  endingIds: Set<string>;
  actionIds: Set<string>;
  checkIds: Set<string>;
  flagIds: Set<string>;
  counterIds: Set<string>;
  carryOutGroupIds: Set<string>;
}

type ReferenceKind =
  | "scene"
  | "npc"
  | "item"
  | "ending"
  | "action"
  | "check"
  | "flag"
  | "counter"
  | "carry-out group";

const CONDITION_KEYS = ["all", "any", "any_missing", "flag", "counter", "trust", "item", "choice"];

export function validateScenarioPacks(packs: ScenarioPack[]): ScenarioValidationResult[] {
  return packs.map((pack) => validateScenarioPack(pack));
}

export function validateScenarioPack(pack: ScenarioPack): ScenarioValidationResult {
  const ctx = createValidationContext(pack);

  validateScenarioReferences(ctx);
  validateSceneReferences(ctx);
  validateEndingReferences(ctx);
  validateCarryOutGroups(ctx);
  validateReachability(ctx);

  return {
    scenarioId: pack.scenario.id,
    directory: pack.directory,
    issues: ctx.issues,
    errorCount: ctx.issues.filter((issue) => issue.severity === "error").length,
    warningCount: ctx.issues.filter((issue) => issue.severity === "warning").length,
  };
}

export function hasScenarioValidationErrors(results: ScenarioValidationResult[]): boolean {
  return results.some((result) => result.errorCount > 0);
}

export function formatScenarioValidationResults(results: ScenarioValidationResult[]): string {
  const errorCount = results.reduce((total, result) => total + result.errorCount, 0);
  const warningCount = results.reduce((total, result) => total + result.warningCount, 0);
  const lines = [`Scenario validation: ${results.length} pack(s), ${errorCount} error(s), ${warningCount} warning(s).`];

  for (const result of results) {
    for (const issue of result.issues) {
      lines.push(
        `[${issue.severity}] ${result.directory}/${result.scenarioId} ${issue.path} ${issue.code}: ${issue.message}`,
      );
    }
  }

  if (errorCount === 0 && warningCount === 0) {
    lines.push("No scenario data issues found.");
  }

  return lines.join("\n");
}

function createValidationContext(pack: ScenarioPack): ValidationContext {
  const issues: ScenarioValidationIssue[] = [];
  const ctx: ValidationContext = {
    pack,
    issues,
    sceneIds: collectUniqueIds(issues, "scene", pack.scenes.map((scene, index) => ({ id: scene.id, path: `scenes[${index}].id` }))),
    npcIds: collectUniqueIds(issues, "npc", pack.npcs.map((npc, index) => ({ id: npc.id, path: `npcs[${index}].id` }))),
    itemIds: collectUniqueIds(issues, "item", pack.items.map((item, index) => ({ id: item.id, path: `items[${index}].id` }))),
    endingIds: collectUniqueIds(
      issues,
      "ending",
      pack.endings.map((ending, index) => ({ id: ending.id, path: `endings[${index}].id` })),
    ),
    actionIds: collectUniqueIds(issues, "action", collectActionRefs(pack.scenes)),
    checkIds: collectUniqueIds(issues, "check", collectCheckRefs(pack.scenes)),
    flagIds: new Set(Object.keys(pack.scenario.mechanics?.initial_flags ?? {})),
    counterIds: new Set(Object.keys(pack.scenario.mechanics?.counters ?? {})),
    carryOutGroupIds: collectUniqueIds(
      issues,
      "carry-out group",
      (pack.scenario.mechanics?.carry_out_groups ?? []).map((group, index) => ({
        id: group.id,
        path: `scenario.mechanics.carry_out_groups[${index}].id`,
      })),
    ),
  };

  return ctx;
}

function collectUniqueIds(issues: ScenarioValidationIssue[], kind: ReferenceKind, refs: IdRef[]): Set<string> {
  const ids = new Set<string>();
  const firstPathById = new Map<string, string>();

  for (const ref of refs) {
    if (!ref.id) {
      addIssue(issues, "error", "MISSING_ID", ref.path, `Missing ${kind} id.`);
      continue;
    }

    const firstPath = firstPathById.get(ref.id);
    if (firstPath) {
      addIssue(issues, "error", "DUPLICATE_ID", ref.path, `Duplicate ${kind} id "${ref.id}" already defined at ${firstPath}.`);
      continue;
    }

    firstPathById.set(ref.id, ref.path);
    ids.add(ref.id);
  }

  return ids;
}

function collectActionRefs(scenes: SceneDefinition[]): IdRef[] {
  return scenes.flatMap((scene, sceneIndex) =>
    (scene.available_actions ?? []).map((action, actionIndex) => ({
      id: action.id,
      path: `scenes[${sceneIndex}].available_actions[${actionIndex}].id`,
    })),
  );
}

function collectCheckRefs(scenes: SceneDefinition[]): IdRef[] {
  return scenes.flatMap((scene, sceneIndex) =>
    (scene.checks ?? []).map((check, checkIndex) => ({
      id: check.id,
      path: `scenes[${sceneIndex}].checks[${checkIndex}].id`,
    })),
  );
}

function validateScenarioReferences(ctx: ValidationContext): void {
  const { pack } = ctx;

  assertKnownId(ctx, "npc", pack.scenario.mechanics?.npc_trust?.npc_id, ctx.npcIds, "scenario.mechanics.npc_trust.npc_id");

  pack.scenario.scenes.forEach((sceneId, index) => {
    assertKnownId(ctx, "scene", sceneId, ctx.sceneIds, `scenario.scenes[${index}]`);
  });

  pack.scenario.endings.forEach((endingId, index) => {
    assertKnownId(ctx, "ending", endingId, ctx.endingIds, `scenario.endings[${index}]`);
  });

  (pack.scenario.ending_resolution_order ?? []).forEach((endingId, index) => {
    assertKnownId(ctx, "ending", endingId, ctx.endingIds, `scenario.ending_resolution_order[${index}]`);
  });

  for (const actionId of Object.keys(pack.scenario.mechanics?.trust_gain ?? {})) {
    assertKnownId(ctx, "action", actionId, ctx.actionIds, `scenario.mechanics.trust_gain.${actionId}`);
  }

  for (const actionId of Object.keys(pack.scenario.mechanics?.trust_loss ?? {})) {
    assertKnownId(ctx, "action", actionId, ctx.actionIds, `scenario.mechanics.trust_loss.${actionId}`);
  }

  const carryOutGroupId = pack.scenario.mechanics?.four_rooms_rule?.carry_out_group_id;
  if (typeof carryOutGroupId === "string") {
    assertKnownId(ctx, "carry-out group", carryOutGroupId, ctx.carryOutGroupIds, "scenario.mechanics.four_rooms_rule.carry_out_group_id");
  }

  (pack.scenario.clear_conditions ?? []).forEach((condition, conditionIndex) => {
    (condition.required_flags ?? []).forEach((rawFlag, flagIndex) => {
      const flagId = rawFlag.split(":")[0];
      assertKnownId(ctx, "flag", flagId, ctx.flagIds, `scenario.clear_conditions[${conditionIndex}].required_flags[${flagIndex}]`);
    });
  });

  validateRewards(ctx, pack.scenario.rewards ?? [], "scenario.rewards");
}

function validateSceneReferences(ctx: ValidationContext): void {
  ctx.pack.scenes.forEach((scene, sceneIndex) => {
    (scene.npc_ids ?? []).forEach((npcId, npcIndex) => {
      assertKnownId(ctx, "npc", npcId, ctx.npcIds, `scenes[${sceneIndex}].npc_ids[${npcIndex}]`);
    });

    (scene.available_actions ?? []).forEach((action, actionIndex) => {
      validateAction(ctx, action, `scenes[${sceneIndex}].available_actions[${actionIndex}]`);
    });

    (scene.checks ?? []).forEach((check, checkIndex) => {
      validateCheck(ctx, check, `scenes[${sceneIndex}].checks[${checkIndex}]`);
    });

    validateNextSceneRules(ctx, scene, sceneIndex);
  });
}

function validateAction(ctx: ValidationContext, action: SceneActionDefinition, basePath: string): void {
  validateRequirements(ctx, action.requirements, `${basePath}.requirements`, "requirement");
  validateStateChanges(ctx, action.state_changes, `${basePath}.state_changes`);
}

function validateCheck(ctx: ValidationContext, check: SceneCheckDefinition, basePath: string): void {
  validateRequirements(ctx, check.requirements, `${basePath}.requirements`, "requirement");
  validateCheckOutcome(ctx, check.success, `${basePath}.success`);
  validateCheckOutcome(ctx, check.failure, `${basePath}.failure`);
}

function validateCheckOutcome(ctx: ValidationContext, outcome: CheckOutcome | undefined, basePath: string): void {
  validateStateChanges(ctx, outcome, basePath);
}

function validateNextSceneRules(ctx: ValidationContext, scene: SceneDefinition, sceneIndex: number): void {
  const rules = scene.next_scene_rules ?? [];
  const targetByCondition = new Map<string, { path: string; target: string }>();
  let sawDefault = false;
  let unconditionalRulePath: string | null = null;

  rules.forEach((rule, ruleIndex) => {
    const basePath = `scenes[${sceneIndex}].next_scene_rules[${ruleIndex}]`;
    const targetCount = [rule.next_scene_id, rule.ending_id, rule.resolve_ending === true].filter(Boolean).length;

    if (targetCount !== 1) {
      addIssue(
        ctx.issues,
        "error",
        "INVALID_NEXT_SCENE_RULE_TARGET",
        basePath,
        "A next_scene_rule must set exactly one of next_scene_id, ending_id, or resolve_ending.",
      );
    }

    if (rule.next_scene_id) {
      assertKnownId(ctx, "scene", rule.next_scene_id, ctx.sceneIds, `${basePath}.next_scene_id`);
    }
    if (rule.ending_id) {
      assertKnownId(ctx, "ending", rule.ending_id, ctx.endingIds, `${basePath}.ending_id`);
    }

    validateRequirement(ctx, rule.condition, `${basePath}.condition`, "next_scene_rule");

    if (rule.condition === "default") {
      if (sawDefault) {
        addIssue(ctx.issues, "error", "MULTIPLE_DEFAULT_RULES", `${basePath}.condition`, `Scene "${scene.id}" has more than one default rule.`);
      }
      sawDefault = true;
    }

    if (unconditionalRulePath && rule.condition !== "default") {
      addIssue(
        ctx.issues,
        "warning",
        "UNREACHABLE_NEXT_SCENE_RULE",
        `${basePath}.condition`,
        `This rule is after unconditional rule ${unconditionalRulePath} and will not be selected.`,
      );
    }

    if (rule.condition === "always") {
      unconditionalRulePath = `${basePath}.condition`;
    }

    const conditionKey = stableRequirementKey(rule.condition);
    const targetKey = stableRuleTargetKey(rule);
    const previous = targetByCondition.get(conditionKey);
    if (previous && previous.target !== targetKey) {
      addIssue(
        ctx.issues,
        "error",
        "CONFLICTING_NEXT_SCENE_RULE",
        basePath,
        `Condition ${conditionKey} has conflicting targets at ${previous.path} and ${basePath}.`,
      );
    } else if (previous) {
      addIssue(ctx.issues, "warning", "DUPLICATE_NEXT_SCENE_RULE", basePath, `Condition ${conditionKey} duplicates ${previous.path}.`);
    } else {
      targetByCondition.set(conditionKey, { path: basePath, target: targetKey });
    }
  });
}

function validateEndingReferences(ctx: ValidationContext): void {
  ctx.pack.endings.forEach((ending, endingIndex) => {
    const basePath = `endings[${endingIndex}]`;
    validateCondition(ctx, ending.unlock_conditions, `${basePath}.unlock_conditions`);
    validateRewards(ctx, ending.rewards ?? [], `${basePath}.rewards`);
  });
}

function validateCarryOutGroups(ctx: ValidationContext): void {
  const itemIdsByGroup = new Map<string, Set<string>>();

  (ctx.pack.scenario.mechanics?.carry_out_groups ?? []).forEach((group, groupIndex) => {
    const groupPath = `scenario.mechanics.carry_out_groups[${groupIndex}]`;
    const ids = new Set<string>();
    itemIdsByGroup.set(group.id, ids);

    group.item_ids.forEach((itemId, itemIndex) => {
      const itemPath = `${groupPath}.item_ids[${itemIndex}]`;
      assertKnownId(ctx, "item", itemId, ctx.itemIds, itemPath);
      if (ids.has(itemId)) {
        addIssue(ctx.issues, "error", "DUPLICATE_GROUP_ITEM", itemPath, `Item "${itemId}" is repeated in carry-out group "${group.id}".`);
      }
      ids.add(itemId);
    });

    if (group.max_count_at_clear !== undefined && group.max_count_at_clear > group.item_ids.length) {
      addIssue(
        ctx.issues,
        "warning",
        "CARRY_OUT_LIMIT_EXCEEDS_GROUP_SIZE",
        `${groupPath}.max_count_at_clear`,
        `Limit ${group.max_count_at_clear} is larger than the ${group.item_ids.length} item(s) in group "${group.id}".`,
      );
    }

    if (group.return_ritual_requires_returned_count !== undefined && group.return_ritual_requires_returned_count > group.item_ids.length) {
      addIssue(
        ctx.issues,
        "error",
        "RETURN_REQUIREMENT_EXCEEDS_GROUP_SIZE",
        `${groupPath}.return_ritual_requires_returned_count`,
        `Return requirement ${group.return_ritual_requires_returned_count} is larger than the ${group.item_ids.length} item(s) in group "${group.id}".`,
      );
    }
  });

  ctx.pack.items.forEach((item, itemIndex) => {
    const basePath = `items[${itemIndex}]`;

    if (item.found_in_scene_id) {
      assertKnownId(ctx, "scene", item.found_in_scene_id, ctx.sceneIds, `${basePath}.found_in_scene_id`);
    }

    if (item.carry_out_group) {
      assertKnownId(ctx, "carry-out group", item.carry_out_group, ctx.carryOutGroupIds, `${basePath}.carry_out_group`);
      const groupItemIds = itemIdsByGroup.get(item.carry_out_group);
      if (groupItemIds && !groupItemIds.has(item.id)) {
        addIssue(
          ctx.issues,
          "error",
          "MISMATCHED_CARRY_OUT_GROUP",
          `${basePath}.carry_out_group`,
          `Item "${item.id}" points to group "${item.carry_out_group}" but that group does not list the item.`,
        );
      }
    }

    if (item.can_carry_out && !item.carry_out_group) {
      addIssue(ctx.issues, "warning", "CARRY_OUT_ITEM_WITHOUT_GROUP", basePath, `Carry-out item "${item.id}" does not belong to a carry-out group.`);
    }
  });

  itemIdsByGroup.forEach((groupItemIds, groupId) => {
    Array.from(groupItemIds).forEach((itemId) => {
      const item = ctx.pack.items.find((candidate) => candidate.id === itemId);
      if (item && item.carry_out_group !== groupId) {
        addIssue(
          ctx.issues,
          "error",
          "MISMATCHED_CARRY_OUT_GROUP",
          `scenario.mechanics.carry_out_groups.${groupId}`,
          `Group "${groupId}" lists item "${itemId}" but the item points to "${item.carry_out_group ?? "no group"}".`,
        );
      }
    });
  });
}

function validateReachability(ctx: ValidationContext): void {
  const startSceneId = ctx.pack.scenario.scenes[0];
  if (!startSceneId || !ctx.sceneIds.has(startSceneId)) {
    return;
  }

  const sceneById = new Map(ctx.pack.scenes.map((scene) => [scene.id, scene]));
  const reachableSceneIds = new Set<string>();
  const queue = [startSceneId];

  while (queue.length > 0) {
    const sceneId = queue.shift()!;
    if (reachableSceneIds.has(sceneId)) {
      continue;
    }
    reachableSceneIds.add(sceneId);

    const scene = sceneById.get(sceneId);
    for (const nextSceneId of (scene?.next_scene_rules ?? []).map((rule) => rule.next_scene_id).filter(isString)) {
      if (!reachableSceneIds.has(nextSceneId) && ctx.sceneIds.has(nextSceneId)) {
        queue.push(nextSceneId);
      }
    }
  }

  ctx.pack.scenes.forEach((scene, sceneIndex) => {
    if (!reachableSceneIds.has(scene.id)) {
      addIssue(ctx.issues, "error", "UNREACHABLE_SCENE", `scenes[${sceneIndex}].id`, `Scene "${scene.id}" is not reachable from "${startSceneId}".`);
    }
  });

  const reachableEndingIds = new Set<string>();
  const resolutionOrder = ctx.pack.scenario.ending_resolution_order ?? ctx.pack.scenario.endings;
  Array.from(reachableSceneIds).forEach((sceneId) => {
    const scene = sceneById.get(sceneId);
    for (const rule of scene?.next_scene_rules ?? []) {
      if (rule.ending_id) {
        reachableEndingIds.add(rule.ending_id);
      }
      if (rule.resolve_ending) {
        for (const endingId of resolutionOrder) {
          reachableEndingIds.add(endingId);
        }
      }
    }
  });

  ctx.pack.scenario.endings.forEach((endingId, endingIndex) => {
    if (!reachableEndingIds.has(endingId)) {
      addIssue(
        ctx.issues,
        "error",
        "UNREACHABLE_ENDING",
        `scenario.endings[${endingIndex}]`,
        `Ending "${endingId}" is not targeted by reachable next_scene_rules or ending resolution.`,
      );
    }
  });
}

function validateRequirements(
  ctx: ValidationContext,
  requirements: Requirement[] | undefined,
  basePath: string,
  usage: "requirement" | "next_scene_rule",
): void {
  (requirements ?? []).forEach((requirement, index) => {
    validateRequirement(ctx, requirement, `${basePath}[${index}]`, usage);
  });
}

function validateRequirement(
  ctx: ValidationContext,
  requirement: Requirement,
  path: string,
  usage: "requirement" | "next_scene_rule",
): void {
  if (typeof requirement === "string") {
    validateShortcut(ctx, requirement, path, usage);
    return;
  }

  validateCondition(ctx, requirement, path);
}

function validateCondition(ctx: ValidationContext, condition: ConditionExpr | undefined, path: string): void {
  if (!condition) {
    return;
  }

  const conditionRecord = condition as Record<string, unknown>;
  const keys = CONDITION_KEYS.filter((key) => key in conditionRecord);
  if (keys.length !== 1) {
    addIssue(
      ctx.issues,
      "error",
      "INVALID_CONDITION_SHAPE",
      path,
      `Condition must contain exactly one operator key, but found ${keys.length === 0 ? "none" : keys.join(", ")}.`,
    );
    return;
  }

  if ("all" in condition) {
    validateConditionList(ctx, condition.all, `${path}.all`);
    return;
  }
  if ("any" in condition) {
    validateConditionList(ctx, condition.any, `${path}.any`);
    return;
  }
  if ("any_missing" in condition) {
    validateConditionList(ctx, condition.any_missing, `${path}.any_missing`);
    return;
  }
  if ("flag" in condition) {
    assertKnownId(ctx, "flag", condition.flag, ctx.flagIds, `${path}.flag`);
    return;
  }
  if ("counter" in condition) {
    assertKnownId(ctx, "counter", condition.counter.id, ctx.counterIds, `${path}.counter.id`);
    return;
  }
  if ("trust" in condition) {
    assertKnownId(ctx, "npc", condition.trust.npc_id, ctx.npcIds, `${path}.trust.npc_id`);
    return;
  }
  if ("item" in condition) {
    assertKnownId(ctx, "item", condition.item.id, ctx.itemIds, `${path}.item.id`);
    return;
  }
  if ("choice" in condition) {
    assertKnownId(ctx, "action", condition.choice.action_id, ctx.actionIds, `${path}.choice.action_id`);
  }
}

function validateConditionList(ctx: ValidationContext, conditions: ConditionExpr[], path: string): void {
  if (conditions.length === 0) {
    addIssue(ctx.issues, "warning", "EMPTY_CONDITION_LIST", path, "Condition list is empty.");
  }

  conditions.forEach((condition, index) => {
    validateCondition(ctx, condition, `${path}[${index}]`);
  });
}

function validateShortcut(
  ctx: ValidationContext,
  shortcut: string,
  path: string,
  usage: "requirement" | "next_scene_rule",
): void {
  if (shortcut === "always") {
    return;
  }
  if (shortcut === "default") {
    if (usage !== "next_scene_rule") {
      addIssue(ctx.issues, "warning", "DEFAULT_CONDITION_OUTSIDE_SCENE_RULE", path, '"default" is only meaningful in next_scene_rules.');
    }
    return;
  }
  if (shortcut.startsWith("has_flag:")) {
    assertKnownId(ctx, "flag", shortcut.slice("has_flag:".length), ctx.flagIds, path);
    return;
  }
  if (shortcut.startsWith("has_item:")) {
    assertKnownId(ctx, "item", shortcut.slice("has_item:".length), ctx.itemIds, path);
    return;
  }
  if (shortcut.startsWith("choice:")) {
    assertKnownId(ctx, "action", shortcut.slice("choice:".length), ctx.actionIds, path);
    return;
  }

  const comparison = shortcut.match(
    /^(counter|owned_items_in_group|carry_out_selection_count):([A-Za-z0-9_]+)(>=|<=|==|!=|>|<)-?\d+$/,
  );
  if (!comparison) {
    addIssue(ctx.issues, "error", "INVALID_CONDITION_SHORTCUT", path, `Unsupported condition shortcut "${shortcut}".`);
    return;
  }

  const [, kind, id] = comparison;
  if (kind === "counter") {
    assertKnownId(ctx, "counter", id, ctx.counterIds, path);
    return;
  }

  assertKnownId(ctx, "carry-out group", id, ctx.carryOutGroupIds, path);
}

function validateStateChanges(ctx: ValidationContext, changes: StateChanges | undefined, basePath: string): void {
  if (!changes) {
    return;
  }

  for (const npcId of Object.keys(changes.trust_delta ?? {})) {
    assertKnownId(ctx, "npc", npcId, ctx.npcIds, `${basePath}.trust_delta.${npcId}`);
  }

  (changes.add_flags ?? []).forEach((flagId, index) => {
    assertKnownId(ctx, "flag", flagId, ctx.flagIds, `${basePath}.add_flags[${index}]`);
  });

  for (const flagId of Object.keys(changes.set_flags ?? {})) {
    assertKnownId(ctx, "flag", flagId, ctx.flagIds, `${basePath}.set_flags.${flagId}`);
  }

  for (const counterId of Object.keys(changes.counter_delta ?? {})) {
    assertKnownId(ctx, "counter", counterId, ctx.counterIds, `${basePath}.counter_delta.${counterId}`);
  }

  (changes.add_items ?? []).forEach((itemId, index) => {
    assertKnownId(ctx, "item", itemId, ctx.itemIds, `${basePath}.add_items[${index}]`);
  });

  (changes.remove_items ?? []).forEach((itemId, index) => {
    assertKnownId(ctx, "item", itemId, ctx.itemIds, `${basePath}.remove_items[${index}]`);
  });

  if (changes.enforce_carry_out_limit) {
    assertKnownId(ctx, "carry-out group", changes.enforce_carry_out_limit.group, ctx.carryOutGroupIds, `${basePath}.enforce_carry_out_limit.group`);
  }
}

function validateRewards(ctx: ValidationContext, rewards: RewardDefinition[], basePath: string): void {
  rewards.forEach((reward, rewardIndex) => {
    const rewardPath = `${basePath}[${rewardIndex}]`;
    assertKnownId(ctx, "npc", reward.npc_id, ctx.npcIds, `${rewardPath}.npc_id`);

    (reward.item_ids ?? []).forEach((itemId, itemIndex) => {
      assertKnownId(ctx, "item", itemId, ctx.itemIds, `${rewardPath}.item_ids[${itemIndex}]`);
    });
  });
}

function assertKnownId(
  ctx: ValidationContext,
  kind: ReferenceKind,
  id: string | undefined,
  knownIds: Set<string>,
  path: string,
): void {
  if (!id) {
    return;
  }
  if (!knownIds.has(id)) {
    addIssue(ctx.issues, "error", unknownIdCode(kind), path, `Unknown ${kind} id "${id}".`);
  }
}

function addIssue(
  issues: ScenarioValidationIssue[],
  severity: ScenarioValidationSeverity,
  code: string,
  path: string,
  message: string,
): void {
  issues.push({ severity, code, path, message });
}

function unknownIdCode(kind: ReferenceKind): string {
  return `UNKNOWN_${kind.toUpperCase().replace(/[- ]/g, "_")}_ID`;
}

function stableRequirementKey(requirement: Requirement): string {
  return typeof requirement === "string" ? requirement : JSON.stringify(requirement);
}

function stableRuleTargetKey(rule: { next_scene_id?: string; ending_id?: string; resolve_ending?: boolean }): string {
  if (rule.next_scene_id) {
    return `scene:${rule.next_scene_id}`;
  }
  if (rule.ending_id) {
    return `ending:${rule.ending_id}`;
  }
  if (rule.resolve_ending) {
    return "resolve_ending";
  }
  return "none";
}

function isString(value: string | undefined): value is string {
  return typeof value === "string";
}
