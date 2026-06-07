export type Scalar = string | number | boolean | null;
export type ComparisonOperator = ">" | ">=" | "<" | "<=" | "==" | "!=";
export type ClueCategory = "confirmed" | "inference" | "testimony" | "polluted_memory" | "unverified";
export type ClueSourceType = "scene" | "item" | "action" | "check";

export interface ScenarioPack {
  directory: string;
  scenario: ScenarioDefinition;
  npcs: NpcDefinition[];
  scenes: SceneDefinition[];
  items: ItemDefinition[];
  endings: EndingDefinition[];
  clues: ClueDefinition[];
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  ruleset_id: string;
  summary: string;
  source: {
    author: string;
    url?: string;
    license_note: string;
    commercial_use: string;
    modification: string;
    redistribution?: string;
    credit_required?: boolean;
  };
  play_time?: {
    estimated_minutes: number;
    scene_count: number;
  };
  required_npc_roles: string[];
  files: Record<string, string>;
  scenes: string[];
  endings: string[];
  ending_resolution_order?: string[];
  content_warnings?: string[];
  safety_notes?: string[];
  core_premise?: Record<string, string>;
  mechanics?: ScenarioMechanics;
  clear_conditions?: ScenarioConditionSummary[];
  lost_conditions?: ScenarioConditionSummary[];
  rewards?: RewardDefinition[];
}

export interface ScenarioMechanics {
  npc_trust?: {
    npc_id: string;
    max: number;
    initial: number;
    return_required?: number;
    memory_bonus_empty_nameplate?: number;
  };
  trust_gain?: Record<string, number>;
  trust_loss?: Record<string, number>;
  initial_flags?: Record<string, boolean>;
  counters?: Record<string, number>;
  four_rooms_rule?: Record<string, Scalar>;
  carry_out_groups?: CarryOutGroup[];
  carry_slots?: Record<string, Scalar>;
}

export interface CarryOutGroup {
  id: string;
  item_ids: string[];
  max_count_at_clear?: number;
  return_ritual_requires_returned_count?: number;
}

export interface ScenarioConditionSummary {
  id: string;
  description: string;
  required_flags?: string[];
}

export interface NpcDefinition {
  id: string;
  name: string;
  reading?: string;
  role: string;
  roles?: string[];
  generated_by_ai?: boolean;
  gender?: string;
  age?: number;
  age_label?: string;
  status?: string;
  can_be_contact?: boolean;
  can_be_companion?: boolean;
  can_be_lost?: boolean;
  personality_tags?: string[];
  has_affection_system?: boolean;
  affection?: {
    enabled?: boolean;
    min?: number;
    max?: number;
    value?: number;
    initial?: number;
    contact_unlock_threshold?: number;
    after_story_threshold?: number;
    memory_bonus_empty_nameplate?: number;
  };
  scenario_role?: Record<string, Scalar>;
  cult?: Record<string, string>;
  ai_roleplay?: {
    first_person?: string;
    player_call?: string;
    speech_style?: string;
    motivation?: string;
    hidden_note?: string;
    sample_lines?: string[];
  };
  combat_style?: Record<string, Scalar | string[]>;
  available_actions?: NpcActionDefinition[];
}

export interface NpcActionDefinition {
  id: string;
  description: string;
}

export interface ItemDefinition {
  id: string;
  name: string;
  type: string;
  description: string;
  found_in_scene_id?: string;
  room?: string;
  role?: string;
  carry_out_group?: string;
  counts_for_ritual_disruption?: boolean;
  counts_for_return_ritual?: boolean;
  effects?: ItemEffectDefinition[];
  cost?: Record<string, Scalar>;
  can_carry_out?: boolean;
  can_bring_into_scenario?: boolean;
  can_give_to_companion_npc?: boolean;
  lost_if_holder_lost?: boolean;
}

export interface ItemEffectDefinition {
  id: string;
  type: string;
  amount?: number;
  description: string;
}

export interface SceneDefinition {
  id: string;
  title: string;
  description: string;
  scene_type: string;
  npc_ids?: string[];
  available_actions?: SceneActionDefinition[];
  checks?: SceneCheckDefinition[];
  next_scene_rules?: NextSceneRule[];
}

export interface SceneActionDefinition {
  id: string;
  label: string;
  type: "conversation" | "check" | "story" | "danger" | "ending_choice" | string;
  once_per_run?: boolean;
  requirements?: Requirement[];
  state_changes?: StateChanges;
}

export type Requirement = string | ConditionExpr;

export interface SceneCheckDefinition {
  id: string;
  label: string;
  ruleset_id: string;
  related_stat: string;
  skill_or_art: string;
  target_number: number;
  requirements?: Requirement[];
  success?: CheckOutcome;
  failure?: CheckOutcome;
}

export interface CheckOutcome extends StateChanges {
  reveal_text?: string;
}

export interface NextSceneRule {
  condition: Requirement;
  next_scene_id?: string;
  ending_id?: string;
  resolve_ending?: boolean;
}

export interface StateChanges {
  trust_delta?: Record<string, number>;
  add_flags?: string[];
  set_flags?: Record<string, boolean>;
  counter_delta?: Record<string, number>;
  add_items?: string[];
  remove_items?: string[];
  enforce_carry_out_limit?: {
    group: string;
    max_count: number;
  };
}

export type ConditionExpr =
  | { all: ConditionExpr[] }
  | { any: ConditionExpr[] }
  | { any_missing: ConditionExpr[] }
  | { flag: string; value: boolean }
  | { counter: CounterCondition }
  | { trust: TrustCondition }
  | { item: ItemCondition }
  | { choice: { action_id: string } };

export interface CounterCondition {
  id: string;
  operator: ComparisonOperator;
  value: number;
}

export interface TrustCondition {
  npc_id: string;
  operator: ComparisonOperator;
  value: number;
}

export interface ItemCondition {
  id: string;
  owned: boolean;
}

export interface EndingDefinition {
  id: string;
  title: string;
  ending_type: "true" | "good" | "normal" | "bad" | "lost" | string;
  description: string;
  hidden_description?: string;
  unlock_conditions?: ConditionExpr;
  result?: Record<string, boolean>;
  unlocks?: string[];
  rewards?: RewardDefinition[];
  ending_tree?: {
    visible_before_unlock?: boolean;
    blurred_title?: string;
    route_hint?: string;
  };
}

export interface RewardDefinition {
  id: string;
  type: string;
  description?: string;
  npc_id?: string;
  item_ids?: string[];
  amount?: number;
  max_count?: number;
}

export interface ClueDefinition {
  id: string;
  title: string;
  category: ClueCategory;
  description: string;
  sources: ClueSourceReference[];
  reveal: ClueRevealCondition;
}

export interface ClueSourceReference {
  type: ClueSourceType;
  id: string;
}

export type ClueRevealCondition = ClueRevealTerm | { any: ClueRevealTerm[] } | { all: ClueRevealTerm[] };

export type ClueRevealTerm = { flag: string } | { item: string } | { action: string } | { check: string };

export interface ScenarioRuntimeState {
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
}
