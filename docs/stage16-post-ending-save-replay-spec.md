# Stage16 Post-Ending Save Replay Spec

Created: 2026-06-07 JST

This document is the implementation-preparation specification for Stage16-1
through Stage16-4. It defines the deterministic post-clear layer for
`AdventurePlayer` before Stage16-5 code work begins.

## 0. Scope

Stage16 prepares the player-facing layer that appears after the deterministic
scene 1-7 flow is complete.

In scope:

- Stage16-1: post-ending UX.
- Stage16-2: minimal AdventurePlayer save/resume behavior.
- Stage16-3: ending progress and reward surface.
- Stage16-4: deterministic replay motivation and Stage16-5 candidate slice.

Out of scope:

- Stage16-5 code implementation.
- Figma editing.
- Scenario YAML/body rewrites.
- Ending condition, scene order, final-choice gate, or route gate changes.
- AI GM, free input, AI narration, Tauri/API integration, external save, cloud
  sync, or account-backed persistence.
- New asset import or production art sourcing.
- Formal clue schema creation.

## 1. Current Stage15 Baseline

Stage15 is committed and pushed as:

```text
c3c91aa Complete stage15 adventure player flow
```

The current player route:

- keeps `/` as `AdventurePlayer`;
- keeps `/debug` as `ScenarioExplorer`;
- follows `kimidake_ga_oboeteiru_jiko` scenes 1-7 through existing YAML;
- treats `state.endingId` as a terminal player-facing state;
- disables final choices after ending resolution by returning no-op events;
- exposes four-room carry-out selection in the Status panel before ending;
- keeps carry-out controls read-only after ending;
- does not implement real player-facing save/resume yet.

The active scenario contract remains:

- final choices are gated by `regret_resolved`;
- the ending resolution order remains `boundary_collapse`,
  `stay_with_akari`, `return_with_akari`, `return_without_akari`;
- four-room carry-out behavior remains max-one for stable return and two or
  more as a collapse risk;
- scenario YAML and current-spec are the source of truth.

## 2. Stage16-1 Post-Ending UX

### 2.1 Purpose

The post-ending UX should make the first full playthrough feel complete while
inviting replay without exposing hidden route logic as a debug table.

It must answer four player questions:

1. Which ending did this run reach?
2. What did the run carry out or leave behind?
3. What can the player inspect safely after the ending?
4. What is the next meaningful action?

It must not turn the ending screen into a production status screen, a spoiler
map, or a route-debug inspector.

### 2.2 Entry Condition

Post-ending UX appears only when `AdventurePlayer` has a terminal
`state.endingId`.

On entry:

- no scene advance control remains active;
- no final choice remains active;
- no carry-out checkbox remains editable;
- Evidence, Log, and Status may remain inspectable as read-only drawers;
- a restart/replay control may be enabled if it starts a new run or opens a
  defined resume/replay surface.

The post-ending surface uses runtime state and ending metadata only. It does
not recalculate or override the ending.

### 2.3 Primary Surface

The ending screen should remain part of the ADV experience, not a debug page.

Required visible elements:

- ending type label in Japanese player-facing terms, such as `トゥルー`,
  `ノーマル`, `グッド`, or `ロスト`;
- ending title from the resolved ending;
- short ending description from the resolved ending;
- one-line run outcome summary derived from player-facing state, not raw IDs;
- read-only carry-out summary;
- read-only reminder that Evidence / Log / Status can still be inspected.

Recommended outcome summary examples:

| Ending ID | Tone | Summary direction |
| --- | --- | --- |
| `return_with_akari` | fulfilled but scarred | `ふたりは同じ灯を見て、境界を越えた。` |
| `return_without_akari` | bittersweet | `帰還は果たされたが、灯は向こう側に残った。` |
| `stay_with_akari` | quiet refusal | `帰還よりも、灯のいる境界を選んだ。` |
| `boundary_collapse` | unstable loss | `持ち帰ろうとした願いが、帰還路を崩した。` |

These summaries are implementation examples, not mandatory copy. The mandatory
rule is that they are deterministic, story-facing, and do not expose raw
conditions.

### 2.4 Actions After Ending

Every visible enabled control must have a concrete user-observable outcome.

Required action candidates:

- `もう一度たどる`: starts a fresh run for the same scenario.
- `記録を見る`: opens or focuses the Log drawer.
- `手がかりを見る`: opens or focuses the Evidence drawer.
- `状態を見る`: opens or focuses the Status drawer.

Optional action candidates once Stage16-3 exists:

- `到達記録`: opens the ending progress/reward surface.
- `分岐の手がかり`: opens the replay hint surface.

Forbidden enabled controls:

- placeholder buttons;
- console-log-only buttons;
- route debug links exposed as the main post-ending action;
- `href="#"` or `javascript:void(0)`;
- controls that imply cloud save, external export, or Tauri/API integration.

### 2.5 Read-Only Drawers

After an ending:

- Evidence remains readable.
- Log remains readable.
- Status remains readable.
- Carry-out selections are visible but disabled.
- Disabled carry-out controls should communicate that the run has ended.

The player must not be able to mutate state after the ending and then keep the
same ending result. If mutation is required, it must happen through a new run.

### 2.6 Spoiler Boundary

The post-ending surface may reveal the reached ending's title, type,
description, run outcome, and reached-run summary.

It must not reveal:

- unreached ending titles unless Stage16-3 explicitly allows a blurred title;
- exact hidden conditions for unreached endings;
- route order as a solved checklist;
- raw flag/counter/trust thresholds;
- debug-only IDs.

### 2.7 Acceptance Criteria

Stage16-1 is ready for implementation when the spec can be implemented without
changing scenario data:

- `state.endingId` is the sole entry condition.
- The ending surface is read-only except for explicit new-run/replay/navigation
  controls.
- Each visible enabled control has a defined result.
- The surface uses story-facing Japanese labels.
- Unreached endings remain hidden until Stage16-3 defines progress display.
- The spec does not require code changes before Stage16-5.

## 3. Stage16-2 AdventurePlayer Save/Resume

### 3.1 Purpose

AdventurePlayer needs a minimal player-facing save/resume layer so a full
scene 1-7 run can survive reloads and accidental tab closes.

The Stage16-2 recommendation is localStorage-backed automatic save/resume using
the existing scenario storage model. This is deliberately not a cloud save
system and not a Tauri/API persistence layer.

### 3.2 Storage Boundary

Stage16-5 should reuse the existing browser storage contract unless code
inspection proves a blocker:

```text
active run: trpg-web:v1:active-run:<scenarioId>
run history: trpg-web:v1:run-history
version: 1
```

The active run record already has the fields AdventurePlayer needs:

- `scenarioId`
- `sceneId`
- `flags`
- `counters`
- `trust`
- `inventory`
- `usedActionIds`
- `carryOutSelections`
- `carryOutLimits`
- `lastChoiceId`
- `endingId`
- `completedRunId`
- `log`
- `updatedAt`

Stage16-5 should not introduce a parallel AdventurePlayer-only save key unless
there is a concrete migration or collision reason. Shared storage keeps
`ScenarioExplorer` and `AdventurePlayer` aligned around the same deterministic
runtime state.

### 3.3 Automatic Save Rules

AdventurePlayer should automatically save after meaningful state changes.

Meaningful changes include:

- action result;
- check result;
- scene advance;
- carry-out selection change;
- ending resolution;
- completed run id assignment, if the implementation assigns one in the player
  route.

Non-meaningful states should not create an active run:

- untouched initial state;
- purely opening or closing drawers;
- text page advance that does not change runtime state;
- viewport/layout changes;
- transient UI hover/focus state.

If localStorage is unavailable, full, blocked, or throws, play must continue in
React state. The UI may show a subtle save-unavailable state, but Stage16-5 does
not need a modal error flow.

### 3.4 Resume Rules

On AdventurePlayer load:

1. Create the fresh initial runtime state from the scenario pack.
2. Try to load `active-run:<scenarioId>`.
3. If the saved record is valid and belongs to the active scenario, restore it
   onto the fresh initial state.
4. If the saved record is invalid, wrong-version, wrong-scenario, or malformed,
   discard it and start fresh.

Recommended player behavior:

- If a valid non-ended run exists, resume it automatically and show a compact
  `つづきから` status note or banner with a visible `最初から` control.
- If a valid ended run exists, resume into the post-ending surface so the player
  can inspect the result, then offer `もう一度たどる`.
- If no valid run exists, start at scene 1 without asking.

This keeps resume friction low while still giving the player an escape hatch.

### 3.5 New Run / Restart Rules

`もう一度たどる` and any `最初から` control must:

- clear the active run for the current scenario;
- create a fresh initial state;
- reset AdventurePlayer presentation/session state;
- keep completed run history intact;
- keep check profile storage intact unless a future explicit profile-reset
  control is added.

Restart must not delete reached ending history by default.

### 3.6 Completed Run History

Ending resolution should append a completed run record exactly once per ended
run.

Required behavior:

- Use the existing completed history shape if possible.
- Include ending id, ending title, ending type, final trust/counters/inventory,
  carry-out selections, unlocks, rewards, and completed timestamp.
- Prevent duplicate history records on rerender/reload of the same ended run.
- Keep multiple legitimate runs for the same ending as separate history records.
- Derive reached-ending progress from history, not from a separate unlocked
  endings key.

If duplicate prevention needs a run-local marker, prefer the existing
`completedRunId` field rather than adding a new storage schema.

### 3.7 Player-Facing Save State

The save UX should be quiet.

Recommended labels:

- `保存済み`
- `自動保存中`
- `この端末では保存できない`
- `つづきから`
- `最初から`

Avoid technical labels such as localStorage, schema version, JSON, or raw
scenario id in the player surface.

The debug route may keep technical visibility; AdventurePlayer should not.

### 3.8 Non-Goals

Stage16 save/resume does not include:

- manual named save slots;
- save file export/import;
- cloud sync;
- account identity;
- cross-device save transfer;
- Tauri filesystem access;
- API persistence;
- migration UI for old invalid saves;
- save encryption;
- rollback to arbitrary scene.

### 3.9 Acceptance Criteria

Stage16-2 is ready for implementation when:

- AdventurePlayer can restore a valid active run after reload.
- AdventurePlayer can start fresh without deleting completed history.
- Ending completion writes or preserves completed run history exactly once per
  ended run.
- localStorage failure does not block play.
- Resume/restart controls have visible outcomes.
- No external persistence is implied or required.

## 4. Stage16-3 Ending Progress And Reward Surface

### 4.1 Purpose

The ending progress surface should turn completed runs into replay motivation
without spoiling the whole route map.

It should be available from post-ending UX and may later be available from a
top-level start/resume surface. Stage16-5 should prioritize the post-ending
entry first.

### 4.2 Data Source

Ending progress should be derived from:

- completed run history in `trpg-web:v1:run-history`;
- ending metadata in `endings.yaml`;
- `scenario.ending_resolution_order` for stable ordering;
- player-facing label maps for ending type, reward type, item names, and NPC
  names.

Do not create a separate unlocked-ending storage key in Stage16-5. The
completed history is already the durable source.

### 4.3 Locked Ending Display

For unreached endings:

- show only endings with `ending_tree.visible_before_unlock: true`;
- use `ending_tree.blurred_title` as the title;
- use `ending_tree.route_hint` as the description;
- show the player-facing ending type only if the design needs category balance;
- do not show `title`;
- do not show `description`;
- do not show `hidden_description`;
- do not show `unlock_conditions`;
- do not show `unlocks`;
- do not show `rewards`;
- do not show raw IDs, counters, flags, trust thresholds, or resolution order
  internals.

Allowed locked examples from current metadata:

| Ending ID | Locked title | Locked hint scope |
| --- | --- | --- |
| `return_with_akari` | `二人で帰る結末` | trust, unopened gift, shared guilt, ritual reproduction |
| `return_without_akari` | `一人で帰る結末` | return succeeds but Akari conditions are missing |
| `stay_with_akari` | `残る結末` | choose to remain with Akari at the final furnace |
| `boundary_collapse` | `帰れない結末` | ritual failure, contamination, or carrying out too much |

These hints are allowed because they already exist as scenario metadata and do
not expose exact numeric requirements.

### 4.4 Reached Ending Display

For reached endings, the surface may show:

- actual ending title;
- player-facing ending type label;
- ending description;
- hidden description;
- first reached timestamp;
- latest reached timestamp;
- reached count;
- final carry-out summary from the latest completed run;
- final relationship/state summary from completed run data;
- unlocks and rewards after player-facing formatting.

Reached display should still avoid raw implementation internals. For example,
show `灯との記憶の断片` rather than `reward_memory_fragment_akari` or
`npc_memory_fragment`.

### 4.5 Reward Surface

Rewards are not mechanical power-ups yet. In Stage16 they are post-clear
meaning and replay framing.

Recommended player-facing reward categories:

| Reward type | Player label | Meaning |
| --- | --- | --- |
| `memory_fragment` | `記憶の断片` | a reached ending leaves a readable memory trace |
| `relationship_asset` | `関係のしるし` | Akari relationship state was preserved in this ending |
| `carry_out_choice` | `持ち帰りの余白` | the run respected the carry-out limit and leaves room for choice |

If a reward has a scenario-authored `description`, use it first. If not, use a
deterministic player-facing fallback. Do not expose raw reward type strings as
the final UI copy.

`boundary_collapse` may have no reward. That absence should be shown quietly,
not as a punishment banner.

### 4.6 Surface Structure

Recommended layout:

- header: `到達記録`;
- small summary: reached count out of visible progress entries;
- list of ending cards;
- each card has `locked` or `reached` visual treatment;
- reached cards can expand to show description, hidden description, rewards,
  and latest-run summary;
- locked cards stay compact and show only the route hint.

On mobile, this should be a full-height sheet or post-ending subview. On
desktop, it may live in the existing side panel pattern. It must not require
`/debug`.

### 4.7 Ordering

Use the existing deterministic order:

1. ids in `scenario.ending_resolution_order`;
2. any remaining ending definitions in file order.

The UI should not label this as "resolution priority". It is only a stable
display order.

### 4.8 Acceptance Criteria

Stage16-3 is ready for implementation when:

- unreached endings reveal only blurred title and route hint;
- reached endings reveal title, description, hidden description, history count,
  timestamps, final-run summary, and formatted rewards;
- progress is derived from completed run history;
- raw IDs and exact hidden conditions are not player-visible;
- the surface can open from post-ending UX without `/debug`;
- no scenario YAML changes are required.

## 5. Stage16-4 Replay Motivation

### 5.1 Purpose

Replay motivation should point the player toward another run without turning
the story into a solved route spreadsheet.

The design must be deterministic. It may use runtime state, completed run
history, ending metadata, derived evidence, carry-out selections, and existing
player-facing labels. It must not use AI-generated advice, free input parsing,
or guessed hidden conditions.

### 5.2 Hint Families

Stage16 supports three safe hint families.

1. Branch hints.
   - Source: reached ending id plus `ending_tree.route_hint` for visible locked
     endings.
   - Use: tell the player there are other emotional outcomes.
   - Do not show exact condition formulas.

2. Evidence hints.
   - Source: current ended run's restored `state.flags`, `inventory`, and
     derived evidence adapter output.
   - Use: show that this run saw some evidence and left other investigation
     angles unresolved.
   - Do not require a new clue schema in Stage16-5.

3. Carry-out hints.
   - Source: `carryOutSelections`, carry-out group limits, and final ending id.
   - Use: explain that carrying out too much destabilizes return and that
     choosing one object can be replayed differently.
   - Do not change the carry-out limit or ending requirements.

### 5.3 Branch Hints

Branch hints are shown after ending and inside the replay motivation surface.

Recommended deterministic mapping:

| Reached ending | Safe replay hint |
| --- | --- |
| `return_with_akari` | `別の選択では、帰ることそのものを選ばない結末も残っている。` |
| `return_without_akari` | `帰還には届いた。次は灯と同じ灯を見る条件を整えられるかもしれない。` |
| `stay_with_akari` | `灯の隣に残った。帰還を選ぶ道では、別の痛みが見える。` |
| `boundary_collapse` | `境界は崩れた。持ち帰る数、儀式の再現、侵食の匂いを見直せる。` |

These are examples. Implementation may tune copy, but the source must remain
deterministic and story-facing.

### 5.4 Evidence Hints

Stage16-5 should not add `clues.yaml`. It can use the existing derived evidence
adapter as a current-run-only hint source.

Allowed current-run evidence hint data:

- evidence count reached in this run;
- evidence categories reached in this run;
- whether key early evidence flags exist in the ended active run;
- whether important inventory items were found;
- scene source labels already formatted by the adapter.

Allowed display:

- `この周回で見た手がかり`;
- `まだ見落としがありそうな調査`;
- category-level gaps such as `証言`, `推測`, `汚染記憶`;
- source-level hints such as a scene title, if the source has already been
  reached.

Forbidden display:

- raw flag ids;
- unreached exact action ids;
- hidden condition formulas;
- claims that all evidence exists unless a formal checklist exists;
- history-wide "missing evidence" based on completed run records, because the
  current history format does not store final flags or evidence ids.

If the active ended run is unavailable, omit current-run evidence hints instead
of fabricating them from history.

### 5.5 Carry-Out Hints

Carry-out hints are allowed because carry-out is already player-facing in the
Status panel.

Rules:

- If selected count is over the group limit, the hint may say carrying out too
  much destabilized the return.
- If selected count is within the limit, the hint may say another run can choose
  a different object.
- If no carry-out item was owned or selected, the hint may say no object was
  carried beyond the boundary in this run.
- Do not expose raw counter ids.
- Do not change `four_room_artifacts_carried_out`.

Recommended wording:

- `持ち帰れる余白は一つだけだった。次は別のものを選べる。`
- `持ち帰ろうとした数が、帰還路を揺らした。`
- `今回は境界の向こうへ持ち出したものはない。`

### 5.6 Tone Rules

Replay motivation should never scold the player for a non-true ending.

Preferred tone:

- "another emotional route exists";
- "there are unresolved traces";
- "a different carry-out choice can show another angle";
- "the ending is complete, but not the only answer".

Avoid:

- `失敗`;
- `正解`;
- `条件不足`;
- exact numeric thresholds;
- route names as checklist tasks;
- production wording such as Stage, debug, TODO, or implementation.

### 5.7 Autonomy Boundary For Future Work

Codex can self-drive these follow-up stages without asking Shiki, as long as
they stay within existing scenario/runtime contracts:

- implement localStorage-backed AdventurePlayer save/resume;
- implement post-ending read-only controls;
- implement ending progress using completed history and existing metadata;
- implement deterministic replay hints from the current ended run;
- add focused tests and UI audit helpers if kept in tracked reusable script
  form and scoped to the feature.

Codex should ask Shiki before:

- changing ending conditions;
- changing scenario YAML/body/route gates;
- adding formal clue schema files;
- adding external persistence, cloud save, Tauri/API integration, or accounts;
- importing new art assets;
- making Figma edits;
- committing historical handoff/archive files;
- turning `.runtime/` local helpers into permanent tooling if the scope is not
  already explicit.

## 6. Stage16-5 Minimal Code Implementation Candidate

Recommended next code slice:

```text
Stage16-5A: AdventurePlayer local save/resume and post-ending record entry
```

Objective:

- Wire AdventurePlayer to existing localStorage active-run and run-history
  helpers.
- Resume valid player progress after reload.
- Keep post-ending state inspectable.
- Add a minimal post-ending entry to reached-ending progress.

Target files:

- `components/adventure/AdventurePlayer.tsx`
- `lib/adventure/view-model.ts`
- `lib/scenarios/storage.ts` only if an existing helper gap blocks integration
- `lib/scenarios/ending-progress.ts` only for player-facing reward labels if
  needed
- focused tests under `tests/`

Hard excludes:

- no scenario YAML/body edits;
- no ending condition/order changes;
- no Figma edits;
- no asset imports;
- no AI GM/free input/AI narration;
- no Tauri/API/cloud save;
- no historical handoff/archive staging;
- no `.runtime/` or `.context-archive/` commits.

Minimum behavior:

1. On load, restore a valid active run for the current scenario.
2. After meaningful runtime state changes, save the active run.
3. At ending resolution, append completed history once.
4. Post-ending surface offers:
   - `もう一度たどる`;
   - `記録を見る`;
   - `手がかりを見る`;
   - `状態を見る`;
   - `到達記録` if ending progress can be connected within the same small slice.
5. Restart clears only the active run and preserves completed history.

Suggested deferred slices:

| Stage | Purpose |
| --- | --- |
| Stage16-5B | Full ending progress/reward sheet if 5A keeps only a minimal entry |
| Stage16-5C | Replay hint surface from current ended run evidence/carry-out state |
| Stage16-6 | Browser UI audit hardening and reusable tracked audit runner |
| Stage17 | Later clue schema or richer evidence board, only after Shiki approves |

Verification for Stage16-5A:

- `npm run typecheck`
- `npm run lint`
- `npm run validate:scenarios`
- `npm run test`
- `npm run build`
- browser/UI audit for `/` and `/debug`
- reload/resume audit for mid-run and ended-run states
- interaction audit for every new visible enabled control
