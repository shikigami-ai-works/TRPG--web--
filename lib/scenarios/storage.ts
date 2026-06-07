import {
  clonePlayerCheckProfile,
  normalizePlayerCheckProfile,
  type PlayerCheckProfile,
} from "./check-resolution";
import type { EndingDefinition, RewardDefinition, ScenarioPack, ScenarioRuntimeState } from "./types";

export const STORAGE_VERSION = 1;

export interface SavedRunState {
  version: number;
  scenarioId: string;
  sceneId: string;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  trust: Record<string, number>;
  inventory: string[];
  usedActionIds: string[];
  carryOutSelections: Record<string, string[]>;
  carryOutLimits: Record<string, number>;
  lastChoiceId?: string;
  endingId?: string;
  completedRunId?: string;
  log: string[];
  updatedAt: string;
}

export interface CompletedRunRecord {
  version: number;
  runId: string;
  scenarioId: string;
  scenarioTitle: string;
  endingId: string;
  endingTitle: string;
  endingType: string;
  completedAt: string;
  finalTrust: Record<string, number>;
  finalCounters: Record<string, number>;
  finalInventory: string[];
  carryOutSelections: Record<string, string[]>;
  unlocks: string[];
  rewards: RewardDefinition[];
}

export interface ReachedEndingSummary {
  endingId: string;
  endingTitle: string;
  endingType: string;
  firstCompletedAt: string;
  latestCompletedAt: string;
  count: number;
}

export interface CompletedRunAppendResult {
  state: ScenarioRuntimeState;
  record: CompletedRunRecord | null;
}

export interface SavedCheckProfile {
  version: number;
  scenarioId: string;
  profile: PlayerCheckProfile;
  updatedAt: string;
}

const ACTIVE_RUN_KEY_PREFIX = "trpg-web:v1:active-run:";
const CHECK_PROFILE_KEY_PREFIX = "trpg-web:v1:check-profile:";
const HISTORY_KEY = "trpg-web:v1:run-history";

export function saveActiveRun(scenarioId: string, state: ScenarioRuntimeState): SavedRunState | null {
  if (!canUseStorage()) {
    return null;
  }

  const saved = serializeRunState(scenarioId, state);
  try {
    window.localStorage.setItem(activeRunKey(scenarioId), JSON.stringify(saved));
    return saved;
  } catch {
    return null;
  }
}

export function loadActiveRun(scenarioId: string): SavedRunState | null {
  if (!canUseStorage()) {
    return null;
  }

  const key = activeRunKey(scenarioId);
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return null;
  }
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isSavedRunState(parsed) && parsed.scenarioId === scenarioId) {
      return parsed;
    }
  } catch {
    // Invalid save data is removed below.
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore cleanup failures; callers already receive no usable save.
  }
  return null;
}

export function clearActiveRun(scenarioId: string): void {
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.removeItem(activeRunKey(scenarioId));
  } catch {
    // Ignore storage cleanup failures.
  }
}

export function saveCheckProfile(scenarioId: string, profile: PlayerCheckProfile): SavedCheckProfile | null {
  if (!canUseStorage()) {
    return null;
  }

  const saved: SavedCheckProfile = {
    version: STORAGE_VERSION,
    scenarioId,
    profile: normalizePlayerCheckProfile(profile),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(checkProfileKey(scenarioId), JSON.stringify(saved));
    return saved;
  } catch {
    return null;
  }
}

export function loadCheckProfile(scenarioId: string): PlayerCheckProfile {
  if (!canUseStorage()) {
    return clonePlayerCheckProfile();
  }

  const key = checkProfileKey(scenarioId);
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    return clonePlayerCheckProfile();
  }
  if (!raw) {
    return clonePlayerCheckProfile();
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isSavedCheckProfile(parsed) && parsed.scenarioId === scenarioId) {
      return normalizePlayerCheckProfile(parsed.profile);
    }
  } catch {
    // Invalid profile data is removed below.
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore cleanup failures; callers already receive a default profile.
  }
  return clonePlayerCheckProfile();
}

export function clearCheckProfile(scenarioId: string): void {
  if (!canUseStorage()) {
    return;
  }
  try {
    window.localStorage.removeItem(checkProfileKey(scenarioId));
  } catch {
    // Ignore storage cleanup failures.
  }
}

export function restoreRuntimeState(saved: SavedRunState, fallback: ScenarioRuntimeState): ScenarioRuntimeState {
  return {
    ...fallback,
    sceneId: saved.sceneId,
    flags: { ...fallback.flags, ...saved.flags },
    counters: { ...fallback.counters, ...saved.counters },
    trust: { ...fallback.trust, ...saved.trust },
    inventory: [...saved.inventory],
    usedActionIds: [...saved.usedActionIds],
    carryOutSelections: cloneSelections(saved.carryOutSelections),
    carryOutLimits: { ...saved.carryOutLimits },
    lastChoiceId: saved.lastChoiceId,
    endingId: saved.endingId,
    completedRunId: saved.completedRunId,
    log: [...saved.log],
  };
}

export function appendCompletedRun(pack: ScenarioPack, state: ScenarioRuntimeState, ending: EndingDefinition): CompletedRunRecord | null {
  if (!canUseStorage()) {
    return null;
  }

  const record: CompletedRunRecord = {
    version: STORAGE_VERSION,
    runId: createRunId(pack.scenario.id, ending.id),
    scenarioId: pack.scenario.id,
    scenarioTitle: pack.scenario.title,
    endingId: ending.id,
    endingTitle: ending.title,
    endingType: ending.ending_type,
    completedAt: new Date().toISOString(),
    finalTrust: { ...state.trust },
    finalCounters: { ...state.counters },
    finalInventory: [...state.inventory],
    carryOutSelections: cloneSelections(state.carryOutSelections),
    unlocks: [...(ending.unlocks ?? [])],
    rewards: [...(ending.rewards ?? [])],
  };

  const history = loadRunHistory();
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify([record, ...history]));
    return record;
  } catch {
    return null;
  }
}

export function appendCompletedRunOnce(pack: ScenarioPack, state: ScenarioRuntimeState): CompletedRunAppendResult {
  if (!state.endingId || state.completedRunId) {
    return { state, record: null };
  }

  const ending = pack.endings.find((candidate) => candidate.id === state.endingId);
  if (!ending) {
    return { state, record: null };
  }

  const record = appendCompletedRun(pack, state, ending);
  return {
    state: {
      ...state,
      completedRunId: record?.runId ?? `${pack.scenario.id}:${ending.id}:unpersisted`,
    },
    record,
  };
}

export function loadRunHistory(scenarioId?: string): CompletedRunRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(HISTORY_KEY);
  } catch {
    return [];
  }
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter(isCompletedRunRecord)
        .filter((record) => !scenarioId || record.scenarioId === scenarioId);
    }
  } catch {
    // Invalid history is removed below.
  }

  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore cleanup failures; invalid history is already being ignored.
  }
  return [];
}

export function getReachedEndings(history: CompletedRunRecord[]): ReachedEndingSummary[] {
  const byEnding = new Map<string, ReachedEndingSummary>();

  for (const record of [...history].reverse()) {
    const existing = byEnding.get(record.endingId);
    if (!existing) {
      byEnding.set(record.endingId, {
        endingId: record.endingId,
        endingTitle: record.endingTitle,
        endingType: record.endingType,
        firstCompletedAt: record.completedAt,
        latestCompletedAt: record.completedAt,
        count: 1,
      });
      continue;
    }

    byEnding.set(record.endingId, {
      ...existing,
      endingTitle: record.endingTitle,
      endingType: record.endingType,
      latestCompletedAt: record.completedAt,
      count: existing.count + 1,
    });
  }

  return Array.from(byEnding.values()).sort((a, b) => b.latestCompletedAt.localeCompare(a.latestCompletedAt));
}

export function hasMeaningfulProgress(state: ScenarioRuntimeState, initialState: ScenarioRuntimeState): boolean {
  return (
    state.sceneId !== initialState.sceneId ||
    state.endingId !== initialState.endingId ||
    state.lastChoiceId !== initialState.lastChoiceId ||
    state.completedRunId !== initialState.completedRunId ||
    !booleanRecordsEqual(state.flags, initialState.flags) ||
    !numberRecordsEqual(state.counters, initialState.counters) ||
    !numberRecordsEqual(state.trust, initialState.trust) ||
    !stringArraysEqual(state.inventory, initialState.inventory) ||
    !stringArraysEqual(state.usedActionIds, initialState.usedActionIds) ||
    !stringArrayRecordsEqual(state.carryOutSelections, initialState.carryOutSelections) ||
    !numberRecordsEqual(state.carryOutLimits, initialState.carryOutLimits) ||
    !stringArraysEqual(state.log, initialState.log)
  );
}

export function serializeRunState(scenarioId: string, state: ScenarioRuntimeState): SavedRunState {
  return {
    version: STORAGE_VERSION,
    scenarioId,
    sceneId: state.sceneId,
    flags: { ...state.flags },
    counters: { ...state.counters },
    trust: { ...state.trust },
    inventory: [...state.inventory],
    usedActionIds: [...state.usedActionIds],
    carryOutSelections: cloneSelections(state.carryOutSelections),
    carryOutLimits: { ...state.carryOutLimits },
    lastChoiceId: state.lastChoiceId,
    endingId: state.endingId,
    completedRunId: state.completedRunId,
    log: [...state.log],
    updatedAt: new Date().toISOString(),
  };
}

function activeRunKey(scenarioId: string): string {
  return `${ACTIVE_RUN_KEY_PREFIX}${scenarioId}`;
}

function checkProfileKey(scenarioId: string): string {
  return `${CHECK_PROFILE_KEY_PREFIX}${scenarioId}`;
}

function createRunId(scenarioId: string, endingId: string): string {
  const safeRandom =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${scenarioId}:${endingId}:${safeRandom}`;
}

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function isSavedRunState(value: unknown): value is SavedRunState {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === STORAGE_VERSION &&
    typeof value.scenarioId === "string" &&
    typeof value.sceneId === "string" &&
    isBooleanRecord(value.flags) &&
    isNumberRecord(value.counters) &&
    isNumberRecord(value.trust) &&
    isStringArray(value.inventory) &&
    isStringArray(value.usedActionIds) &&
    isStringArrayRecord(value.carryOutSelections) &&
    isNumberRecord(value.carryOutLimits) &&
    (value.lastChoiceId === undefined || typeof value.lastChoiceId === "string") &&
    (value.endingId === undefined || typeof value.endingId === "string") &&
    (value.completedRunId === undefined || typeof value.completedRunId === "string") &&
    isStringArray(value.log) &&
    typeof value.updatedAt === "string"
  );
}

function isCompletedRunRecord(value: unknown): value is CompletedRunRecord {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === STORAGE_VERSION &&
    typeof value.runId === "string" &&
    typeof value.scenarioId === "string" &&
    typeof value.scenarioTitle === "string" &&
    typeof value.endingId === "string" &&
    typeof value.endingTitle === "string" &&
    typeof value.endingType === "string" &&
    typeof value.completedAt === "string" &&
    isNumberRecord(value.finalTrust) &&
    isNumberRecord(value.finalCounters) &&
    isStringArray(value.finalInventory) &&
    isStringArrayRecord(value.carryOutSelections) &&
    isStringArray(value.unlocks) &&
    Array.isArray(value.rewards)
  );
}

function isSavedCheckProfile(value: unknown): value is SavedCheckProfile {
  if (!isRecord(value)) {
    return false;
  }

  return value.version === STORAGE_VERSION && typeof value.scenarioId === "string" && isRecord(value.profile) && typeof value.updatedAt === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "boolean");
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "number");
}

function isStringArrayRecord(value: unknown): value is Record<string, string[]> {
  return isRecord(value) && Object.values(value).every(isStringArray);
}

function cloneSelections(selections: Record<string, string[]>): Record<string, string[]> {
  return Object.fromEntries(Object.entries(selections).map(([group, itemIds]) => [group, [...itemIds]]));
}

function booleanRecordsEqual(left: Record<string, boolean>, right: Record<string, boolean>): boolean {
  return recordsEqual(left, right);
}

function numberRecordsEqual(left: Record<string, number>, right: Record<string, number>): boolean {
  return recordsEqual(left, right);
}

function stringArrayRecordsEqual(left: Record<string, string[]>, right: Record<string, string[]>): boolean {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of Array.from(keys)) {
    if (!stringArraysEqual(left[key] ?? [], right[key] ?? [])) {
      return false;
    }
  }
  return true;
}

function recordsEqual<T extends string | number | boolean>(left: Record<string, T>, right: Record<string, T>): boolean {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const key of Array.from(keys)) {
    if (left[key] !== right[key]) {
      return false;
    }
  }
  return true;
}

function stringArraysEqual(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}
