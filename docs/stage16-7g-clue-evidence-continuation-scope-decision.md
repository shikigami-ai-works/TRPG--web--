# Stage16-7G Clue/Evidence Continuation Scope Decision

Created: 2026-06-08 JST

Status: docs-only decision. No scenario data, runtime, storage, UI, replay hint,
route gate, ending condition, test, or scenario prose changes are included in
this stage.

Stage16-7G decides what should happen after Stage16-7F added the single
`relatives_wedding_rings` authored item-backed clue. This stage is intentionally
not another clue-authoring implementation slice.

## Decision

Do not add more authored item-backed clues now.

Stage16-7F completed the only currently justified item-backed clue candidate.
The remaining inventory entries are still better handled as item-derived
evidence from `items.yaml` unless a later stage identifies a specific
clue-authoring need.

Do not start an evidence board, missing-evidence checklist, deduction
declaration, scene-reached predicate, or history-wide replay inference in
Stage16-7G.

If clue/evidence work continues, the safest next implementation candidate is a
small regression-guard stage:

```text
Stage16-7H: evidence identity regression guard
```

That stage should strengthen tests around duplicate evidence IDs and the
current `EvidenceEntry[]` boundary without adding new clue data or changing
player-facing behavior.

## Why

Stage16-7B through Stage16-7F already established the current safe boundary:

- `clue` is the authored schema unit.
- `evidence` remains current-run runtime/view output.
- AdventurePlayer, the Evidence drawer, and Stage16-5C replay hints consume
  `EvidenceEntry[]`.
- item-derived evidence stays in `items.yaml` by default.
- exactly one authored item-backed clue is justified for
  `relatives_wedding_rings`.
- duplicate item/clue evidence is rejected for that one item, with targeted
  authored clue precedence.

Adding more clue data now would require a new reason per item, action, check,
or future scene predicate. Without that reason, more clue authoring becomes a
partial migration rather than a player-visible improvement.

The next low-risk value is not more content. It is protecting the current
adapter contract so future clue additions cannot accidentally duplicate
`EvidenceEntry.id` values or widen the consumer boundary.

## Keep

- Keep `/` as AdventurePlayer.
- Keep `/debug` as ScenarioExplorer.
- Keep `EvidenceEntry[]` as the AdventurePlayer-facing evidence boundary.
- Keep Stage16-5C replay hint families as `branch`, `evidence`, and
  `carry_out`.
- Keep evidence hints current-run only.
- Keep item-derived evidence from `items.yaml` by default.
- Keep `relatives_wedding_rings` as the only authored item-backed clue for now.
- Keep `.runtime/` and `.context-archive/` local-only unless Shiki explicitly
  requests a preservation or publish stage.

## Defer

- Blanket migration of inventory evidence into `clues.yaml`.
- Additional item-backed authored clues.
- Scene-reached reveal predicates.
- Evidence board UI.
- Missing-evidence checklist.
- Deduction declaration or investigation report flow.
- History-wide inference from completed run records.
- `CompletedRunRecord` extension.
- Replay hint copy or family changes.
- Route gate, ending condition, scene order, or scenario prose changes.

## Stage16-7H Candidate

Recommended next code-adjacent slice:

```text
Stage16-7H: evidence identity regression guard
```

Objective:

- Add focused regression coverage that derived evidence IDs remain unique for
  currently representative states.
- Preserve the `EvidenceEntry[]` output shape.
- Prove the authored `relatives_wedding_rings` entry does not duplicate the
  inventory-derived entry.
- Prove unrelated inventory evidence can still coexist with authored clues.

Likely target files:

- `tests/adventure-view-model.test.ts`
- `docs/development-progress.md`
- `docs/implementation-notes.md` only if a test-design judgment is not already
  captured here

Hard excludes:

- no `clues.yaml` additions;
- no `items.yaml` changes;
- no `lib/adventure/evidence.ts` changes unless the new test exposes an actual
  current bug;
- no scenario YAML/body changes;
- no storage schema changes;
- no route gate, ending condition, scene order, or replay hint changes;
- no UI changes or new enabled controls.

Expected verification:

- `npm run test`
- `npm run validate:scenarios`
- `git diff --check`

If `lib/adventure/evidence.ts` must change to satisfy the guard, widen the
verification to:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run validate:scenarios`
- `npm run build`
- `npm run audit:adventure-player`
- `git diff --check`

## Stop Conditions

Stop before implementation and report if the next stage requires:

- changing route gates, ending conditions, scene order, or final-choice gates;
- storing visited scene history;
- extending `CompletedRunRecord`;
- changing replay hint families or visible copy;
- adding new enabled UI controls;
- adding more authored item-backed clues;
- redesigning evidence IDs across the schema;
- inferring missing evidence from completed run history;
- adding AI GM, free input, AI narration, Figma, assets, Tauri/API, cloud save,
  or external persistence.

## Verification

Stage16-7G verification is docs-only:

- `git diff --check`
- trailing-whitespace scan for changed docs
- `git status --short --branch`

Runtime tests are intentionally not required for Stage16-7G because no code,
scenario YAML, storage schema, replay copy, route gate, or UI behavior changes
in this stage.
