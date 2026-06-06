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
- Latest committed revision: `3c13090 Polish stage14r player-facing completion`
- `main` is aligned with `origin/main` at the time this ledger was created.
- Current worktree includes uncommitted Stage 14R-3 player-facing drawer polish.
- Remaining untracked handoff/ledger files are historical preservation artifacts unless Shiki explicitly asks to commit or delete them.
- `.runtime/` and `.context-archive/` are local-only evidence/archive areas and should not be staged by default.

## Current Product Shape

- `/` renders the player-facing `AdventurePlayer`.
- `/debug` renders the original `ScenarioExplorer` debug/validation surface.
- The active player-facing slice covers scenes 1-3 of `kimidake_ga_oboeteiru_jiko`.
- Stage 14R stops at `scene_003_empty_house` after `akari_rested_in_empty_house`.
- Scene 4+ still exist in the scenario/runtime data but are not yet part of the player-facing `AdventurePlayer` slice.
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

Status: uncommitted at the time this ledger was created.

- Added structured `logEntries` derived from runtime `state.log`.
- Kept `state.log` strings intact to preserve the runtime/log contract.
- Rendered Log drawer entries as compact cards labeled `行動`, `判定`, `場面`, `結末`, or `記録`.
- Separated Evidence card category pills from source lines and labeled source as `出どころ`.
- Separated Status drawer primary labels from supporting numeric values such as `侵食値` and `信頼値`.
- Added focused regression coverage for initial note, scene transition, action, and check log categories.

Latest verification for this uncommitted Stage 14R-3 work:

- `npm run test`: PASS, 26 tests
- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings
- `npm run build`: PASS
- UI interaction audit: PASS at `390x844`, `430x932`, `1280x720`, and `1440x900`
- Console errors: 0
- Request failures: 0
- `git diff --check`: PASS, LF-to-CRLF warnings only

## Area Status

| Area | Status | Notes |
| --- | --- | --- |
| Kimidake scenario contract | Stable | Current-spec and YAML are the source of truth. |
| ScenarioExplorer debug UI | Stable | Preserved under `/debug`. |
| AdventurePlayer scenes 1-3 | Implemented | Player-facing deterministic first slice. |
| Evidence drawer | In polish | Derived from existing flags/items; no clue YAML yet. |
| Log drawer | In polish | Structured UI entries derived from existing runtime log strings. |
| Status drawer | In polish | Player-facing labels first, raw values as supporting detail. |
| Assets | Gated | Native UI/placeholders only unless later approval opens imports. |
| Scene 4+ AdventurePlayer support | Not started | Scenario data exists; player route is still scenes 1-3 only. |
| AI GM / free input | Out of scope | Future layer after deterministic core. |
| Real player-facing save UX | Not started | Debug persistence exists; AdventurePlayer save UX is not integrated. |
| Tauri/API integration | Out of scope | No current implementation. |

## Open Decisions

- Whether to commit the current Stage 14R-3 drawer polish.
- Whether the older untracked 2026-06-06 preservation docs should be deleted, committed as history, or left local.
- Whether Stage 14R should continue polishing scenes 1-3 or move to a Stage 14R-4 planning pass for scene 4+.
- Whether `.runtime/stage14r3-ui-audit.cjs` should remain local-only evidence or later become tracked reusable tooling under `scripts/`.
- When to formalize clue/evidence schema instead of deriving evidence from flags/items.

## Next Safe Stages

1. Commit current Stage 14R-3 drawer polish if Shiki asks for Git push / commit.
2. Decide what to do with old untracked handoff/ledger files.
3. Run a focused manual/playtest review of the player-facing scenes 1-3 flow.
4. Plan Stage 14R-4: extend AdventurePlayer beyond scene 3 or specify why the next slice should wait.
5. Turn the local Stage 14R UI audit helper into tracked tooling only if Shiki explicitly approves that tooling stage.

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
