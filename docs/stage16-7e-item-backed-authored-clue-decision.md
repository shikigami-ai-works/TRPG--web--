# Stage16-7E Item-Backed Authored Clue Decision

Created: 2026-06-08 JST

Status: docs-only decision. No scenario data, runtime, storage, UI, replay hint,
route gate, ending condition, or scenario prose changes are included in this
stage.

Stage16-7E decides whether any item in
`scenarios/kimidake_ga_oboeteiru_jiko/items.yaml` currently needs an authored
item-backed clue in `clues.yaml`. This is narrower than a migration plan for all
inventory evidence.

## Decision

Do not blanket-migrate item-derived evidence into `clues.yaml`.

Keep current item evidence derived from `items.yaml` for the player route.
`deriveEvidenceEntries` already emits a confirmed `EvidenceEntry` for each
inventory item by using the item name, item description, and `found_in_scene_id`
as the source label. That remains sufficient for most items.

One item is worth preserving as a future candidate:

```text
relatives_wedding_rings
```

Do not implement that candidate in Stage16-7E. Split implementation into a
later Stage16-7F only if Shiki explicitly opens it.

## Criteria

An item-backed authored clue is justified only when at least one of these is
true:

- the player-facing clue copy should differ from the inventory description;
- the clue category should not be the default `confirmed`;
- the clue needs multiple source labels such as item plus action or scene;
- the reveal rule should be more specific than item ownership;
- validation should protect an authored source or reveal reference that the
  item definition cannot express by itself.

An item-backed authored clue is not justified when the item name, description,
and current source scene already explain the evidence role.

## Item Decision Table

| Item | Decision | Reason | Future handling |
| --- | --- | --- | --- |
| `paired_lion_keyholder_akari` | No authored clue now | This item is not currently acquired by the player route as inventory evidence. Making it item-backed would require a new reveal/acquisition rule, not just clue authoring. | Keep as scenario item context. Reopen only with a specific route/state design. |
| `paired_lion_keyholder_stolen` | Keep item-derived evidence | The recovered item name, description, and `unlock_return_fire` effect already explain its evidence role after `recover_stolen_keyholder`. | No Stage16 item clue. If later copy needs multiple sources, compare it against `burn_keepsakes_as_farewell` in a separate stage. |
| `unopened_birthday_gift` | Keep item-derived evidence | Existing `clue_gift_respected_unopened` already covers the authored ethical clue around not opening the gift. The inventory item covers the recovered package itself. | If the item description is too spoiler-heavy for the Evidence drawer, handle that as item/evidence copy polish first, not as blanket clue migration. |
| `relatives_wedding_rings` | Future candidate | The item is `found_in_scene_id: scene_006_four_rooms_ritual`, but the player-facing acquisition happens later through `take_wedding_rings` in `scene_007_return_fire` after refusing the gift-fuel plan. A clue could express the pair-medium meaning with better source context than item-derived evidence alone. | Candidate for Stage16-7F, at most one authored clue. Implementation must decide duplicate handling because current evidence derivation would still add `item:relatives_wedding_rings`. |
| `son_tournament_medal` | Keep item-derived evidence | The item description and `explain_relative_motive` effect already state the relative motive evidence. Adding a clue would not add a new category, source, or reveal behavior. | No Stage16 item clue. |
| `boundary_ember` | Keep item-derived evidence | Its value is carry-out/reward and boundary detection behavior. Authored clue work here would drift toward replay reward mechanics. | Keep under carry-out/reward scope, not clue authoring. |
| `empty_nameplate` | Keep item-derived evidence | Its role is NPC memory inheritance and future-run benefit. Turning it into a clue now would imply persistence/reward semantics beyond current Stage16 boundaries. | Keep under carry-out/reward scope. |
| `stopped_pocket_watch` | Keep item-derived evidence | The item points to future reroll or past-vision mechanics that are not implemented. A clue would overstate future behavior. | Reopen only after the time-interference mechanic is specified. |
| `ash_vial` | Keep item-derived evidence | The item already describes cult-trace follow-up. An authored clue would push into sequel/next-scenario investigation scope. | Reopen with a future scenario hook or evidence-board stage. |

## Stage16-7F Candidate

If Shiki opens a code slice, the only recommended implementation candidate is:

```text
Stage16-7F: one item-backed clue for relatives_wedding_rings
```

Possible authored clue shape:

```yaml
- id: "clue_pair_medium_wedding_rings"
  title: "二人分のペア媒介"
  category: "confirmed"
  description: "親族夫婦の対の指輪は、二人分の帰還儀式を束ねる媒介になる。"
  sources:
    - type: "item"
      id: "relatives_wedding_rings"
    - type: "action"
      id: "take_wedding_rings"
  reveal:
    any:
      - item: "relatives_wedding_rings"
```

Before implementing this, Stage16-7F must decide whether duplicated item-derived
evidence is acceptable. The current adapter would emit both a schema-backed clue
and the existing `item:relatives_wedding_rings` evidence entry for the same
inventory item. If duplicate evidence is not acceptable, duplicate suppression
or item-backed clue precedence must be specified and tested in that later stage.

## Keep

- Keep `EvidenceEntry[]` as the only consumer-facing boundary.
- Keep item-derived evidence from `items.yaml` by default.
- Keep Stage16-5C replay hint families as `branch`, `evidence`, and
  `carry_out`.
- Keep evidence hints current-run only.
- Keep `/` as AdventurePlayer and `/debug` as ScenarioExplorer.

## Defer

- Blanket migration of inventory evidence into `clues.yaml`.
- Item-backed clue implementation.
- Duplicate item/clue evidence handling.
- Evidence board UI, checklist, deduction declaration, or missing-evidence
  flow.
- History-wide inference from completed run records.
- `CompletedRunRecord` extension.
- Replay hint copy or family changes.
- Route gate, ending condition, scene order, or scenario prose changes.

## Verification

Stage16-7E verification is docs-only:

- `git diff --check`
- trailing-whitespace scan for changed docs
- `git status --short --branch`

Runtime tests are intentionally not required for Stage16-7E because no code,
scenario YAML, storage schema, replay copy, route gate, or UI behavior changes
in this stage.
