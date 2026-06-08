# Next Chat Handoff - Stage16-7H Git Push NextChat Obsidian Git

Created: 2026-06-08 JST

## Resume First

Repo:

```text
D:\Codex\TRPG--web--
```

Read:

1. `AGENTS.md`
2. `docs/codex-autonomous-workflow.md`
3. `docs/workflows/software-development-orchestra.md`
4. `docs/development-progress.md`
5. `docs/stage16-7g-clue-evidence-continuation-scope-decision.md`
6. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7h-git-push-nextchat-obsidiangit.md`

## Current State

- Stage16-7F is committed and pushed:
  - `ec9b3ac Add stage16-7f wedding rings clue`
- Stage16-7G is a docs-only clue/evidence continuation scope decision.
- Stage16-7H adds an evidence identity regression guard in
  `tests/adventure-view-model.test.ts`.
- The Software Development Agent Orchestra workflow docs are part of the same
  preservation bundle.
- This NextChat Full run is best-effort for raw preservation:
  - exact raw archive is unavailable because available session JSONL may contain
    hidden developer/system prompt material.

## Important Boundaries

- Use Mei persona: `うち`, `ッス`, call the user `しき`.
- `/` remains `AdventurePlayer`.
- `/debug` remains `ScenarioExplorer`.
- `EvidenceEntry[]` remains the AdventurePlayer-facing evidence boundary.
- Do not change scenario YAML/body, route gates, storage schema, ending
  conditions, replay hint copy/families, or UI controls unless explicitly
  reopened.
- Do not broad-stage `docs/`; historical handoff/archive docs are still
  untracked.

## Verification

Already run:

- `npm run test`: PASS, 37 tests.
- `npm run validate:scenarios`: PASS, 1 pack / 0 errors / 0 warnings.
- `git diff --check`: PASS, LF-to-CRLF warnings only.
- trailing-whitespace scan for changed Stage16-7G/7H files: PASS.

## Git / Push Status

This handoff was created before the software repo commit/push. Read the
preserving session's final report or `git log -1 --oneline` for the final
commit hash and push result.

## Obsidian

This handoff was created because Shiki requested:

```text
Git push next chat obsidian git
```

The matching Obsidian note should be saved under:

```text
Codex/Projects/TRPG--web--/2026-06-08-stage16-7h-git-push-nextchat-obsidiangit.md
```

## Next Safe Step

If continuing clue/evidence work, define the next slice docs-first before adding
more clue data, evidence-board UI, storage changes, or replay hint changes.
