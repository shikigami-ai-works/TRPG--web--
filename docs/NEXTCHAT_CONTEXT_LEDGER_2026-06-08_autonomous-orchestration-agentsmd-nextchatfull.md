# NextChat Context Ledger - 2026-06-08 - Autonomous Orchestration AGENTS.md

Created: 2026-06-08 JST

Raw transcript/archive status: unavailable from this Codex environment. This is
a best-effort ledger. It does not claim one-character-perfect transcript
preservation.

## Trigger

Shiki requested a bundled preservation action:

```text
Next, Chatful, Commit Push, Obsidian Git.
```

This was interpreted as:

- create a NextChat Full handoff/ledger pair;
- commit and push the current software repository state;
- save a graph-friendly Obsidian Git context note.

## Session Chronology

1. Shiki asked what to do after Stage16-7D.
2. Multiple sub-agents reviewed the next stage and converged on
   `Stage16-7E: item-backed authored clue docs-first decision`.
3. Shiki asked whether audit agents and orchestration could widen Codex's
   self-driving range.
4. The session used workflow-oriented skills and multiple sub-agents to design
   an expanded autonomous execution lane:
   - Main Orchestrator keeps responsibility.
   - Explorer handles read-only audits.
   - Worker is only for explicit disjoint write scopes.
   - Auditor reviews post-change risk.
   - Preserver handles nextchat, Obsidian Git, and long-session preservation.
5. Shiki asked to save the useful prompt in
   `D:\Codex\AI Automate Prompt\`.
6. A reusable prompt file was saved:

```text
D:\Codex\AI Automate Prompt\拡張自走レーン_監査エージェント運用プロンプト.md
```

7. Shiki asked how to combine the base prompt with Green, Yellow, and Red rules
   into one prompt. A single prompt template was provided in chat.
8. Shiki asked whether this belongs in repo `AGENTS.md`. The answer was that the
   whole long prompt should not be pasted there, but a short pointer/rule can be
   useful.
9. Shiki explicitly asked to write the `Autonomous Orchestration` rule into this
   repository's `AGENTS.md` and said orchestration should always activate.
10. `AGENTS.md` was updated with a short `Autonomous Orchestration` section.
11. Shiki asked for a reusable prompt to turn orchestration on in other repos.
12. A second reusable prompt file was saved:

```text
D:\Codex\AI Automate Prompt\他リポジトリ用_オーケストレーション常時オン導入プロンプト.md
```

## Active Project Instruction Change

`AGENTS.md` now includes:

```text
## Autonomous Orchestration
```

The section establishes:

- lightweight autonomous orchestration as the default for nontrivial work;
- capability preflight and smallest-safe-stage selection;
- optional Explorer, Worker, Auditor, or Preserver sub-agent selection;
- reference to `docs/codex-autonomous-workflow.md`;
- reference to the saved prompt template outside the repo;
- explicit safety boundaries for commit, push, deletion, story canon, route
  gates, storage schemas, and external services.

## External Prompt Assets

The external prompt folder now contains at least these relevant files:

```text
D:\Codex\AI Automate Prompt\拡張自走レーン_監査エージェント運用プロンプト.md
D:\Codex\AI Automate Prompt\他リポジトリ用_オーケストレーション常時オン導入プロンプト.md
```

These are outside the software repository. They should not be reported as repo
tracked files unless Shiki later asks to version them elsewhere.

## Current Git Context

Baseline observed before this bundle:

```text
5fe992b Add stage16-7d action check clues
```

The current worktree had many older untracked handoff/archive files. They are
historical and out of scope for this bundle.

Intended commit scope:

```text
AGENTS.md
docs/NEXT_CHAT_HANDOFF_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md
docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md
```

## Verification Plan

For this docs/project-instructions-only bundle:

```powershell
git diff --check -- AGENTS.md docs/NEXT_CHAT_HANDOFF_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md
git diff --cached --stat
git log -1 --oneline
```

Full app checks are unnecessary unless implementation files are changed.

## Risks And Boundaries

- Older untracked handoff/archive docs remain in the worktree and must not be
  staged accidentally.
- `D:\Codex\AI Automate Prompt\` is outside this repo; those prompt files were
  saved locally, not committed here.
- Expanded autonomy is a workflow rule, not permission to bypass user approval.
- Git push and Obsidian Git are allowed in this bundle only because Shiki
  explicitly requested them.

## Resume Notes

After this bundle, the next product stage should remain:

```text
Stage16-7E: item-backed authored clue docs-first decision
```

Use the new `Autonomous Orchestration` section for nontrivial future work:

- run lightweight preflight;
- choose one safe stage;
- select agents only when useful;
- keep Red-zone work behind explicit Shiki approval.
