import type { SceneCheckDefinition } from "./types";

export interface PlayerCheckProfile {
  id: string;
  name: string;
  rulesetId: string;
  stats: Record<string, number>;
  skills: Record<string, number>;
}

export interface CheckModifierBreakdown {
  statId: string;
  statValue: number;
  skillId: string;
  skillValue: number;
  targetNumber: number;
}

export interface CheckRollResult extends CheckModifierBreakdown {
  dieRoll: number;
  total: number;
  success: boolean;
}

export const DEFAULT_MVP_CHECK_PROFILE: PlayerCheckProfile = {
  id: "mvp-investigator",
  name: "MVP investigator",
  rulesetId: "cthulhu_like",
  stats: {
    strength: 10,
    constitution: 10,
    dexterity: 10,
    appearance: 10,
    intelligence: 10,
    willpower: 10,
    education: 10,
    luck: 10,
  },
  skills: {
    observe: 2,
    listen: 2,
    search: 2,
    persuade: 2,
    occult: 2,
    medicine: 1,
    stealth: 1,
    combat: 2,
    library_use: 2,
    dodge: 2,
    sanity: 0,
    melee_or_firearm: 2,
  },
};

export function clonePlayerCheckProfile(profile: PlayerCheckProfile = DEFAULT_MVP_CHECK_PROFILE): PlayerCheckProfile {
  return {
    ...profile,
    stats: { ...profile.stats },
    skills: { ...profile.skills },
  };
}

export function updatePlayerCheckProfileValue(
  profile: PlayerCheckProfile,
  group: "stats" | "skills",
  id: string,
  rawValue: string | number,
): PlayerCheckProfile {
  const value = normalizeProfileNumber(rawValue);

  return {
    ...profile,
    [group]: {
      ...profile[group],
      [id]: value,
    },
  };
}

export function getCheckModifierBreakdown(
  check: SceneCheckDefinition,
  profile: PlayerCheckProfile = DEFAULT_MVP_CHECK_PROFILE,
): CheckModifierBreakdown {
  return {
    statId: check.related_stat,
    statValue: getValue(profile.stats, check.related_stat) ?? getValue(profile.skills, check.related_stat) ?? 0,
    skillId: check.skill_or_art,
    skillValue: getSkillValue(check.skill_or_art, profile),
    targetNumber: check.target_number,
  };
}

export function rollScenarioCheck(
  check: SceneCheckDefinition,
  profile: PlayerCheckProfile = DEFAULT_MVP_CHECK_PROFILE,
  random: () => number = Math.random,
): CheckRollResult {
  const modifiers = getCheckModifierBreakdown(check, profile);
  const dieRoll = rollD20(random);
  const total = modifiers.statValue + modifiers.skillValue + dieRoll;

  return {
    ...modifiers,
    dieRoll,
    total,
    success: total >= modifiers.targetNumber,
  };
}

function getSkillValue(skillId: string, profile: PlayerCheckProfile): number {
  if (skillId === "none") {
    return 0;
  }

  return getValue(profile.skills, skillId) ?? getValue(profile.stats, skillId) ?? 0;
}

function getValue(values: Record<string, number>, id: string): number | undefined {
  const value = values[id];
  return Number.isFinite(value) ? value : undefined;
}

function normalizeProfileNumber(rawValue: string | number): number {
  const value = typeof rawValue === "number" ? rawValue : Number.parseInt(rawValue, 10);
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(Math.trunc(value), 99));
}

function rollD20(random: () => number): number {
  const raw = random();
  const normalized = Number.isFinite(raw) ? Math.max(0, Math.min(raw, 0.999999999999)) : 0;
  return Math.floor(normalized * 20) + 1;
}
