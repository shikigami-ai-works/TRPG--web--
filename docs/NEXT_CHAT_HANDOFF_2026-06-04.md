# NEXT CHAT HANDOFF 2026-06-04

## Project

- Repo: `D:\Codex\TRPG--web--`
- Branch: `main`
- Pushed commit: `f18241ba0c6d30eb7197966b4efc6d49ee1af98f`
- Commit message: `Improve Kimidake UI labels and workflow docs`
- Push result: `main -> main` succeeded.
- Remote note: `origin` still points at `https://github.com/shiki-ai-works/TRPG--web--`; GitHub responded that the repository moved to `https://github.com/shikigami-ai-works/TRPG--web--.git`.
- Status before creating this handoff: `## main...origin/main` clean. This handoff file was created after the push, so it may appear as an untracked local file until intentionally committed.

## User Intent

しき wants Codex to keep advancing the TRPG web project autonomously, while using skills and agents deliberately at each stage. For broad work, Codex should write a concrete execution prompt for one safe stage, execute it, verify it, and continue. Scenario prose is explicitly mutable and should not be over-treated as a fixed contract.

## Completed In This Session

1. Refreshed `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`.
   - Updated the current-spec date to 2026-06-04.
   - Added 2026-06-02 Scene 7 final-choice / non-true route handoffs as latest verification references.
   - Clarified that old handoff Git state is historical, not a current instruction.
   - Added rules to check `scenario.yaml` `ending_resolution_order`, not only `endings.yaml`.
   - Recorded that `.runtime/` CDP helpers are local evidence, not tracked tooling.

2. Added `docs/codex-autonomous-workflow.md`.
   - Defines what Codex may do autonomously.
   - Requires explicit instruction for Git commit/push/tag/release/PR, Obsidian Git, nextchat, major canon/story changes, dependency/network work, and formalizing `.runtime` helpers.
   - Keeps scenario prose mutable and contract decisions anchored to current-spec, YAML, tests, and verified evidence.

3. Improved player-facing labels in `components/ScenarioExplorer.tsx`.
   - Added display-only label maps for stats, skills, action types, scene types, ending types, ruleset, profile name, scenario directory, counters, flags, and carry groups.
   - Replaced visible raw labels such as `strength`, `library_use`, `conversation`, `story`, `cthulhu_like`, `MVP investigator`, `KIMIDAKE_GA_OBOETEIRU_JIKO`, and `lost/good/true/normal`.
   - Kept YAML IDs, saved data, `ending_type` values, route logic, and `data-*` audit attributes unchanged.

4. Added `docs/ux-audit-kimidake-initial-ui-2026-06-04.md`.
   - Documents initial UI CDP audit.
   - Documents follow-up label fixes.
   - Documents full true route and non-true route UI checks.

5. Updated `docs/implementation-notes.md`.
   - Recorded Stage 7 through Stage 12 decisions and verification evidence.
   - Recorded why `.runtime` CDP helpers were not promoted into tracked `scripts/`.
   - Recorded the local helper expectation fix after ending type labels changed.

## Verification Already Run

- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm run build`: pass
- `npm run test`: 19/19 pass
- `npm run validate:scenarios`: 1 pack, 0 errors, 0 warnings
- `git diff --check`: pass, with LF -> CRLF warnings only
- Initial UI CDP: `.runtime/initial-ui-2026-06-04T08-40-32-751Z.json`
- True route CDP: `.runtime/scene7-ending-2026-06-04T08-42-14-579Z.json`
- Non-true routes CDP: `.runtime/scene7-nontrue-endings-2026-06-04T08-44-56-579Z.json`
- CDP routes reported 0 console errors, 0 network 404s, and 0 network failures.

## Important Boundaries

- Do not treat scenario prose as frozen. If prose changes, verify whether current-spec, YAML, tests, or UI contracts actually need updates.
- Do not auto-commit or auto-push unless しき explicitly asks again.
- Do not run Obsidian Git unless explicitly requested.
- Do not promote `.runtime/` CDP helpers into tracked tooling without a separate formalization task.
- Do not rewrite old handoffs; update current-spec or a new handoff instead.

## Current Local Caveat

This handoff file was created after commit `f18241ba0c6d30eb7197966b4efc6d49ee1af98f` was pushed. If the next chat checks `git status`, it should expect this file itself to be untracked unless the current chat/user commits it later.

## Suggested Next Stage

Stage 13: Low-frequency UI raw label sweep.

Objective:
Inspect latest CDP JSON `bodyTextSample`, full-route snapshots, and screenshots for any remaining player-visible raw IDs after the label-map improvements. Only fix display-layer labels. Do not edit scenario prose or YAML unless a visible label is impossible to improve without contract data.

Suggested checks:

- Search latest `.runtime/*2026-06-04T08-40*`, `08-42*`, and `08-44*` JSON for obvious raw snake_case in visible text fields.
- If UI code changes, run `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test`, `npm run validate:scenarios`, and relevant CDP helper(s).
- Update `docs/ux-audit-kimidake-initial-ui-2026-06-04.md` and `docs/implementation-notes.md` if decisions are made.

## Resume Prompt

```text
D:\Codex\TRPG--web-- を続けて。まず docs/NEXT_CHAT_HANDOFF_2026-06-04.md、docs/codex-autonomous-workflow.md、docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md を読んで、現在の git status を確認して。シナリオ本文は今後変わり得る前提で、本文だけを根拠に YAML/UI/tests を過剰同期しないで。次の安全な工程として Stage 13: Low-frequency UI raw label sweep を実行して。目的は、最新 CDP JSON とスクショに残るプレイヤー可視の raw ID を抽出し、必要なら ScenarioExplorer の表示層だけでラベル追加すること。YAML ID、保存形式、ending 解決、data-* 監査属性、シナリオ本文は変更しない。変更したら typecheck/lint/build/test/validate:scenarios と必要な CDP 監査を通し、implementation-notes と UX audit に判断を残して報告して。
```
