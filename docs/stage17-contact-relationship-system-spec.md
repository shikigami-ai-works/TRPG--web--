# Stage17 Contact Relationship System Spec

Created: 2026-06-09 JST

## 0. Position

Stage17 defines the first deterministic contact and relationship record layer
for `AdventurePlayer` while final graphic assets are still being produced.

This stage does not start an AI free chat, generated reply system, or
messenger-style UI. The first goal is to show that Akari's relationship trace
can remain after clear by reading existing completed-run history, ending
metadata, rewards, and trust state.

Stage17A is docs-only. Stage17B may later implement the smallest UI slice after
this document is reviewed.

## 1. Scope

In scope for Stage17A:

- define Akari's minimum post-clear relationship/contact record;
- decide per-ending visibility for `return_with_akari`,
  `return_without_akari`, `stay_with_akari`, and `boundary_collapse`;
- define the deterministic data sources and spoiler boundaries;
- define a narrow Stage17B implementation candidate.

Out of scope for Stage17A:

- code implementation;
- AI free chat, generated NPC replies, or RAG-backed conversation;
- messenger-style UI, send boxes, unread badges, notification simulation, or
  chat history generation;
- cloud save, external account persistence, or cross-device sync;
- broad `CompletedRunRecord` schema changes;
- scenario YAML/body edits;
- route gate, ending condition, replay hint, or reward-copy changes;
- production asset import;
- Git commit or push.

## 2. Existing Anchors

Stage17 must build on existing contracts instead of inventing a new persistence
layer.

- `docs/01_mvp_scope.md` already names NPC affection changes, NPC contact
  unlock, scenario result records, and ending-tree updates as MVP concerns.
- `docs/04_npc_spec.md` defines contact unlock as: affection system enabled,
  affection value at or above `contact_unlock_threshold`, NPC not lost, and
  scenario clear.
- `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml` defines `minase_akari` as
  contact-capable, companion-capable, affection-enabled, and using
  `contact_unlock_threshold: 70`.
- `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml` defines Akari return
  trust requirement as `return_required: 70`.
- `docs/stage16-post-ending-save-replay-spec.md` defines completed-run history,
  ending progress, rewards, and deterministic replay hints as the post-clear
  layer.
- `lib/scenarios/storage.ts` already stores `CompletedRunRecord` fields needed
  here: `endingId`, `endingTitle`, `endingType`, `completedAt`, `finalTrust`,
  `finalCounters`, `finalInventory`, `carryOutSelections`, `unlocks`, and
  `rewards`.

## 3. Deterministic Data Sources

The Stage17 contact/relationship record may read:

- completed run history filtered to the current scenario id;
- the latest completed run for a specific ending;
- the best relationship-bearing completed run across the scenario history;
- ending metadata: title, type, result, unlocks, rewards, and visible ending
  tree fields;
- Akari NPC metadata: display name, contact capability, affection threshold,
  and lost/contact flags;
- final trust from `CompletedRunRecord.finalTrust.minase_akari`;
- reward types after player-facing formatting.

The Stage17 record must not read or infer from:

- generated AI chat output;
- hidden system prompts or external memory;
- raw scenario body prose as a storage contract;
- unreached ending descriptions;
- raw route-gate condition strings in player text;
- storage keys or localStorage internals in player text;
- missing-evidence or missing-route inference across history.

## 4. Record Model

Stage17 should treat contact and relationship as related but different labels.

`relationship record` means the completed run left a player-visible trace of
Akari's relationship state: trust band, memory fragment, relationship reward,
or ending-specific relationship result.

`contact record` means the completed run supports a post-clear contact-facing
status for Akari. In the first slice this is only a record label, not a working
message feature.

Suggested derived categories:

| Category | Meaning | First-slice behavior |
| --- | --- | --- |
| `active_contact_record` | Akari and the player returned with preserved relationship state. | Show contact preserved and relationship trace. |
| `memory_contact_trace` | The player returned, but Akari did not return; a memory or promise trace remains. | Show a fragmentary contact trace, not active contact. |
| `shared_boundary_record` | The player did not return because they stayed with Akari. | Show relationship preserved together in the boundary, not a phone/contact address. |
| `lost_relationship_trace` | The ending does not preserve Akari memory/contact state. | Show no contact unlock for that run. |
| `no_record` | No completed run supports an Akari record yet. | Hide the contact card or show only a locked summary if the surrounding UI already shows locked endings. |

These category names are implementation-facing. Player text should use softer
wording such as `灯との縁`, `残った記憶`, `関係のしるし`, and `連絡先の痕跡`.

## 5. Per-Ending Visibility

### 5.1 `return_with_akari`

Existing ending facts:

- player returns;
- Akari returns;
- Akari memory inheritance is true;
- relationship asset is preserved;
- ending rewards include `relationship_asset` for Akari;
- ending requires Akari trust at or above 70.

Stage17 visibility:

- relationship record: visible;
- contact record: active contact record;
- reward trace: show `関係のしるし` or equivalent formatted reward copy;
- trust trace: show Akari's final trust band, not the raw threshold;
- latest-run detail: may show that the player and Akari returned under the same
  light;
- unavailable actions: do not show message send, reply generation, call,
  notification, or free chat controls.

Player-facing copy direction:

```text
灯との縁が、帰還後の記録として残っている。
同じ灯を見て帰った記録。
```

### 5.2 `return_without_akari`

Existing ending facts:

- player returns;
- Akari does not return;
- Akari memory inheritance is true;
- relationship asset preservation is true in ending result metadata;
- ending rewards include an Akari memory fragment;
- unlocks may include promise and trace labels.

Stage17 visibility:

- relationship record: visible as memory/promise trace;
- contact record: fragmentary contact trace, not active contact;
- reward trace: show `記憶の断片` or equivalent formatted reward copy;
- trust trace: show Akari's final trust band if recorded, but do not imply that
  threshold alone created active contact;
- latest-run detail: may say Akari remained beyond the boundary and the player
  returned with a trace;
- unavailable actions: do not show active send/reply controls.

Decision:

Even if the final trust value is high, this ending must not be promoted to the
same contact status as `return_with_akari`. Akari did not return, so the first
slice should frame it as a remembered contact trace or unfinished promise.

Player-facing copy direction:

```text
灯は向こう側に残った。けれど、記憶の断片と約束の痕跡は残っている。
連絡先ではなく、戻る理由として残った縁。
```

### 5.3 `stay_with_akari`

Existing ending facts:

- player does not return;
- Akari does not return;
- player stays with Akari;
- Akari memory inheritance is true;
- relationship asset is preserved;
- ending rewards include an Akari memory fragment.

Stage17 visibility:

- relationship record: visible;
- contact record: not a returned-world contact address;
- reward trace: show `記憶の断片` or equivalent formatted reward copy;
- trust trace: show Akari's final trust band if recorded;
- latest-run detail: may say the player chose to remain beside Akari;
- unavailable actions: do not show send/reply controls because the premise is
  not post-return communication.

Decision:

This ending should count as a strong relationship record but not as an active
contact record in the returned-world sense. The UI may still show it under
Akari's relationship traces because the completed run clearly preserves the
bond.

Player-facing copy direction:

```text
帰還ではなく、灯のいる境界に残った記録。
連絡先ではなく、そばに残った縁。
```

### 5.4 `boundary_collapse`

Existing ending facts:

- player does not return;
- Akari does not return;
- Akari memory inheritance is false;
- relationship asset is not preserved;
- ending rewards are absent.

Stage17 visibility:

- relationship record: not unlocked for this run;
- contact record: unavailable;
- reward trace: none;
- trust trace: may be omitted from the relationship/contact card even if raw
  history contains a trust value;
- latest-run detail: may show the ending history row, but not an Akari contact
  card for this run;
- unavailable actions: do not show send/reply controls.

Decision:

`boundary_collapse` should never erase previous completed-run records. If the
player previously reached `return_with_akari`, `return_without_akari`, or
`stay_with_akari`, a history-wide Akari record may still show the best previous
trace while the current `boundary_collapse` detail states that this run left no
contact trace.

Player-facing copy direction:

```text
この周回では、灯との連絡先の痕跡は残らなかった。
過去の到達記録がある場合だけ、別の記録として灯との縁を見返せる。
```

## 6. History-Wide Selection Rule

Stage17B should distinguish two concepts:

- current ending detail: derived from the current completed run only;
- Akari relationship summary: derived from completed history for the same
  scenario.

For the history-wide Akari summary, choose the strongest available relationship
trace without mutating history.

Recommended rank:

1. `active_contact_record` from `return_with_akari`;
2. `shared_boundary_record` from `stay_with_akari`;
3. `memory_contact_trace` from `return_without_akari`;
4. `lost_relationship_trace` from `boundary_collapse`;
5. `no_record`.

When multiple records have the same category, prefer the latest `completedAt`.

This rule prevents a later failed run from deleting the player's earlier clear
record, while still allowing the current ending screen to be honest about what
happened in the latest run.

## 7. Player-Facing Surface

The first implementation should be a record surface, not an app-within-the-app.

Possible placement:

- inside the existing post-ending progress/reward sheet;
- as an Akari-specific relationship card near reached ending details;
- on a future deterministic relationship view if the existing sheet becomes too
  dense.

Minimum fields:

- Akari display name;
- relationship/contact category as player-facing copy;
- supporting ending title;
- first or latest completion timestamp, using existing completed-run history;
- trust band text from final trust;
- formatted reward labels;
- short explanation of why the record is active, fragmentary, boundary-bound,
  or unavailable.

Forbidden enabled controls:

- message input;
- send button;
- generated reply button;
- call/contact button that has no real outcome;
- unread notification badges;
- clickable contact rows with no visible state change;
- placeholder links.

If an expand/collapse control is added, it must visibly open or close details.
If no interaction is necessary, the card should be static.

## 8. Spoiler And Copy Rules

Stage17 must preserve the existing Stage16 spoiler boundary.

- Do not show reached-only ending titles, hidden descriptions, rewards, or
  contact states for unreached endings.
- Do not expose raw ids such as `return_with_akari`,
  `reward_akari_relationship_asset`, or `minase_akari` in player text.
- Do not expose raw trust thresholds or route condition strings in player text.
- Do not frame Akari as a romance prize, possession, rescue reward, or owned
  contact.
- Do not imply AI conversation exists before it is implemented.

Preferred words:

- `灯との縁`;
- `残った記憶`;
- `関係のしるし`;
- `連絡先の痕跡`;
- `戻る理由`;
- `そばに残った記録`.

Avoid:

- `攻略報酬`;
- `入手したNPC`;
- `所有`;
- `いつでも話せる`;
- `AI灯と会話する`.

## 9. Stage17B Implementation Candidate

Stage17B should be the smallest code slice that proves the record can be shown.

Candidate objective:

```text
Add an Akari relationship/contact record card derived from existing completed
run history and ending metadata, without changing storage schema or scenario
data.
```

Likely target areas:

- a pure helper under `lib/scenarios/` for deriving Akari relationship/contact
  record entries;
- focused regression tests for the four ending categories and history-wide
  ranking;
- a small `AdventurePlayer` post-ending surface addition, if the helper and
  tests stay narrow.

Required Stage17B constraints:

- no `CompletedRunRecord` schema expansion;
- no localStorage migration;
- no scenario YAML edits;
- no ending condition or route gate changes;
- no AI text generation;
- no messenger UI;
- every enabled interactive element must have a visible outcome.

Suggested Stage17B verification:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run validate:scenarios
npm run audit:adventure-player
```

## 10. Acceptance Criteria

Stage17A is complete when:

- this spec exists at `docs/stage17-contact-relationship-system-spec.md`;
- every current ending has an explicit contact/relationship visibility decision;
- the first slice is deterministic and record-like;
- the spec explicitly forbids AI free chat and messenger UI for the first slice;
- no code, storage schema, scenario YAML/body, route gate, ending condition, or
  replay hint change is required;
- `git diff --check -- docs/stage17-contact-relationship-system-spec.md`
  passes.

Stage17B is ready to start only after:

- Shiki accepts this direction or asks for a specific adjustment;
- the implementation prompt restates target files, constraints, verification,
  and stop conditions;
- the worktree dirty state is rechecked and narrow edit scope is confirmed.
