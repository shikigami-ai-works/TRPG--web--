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
- Latest committed revision: `cc28433 Polish stage14r investigation drawers`
- `main` is aligned with `origin/main` after the Stage 14R-3 push.
- Stage 14R-3 investigation drawer polish is committed and pushed.
- Post-push untracked preservation docs include the current Stage 14R-3 handoff/ledger in `docs/` and six older historical handoff/ledger files temporarily organized under `docs/archive/`.
- `.runtime/` and `.context-archive/` are local-only evidence/archive areas and should not be staged by default.

## Current Product Shape

- `/` renders the player-facing `AdventurePlayer`.
- `/debug` renders the original `ScenarioExplorer` debug/validation surface.
- The active player-facing route now covers scenes 1-7 of `kimidake_ga_oboeteiru_jiko` in the uncommitted Stage 15 work.
- Stage 15 removes the old player-facing stop at `scene_003_empty_house` and follows existing YAML scene transitions through the final scene.
- Scene 4+ support, ending resolution, and four-room carry-out selection are implemented in the player-facing adapter/UI layer without changing scenario YAML.
- The player-facing UI is deterministic. No AI GM, free input, AI narration, Tauri/API integration, or real player-facing save integration is in scope yet.

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

- Commit: uncommitted.
- Status: complete and verified locally; commit still pending.

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

- `npm run test`: PASS, 29 tests

## Area Status

| Area | Status | Notes |
| --- | --- | --- |
| Kimidake scenario contract | Stable | Current-spec and YAML are the source of truth. |
| ScenarioExplorer debug UI | Stable | Preserved under `/debug`. |
| AdventurePlayer scenes 1-7 | Verified in uncommitted Stage 15 | Browser/UI audit passed through true ending. |
| Evidence drawer | Polished | Derived from existing flags/items; metadata is easier to scan; no clue YAML yet. |
| Log drawer | Polished | Structured UI entries derived from existing runtime log strings. |
| Status drawer | Verified in uncommitted Stage 15 | Player-facing labels first, raw values as supporting detail, plus four-room carry-out selection. |
| Assets | Gated | Native UI/placeholders only unless later approval opens imports. |
| Scene 4+ AdventurePlayer support | Verified in uncommitted Stage 15 | Uses existing scenario YAML and runtime helpers. |
| AI GM / free input | Out of scope | Future layer after deterministic core. |
| Real player-facing save UX | Not started | Debug persistence exists; AdventurePlayer save UX is not integrated. |
| Tauri/API integration | Out of scope | No current implementation. |

## Open Decisions

- Whether the two untracked Stage 14R-3 post-push handoff/ledger docs should be committed as history, organized, or left local.
- Whether the six older untracked Stage 14R / Stage 14R-2 preservation docs now under `docs/archive/` should later be moved to Shiki's external storage, committed as history, or deleted.
- Whether Stage 15 should add a fuller post-ending reward/save UX later, beyond the current deterministic ending surface.
- Whether `.runtime/stage14r3-ui-audit.cjs` and `.runtime/stage15-adventureplayer-ui-audit.cjs` should remain local-only evidence or later become tracked reusable tooling under `scripts/`.
- When to formalize clue/evidence schema instead of deriving evidence from flags/items.

## Next Safe Stages

1. Decide what to do with the current untracked Stage 14R-3 handoff/ledger files.
2. Move or commit the temporary `docs/archive/` historical preservation files when Shiki chooses their final home.
3. Review and commit the Stage 15 code/docs with narrow pathspecs, keeping `.runtime/`, `.context-archive/`, and unrelated preservation docs out unless Shiki explicitly chooses otherwise.
4. Decide whether the current docs-only preservation work should be committed together with Stage 15 or kept separate.
5. Turn the local UI audit helper into tracked tooling only if Shiki explicitly approves that tooling stage.

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
