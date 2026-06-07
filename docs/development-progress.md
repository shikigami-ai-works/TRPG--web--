# Development Progress

Last updated: 2026-06-07 JST

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
- Latest Stage16 implementation revision: `76a9425 Add stage16-6 adventure UI audit runner`.
- Stage16-6 is committed and pushed.
- Stage 15 AdventurePlayer scene 1-7 flow is committed and pushed.
- Stage16-5A AdventurePlayer local save/resume and minimal post-ending record entry is committed and pushed.
- Stage16-5B ending progress/reward sheet is committed and pushed.
- Stage16-5C deterministic replay hints are committed and pushed.
- Stage16-6 reusable AdventurePlayer browser/UI audit runner is committed and pushed.
- Stage16-7A clue/evidence schema design is committed and pushed.
- Post-push untracked preservation docs include Stage 14R historical handoff/ledger files, the Stage16 prompt handoff/ledger pair, `docs/archive/`, and `docs/scenario-choice-planning-kimidake_ga_oboeteiru_jiko.md`; keep them out of Stage16 spec commits unless Shiki explicitly chooses otherwise.
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

## Area Status

| Area | Status | Notes |
| --- | --- | --- |
| Kimidake scenario contract | Stable | Current-spec and YAML are the source of truth. |
| ScenarioExplorer debug UI | Stable | Preserved under `/debug`. |
| AdventurePlayer scenes 1-7 | Committed and pushed in Stage 15 | Browser/UI audit passed through true ending and `/debug` remained available. |
| Evidence drawer | Polished | Derived from existing flags/items; metadata is easier to scan; no clue YAML yet. |
| Clue/evidence schema | Stage16-7A docs-only design complete | Future minimum unit is `clue`; `evidence` remains current-run view output. No schema file or code change yet. |
| Log drawer | Polished | Structured UI entries derived from existing runtime log strings. |
| Status drawer | Committed and pushed in Stage 15 | Player-facing labels first, raw values as supporting detail, plus four-room carry-out selection. |
| Assets | Gated | Native UI/placeholders only unless later approval opens imports. |
| Scene 4+ AdventurePlayer support | Committed and pushed in Stage 15 | Uses existing scenario YAML and runtime helpers. |
| Post-ending save/replay spec | Stage16-5A-5C committed and pushed | Stage16-5A implements save/resume/history append; Stage16-5B implements the minimal ending progress/reward sheet; Stage16-5C implements passive deterministic replay hints. |
| Browser/UI audit tooling | Stage16-6 committed and pushed | `npm run audit:adventure-player` covers `/`, post-ending guarantees, existing post-ending controls, and `/debug`; evidence stays in `.runtime/`. |
| AI GM / free input | Out of scope | Future layer after deterministic core. |
| Real player-facing save UX | Stage16-5A implemented and pushed | LocalStorage-backed active-run restore, auto-save, completed history append-once, and restart behavior use existing storage helpers. |
| Tauri/API integration | Out of scope | No current implementation. |

## Open Decisions

- Whether the two untracked Stage 14R-3 post-push handoff/ledger docs should be committed as history, organized, or left local.
- Whether the six older untracked Stage 14R / Stage 14R-2 preservation docs now under `docs/archive/` should later be moved to Shiki's external storage, committed as history, or deleted.
- Whether Stage16's later replay UX should remain a minimal localStorage-backed player surface or later expand into a richer persistence/reward layer.
- Whether older `.runtime/stage14r3-ui-audit.cjs`, `.runtime/stage15-adventureplayer-ui-audit.cjs`, and `.runtime/stage16-5a-ui-audit.cjs` should remain local-only historical evidence or be deleted after the Stage16-6 runner is committed.
- Whether to implement Stage16-7B as the optional `clues.yaml` parity adapter for the existing `FLAG_EVIDENCE` definitions.
- Whether the remaining untracked NextChat/handoff/archive docs should stay local, be archived elsewhere, or be committed separately.

## Next Safe Stages

1. Stage16-7B: optional `clues.yaml` parity adapter for current derived flag evidence, with no replay hint copy/storage/route changes.
2. Decide separately what to do with historical untracked handoff/ledger/archive docs; do not mix that cleanup into Stage16 specs by default.

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
