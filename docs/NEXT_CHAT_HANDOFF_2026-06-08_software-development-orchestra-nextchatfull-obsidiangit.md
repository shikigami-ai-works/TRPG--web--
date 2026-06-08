# Next Chat Handoff - Software Development Orchestra

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
5. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_software-development-orchestra-nextchatfull-obsidiangit.md`

## Current State

- Stage16-7F is committed and pushed:
  - `ec9b3ac Add stage16-7f wedding rings clue`
- The software development Agent Orchestra workflow template is local and
  uncommitted:
  - `docs/workflows/software-development-orchestra.md`
  - `docs/codex-autonomous-workflow.md`
  - `docs/development-progress.md`
- The workflow template now includes Japanese support:
  - Japanese title;
  - bilingual headings;
  - short `日本語メモ`;
  - Japanese labels for self-drive levels and agent roles.
- This NextChat Full run is best-effort only for raw preservation:
  - exact raw archive is unavailable because the available session JSONL
    includes hidden developer/system prompt material.

## Important Boundaries

- Use Mei persona: `うち`, `ッス`, call the user `しき`.
- `/` remains `AdventurePlayer`.
- `/debug` remains `ScenarioExplorer`.
- `EvidenceEntry[]` remains the AdventurePlayer-facing evidence boundary.
- Do not change scenario YAML/body, route gates, storage schema, or ending
  conditions unless explicitly reopened.
- Do not run software repo `Git push` unless Shiki explicitly asks.
- Do not broad-stage `docs/`; many historical handoff/archive docs are
  untracked.

## Verification Already Done

- `git diff --check`: PASS with LF-to-CRLF warnings only.
- Trailing-whitespace scan for
  `docs/workflows/software-development-orchestra.md`: PASS.
- No runtime tests were run for the workflow docs because this was docs-only.

## Next Safe Step

If Shiki says `Git push`:

1. Run `git status --short --branch`.
2. Stage only the intended workflow/preservation docs.
3. Inspect `git diff --cached --name-status` and `git diff --cached --check`.
4. Commit with a concise workflow/preservation message.
5. Push `main` to `origin`.

If Shiki continues development:

1. Use `docs/workflows/software-development-orchestra.md`.
2. Create one Stage Prompt.
3. Use only the smallest useful agent orchestra.
4. Verify and report before the next stage.

## Obsidian

This handoff was created because Shiki requested:

```text
Next Chatful Obsidian Git
```

The matching Obsidian note should be saved under:

```text
Codex/Projects/TRPG--web--/2026-06-08-software-development-orchestra-nextchatfull.md
```
