# Stage16-7C Clue Authoring Scope Decision

Created: 2026-06-08 JST

Status: docs-only decision. No implementation is included in this stage.

Stage16-7C decides what should happen after the Stage16-7B optional
`clues.yaml` parity adapter. The decision is intentionally narrower than a full
evidence-board design.

## Decision

Do not blanket-migrate item-derived evidence into `clues.yaml` now.

Keep item evidence derived from `items.yaml` for the current player route. Add
item-backed authored clues only later when an item needs clue-specific copy,
category, multiple sources, or a reveal rule that cannot be represented by the
item definition itself.

Action/check-backed clues are a safe Stage16-7D implementation candidate, but
only as a small authoring proof. The slice should add a tiny number of authored
clues revealed by existing `usedActionIds` for existing actions/checks, then
prove that AdventurePlayer still consumes only `EvidenceEntry[]`.

Do not add a scene-reached reveal predicate yet.

Missing-evidence checklists, evidence board UX, deduction declaration, and
history-wide missing-evidence inference stay deferred to a later stage.

## Why

Stage16-7B already added the durable boundary needed for schema-backed evidence:

- `clue` is the authored schema unit.
- `evidence` remains current-run runtime/view output.
- AdventurePlayer and Stage16-5C replay hints consume `EvidenceEntry[]`.
- `clues.yaml` is optional and currently covers only the old flag evidence
  parity set.

The current implementation already supports clue sources and reveal refs for
`item`, `action`, and `check`, but the product contract is still narrower:

- inventory items are runtime truth for inventory, carry-out, and ritual
  requirements;
- actions/checks are already tracked in `usedActionIds` in the AdventurePlayer
  path;
- scene reach is not tracked as historical state beyond the current `sceneId`;
- completed run history does not store final flags, evidence ids, or visited
  scenes.

Because of that, action/check-backed clues can prove authoring value without
changing storage. Scene-reached predicates would require new runtime/storage
semantics or unsafe inference, so they should wait.

## Keep Now

- Keep `EvidenceEntry[]` as the only boundary consumed by AdventurePlayer,
  Evidence drawer, and Stage16-5C replay hints.
- Keep Stage16-5C replay hint families as `branch`, `evidence`, and
  `carry_out`.
- Keep evidence hints current-run only.
- Keep item-derived evidence from `items.yaml`.
- Keep current flag-backed clues in `clues.yaml`.
- Keep optional clue loading and fallback behavior for scenarios without
  clue data.
- Keep `/` as AdventurePlayer and `/debug` as ScenarioExplorer.

## Defer

- Blanket migration of all inventory evidence into `clues.yaml`.
- Scene-reached reveal predicates.
- Missing evidence checklist.
- Evidence board UI.
- Deduction declaration or investigation report flow.
- History-wide inference from completed run records.
- `CompletedRunRecord` extension.
- Replay hint copy or family changes.
- Route gate, ending condition, scene order, or scenario prose changes.

## Future Minimal Slice

Recommended next implementation candidate:

```text
Stage16-7D: action/check-backed clue authoring smoke slice
```

Objective:

- Add at most two new authored clues in `clues.yaml`.
- Use only existing action/check IDs that AdventurePlayer already records in
  `state.usedActionIds`.
- Prefer one action-backed clue and one check-backed clue from existing
  investigation outcomes.
- Do not move item-derived evidence yet.
- Do not add scene-reached predicates.
- Continue returning `EvidenceEntry[]` from `deriveEvidenceEntries`.

Likely target files if Stage16-7D is implemented later:

- `scenarios/kimidake_ga_oboeteiru_jiko/clues.yaml`
- `tests/adventure-view-model.test.ts`
- `tests/scenario-regression.test.ts` only if validation coverage needs a
  focused assertion
- `docs/development-progress.md`
- `docs/implementation-notes.md` only for implementation decisions not already
  specified here

Expected verification for that later implementation:

- `npm run typecheck`
- `npm run lint`
- `npm run validate:scenarios`
- `npm run test`
- `npm run build`
- `npm run audit:adventure-player`
- `git diff --check`

## Stop Conditions

Stop before implementation and split to Stage17 or later if the work requires:

- storing visited scene history;
- extending `CompletedRunRecord`;
- changing route gates, ending conditions, scene order, or final-choice gates;
- changing Stage16-5C replay hint family names or visible copy;
- claiming missing evidence from completed run history;
- adding an evidence board, checklist, deduction declaration, or new enabled UI
  control;
- changing scenario body/prose;
- adding AI GM, free input, AI narration, Figma, assets, Tauri/API, cloud save,
  or external persistence.

## Verification

Stage16-7C verification is docs-only:

- `git diff --check`
- trailing-whitespace scan for changed docs
- `git status --short --branch`

Runtime tests are intentionally not required for Stage16-7C because no code,
scenario YAML, storage schema, replay copy, route gate, or UI behavior changes
in this stage.
