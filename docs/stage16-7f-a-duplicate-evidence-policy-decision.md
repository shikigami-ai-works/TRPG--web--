# Stage16-7F-A Duplicate Evidence Policy Decision

Created: 2026-06-08 JST

Status: docs-only decision. No scenario data, runtime, storage, UI, replay hint,
route gate, ending condition, test, or scenario prose changes are included in
this stage.

Stage16-7F-A decides what should happen if an authored clue revealed by an item
and the existing inventory-derived evidence both describe the same item. This
must be decided before any possible Stage16-7F implementation of the
`relatives_wedding_rings` item-backed clue.

## Decision

Do not allow duplicate evidence entries for the same item meaning.

If Stage16-7F remains exactly one item-backed authored clue for
`relatives_wedding_rings`, choose authored item-backed clue precedence:

- reveal the authored clue from `item: relatives_wedding_rings`;
- keep the consumer-facing `EvidenceEntry[]` boundary;
- use the authored clue copy/category/source labels as the single player-facing
  evidence entry for that item;
- suppress the inventory-derived `item:relatives_wedding_rings` entry while
  that authored clue is revealed;
- leave all other inventory-derived item evidence unchanged.

If Stage16-7F grows beyond that one clue, requires broader item migration,
requires route/storage/UI/replay changes, or cannot keep the suppression rule
small and testable, do not implement the item-backed clue now. In that case,
keep the existing inventory-derived evidence and defer item-backed authoring.

## Why

Current evidence derivation has two independent paths:

- schema-backed clues are derived first;
- inventory items are appended afterward from `items.yaml`.

For a clue with a single item reveal, the current clue adapter formats its
`EvidenceEntry.id` as `item:<id>`. The inventory path also emits `item:<id>`.
AdventurePlayer renders evidence cards with `key={entry.id}`, so allowing both
entries would duplicate player meaning and can also duplicate React keys.

That duplicate is not a useful product distinction for
`relatives_wedding_rings`. The player needs one better-authored explanation of
the pair-medium meaning, not two entries that point at the same underlying item.

## Policy Options Evaluated

### Option 1: Allow Duplicate Entries

Rejected.

This would keep code simple, but it would make the Evidence drawer show two
entries for one item-backed fact and risks duplicate `entry.id` keys. It also
pushes ambiguity into replay hint counts and source summaries.

### Option 2: Authored Item-Backed Clue Precedence

Accepted conditionally.

This is the recommended Stage16-7F policy only if the implementation remains a
single `relatives_wedding_rings` clue. It lets the authored clue replace the
weaker inventory-derived presentation for that one item while preserving the
rest of the existing item evidence path.

The later code slice should treat this as targeted suppression, not as blanket
migration from `items.yaml` to `clues.yaml`.

### Option 3: Keep Inventory-Derived Evidence And Avoid Item-Backed Clue Work

Accepted fallback.

If the authored clue is not worth even a small adapter change, or if the work
starts broadening into general item migration, this is safer than implementing
partial item authoring. The current item description already carries the core
ritual meaning, so deferring the clue is acceptable.

## Future Stage16-7F Implementation Guidance

If Shiki explicitly opens implementation, keep it to this shape:

1. Add at most one authored clue for `relatives_wedding_rings`.
2. Reveal it from the existing inventory item only.
3. Include item and action sources if needed for player-facing context, such as
   `relatives_wedding_rings` and `take_wedding_rings`.
4. In `deriveEvidenceEntries`, derive revealed clues first, identify revealed
   single-item clue evidence entries, and skip only the matching
   inventory-derived item entries.
5. Add focused coverage proving the final evidence list contains one authored
   `relatives_wedding_rings` entry and no duplicate `item:relatives_wedding_rings`
   key.

The later implementation may keep the evidence id as `item:relatives_wedding_rings`
for the authored replacement entry because that preserves the current
single-item reveal ID convention. The important policy is that only one entry
with that id reaches AdventurePlayer.

## Keep

- Keep `EvidenceEntry[]` as the only consumer-facing boundary.
- Keep item-derived evidence from `items.yaml` by default.
- Keep Stage16-5C replay hint families as `branch`, `evidence`, and
  `carry_out`.
- Keep evidence hints current-run only.
- Keep `/` as AdventurePlayer and `/debug` as ScenarioExplorer.
- Keep the future implementation candidate limited to
  `relatives_wedding_rings`.

## Defer

- Blanket migration of inventory evidence into `clues.yaml`.
- Multiple item-backed clue implementation.
- Evidence ID redesign for all clue types.
- Evidence board UI, checklist, deduction declaration, or missing-evidence
  flow.
- History-wide inference from completed run records.
- `CompletedRunRecord` extension.
- Replay hint copy or family changes.
- Route gate, ending condition, scene order, or scenario prose changes.

## Stop Conditions

Stop before Stage16-7F implementation if the work requires:

- changing route gates, ending conditions, scene order, or final-choice gates;
- storing visited scene history;
- extending `CompletedRunRecord`;
- changing replay hint families or visible copy;
- adding new enabled UI controls;
- adding general item migration or schema-wide evidence ID redesign;
- adding AI GM, free input, AI narration, Figma, assets, Tauri/API, cloud save,
  or external persistence.

## Verification

Stage16-7F-A verification is docs-only:

- `git diff --check`
- trailing-whitespace scan for changed docs
- `git status --short --branch`

Runtime tests are intentionally not required for Stage16-7F-A because no code,
scenario YAML, storage schema, replay copy, route gate, or UI behavior changes
in this stage.
