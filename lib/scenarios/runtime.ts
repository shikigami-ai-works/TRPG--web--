import type {
  CarryOutGroup,
  CheckOutcome,
  ComparisonOperator,
  ConditionExpr,
  EndingDefinition,
  Requirement,
  ScenarioPack,
  ScenarioRuntimeState,
  StateChanges,
} from "./types";

export function createInitialState(pack: ScenarioPack): ScenarioRuntimeState {
  const mechanics = pack.scenario.mechanics;
  const flags = { ...(mechanics?.initial_flags ?? {}) };
  const counters = { ...(mechanics?.counters ?? {}) };
  const trust: Record<string, number> = {};

  for (const npc of pack.npcs) {
    if (npc.has_affection_system) {
      trust[npc.id] = npc.affection?.initial ?? npc.affection?.value ?? 0;
    }
  }

  if (mechanics?.npc_trust) {
    trust[mechanics.npc_trust.npc_id] = mechanics.npc_trust.initial;
  }

  return {
    sceneId: pack.scenario.scenes[0] ?? "",
    flags,
    counters,
    trust,
    inventory: [],
    usedActionIds: [],
    carryOutSelections: {},
    carryOutLimits: {},
    log: ["シナリオを開始した。"],
  };
}

export function applyStateChanges(
  state: ScenarioRuntimeState,
  changes: StateChanges | CheckOutcome | undefined,
  pack: ScenarioPack,
): ScenarioRuntimeState {
  if (!changes) {
    return state;
  }

  const next: ScenarioRuntimeState = {
    ...state,
    flags: { ...state.flags },
    counters: { ...state.counters },
    trust: { ...state.trust },
    inventory: [...state.inventory],
    usedActionIds: [...state.usedActionIds],
    carryOutSelections: cloneSelections(state.carryOutSelections),
    carryOutLimits: { ...state.carryOutLimits },
    log: [...state.log],
  };

  for (const [npcId, delta] of Object.entries(changes.trust_delta ?? {})) {
    const max = pack.scenario.mechanics?.npc_trust?.npc_id === npcId ? pack.scenario.mechanics.npc_trust.max : 100;
    next.trust[npcId] = clamp((next.trust[npcId] ?? 0) + delta, 0, max);
  }

  for (const flag of changes.add_flags ?? []) {
    next.flags[flag] = true;
  }

  for (const [flag, value] of Object.entries(changes.set_flags ?? {})) {
    next.flags[flag] = value;
  }

  for (const [counter, delta] of Object.entries(changes.counter_delta ?? {})) {
    next.counters[counter] = (next.counters[counter] ?? 0) + delta;
  }

  for (const itemId of changes.add_items ?? []) {
    if (!next.inventory.includes(itemId)) {
      next.inventory.push(itemId);
    }
  }

  for (const itemId of changes.remove_items ?? []) {
    next.inventory = next.inventory.filter((ownedItemId) => ownedItemId !== itemId);
    for (const [groupId, selected] of Object.entries(next.carryOutSelections)) {
      next.carryOutSelections[groupId] = selected.filter((selectedItemId) => selectedItemId !== itemId);
      syncCarryOutCounter(next, groupId);
    }
  }

  if (changes.enforce_carry_out_limit) {
    next.carryOutLimits[changes.enforce_carry_out_limit.group] = changes.enforce_carry_out_limit.max_count;
  }

  return next;
}

export function canUseRequirements(
  requirements: Requirement[] | undefined,
  state: ScenarioRuntimeState,
  pack: ScenarioPack,
): boolean {
  return (requirements ?? []).every((requirement) => evaluateRequirement(requirement, state, pack));
}

export function evaluateRequirement(
  requirement: Requirement,
  state: ScenarioRuntimeState,
  pack: ScenarioPack,
): boolean {
  if (typeof requirement === "string") {
    return evaluateShortcut(requirement, state, pack, false);
  }

  return evaluateCondition(requirement, state);
}

export function evaluateCondition(condition: ConditionExpr | undefined, state: ScenarioRuntimeState): boolean {
  if (!condition) {
    return true;
  }

  if ("all" in condition) {
    return condition.all.every((child) => evaluateCondition(child, state));
  }
  if ("any" in condition) {
    return condition.any.some((child) => evaluateCondition(child, state));
  }
  if ("any_missing" in condition) {
    return condition.any_missing.some((child) => !evaluateCondition(child, state));
  }
  if ("flag" in condition) {
    return (state.flags[condition.flag] ?? false) === condition.value;
  }
  if ("counter" in condition) {
    return compare(state.counters[condition.counter.id] ?? 0, condition.counter.operator, condition.counter.value);
  }
  if ("trust" in condition) {
    return compare(state.trust[condition.trust.npc_id] ?? 0, condition.trust.operator, condition.trust.value);
  }
  if ("item" in condition) {
    return state.inventory.includes(condition.item.id) === condition.item.owned;
  }
  if ("choice" in condition) {
    return state.lastChoiceId === condition.choice.action_id;
  }

  return false;
}

export function evaluateShortcut(
  shortcut: string,
  state: ScenarioRuntimeState,
  pack: ScenarioPack,
  defaultValue: boolean,
): boolean {
  if (shortcut === "always") {
    return true;
  }
  if (shortcut === "default") {
    return defaultValue;
  }
  if (shortcut.startsWith("has_flag:")) {
    return state.flags[shortcut.slice("has_flag:".length)] === true;
  }
  if (shortcut.startsWith("has_item:")) {
    return state.inventory.includes(shortcut.slice("has_item:".length));
  }
  if (shortcut.startsWith("choice:")) {
    return state.lastChoiceId === shortcut.slice("choice:".length);
  }

  const comparison = shortcut.match(
    /^(counter|owned_items_in_group|carry_out_selection_count):([A-Za-z0-9_]+)(>=|<=|==|!=|>|<)(-?\d+)$/,
  );
  if (!comparison) {
    return false;
  }

  const [, kind, id, operator, rawValue] = comparison;
  const value = Number(rawValue);
  if (kind === "counter") {
    return compare(state.counters[id] ?? 0, operator as ComparisonOperator, value);
  }
  if (kind === "owned_items_in_group") {
    return compare(countOwnedItemsInGroup(pack, state, id), operator as ComparisonOperator, value);
  }
  if (kind === "carry_out_selection_count") {
    return compare((state.carryOutSelections[id] ?? []).length, operator as ComparisonOperator, value);
  }

  return false;
}

export function resolveEnding(pack: ScenarioPack, state: ScenarioRuntimeState): EndingDefinition | undefined {
  const order = pack.scenario.ending_resolution_order ?? pack.scenario.endings;
  for (const endingId of order) {
    const ending = pack.endings.find((candidate) => candidate.id === endingId);
    if (ending && evaluateCondition(ending.unlock_conditions, state)) {
      return ending;
    }
  }
  return undefined;
}

export function getCarryOutGroups(pack: ScenarioPack): CarryOutGroup[] {
  return pack.scenario.mechanics?.carry_out_groups ?? [];
}

export function toggleCarryOutItem(
  state: ScenarioRuntimeState,
  groupId: string,
  itemId: string,
): ScenarioRuntimeState {
  const next: ScenarioRuntimeState = {
    ...state,
    counters: { ...state.counters },
    carryOutSelections: cloneSelections(state.carryOutSelections),
  };
  const selected = next.carryOutSelections[groupId] ?? [];
  next.carryOutSelections[groupId] = selected.includes(itemId)
    ? selected.filter((selectedItemId) => selectedItemId !== itemId)
    : [...selected, itemId];
  syncCarryOutCounter(next, groupId);
  return next;
}

export function groupOwnedItems(pack: ScenarioPack, state: ScenarioRuntimeState, groupId: string): string[] {
  const group = getCarryOutGroups(pack).find((candidate) => candidate.id === groupId);
  const ids = group?.item_ids ?? pack.items.filter((item) => item.carry_out_group === groupId).map((item) => item.id);
  return ids.filter((itemId) => state.inventory.includes(itemId));
}

function countOwnedItemsInGroup(pack: ScenarioPack, state: ScenarioRuntimeState, groupId: string): number {
  return groupOwnedItems(pack, state, groupId).length;
}

function syncCarryOutCounter(state: ScenarioRuntimeState, groupId: string): void {
  const counterId = groupId === "four_room_artifact" ? "four_room_artifacts_carried_out" : `${groupId}_carried_out`;
  if (counterId in state.counters) {
    state.counters[counterId] = (state.carryOutSelections[groupId] ?? []).length;
  }
}

function compare(left: number, operator: ComparisonOperator, right: number): boolean {
  switch (operator) {
    case ">":
      return left > right;
    case ">=":
      return left >= right;
    case "<":
      return left < right;
    case "<=":
      return left <= right;
    case "==":
      return left === right;
    case "!=":
      return left !== right;
    default:
      return false;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function cloneSelections(selections: Record<string, string[]>): Record<string, string[]> {
  return Object.fromEntries(Object.entries(selections).map(([group, itemIds]) => [group, [...itemIds]]));
}
