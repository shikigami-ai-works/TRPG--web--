# Development Progress

Last updated: 2026-06-10 JST

This document is the project progress ledger for `D:\Codex\TRPG--web--`.
It is not the scenario specification, not the implementation decision log, and
not a next-chat handoff. Use it to answer: what is done, what is currently in
flight, what remains undecided, and what the next safe stage should be.

## Reading Order

For specification decisions, read these first:

1. `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
2. `scenarios/kimidake_ga_oboeteiru_jiko/*.yaml`
3. `docs/web-adv-v0-2-player-experience-spec.md`
4. `docs/STAGE_13S_3_STAGE_14R_ASSET_DECISION.md`
5. `docs/implementation-notes.md`

Use this file only as a progress overview and restart map.

## Current Snapshot

- Branch: `main`
- Latest committed project revision: `adf4257 Add stage17 Akari contact record`.
- Latest committed Stage16 revision: `1dacfc2 Add stage16-7h evidence guard workflow`.
- Stage16-6 is committed and pushed.
- Stage 15 AdventurePlayer scene 1-7 flow is committed and pushed.
- Stage16-5A AdventurePlayer local save/resume and minimal post-ending record entry is committed and pushed.
- Stage16-5B ending progress/reward sheet is committed and pushed.
- Stage16-5C deterministic replay hints are committed and pushed.
- Stage16-6 reusable AdventurePlayer browser/UI audit runner is committed and pushed.
- Stage16-7A clue/evidence schema design is committed and pushed.
- Stage16-7B clue schema parity adapter is committed and pushed.
- Stage16-7C clue authoring scope decision is docs-only and included in the Stage16-7D commit/push bundle.
- Stage16-7D action/check-backed clue authoring smoke slice is committed and pushed.
- Stage16-7E item-backed authored clue scope decision is committed and pushed.
- Stage16-7F-A duplicate evidence policy decision is committed and pushed.
- Stage16-7F `relatives_wedding_rings` item-backed authored clue implementation is committed and pushed.
- Stage16-7G clue/evidence continuation scope decision is committed and pushed.
- Stage16-7H evidence identity regression guard is committed and pushed.
- Software development Agent Orchestra workflow docs are committed and pushed.
- Stage16-7H NextChat Full + Obsidian Git preservation docs are committed and pushed.
- Stage17A contact/relationship system spec is committed and pushed.
- Stage17B-1 deterministic Akari relationship/contact record helper and tests are committed and pushed.
- Stage17B-2 AdventurePlayer Akari relationship/contact card is committed and pushed.
- Stage17C UI interaction and copy audit hardening is implemented and verified locally; it is prepared as the next software commit candidate with this Stage17D ledger refresh.
- Historical uncommitted preservation docs and the scenario-choice planning doc are gathered under `docs/archive/uncommitted-docs/`; keep them out of active software commits unless Shiki explicitly chooses otherwise.
- The historical docs were copied as-is to `shikigami-ai-works/shiki-work-archive` at `97cad34 Archive TRPG web uncommitted docs`; the source repo copies remain local/untracked for Shiki's later cleanup choice.
- `.runtime/` and `.context-archive/` are local-only evidence/archive areas and should not be staged by default.

## Current Product Shape

- `/` renders the player-facing `AdventurePlayer`.
- `/debug` renders the original `ScenarioExplorer` debug/validation surface.
- The active player-facing route now covers scenes 1-7 of `kimidake_ga_oboeteiru_jiko`.
- Stage 15 removed the old player-facing stop at `scene_003_empty_house` and follows existing YAML scene transitions through the final scene.
- Scene 4+ support, ending resolution, and four-room carry-out selection are implemented in the player-facing adapter/UI layer without changing scenario YAML.
- Stage16-5A connects `AdventurePlayer` to the existing localStorage active-run and run-history helpers for minimal resume, completion record, and restart behavior.
- Stage16-5B shows completed-run-history-derived ending progress and minimal rewards on the AdventurePlayer post-ending surface.
- Stage16-5C shows three passive post-ending replay hints from the current ended run: branch, evidence, and carry-out.
- Stage16-7B keeps AdventurePlayer evidence output as `EvidenceEntry[]` while adding optional `clues.yaml` parity data for the existing flag-derived evidence.
- Stage16-7C keeps item-derived evidence in `items.yaml`, allows a future small action/check-backed clue authoring slice, and defers scene-reached predicates plus evidence-board design.
- Stage16-7D adds one action-backed and one check-backed authored clue while preserving item-derived evidence and the `EvidenceEntry[]` boundary.
- Stage16-7E decides item-backed authored clue scope docs-first: no blanket item migration, keep item-derived evidence by default, and preserve only `relatives_wedding_rings` as a possible one-clue Stage16-7F candidate.
- Stage16-7F-A rejects duplicate item/clue evidence and conditionally selects authored item-backed clue precedence for a future one-clue `relatives_wedding_rings` Stage16-7F slice.
- Stage16-7F adds that one `relatives_wedding_rings` authored clue and suppresses only the matching inventory-derived `item:relatives_wedding_rings` entry while leaving other inventory-derived evidence unchanged.
- Stage16-7G stops further clue-data expansion for now and selects a future test-focused evidence identity guard as the safest next clue/evidence candidate.
- Stage16-7H adds that evidence identity guard as a regression test without changing clue data, runtime logic, storage, UI, or replay hints.
- Stage17A defines deterministic Akari relationship/contact records as post-clear history-derived state, not AI chat or messenger behavior.
- Stage17B-1 adds the pure relationship/contact record helper and regression coverage for the four Stage17 categories plus history-wide best-record ranking.
- Stage17B-2 shows a small static/read-only Akari relationship/contact card on the post-ending AdventurePlayer surface using completed run history.
- Stage17C hardens the AdventurePlayer UI audit so every visible enabled player control in audited states has a user-observable outcome, and the Akari card copy stays free of raw IDs, ownership/romance reward framing, AI chat, and messenger implications.
- The player-facing UI is deterministic. No AI GM, free input, AI narration, Tauri/API integration, cloud save, or external save integration is in scope yet.

## Progress Timeline

### 2026-05-27 - Scenario MVP Vertical Slice

- Added the initial Next.js app structure.
- Added scenario loading, runtime state changes, validation, and regression tests.
- Built `ScenarioExplorer` as a debug/validation-oriented MVP surface.
- Added implementation notes for parser/runtime choices and local validation.

### 2026-05-27 - Save/Load And Run History

- Added localStorage-backed active run and completed run history for the debug UI.
- Kept persistence scoped to MVP/debug use.
- Left player-facing real save UX and future migration as later work.

### 2026-06-01 to 2026-06-02 - Kimidake Ending Contract Stabilization

- Locked the late-game order around wedding rings, unopened gift refusal, return ritual reproduction, farewell fire, and final choices.
- Gated final Scene 7 choices on `regret_resolved`.
- Verified true, normal, good, and lost route behavior with local browser/CDP evidence.
- Preserved current scenario contract in `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`.

### 2026-06-05 - Web ADV v0.2 Direction

- Created `docs/web-adv-v0-2-player-experience-spec.md`.
- Defined `ScenarioExplorer` as debug tooling and `AdventurePlayer` as the player entry.
- Fixed the first player-facing implementation direction: mobile-first ADV, Evidence / Log / Status drawers, desktop side panel, no AI GM in the first slice.

### 2026-06-05 to 2026-06-06 - Stage 13S Design And Asset Gate

- Produced Stage 13S mobile UI direction and A+B hybrid recommendation.
- Added Stage 14R asset decision gate.
- Allowed native CSS/React placeholders and specific license-safe reference sources.
- Blocked paid, unclear-license, local Figma, and AI-assisted asset import without a later explicit approval gate.

### 2026-06-06 - Stage 14R-1 AdventurePlayer Shell

- Commit: `3b0e549 Implement stage14r adventure player slice`
- Added `AdventurePlayer` and adventure adapter modules.
- Changed `/` to player-facing AdventurePlayer and kept `/debug` for ScenarioExplorer.
- Implemented deterministic scenes 1-3 reading, choices, checks, evidence, log, status, and bottom/side panels.
- Preserved scenario YAML/body/runtime contracts.

### 2026-06-06 - Stage 14R Completion Gate Review

- Commit: `de9324b Tighten stage14r adventure completion`
- Required `akari_rested_in_empty_house` before the player-facing completion control appears.
- Restored evidence/status behavior for scene 2 and scene 3 flags using existing scenario IDs.
- Added objective text in the Status drawer for the hidden completion gate.

### 2026-06-07 - Stage 14R-2 Player-Facing Polish

- Commit: `3c13090 Polish stage14r player-facing completion`
- Removed player-visible production/developer wording such as `Stage 14R`, `縦切り`, and `First slice`.
- Changed the completion control to `記録を閉じる`.
- Reworded completion text, log, event, and objective as story-facing investigation language.
- Removed the visible `debugを開く` link from the player completion surface while keeping `/debug` available.

### 2026-06-07 - Stage 14R-3 Drawer Readability Polish

- Commit: `cc28433 Polish stage14r investigation drawers`
- Status: committed and pushed to `origin/main`.

- Added structured `logEntries` derived from runtime `state.log`.
- Kept `state.log` strings intact to preserve the runtime/log contract.
- Rendered Log drawer entries as compact cards labeled `行動`, `判定`, `場面`, `結末`, or `記録`.
- Separated Evidence card category pills from source lines and labeled source as `出どころ`.
- Separated Status drawer primary labels from supporting numeric values such as `侵食値` and `信頼値`.
- Added focused regression coverage for initial note, scene transition, action, and check log categories.

Verification before the Stage 14R-3 commit:

- `npm run test`: PASS, 26 tests
- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings
- `npm run build`: PASS
- UI interaction audit: PASS at `390x844`, `430x932`, `1280x720`, and `1440x900`
- Console errors: 0
- Request failures: 0
- `git diff --check`: PASS, LF-to-CRLF warnings only

### 2026-06-07 - Stage 15 AdventurePlayer Scene 4-7 Expansion

- Commit: `c3c91aa Complete stage15 adventure player flow`
- Status: committed and pushed to `origin/main`.

- Removed the Stage 14R player-route completion stop at `scene_003_empty_house`.
- Let `AdventurePlayer` follow the existing scenario YAML through scenes 4-7.
- Added a terminal ending surface for `state.endingId` so final choices do not remain active after resolution.
- Added player-facing four-room carry-out selection in the Status panel using existing runtime helpers.
- Added regression coverage for scene 3 to scene 4 advancement, Scene 7 final-choice gating, true-ending playthrough, and carry-out over-limit collapse.
- Browser/UI audit passed with a local `.runtime/stage15-adventureplayer-ui-audit.cjs` CDP helper: scene 1 through `双つ灯の生還`, carry-out selection, `/debug`, four responsive viewports, no console errors, and no network failures.

Verification:

- `git diff --check`: PASS, LF-to-CRLF warnings only.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 29 tests.
- `npm run build`: PASS.
- `node .runtime\stage15-adventureplayer-ui-audit.cjs`: PASS, output saved under `.runtime/stage15-adventureplayer-ui-audit-2026-06-07T05-49-17-034Z.json` and `.runtime/stage15-adventureplayer-screens-2026-06-07T05-49-17-034Z/`.

Verification so far:

- Stage 15 full verification is complete and recorded above.

### 2026-06-07 - Stage 16-0 Progress Ledger Refresh

- Commit: Stage16-5A save point, `Complete stage16 adventure player save resume`
- Status: complete and committed with the Stage16-5A implementation save point.

- Refreshed this progress ledger after the Stage15 push so restart state no longer describes Stage15 as uncommitted.
- Kept Stage16 as a docs/spec preparation stage. Stage16-1 through Stage16-4 should define post-ending UX, save/resume, ending progress/rewards, and replay motivation before Stage16-5 code begins.
- Preserved the rule that untracked handoff/archive files, `.runtime/`, and `.context-archive/` stay out of Stage16 scope unless explicitly selected.

### 2026-06-07 - Stage 16-1 to Stage 16-4 Post-Ending Save Replay Spec

- Commit: Stage16-5A save point, `Complete stage16 adventure player save resume`
- Status: complete and committed with the Stage16-5A implementation save point.

- Added `docs/stage16-post-ending-save-replay-spec.md` as the Stage16 implementation-preparation spec.
- Stage16-1 defines the post-ending UX around terminal `state.endingId`, read-only drawers, story-facing ending summary, and concrete post-ending controls.
- Stage16-2 defines minimal AdventurePlayer save/resume around existing localStorage active-run and run-history storage, with external save/Tauri/API/cloud persistence out of scope.
- Stage16-3 defines ending progress and reward display using completed run history plus existing ending metadata, with unreached endings limited to blurred titles and route hints.
- Stage16-4 defines deterministic replay motivation through branch hints, current-run evidence hints, and carry-out hints, without AI advice or clue schema changes.
- Stage16-5A was selected as the first code slice: wire AdventurePlayer to existing save/resume/history helpers and add the minimal post-ending record entry.

### 2026-06-07 - Stage 16-5A AdventurePlayer Save Resume

- Commit: Stage16-5A save point, `Complete stage16 adventure player save resume`
- Status: committed and pushed; verification passed.

- Wired `AdventurePlayer` to the existing `trpg-web:v1:active-run:<scenarioId>` and `trpg-web:v1:run-history` storage helpers.
- Restores a valid active run on reload, auto-saves meaningful runtime progress, and keeps localStorage failures from blocking React state play.
- Appends completed run history once on ending resolution and marks unavailable storage without repeated append attempts.
- Added post-ending record/status actions using existing Evidence, Log, and Status drawers.
- Changed `もう一度たどる` / restart behavior to clear only the active run and preserve completed run history plus check profile.
- Preserved `/debug` as `ScenarioExplorer` and did not change scenario YAML, scenario body text, scene order, ending conditions, route gates, assets, Figma files, API/Tauri layers, or external storage.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 32 tests.
- `npm run build`: PASS.
- `git diff --check`: PASS, LF-to-CRLF warnings only.
- Browser/UI audit: PASS via local `.runtime/stage16-5a-ui-audit.cjs`; latest output saved under `.runtime/stage16-5a-ui-audit-2026-06-07T08-15-49-346Z.json` and `.runtime/stage16-5a-screens-2026-06-07T08-15-49-346Z/`.
- Browser audit covered `/` mobile and desktop layout smoke, active-run reload resume, post-ending completed history, restart preserving history, localStorage failure handling, new post-ending controls, and `/debug`.

### 2026-06-07 - Stage 16-5B Ending Progress Reward Sheet

- Commit: `59f031a Add stage16-5b ending progress sheet`.
- Status: committed and pushed; verification passed.

- Added a minimal AdventurePlayer post-ending progress/reward sheet built from completed run history.
- Shows reached endings, reached count, first/latest reached timestamps, current reached ending status, latest completed-run carry-out/relationship/contamination summary, and reward summary.
- Keeps unreached endings limited to the configured blurred title plus route hint; Stage16-5C replay hints remain deferred.
- Refilters progress by `scenarioId` inside the ending progress helper and did not extend the `CompletedRunRecord` storage schema.
- Preserved `/` as `AdventurePlayer`, `/debug` as `ScenarioExplorer`, and left scenario YAML/body, scene order, ending conditions, and route gates unchanged.
- Added focused regression coverage for scenario-filtered progress and player-facing labels instead of raw reward/item/NPC ids.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 32 tests.
- `npm run build`: PASS.
- `git diff --check`: PASS, LF-to-CRLF warnings only.
- Browser/UI audit: PASS via local `.runtime/stage16-5b-ui-audit.cjs`; latest output saved under `.runtime/stage16-5b-screens-2026-06-07T09-19-14-355Z/`.
- Browser audit covered `/` mobile and desktop post-ending progress sheet visibility, `/debug` render preservation, no console errors, no request failures, and existing enabled post-ending controls: `もう一度たどる`, `記録を見る`, `手がかりを見る`, `状態を見る`.
- The audit command printed successful JSON output but the parent shell wait timed out after evidence was written; a follow-up port check found no listeners on 3001 or 9223.

### 2026-06-07 - Stage 16-5C Deterministic Replay Hints

- Commit: `c169b3b Add stage16-5c replay hints`.
- Status: committed and pushed; verification passed.

- Added a passive `次の周回の手がかり` block to the AdventurePlayer post-ending surface.
- The block is limited to three deterministic hint families: branch, evidence, and carry-out.
- Branch hints use the current reached ending plus visible `ending_tree.route_hint` metadata without showing raw ending IDs or exact route conditions.
- Evidence hints use only the current ended active-run state through existing derived evidence entries: count, category labels, and reached source labels.
- Carry-out hints use current `state.carryOutSelections` and carry-out group limits without changing carry-out logic or exposing raw counter IDs.
- No `CompletedRunRecord` schema extension was added, and no completed history-derived missing evidence inference was introduced.
- Preserved `/` as `AdventurePlayer`, `/debug` as `ScenarioExplorer`, existing post-ending controls, Stage16-5B ending progress/reward sheet, scenario YAML/body, scene order, ending conditions, and route gates.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 32 tests.
- `npm run build`: PASS.
- `git diff --check`: PASS, LF-to-CRLF warnings only.
- Browser/UI audit: PASS via local inline CDP audit; latest output saved under `.runtime/stage16-5c-screens-2026-06-07T09-51-06-174Z/`.
- Browser audit covered `/` mobile `430x932` and desktop `1280x720`, replay hint family visibility (`branch`, `evidence`, `carry_out`), Stage16-5B progress sheet visibility, raw ID / condition-string non-exposure in player text, existing post-ending control outcomes, passive replay hint behavior, and `/debug` render preservation.
- The audit parent shell timed out after writing `audit.json`, screenshots, and server log; `audit.json` records no console errors, no request failures, and passing interaction results. A follow-up port check found no listeners on 3004 or 9226. Some node worker processes from failed local audit attempts remained visible, but process cleanup by force was not approved; no listening dev server ports remained.

### 2026-06-07 - Stage 16-6 Reusable AdventurePlayer Browser/UI Audit Runner

- Commit: `76a9425 Add stage16-6 adventure UI audit runner`.
- Status: committed and pushed; verification passed.

- Added `scripts/adventure-player-ui-audit.cjs` as a dependency-free CDP audit runner for the minimum AdventurePlayer browser/UI contract.
- Added `npm run audit:adventure-player` as the reusable repo entrypoint.
- The runner starts a random-port Next dev server, launches headless Edge/Chrome through CDP, seeds only browser localStorage with an ended active run and completed history, and writes evidence under `.runtime/adventure-player-ui-audit-<timestamp>/`.
- Covered `/` as AdventurePlayer, mobile and desktop post-ending surfaces, Stage16-5B progress/reward sheet visibility, Stage16-5C replay hint family visibility (`branch`, `evidence`, `carry_out`), raw player-text leak checks, existing post-ending control outcomes, passive replay hint behavior, and `/debug` as ScenarioExplorer.
- Did not add product test hooks, product controls, scenario data, storage schema, replay hint copy changes, or Stage16-7 clue/evidence schema work.
- Preserved `/` as `AdventurePlayer`, `/debug` as `ScenarioExplorer`, and left scenario YAML/body, scene order, ending conditions, route gates, and `CompletedRunRecord` unchanged.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 32 tests.
- `npm run build`: PASS.
- `npm run audit:adventure-player`: PASS; latest output saved under `.runtime/adventure-player-ui-audit-2026-06-07T10-34-36-028Z/`.
- `git diff --check`: PASS.

### 2026-06-07 - Stage 16-7A Clue/Evidence Schema Design

- Commit: `cf65b12 Document stage16-7a clue evidence schema design`.
- Status: committed and pushed.

- Added `docs/stage16-7-clue-evidence-schema-design.md` as the handoff-grade design decision for future clue/evidence schema formalization.
- Decided that a future schema should use `clue` as the minimum authored unit, while `evidence` remains the current-run runtime/view output consumed by AdventurePlayer and Stage16-5C replay hints.
- Kept `source` and `reveal condition` as fields inside clue definitions for the first future slice instead of separate top-level schema units.
- Defined Stage16-7B as one safe minimal candidate: optional `clues.yaml` parity adapter for the existing `FLAG_EVIDENCE` definitions.
- Preserved Stage16-5A/5B/5C behavior, Stage16-6 audit tooling, scenario YAML/body, scene order, ending conditions, route gates, `CompletedRunRecord`, and replay hint families/copy.

Verification:

- `git diff --check`: PASS for tracked docs diff, LF-to-CRLF warnings only.
- Stage16-7A changed-files review: docs-only (`docs/stage16-7-clue-evidence-schema-design.md`, `docs/implementation-notes.md`, `docs/development-progress.md`).
- Runtime verification is intentionally not required for Stage16-7A because no code, scenario data, or storage schema is changed.

### 2026-06-07 - Stage 16-7B Clue Schema Parity Adapter

- Commit: `6558886 Add stage16-7b clue schema parity adapter`.
- Status: committed and pushed to `origin/main`; verification passed.

- Added optional authored `clues.yaml` data for the existing nine `FLAG_EVIDENCE` entries only.
- Added clue schema types, optional loader support, scenario validation for clue IDs/categories/sources/reveal refs, and schema-backed evidence derivation.
- Kept `evidence` as `EvidenceEntry[]`, preserved single-flag `EvidenceEntry.id` values such as `flag:noticed_parallel_displacement`, and kept item-derived evidence from `items.yaml`.
- Preserved Stage16-5C replay hint families/copy, `CompletedRunRecord`, route gates, ending conditions, scene order, scenario prose, and UI controls.
- Did not add scene-reached reveal predicates, missing-evidence inference, evidence board UX, AI GM, free input, assets, external persistence, or Figma work.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 34 tests.
- `npm run build`: PASS.
- `npm run audit:adventure-player`: PASS; latest output saved under `.runtime/adventure-player-ui-audit-2026-06-07T14-54-03-364Z/`.
- `git diff --check`: PASS, LF-to-CRLF warnings only.

### 2026-06-08 - Stage 16-7C Clue Authoring Scope Decision

- Commit: `5fe992b Add stage16-7d action check clues`.
- Status: docs-only decision completed.

- Added `docs/stage16-7c-clue-authoring-scope-decision.md`.
- Decided not to blanket-migrate item-derived evidence into `clues.yaml`; item evidence stays derived from `items.yaml` until a specific item needs authored clue copy, category, sources, or reveal behavior.
- Decided action/check-backed authored clues can become one small Stage16-7D implementation candidate using existing `state.usedActionIds`.
- Decided not to add a scene-reached reveal predicate now because the runtime does not preserve visited-scene history beyond current `sceneId`.
- Deferred missing-evidence checklist, evidence board UX, deduction declaration, history-wide missing-evidence inference, `CompletedRunRecord` extension, replay hint copy/family changes, route gate changes, ending condition changes, and scenario prose changes.

Verification:

- `git diff --check`: PASS, LF-to-CRLF warning only.
- Trailing-whitespace scan for changed docs: PASS.

### 2026-06-08 - Stage 16-7D Action/Check-Backed Clue Authoring Smoke Slice

- Commit: `5fe992b Add stage16-7d action check clues`.
- Status: implemented; verification passed.

- Added two authored clues to `scenarios/kimidake_ga_oboeteiru_jiko/clues.yaml`.
- Added one action-backed clue revealed by existing `usedActionIds` for `stand_beside_akari_choice`.
- Added one check-backed clue revealed by existing `usedActionIds` for `check_escape_returning_family`.
- Kept item-derived evidence from `items.yaml` and did not migrate inventory evidence into `clues.yaml`.
- Did not change schema types, validation code, evidence adapter code, storage schema, route gates, ending conditions, scene order, scenario prose, UI controls, or Stage16-5C replay hint families/copy.
- Added focused regression coverage that action/check-backed authored clues derive as `EvidenceEntry[]` with player-facing source labels.

Verification:

- `git diff --check`: PASS, LF-to-CRLF warnings only.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 35 tests.
- `npm run build`: PASS.
- `npm run audit:adventure-player`: PASS; latest output saved under `.runtime/adventure-player-ui-audit-2026-06-07T17-28-02-380Z/`.

### 2026-06-08 - Stage 16-7E Item-Backed Authored Clue Decision

- Commit: `f2cb6a2 Document stage16-7e orchestration prompt`.
- Status: committed and pushed.

- Added `docs/stage16-7e-item-backed-authored-clue-decision.md`.
- Evaluated every item in `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml` against the Stage16-7C rule that item-derived evidence stays in `items.yaml` unless a specific item needs clue-specific copy, category, sources, or reveal behavior.
- Decided not to blanket-migrate item evidence into `clues.yaml`.
- Decided current item-derived evidence is sufficient for all current items by default.
- Preserved `relatives_wedding_rings` as the only future Stage16-7F item-backed authored clue candidate because its current item source points to `scene_006_four_rooms_ritual` while player-facing acquisition happens through `take_wedding_rings` in `scene_007_return_fire`.
- Did not edit `clues.yaml`, scenario YAML, runtime, storage, UI, replay hint copy/families, route gates, ending conditions, or scenario prose.

Verification:

- `git diff --check`: PASS, LF-to-CRLF warnings only.
- Trailing-whitespace scan for changed docs: PASS.
- Runtime verification is intentionally not required for Stage16-7E because no code, scenario YAML, storage schema, replay copy, route gate, or UI behavior changes in this stage.

### 2026-06-08 - Stage 16-7F-A Duplicate Evidence Policy Decision

- Commit: `5edea86 Document stage16-7f-a duplicate evidence policy`.
- Status: committed and pushed.

- Added `docs/stage16-7f-a-duplicate-evidence-policy-decision.md`.
- Rejected duplicate item/clue evidence entries for the same item meaning because the current adapter can produce duplicate `item:<id>` evidence IDs and AdventurePlayer uses `entry.id` as the React key for evidence cards.
- Conditionally selected authored item-backed clue precedence for a future Stage16-7F implementation, but only if that implementation remains exactly one clue for `relatives_wedding_rings`.
- Defined the fallback: if Stage16-7F broadens beyond one clue or requires route/storage/UI/replay changes, keep inventory-derived evidence and defer item-backed authored clue implementation.
- Did not edit `clues.yaml`, `items.yaml`, runtime, storage, UI, replay hint copy/families, route gates, ending conditions, tests, or scenario prose.

Verification:

- `git diff --check`: PASS for tracked docs diff, LF-to-CRLF warnings only.
- Trailing-whitespace scan for changed docs: PASS.
- Runtime verification is intentionally not required for Stage16-7F-A because no code, scenario YAML, storage schema, replay copy, route gate, or UI behavior changes in this stage.

### 2026-06-08 - Stage 16-7F Relatives Wedding Rings Item-Backed Authored Clue

- Commit: `ec9b3ac Add stage16-7f wedding rings clue`.
- Status: committed and pushed.

- Added one authored clue, `clue_pair_medium_wedding_rings`, revealed by existing inventory item `relatives_wedding_rings`.
- Kept the generated evidence ID as `item:relatives_wedding_rings` through the existing single-item reveal convention.
- Added targeted duplicate suppression in `deriveEvidenceEntries` so the authored clue replaces only the matching inventory-derived `item:relatives_wedding_rings` entry after reveal.
- Left every other inventory-derived evidence entry unchanged, including `unopened_birthday_gift`.
- Preserved `EvidenceEntry[]` as the AdventurePlayer and replay hint boundary.
- Did not change `items.yaml`, storage schema, route gates, ending conditions, scene order, scenario prose, UI controls, or Stage16-5C replay hint families/copy.
- Added focused regression coverage for the single authored wedding-rings entry and unchanged nonmatching inventory evidence.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `npm run test`: PASS, 36 tests.
- `npm run build`: PASS.
- `npm run audit:adventure-player`: PASS; latest output saved under `.runtime/adventure-player-ui-audit-2026-06-08T07-07-28-528Z/`.

### 2026-06-08 - Stage 16-7G Clue/Evidence Continuation Scope Decision

- Commit: `1dacfc2 Add stage16-7h evidence guard workflow`.
- Status: committed and pushed with the Stage16-7H bundle.

- Added `docs/stage16-7g-clue-evidence-continuation-scope-decision.md`.
- Decided not to add more authored item-backed clues now because Stage16-7F completed the only currently justified item-backed clue candidate.
- Kept `EvidenceEntry[]` as the AdventurePlayer-facing boundary and kept item-derived evidence in `items.yaml` by default.
- Deferred evidence board UI, missing-evidence checklist, deduction declaration, scene-reached predicates, history-wide replay inference, `CompletedRunRecord` extension, replay hint copy/family changes, route gates, ending conditions, scene order, and scenario prose changes.
- Selected a future Stage16-7H candidate as a small evidence identity regression guard, focused on tests rather than new clue data or product behavior.

Verification:

- `git diff --check`: PASS, LF-to-CRLF warnings only.
- Trailing-whitespace scan for changed docs: PASS.
- Runtime verification is intentionally not required because this is docs-only scope guidance.

### 2026-06-08 - Stage 16-7H Evidence Identity Regression Guard

- Commit: `1dacfc2 Add stage16-7h evidence guard workflow`.
- Status: committed and pushed.

- Added a regression test to `tests/adventure-view-model.test.ts` that derives evidence for a representative state with all current flag-backed clues, the action/check-backed authored clues, and all current inventory items.
- Asserted that all derived `EvidenceEntry.id` values are unique.
- Reconfirmed that the authored `relatives_wedding_rings` clue appears as the single `item:relatives_wedding_rings` entry while unrelated inventory evidence, including `unopened_birthday_gift`, remains present.
- Preserved `EvidenceEntry[]` as the AdventurePlayer-facing boundary.
- Did not change `clues.yaml`, `items.yaml`, runtime evidence logic, loader/types/validation code, storage schema, route gates, ending conditions, replay hint copy/families, UI controls, or scenario prose.

Verification:

- `npm run test`: PASS, 37 tests.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `git diff --check`: PASS, LF-to-CRLF warnings only.

### 2026-06-08 - Software Development Agent Orchestra Workflow Template

- Commit: `1dacfc2 Add stage16-7h evidence guard workflow`.
- Status: committed and pushed.

- Added `docs/workflows/software-development-orchestra.md` as the practical operating template for software development with Agent Orchestration.
- Captured the five working rules Shiki asked for: Main Orchestrator authority, self-drive levels, Stage Prompt loop, standard agent orchestra, and repo operating template.
- Added activation phrases, agent role boundaries, verification matrix, record matrix, Git / nextchat / Obsidian boundaries, copyable orchestration prompt, stop conditions, and completion report shape.
- Updated `docs/codex-autonomous-workflow.md` to point software-development orchestration requests to the new workflow template while keeping that file as the higher-level policy document.
- Aligned the older `nextchat` table in `docs/codex-autonomous-workflow.md` with the current default that bare `nextchat` means NextChat Full unless Shiki explicitly asks for a lightweight handoff-only result.
- Did not change product code, scenario YAML/body, route gates, storage schemas, runtime behavior, or product UI.

Verification:

- `git diff --check`: PASS for tracked docs diff, LF-to-CRLF warning only.
- New workflow doc trailing-whitespace scan: PASS.
- Runtime verification is intentionally not required because this is docs-only operations guidance.

### 2026-06-08 - Agent Orchestra NextChat Full And Obsidian Git Preservation

- Commit: `1dacfc2 Add stage16-7h evidence guard workflow`.
- Status: project-local ledger and handoff committed and pushed with the Stage16-7H bundle; Obsidian Git save was completed separately.

- Created `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_software-development-orchestra-nextchatfull-obsidiangit.md`.
- Created `docs/NEXT_CHAT_HANDOFF_2026-06-08_software-development-orchestra-nextchatfull-obsidiangit.md`.
- Labeled raw archive preservation as unavailable / best-effort because discoverable Codex session JSONL includes hidden developer/system prompt material and must not be archived into user-visible project or Obsidian artifacts.
- Preserved the software development workflow context as part of the later Stage16-7H `Git push next chat obsidian git` bundle.

Verification:

- NextChat ledger/handoff files created in `docs/`.
- Raw archive intentionally omitted for privacy/safety boundary.

### 2026-06-08 - Stage 16-7H Git Push NextChat Obsidian Git Bundle

- Commit: `1dacfc2 Add stage16-7h evidence guard workflow`.
- Status: committed and pushed to `origin/main`; matching Obsidian note verified under `D:\Obsidian\MyVault\Codex\Projects\TRPG--web--\2026-06-08-stage16-7h-git-push-nextchat-obsidiangit.md`.

- Bundled Stage16-7G, Stage16-7H, Software Development Agent Orchestra workflow docs, and the matching repo-local NextChat Full handoff/ledger docs.
- Verified that `main`, `origin/main`, and `origin/HEAD` point at `1dacfc2`.
- Kept historical handoff/ledger/archive docs out of the software repo commit.
- Later gathered those historical uncommitted docs under `docs/archive/uncommitted-docs/` so they are separated from active restart sources.

Verification:

- `npm run test`: PASS, 37 tests.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `git diff --check`: PASS, LF-to-CRLF warnings only.
- Intended-file trailing whitespace scan: PASS.
- Staged diff check before commit: PASS.

### 2026-06-09 - Historical Docs Archive Repo Save

- Software repo commit: not requested; `D:\Codex\TRPG--web--` remains uncommitted after the docs cleanup.
- Archive repo commit: `97cad34 Archive TRPG web uncommitted docs` in `shikigami-ai-works/shiki-work-archive`.
- Status: historical uncommitted docs copied and pushed to the separate work archive repository.

- Copied 31 Markdown documents from the TRPG source repo into `D:\Codex\shiki-work-archive\projects\TRPG--web--\2026-06-09-uncommitted-docs\`.
- Preserved original relative paths under `source-paths/`.
- Added `MANIFEST.tsv` with source path, archive path, SHA-256, byte count, and source git status.
- Added `SOURCE_STATUS.txt` with the TRPG repo dirty state at capture time.
- Kept the source repo copies in place; no TRPG files were deleted or staged by this archive save.

Verification:

- `shiki-work-archive` `main` pushed to `origin/main` at `97cad34`.
- Source/archive SHA-256 comparison: PASS for 31 source Markdown files.
- Archive repo status after push: clean.
- TRPG source repo status after archive save: still dirty with `docs/development-progress.md` modified and historical docs untracked under `docs/archive/uncommitted-docs/`.

### 2026-06-09 - Stage17 Akari Contact Relationship Record

- Commit: `adf4257 Add stage17 Akari contact record`.
- Status: committed and pushed to `origin/main`.

- Added `docs/stage17-contact-relationship-system-spec.md` as the deterministic Akari post-clear relationship/contact record spec.
- Updated the player experience spec with Stage17's record-only boundary: no AI free chat, messenger UI, generated replies, notification simulation, or free-contact behavior.
- Added `lib/scenarios/relationship-contact-record.ts` to derive Akari's best relationship/contact record from completed run history and scenario metadata.
- Added regression coverage for the Stage17 categories: `active_contact_record`, `memory_contact_trace`, `shared_boundary_record`, and `lost_relationship_trace`.
- Added a static/read-only Akari relationship/contact card to the AdventurePlayer post-ending surface.
- Updated the reusable AdventurePlayer UI audit so the Stage17B-2 card is visible, category-backed, and copy-safe.
- Preserved scenario YAML/body, route gates, ending conditions, storage schema, replay hint logic, and AI behavior.

Verification:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test`: PASS.
- `npm run build`: PASS.
- `npm run validate:scenarios`: PASS.
- `npm run audit:adventure-player`: PASS.
- `git diff --check`: PASS, LF-to-CRLF warnings only.

### 2026-06-09 - Stage17C UI Interaction And Copy Audit

- Commit: uncommitted local audit/report change.
- Status: implemented and verified locally; prepared for the next software commit candidate with the Stage17D progress refresh.

- Hardened `scripts/adventure-player-ui-audit.cjs` from a post-ending smoke check into a visible-control audit across mobile, compact mobile, desktop, and wide desktop states.
- The audit now records enabled-control snapshots, interaction outcomes, copy guard results, JSON evidence, and a Markdown audit report under `.runtime/adventure-player-ui-audit-<timestamp>/`.
- Verified mobile bottom navigation, drawer close, story text advance, first visible choices, next scene control, save restart, post-ending actions, desktop side-panel tabs, and the passive replay hint sheet.
- Rechecked the Stage17 relationship/contact card as static/read-only and copy-safe with no enabled or focusable controls.
- Added `docs/stage17c-ui-interaction-copy-audit-2026-06-09.md` as the user-visible Stage17C audit report.
- Preserved product UI, scenario data, storage schema, route gates, replay hints, and AI behavior.

Primary runtime evidence:

- JSON: `D:\Codex\TRPG--web--\.runtime\adventure-player-ui-audit-2026-06-09T09-19-26-521Z\audit.json`
- Markdown: `D:\Codex\TRPG--web--\.runtime\adventure-player-ui-audit-2026-06-09T09-19-26-521Z\audit.md`
- Screenshots: `D:\Codex\TRPG--web--\.runtime\adventure-player-ui-audit-2026-06-09T09-19-26-521Z\screens`

Verification:

- `npm run audit:adventure-player`: PASS.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test`: PASS, 39 tests.
- `npm run build`: PASS.
- `npm run validate:scenarios`: PASS.
- `git diff --check`: PASS, LF-to-CRLF warnings only.

### 2026-06-10 - Stage17D Progress And Implementation Notes Refresh

- Commit: uncommitted docs-only progress refresh.
- Status: implemented locally as a commit-preparation companion to Stage17C.

- Updated this progress ledger so the restart map includes Stage17A, Stage17B-1, Stage17B-2, Stage17C, and the current Stage17D commit-preparation state.
- Kept `docs/implementation-notes.md` unchanged because Stage17B/C implementation choices were already covered by the Stage17 spec and Stage17C audit report.
- Kept historical handoff/archive docs, `.runtime/`, `.context-archive/`, scenario data, route gates, storage schema, replay hints, and AI behavior out of scope.

Verification:

- Stage17D diff audit: PASS.
- `git diff --check`: PASS, LF-to-CRLF warnings only.

## Area Status

| Area | Status | Notes |
| --- | --- | --- |
| Kimidake scenario contract | Stable | Current-spec and YAML are the source of truth. |
| ScenarioExplorer debug UI | Stable | Preserved under `/debug`. |
| AdventurePlayer scenes 1-7 | Committed and pushed in Stage 15 | Browser/UI audit passed through true ending and `/debug` remained available. |
| Evidence drawer | Polished | Derived from existing flags/items; Stage16-7B adds optional clue-schema parity for the current flag evidence without changing the view output. |
| Clue/evidence schema | Stage16-7H evidence identity regression guard committed and pushed | Optional `clues.yaml` parity adapter exists for current flag evidence; action/check-backed clues are covered by a small smoke slice; item-derived evidence stays in `items.yaml` by default; duplicate item/clue evidence is rejected; `relatives_wedding_rings` has the only item-backed authored clue; representative derived evidence IDs are now covered by a uniqueness regression test. |
| Log drawer | Polished | Structured UI entries derived from existing runtime log strings. |
| Status drawer | Committed and pushed in Stage 15 | Player-facing labels first, raw values as supporting detail, plus four-room carry-out selection. |
| Assets | Gated | Native UI/placeholders only unless later approval opens imports. |
| Scene 4+ AdventurePlayer support | Committed and pushed in Stage 15 | Uses existing scenario YAML and runtime helpers. |
| Post-ending save/replay spec | Stage16-5A-5C committed and pushed | Stage16-5A implements save/resume/history append; Stage16-5B implements the minimal ending progress/reward sheet; Stage16-5C implements passive deterministic replay hints. |
| Akari relationship/contact record | Stage17B-2 committed and pushed; Stage17C audit hardening prepared locally | The post-ending AdventurePlayer card is deterministic, static/read-only, completed-history-derived, and explicitly not an AI chat or messenger feature. |
| Browser/UI audit tooling | Stage17C hardening prepared locally | `npm run audit:adventure-player` covers `/`, mobile/drawer/story/choice/save/post-ending controls, post-ending relationship/contact copy, multiple viewports, and `/debug`; evidence stays in `.runtime/`. |
| Autonomous development workflow | Software Development Agent Orchestra template committed and pushed | `docs/codex-autonomous-workflow.md` remains the policy layer; `docs/workflows/software-development-orchestra.md` is the practical software stage template. |
| AI GM / free input | Out of scope | Future layer after deterministic core. |
| Real player-facing save UX | Stage16-5A implemented and pushed | LocalStorage-backed active-run restore, auto-save, completed history append-once, and restart behavior use existing storage helpers. |
| Tauri/API integration | Out of scope | No current implementation. |

## Open Decisions

- Whether the historical handoff/ledger/archive docs now gathered under `docs/archive/uncommitted-docs/` should remain as local source copies after the `shiki-work-archive` save, be removed locally later by Shiki, or be selectively committed.
- Whether Stage16's later replay UX should remain a minimal localStorage-backed player surface or later expand into a richer persistence/reward layer.
- Whether any future Stage17 relationship/contact interaction should exist at all; the current committed card is intentionally static/read-only, and any real interaction needs a separate docs-first stage.
- Whether older `.runtime/stage14r3-ui-audit.cjs`, `.runtime/stage15-adventureplayer-ui-audit.cjs`, and `.runtime/stage16-5a-ui-audit.cjs` should remain local-only historical evidence or be deleted after the Stage16-6 runner is committed.

## Next Safe Stages

1. Stage17E Publication Or Preservation: commit/push, NextChat Full, or Obsidian Git only with Shiki's explicit trigger; keep historical untracked docs out unless explicitly included.
2. If Stage17 continues beyond the static record card, define a separate docs-first Stage17B-3 interaction decision before adding any real contact action, message UI, AI chat, notification, storage migration, or route/reward change.
3. Decide separately whether to leave or remove the local source copies under `docs/archive/uncommitted-docs/`; they are already copied to `shiki-work-archive` at `97cad34`.

## Update Rule

When adding a new progress entry, include:

- date and stage name,
- commit hash if already committed,
- status: committed, uncommitted, deferred, or blocked,
- changed areas,
- verification results,
- decisions made,
- next safe stage.

Keep raw logs, browser traces, screenshots, and archive blobs out of this file.
Point to `.runtime/` or `.context-archive/` only when the path is useful evidence.
