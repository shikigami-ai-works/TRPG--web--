# NextChat Context Ledger - Software Development Orchestra

Created: 2026-06-08 JST

Status: current resume ledger. This is a best-effort NextChat Full preservation
record. Exact raw transcript preservation is unavailable for this run because
the available Codex session JSONL contains hidden developer/system instructions
and must not be archived into project or Obsidian artifacts.

## Trigger

Shiki requested:

```text
Next Chatful Obsidian Git
```

Treat this as:

- `Next Chatful` = `NextChat Full`
- create project-local resume artifacts;
- then save the appropriate context to Obsidian Git;
- do not run software repo `Git push`, because `Git push` was not requested.

## Active Persona And Project Rules

- Persona: Mei Earthlight. Use `うち` as first person and `ッス` tone.
- User: Shiki / `しき`.
- Project root: `D:\Codex\TRPG--web--`.
- `/` remains `AdventurePlayer`.
- `/debug` remains `ScenarioExplorer`.
- `EvidenceEntry[]` remains the player-facing evidence boundary.
- Do not change scenario YAML/body, route gates, storage schema, or ending
  conditions unless explicitly reopened.
- `.runtime/` and `.context-archive/` remain local-only and are not staged by
  default.
- Ordinary `nextchat` now means NextChat Full by default; lightweight
  handoff-only behavior requires explicit wording.

## Chronology Since The Latest Push

1. Stage16-7F was committed and pushed:
   - Commit: `ec9b3ac Add stage16-7f wedding rings clue`
   - Remote: `origin/main`
   - Final pushed state: `main...origin/main`
2. Shiki asked how to make software development more autonomous with agent
   orchestration.
3. Codex created the docs-only Software Development Agent Orchestra workflow:
   - New file: `docs/workflows/software-development-orchestra.md`
   - Updated: `docs/codex-autonomous-workflow.md`
   - Updated: `docs/development-progress.md`
4. Agent Orchestration was used:
   - Explorer A reviewed existing workflow docs and approval gates.
   - Explorer B reviewed missing sections, role granularity, verification, and
     record destinations.
   - Auditor reviewed the result and identified one `nextchat` semantics drift.
5. Codex fixed the drift in `docs/codex-autonomous-workflow.md`:
   - bare `nextchat` now routes to NextChat Full by default;
   - lightweight handoff-only is explicit-only.
6. Shiki asked to add some Japanese to the pasted workflow text.
7. Codex added Japanese support to
   `docs/workflows/software-development-orchestra.md`:
   - Japanese title;
   - bilingual headings;
   - short `日本語メモ` sections;
   - Japanese role labels for Explorer / Worker / Auditor / Preserver;
   - Japanese labels for self-drive levels.
8. Shiki requested `Next Chatful Obsidian Git`, triggering this preservation
   run.

## Current Working Tree

Important local changes at preservation time:

- Modified:
  - `docs/codex-autonomous-workflow.md`
  - `docs/development-progress.md`
- Untracked:
  - `docs/workflows/software-development-orchestra.md`
  - this ledger file
  - the matching next-chat handoff file
  - pre-existing historical NextChat/archive docs and `docs/archive/`

Do not use a broad `git add docs`. If Shiki later says `Git push`, stage only
the intended docs for the workflow update and this preservation bundle unless
Shiki explicitly includes the older historical files.

## New Workflow Document

Path:

```text
docs/workflows/software-development-orchestra.md
```

Purpose:

- practical operating template for software development with Agent
  Orchestration;
- keeps `docs/codex-autonomous-workflow.md` as the higher-level policy layer;
- defines how Codex should split work into stages, assign agents, verify, and
  report.

Key sections:

- `Main Orchestrator / 司令塔`
- `Self-Drive Levels / 自走レベル`
- `Stage Prompt Loop / 工程プロンプト`
- `Standard Agent Orchestra / 標準エージェント編成`
- `Repo Operating Template / リポジトリ運用テンプレ`
- `Verification Matrix / 検証表`
- `Record Matrix / 記録先`
- `Git / NextChat / Obsidian Boundaries / 保存・公開境界`
- `Copyable Orchestration Prompt / コピペ用プロンプト`
- `Stop Conditions / 停止条件`
- `Completion Report Shape / 完了報告`

## Verification Performed

Docs-only verification:

- `git diff --check`: PASS with LF-to-CRLF warnings only.
- Trailing-whitespace scan for
  `docs/workflows/software-development-orchestra.md`: PASS.

Runtime tests/build were intentionally not rerun for the workflow text update,
because no product code, scenario data, route gate, storage schema, or runtime
behavior changed.

## Raw Archive Status

Raw archive: unavailable / intentionally omitted.

Reason:

- Codex session JSONL files were discoverable under
  `C:\Users\sakur\.codex\sessions\2026\06\08\`.
- A targeted search showed those JSONL files include hidden developer/system
  prompt material.
- The NextChat Full rules forbid storing hidden prompts in user-visible project
  or Obsidian artifacts.

Therefore this run preserves a high-fidelity ledger and handoff, but does not
claim one-character-perfect raw transcript preservation.

## Obsidian Git Save

Requested in the same user command. The Obsidian note should summarize this
ledger, link to the project and workflow concepts, and avoid raw transcript or
hidden prompt material.

Expected Obsidian note path:

```text
Codex/Projects/TRPG--web--/2026-06-08-software-development-orchestra-nextchatfull.md
```

Expected graph links:

- `[[Codex Index]]`
- `[[TRPG--web-- Index]]`
- `[[Software Development Agent Orchestra]]`
- `[[NextChat Full]]`
- `[[Obsidian Git]]`

## Next Chat Resume Prompt

Use this in the next Codex session:

```text
Resume D:\Codex\TRPG--web--.

Read first:
- AGENTS.md
- docs/codex-autonomous-workflow.md
- docs/workflows/software-development-orchestra.md
- docs/development-progress.md
- docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_software-development-orchestra-nextchatfull-obsidiangit.md
- docs/NEXT_CHAT_HANDOFF_2026-06-08_software-development-orchestra-nextchatfull-obsidiangit.md

Current state:
- Stage16-7F is pushed as ec9b3ac.
- The software development Agent Orchestra workflow docs are local and uncommitted.
- The workflow doc has Japanese support added.
- NextChat Full raw archive is unavailable because the available session JSONL includes hidden developer/system prompt material.
- Obsidian Git save was requested and should be verified from the previous final report.

Do not stage older untracked NextChat/archive docs unless Shiki explicitly asks.

Safest next step:
- If Shiki says Git push, stage only the intended workflow docs and preservation docs, inspect staged diff, commit, and push.
- Otherwise continue from the workflow template using one Stage Prompt at a time.
```

## Open Risks

- Many historical handoff/ledger/archive docs remain untracked in `docs/`.
- The workflow update is not yet committed to the software repository.
- Raw transcript archive is intentionally unavailable for this preservation
  run.
