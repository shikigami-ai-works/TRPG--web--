# Next Chat Handoff - 2026-06-08 - Autonomous Orchestration AGENTS.md

Created: 2026-06-08 JST

Raw transcript/archive status: unavailable from this Codex environment. This is
a best-effort NextChat Full handoff based on visible session state and local
repository evidence.

This handoff was created as part of Shiki's bundled request:

```text
Next, Chatful, Commit Push, Obsidian Git.
```

## Resume First

Run these first in `D:\Codex\TRPG--web--`:

```powershell
git status --short --branch
git log -5 --oneline
git remote -v
```

Expected latest baseline before this bundle:

```text
5fe992b Add stage16-7d action check clues
```

## What Changed

The project `AGENTS.md` now has an `Autonomous Orchestration` section.

The new rule makes lightweight autonomous orchestration the default for
nontrivial work in this repository:

- run a capability preflight;
- choose the smallest safe next stage;
- decide whether Explorer, Worker, Auditor, or Preserver sub-agents are useful;
- use `docs/codex-autonomous-workflow.md` and the saved external prompt template
  for expanded autonomous execution;
- keep commit, push, delete, story-canon changes, route-gate changes, storage
  schema expansion, and external services behind explicit instructions.

## External Prompt Files Created Before This Bundle

These files were saved outside the repo and are not part of the software commit:

```text
D:\Codex\AI Automate Prompt\拡張自走レーン_監査エージェント運用プロンプト.md
D:\Codex\AI Automate Prompt\他リポジトリ用_オーケストレーション常時オン導入プロンプト.md
```

They are reusable prompt templates for expanded autonomous execution and for
turning autonomous orchestration on in other repositories.

## Intended Commit Scope

Stage only these files for this bundle:

```text
AGENTS.md
docs/NEXT_CHAT_HANDOFF_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md
docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md
```

Do not stage the older untracked historical handoff/archive files unless Shiki
explicitly opens that cleanup.

## Boundaries To Keep

- Keep `/` as `AdventurePlayer`.
- Keep `/debug` as `ScenarioExplorer`.
- Do not change scenario body/prose, route gates, ending conditions, storage
  schemas, or `CompletedRunRecord`.
- Do not automatically stage or delete older untracked handoff/archive docs.
- Do not treat expanded autonomy as permission for Git push, Obsidian Git,
  nextchat, deletion, dependency installation, external services, or broad
  schema changes unless explicitly requested.

## Verification For This Bundle

Minimum expected verification:

```powershell
git diff --check -- AGENTS.md docs/NEXT_CHAT_HANDOFF_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_autonomous-orchestration-agentsmd-nextchatfull.md
git diff --cached --stat
git log -1 --oneline
```

Full app tests are not required for this docs/project-instructions-only change
unless additional source files are edited.

## Next Safe Work

After this bundle is pushed, the next TRPG product stage remains:

```text
Stage16-7E: item-backed authored clue docs-first decision
```

Recommended scope:

- decide whether any specific item-backed authored clue is justified;
- avoid blanket migration from `items.yaml`;
- keep runtime, storage, route gates, replay hints, and player UI unchanged;
- prefer docs-only unless one very small proof is clearly justified.
