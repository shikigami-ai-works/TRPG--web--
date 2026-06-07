# Stage16-7 Clue/Evidence Schema Design

Created: 2026-06-07 JST

Status: Stage16-7A docs-only design decision.

This document decides how to formalize AdventurePlayer clue/evidence data in a
later implementation stage. Stage16-7A does not change scenario YAML, runtime,
AdventurePlayer code, storage schema, route gates, ending conditions, replay
hint copy, or player-facing UI behavior.

## 0. Scope

In scope for Stage16-7A:

- describe the current derived evidence role and limits;
- decide the smallest future schema unit;
- define how a future schema connects to Stage16-5C replay hints;
- define a safe migration path that preserves existing flags, items, checks,
  outcomes, and post-ending behavior;
- choose one smallest Stage16-7B implementation candidate.

Out of scope for Stage16-7A:

- editing `scenarios/kimidake_ga_oboeteiru_jiko/*.yaml`;
- editing `lib/adventure/*`, `components/*`, runtime, storage, or validation
  code;
- changing scene order, route gates, ending conditions, or final-choice rules;
- extending `CompletedRunRecord`;
- changing replay hint families or player-facing replay hint text;
- AI GM, free input, AI narration, Figma, assets, Tauri/API, cloud save, or
  external persistence.

## 1. Current Baseline

The current player route is:

- `/` renders `AdventurePlayer`;
- `/debug` renders `ScenarioExplorer`;
- scenes 1-7 follow existing `kimidake_ga_oboeteiru_jiko` YAML;
- Stage16-5A/5B/5C post-ending save, progress, reward, and replay hint behavior
  is committed and pushed;
- Stage16-6 added `npm run audit:adventure-player` as reusable browser/UI audit
  tooling.

Current evidence behavior is implemented in `lib/adventure/evidence.ts`:

- selected scenario flags are mapped by the code-local `FLAG_EVIDENCE` table;
- inventory items are converted into evidence entries from `items.yaml`;
- scene source IDs are formatted into scene titles before reaching the player
  surface;
- evidence output shape is `EvidenceEntry` with `id`, `title`, `category`,
  `description`, and `source`;
- categories are currently `confirmed`, `inference`, `testimony`,
  `polluted_memory`, and `unverified`.

Current Stage16-5C replay hints are implemented in `lib/adventure/view-model.ts`:

- replay hint families are fixed as `branch`, `evidence`, and `carry_out`;
- evidence hints use the current ended run's derived `EvidenceEntry[]`;
- evidence hint detail is limited to count, category labels, and source labels;
- no history-wide missing-evidence inference is attempted;
- `CompletedRunRecord` is not extended.

## 2. Current Derived Evidence Role

Derived evidence is currently a presentation adapter, not a scenario contract.

It is useful because:

- it reuses existing flags and inventory without changing scenario data;
- it keeps AdventurePlayer player-facing and avoids raw flag/item IDs;
- it supports Evidence drawer display and Stage16-5C evidence replay hints;
- it remains current-run scoped, which matches the existing storage contract.

Its limits are:

- the flag-to-evidence mapping lives in TypeScript, so scenario authors cannot
  review or update clue text beside scenario data;
- only flags listed in `FLAG_EVIDENCE` become authored evidence, while later
  important flags may be invisible unless code is edited;
- check outcomes are only represented when they set a flag or item;
- source is a formatted string, so validation cannot confirm that every source
  points to an existing scene, item, action, or check;
- there is no schema-level way to express multiple sources, alternative reveal
  paths, or a clue revealed by either a flag or an item;
- there is no formal checklist for unrevealed evidence, so Stage16-5C correctly
  avoids claims about missing evidence.

The derived adapter is safe for Stage16-5C, but it should not become the
long-term authoring format if evidence grows beyond the current small set.

## 3. Design Decision

If schema formalization proceeds, the minimum authored unit should be `clue`.

Decision:

- `clue` is the authored scenario-level unit.
- `evidence` remains the runtime/view output shown in the current run.
- `source` is a field inside `clue`, not a separate top-level schema in the
  first implementation slice.
- `reveal condition` is a field inside `clue`, expressed with references to
  existing runtime state such as flags, items, checks, actions, or scene reach.

Why `clue` is the minimum unit:

- `evidence` is already a per-run derived view. Making it the authored schema
  would blur data contract and runtime visibility.
- `source` alone cannot define title, category, description, or reveal rules.
- `reveal condition` alone cannot define what the player sees after reveal.
- `clue` can contain stable authored copy while still producing the existing
  `EvidenceEntry` output shape.

This means a future schema-backed adapter should still return the same
`EvidenceEntry[]` consumed by AdventurePlayer and replay hints.

## 4. Proposed Minimal Schema Shape

The following shape is illustrative only. Stage16-7A does not add this file.

```yaml
clues:
  - id: "clue_parallel_displacement"
    title: "世界のズレ"
    category: "confirmed"
    description: "店名、掲示、ニュースの日付が探索者の世界と食い違っている。"
    sources:
      - type: "scene"
        id: "scene_001_parallel_arrival"
    reveal:
      any:
        - flag: "noticed_parallel_displacement"
```

Minimum fields:

- `id`: stable clue ID, not displayed directly to the player.
- `title`: player-facing title.
- `category`: one of the existing evidence categories.
- `description`: player-facing explanation.
- `sources`: one or more references to existing scenario objects.
- `reveal`: condition evaluated against existing runtime state.

Allowed source reference types for the first implementation slice:

- `scene`
- `item`
- `action`
- `check`

Allowed reveal references for the first implementation slice:

- existing flags;
- existing inventory items;
- existing used action/check IDs;
- existing scene IDs if a scene-reached predicate is added explicitly and
  validated.

Stage16-7B should avoid inventing new gameplay state predicates. If a clue can
be revealed through an existing flag or item, use that first.

## 5. Migration From Existing Flags/Items/Checks

Migration should preserve current behavior first, then broaden authoring later.

Safe migration sequence:

1. Keep the existing `EvidenceEntry` view shape.
2. Add optional clue definitions only in a later implementation stage.
3. Map current `FLAG_EVIDENCE` entries into equivalent clue definitions.
4. Continue deriving item evidence from existing `items.yaml` unless the first
   clue slice explicitly includes item-backed clues.
5. Add validation for clue ID uniqueness, category values, source references,
   and reveal references.
6. Use schema-backed clues when present and keep the current TypeScript mapping
   as a compatibility fallback until parity is proven.
7. Remove or shrink the fallback only after tests and browser audit prove no
   player-facing evidence output changed unexpectedly.

Existing gameplay contracts that must not change during migration:

- flags remain the runtime truth for route gates and ending conditions;
- items remain the runtime truth for inventory, carry-out, and ritual
  requirements;
- check success/failure still applies existing state changes;
- scene order and final-choice gates remain unchanged;
- ending resolution order remains in `scenario.yaml`;
- `CompletedRunRecord` remains unchanged.

## 6. Connection To Stage16-5C Replay Hints

Stage16-5C replay hints should stay connected through the existing
`EvidenceEntry[]` boundary.

Future schema-backed flow:

1. Runtime state is evaluated against clue reveal conditions.
2. Revealed clue definitions are converted into `EvidenceEntry` objects.
3. Inventory-derived entries are included exactly as the selected Stage16-7B
   slice defines.
4. `buildEvidenceReplayHint(evidence)` continues to use count, category labels,
   and source labels.
5. Replay hint family remains `evidence`.

Do not change in Stage16-7B:

- replay hint family names: `branch`, `evidence`, `carry_out`;
- replay hint visible wording unless a separate UI copy stage explicitly opens
  it;
- post-ending progress/reward sheet behavior;
- raw ID / raw condition hiding rules;
- current-run-only evidence hint scope.

Because completed run history does not store final flags or evidence IDs,
schema formalization alone does not justify history-wide missing-evidence hints.
That would require a separate storage or history design, and is out of scope.

## 7. Implement Or Do Not Implement

It is safe not to implement schema changes in Stage16-7A because:

- current Stage16-5C replay hints already have a bounded current-run evidence
  source;
- Stage16-6 audit tooling can verify player-visible guarantees without a clue
  schema;
- there is no current requirement to infer missing evidence from history;
- implementing schema now would touch scenario data and runtime/view code,
  which Stage16-7A explicitly excludes.

Schema implementation becomes justified when at least one of these is true:

- more important evidence is added beyond the current early flag list;
- scenario authors need to edit clue title/category/description beside scenario
  data;
- validation should catch source/reveal references before the browser surface;
- replay hints need stable authored clue categories without growing TypeScript
  maps;
- future evidence UI needs explicit unrevealed clue counts, after storage and
  spoiler boundaries are separately specified.

## 8. Stage16-7B Minimal Candidate

The single safest Stage16-7B implementation candidate is:

```text
Stage16-7B: optional clues.yaml parity adapter for current FLAG_EVIDENCE
```

Objective:

- Add an optional `clues.yaml` schema for authored clue definitions.
- Move only the existing `FLAG_EVIDENCE` entries into schema-equivalent data.
- Keep AdventurePlayer evidence output visually equivalent.
- Preserve item-derived evidence behavior unless explicitly included in the
  parity slice.

Likely target files:

- `scenarios/kimidake_ga_oboeteiru_jiko/clues.yaml`
- `lib/scenarios/types.ts`
- `lib/scenarios/loader.ts`
- `lib/scenarios/validation.ts`
- `lib/adventure/evidence.ts`
- focused tests under `tests/`

Hard excludes for Stage16-7B:

- no route gate, ending condition, scene order, or scenario body changes;
- no `CompletedRunRecord` extension;
- no replay hint family or visible copy changes;
- no new enabled UI controls;
- no missing-evidence inference from completed history;
- no AI GM, free input, AI narration, assets, Figma, Tauri/API, cloud save, or
  external persistence.

Verification for Stage16-7B:

- `npm run typecheck`
- `npm run lint`
- `npm run validate:scenarios`
- `npm run test`
- `npm run build`
- `npm run audit:adventure-player`
- `git diff --check`

Acceptance criteria for Stage16-7B:

- `/` and `/debug` still render their current surfaces.
- Evidence drawer still shows the same currently reachable clue titles,
  categories, descriptions, and source labels for equivalent runs.
- Stage16-5B progress/reward sheet still appears after ending.
- Stage16-5C replay hint families still appear as `branch`, `evidence`, and
  `carry_out`.
- No raw ending IDs, raw route conditions, raw flags, or raw route-gate
  formulas become player-visible.
- Scenario validation catches broken clue categories, source references, and
  reveal references.

## 9. Stop Conditions

Stop before implementation and report if:

- schema support appears to require changing route gates or ending conditions;
- schema support appears to require extending `CompletedRunRecord`;
- replay hint wording or family changes seem necessary;
- player-visible missing-evidence claims require history data that is not
  currently stored;
- product code needs new test hooks only for auditability;
- Stage16-7B starts becoming a broad evidence board or deduction-system design.

Those are separate stages, not part of the safe clue/evidence schema parity
slice.
