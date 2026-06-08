# Software Development Agent Orchestra Workflow

日本語名: ソフト開発エージェント・オーケストラ運用テンプレ

Created: 2026-06-08 JST

This document is the practical operating template for running software
development with Agent Orchestration in this repository. Use it when Shiki asks
Codex to work autonomously, use an orchestra, use agents together, or keep
software development moving with minimal back-and-forth.

日本語メモ: しきが短く「自走で進めて」「オーケストラで実装して」と投げたときに、Codex が工程を切り、必要なエージェントだけを使い、検証して報告するための実行票。

For project-wide autonomy policy, approval gates, and preservation boundaries,
see `docs/codex-autonomous-workflow.md`. This document is the execution sheet:
how to split one software task into stages, assign agents, verify the result,
and record the trail.

## 0. Activation / 起動条件

Use this workflow when Shiki says things like:

- `自走レーンで進めて`
- `Agent Orchestrationを使って`
- `オーケストラで実装して`
- `Explorer/Auditor込みで見て`
- `Stage Prompt作って、そのまま実行`
- `なるべく自走して`
- `次の安全なStageを選んで進めて`

Do not use the full ceremony for tiny one-command tasks, simple text edits, or
questions that can be answered directly.

## 1. Main Orchestrator / 司令塔

Codex main is always the Main Orchestrator.

The Main Orchestrator owns:

- Shiki's intent and the current objective.
- `AGENTS.md`, project instructions, current specs, handoff docs, and memory.
- Dirty worktree review and scope isolation.
- Stage Prompt creation before meaningful state changes.
- Agent selection and sub-agent task boundaries.
- Integration of agent results.
- Final diff review, verification, and user report.

Sub-agents provide evidence, patches, checks, or critique. Their output is
material, not authority. The Main Orchestrator decides what is adopted.

日本語メモ: サブエージェントは材料を出す担当。採用判断、差分統合、最終報告は Codex 本体が持つ。

## 2. Self-Drive Levels / 自走レベル

| Level | Name | Codex may do automatically | Stop or ask before |
| --- | --- | --- | --- |
| Green | Read / plan / verify / 読む・計画・検証 | Read docs/code, run local status/diff, build a stage plan, run local tests, summarize risks. | Any durable write outside the agreed stage. |
| Yellow | Narrow local implementation / 狭い実装 | Edit scoped files, add focused tests, update implementation notes or progress docs, run verification. | Broad refactors, storage/schema changes, route/canon changes, external services. |
| Red | Durable publication / 保存・公開 | Stage, commit, push, tag, release, PR, nextchat, Obsidian Git, external archive, dependency install. | Always require Shiki's explicit trigger and any required environment approval. |
| Black | Forbidden without a new stage contract / 新契約なし禁止 | Delete history, rewrite Git history, remove user work, change credentials/billing, perform irreversible external actions. | Must stop and get a direct instruction. |

Default behavior is Green -> one Yellow stage -> report. Red actions only happen
when Shiki explicitly asks, such as `Git push`, `nextchat`, or `Obsidian Git`.

## 3. Stage Prompt Loop / 工程プロンプト

Every nontrivial stage starts with a visible Stage Prompt. Execute only that
stage, then verify and report before starting the next one.

日本語メモ: 大きい依頼でも、実行単位は常に「次の1工程」。下流作業を混ぜない。

```text
Stage <N>: <short title>

Objective:
<One concrete outcome for this stage only. / この工程だけの具体的な成果>

Context:
<Facts, specs, prior commits, user decisions, and current repo state needed for this stage.>

Read First:
<Files, docs, handoffs, or source areas to inspect before editing.>

Target Scope:
<Files, directories, modules, or data this stage may edit.>

Out of Scope:
<Explicitly deferred downstream work. Do not mix it into this stage.>

Agent Orchestra:
- Main Orchestrator: <what Codex main owns>
- Explorer A: <docs/spec/handoff question, read-only>
- Explorer B: <code/data/test question, read-only>
- Worker: <owned files, if a disjoint write task is worth delegating>
- Auditor: <diff/test/scope review>
- Preserver: <disabled unless Shiki explicitly asks nextchat/Git/Obsidian>

Constraints:
<Project invariants, no-go zones, dirty worktree rules, approval gates.>

Steps:
1. <Action>
2. <Action>
3. <Action>

Verification:
<Commands, UI checks, review checks, or artifact checks required for this stage.>

Done Criteria:
<Observable state that means this stage is complete.>

Failure Handling:
<What to do if tests fail, scope expands, files are dirty, or approval is needed.>

Report:
<What to tell Shiki, what to record, and the safest next stage.>
```

## 4. Standard Agent Orchestra / 標準エージェント編成

Use only the smallest useful orchestra. Do not spawn every role just because it
exists.

| Role | Use when | Input | Output | Must not do |
| --- | --- | --- | --- | --- |
| Explorer A / 仕様探索 | Specs, docs, handoffs, product boundaries, approval gates matter. | Exact docs and questions. | Scope summary, stop conditions, recommended shape. | Edit files or re-plan the whole roadmap. |
| Explorer B / コード探索 | Code/data/tests need independent impact review. | Specific files, symbols, test areas. | Edit targets, nearest tests, risks. | Duplicate Explorer A or make broad architecture changes. |
| Worker / 実装担当 | A write task is isolated and ownership is clear. | Owned files and acceptance checks. | Patch or implementation summary. | Touch unowned files, revert other changes, broaden scope. |
| Auditor / 監査担当 | A stage changed behavior, docs, UI, data, or Git state. | Diff, intended scope, verification commands. | Findings, missing tests, scope drift, residual risk. | Rewrite the implementation unless asked. |
| Preserver / 保存担当 | Shiki says `nextchat`, `NextChat Full`, `Git push`, or `Obsidian Git`. | Exact preservation/publish request. | Handoff, archive, commit/push, or vault save. | Run by default or mix outputs into unrelated stages. |

Recommended defaults:

- Docs-only stage: Main + Explorer A + Auditor.
- Code stage: Main + Explorer A/B + Worker only if write ownership is clean + Auditor.
- UI stage: Main + Explorer B + Auditor with interaction checks.
- Publish/preserve stage: Main + Preserver, after status and staged diff review.

## 5. Repo Operating Template / リポジトリ運用テンプレ

Fill this block at the start of a project or before a long autonomous run.

```text
Project:
- Root:
- Primary branch:
- Remote:
- App/runtime:
- Main user-facing route or entrypoint:
- Debug/admin route or tool:

Read First:
- AGENTS.md:
- Current spec:
- Progress map:
- Implementation notes:
- Latest handoff:

Project Invariants:
- Keep:
- Do not change unless reopened:
- Local-only evidence areas:
- Generated output areas:

Autonomous Green Actions:
- <read, inspect, plan, verify>

Autonomous Yellow Actions:
- <scoped local edits, focused tests, docs updates>

Red Gate Actions:
- Git commit/push:
- NextChat / archive:
- Obsidian Git:
- External services:
- Dependency installs:
- Release/tag/PR:

Verification Commands:
- Docs:
- TypeScript/code:
- Scenario/data:
- UI:
- Build:
- Release:

Record Destinations:
- Specifications:
- Design decisions:
- Implementation notes:
- Progress:
- Handoff:
- Raw archives:
- Runtime evidence:
```

For this repository, the important project invariants currently include:

- `/` remains `AdventurePlayer`.
- `/debug` remains `ScenarioExplorer`.
- `EvidenceEntry[]` remains the AdventurePlayer-facing evidence boundary.
- Scenario YAML/body, route gates, storage schema, and ending conditions are not
  changed unless that stage explicitly reopens them.
- `.runtime/` and `.context-archive/` remain local evidence/archive areas and
  are not staged by default.

## Verification Matrix / 検証表

| Change type | Required checks |
| --- | --- |
| Docs-only workflow/spec update | `git diff --check`, changed-file review, `git status --short --branch`. |
| Scenario YAML or schema data | `npm run validate:scenarios`, relevant regression tests, `git diff --check`. |
| TypeScript logic | `npm run typecheck`, `npm run lint`, `npm run test`, `git diff --check`. |
| React/UI behavior | Typecheck, lint, tests, build, UI interaction audit, console/network failure check. |
| Build or packaging | Full tests, build, artifact inspection, changelog/release notes if distributing. |
| Git commit/push | `git status`, scoped diff, scoped staging, staged diff check, commit, push, post-push status. |
| NextChat Full/archive | Handoff, ledger when useful, raw archive when source exists, manifest, SHA-256, byte count, index check. |
| Obsidian Git | Project-local save first when needed, then vault save using explicit user request. |

## Record Matrix / 記録先

| Information | Record in |
| --- | --- |
| Fixed product/spec contract | `docs/*spec*.md` or current-spec file. |
| Comparison, rejected options, open design questions | Design decision docs or design log. |
| Implementation judgment not written in the spec | `docs/implementation-notes.md`. |
| What is done, in flight, and next | `docs/development-progress.md`. |
| Restart instructions for another session | `docs/NEXT_CHAT_HANDOFF_*.md`. |
| Context ledger or summarized preservation | `docs/NEXTCHAT_CONTEXT_LEDGER_*.md`. |
| Exact raw archive with source available | `.context-archive/` manifest, gzip, SHA-256, byte count. |
| Browser/CDP/test evidence not meant for Git | `.runtime/`. |

## Git / NextChat / Obsidian Boundaries / 保存・公開境界

These are separate deliverables.

- `Git push` means commit and push the software repository, after scoped status
  and diff review.
- `nextchat`, `NextChat Full`, `次チャット`, and related phrases mean create the
  project-local restart/preservation artifacts requested by the global rule.
- `Obsidian Git` means save appropriate context to the Obsidian vault.

Even in expanded autonomy, do not trigger these just because a stage completed.
They require Shiki's explicit wording.

## Copyable Orchestration Prompt / コピペ用プロンプト

Use this when starting a software stage:

```text
Use the Software Development Agent Orchestra Workflow.

Objective:
<one outcome>

Repo:
<path>

Read first:
- AGENTS.md
- docs/codex-autonomous-workflow.md
- docs/workflows/software-development-orchestra.md
- <current spec/progress/handoff>

Self-drive level:
<Green / Yellow / Red>

Agent orchestra:
- Main Orchestrator keeps final authority.
- Use Explorer A for docs/spec boundaries.
- Use Explorer B for code/data/test impact.
- Use Worker only if write ownership is isolated.
- Use Auditor for diff, scope, and verification.
- Use Preserver only if this prompt explicitly asks for Git/nextchat/Obsidian.

Target scope:
<allowed files/areas>

Out of scope:
<forbidden files/areas/downstream work>

Verification:
<commands/checks>

Stop if:
<scope broadens, tests fail in a way that changes design, approval gate appears>

Report:
<files changed, checks run, unverified items, git status, next safe stage>
```

## Stop Conditions / 停止条件

Stop and report before continuing if:

- The stage requires a broader schema, storage, route, or API contract than the
  prompt allowed.
- A sub-agent result conflicts with project instructions or user intent.
- Tests fail in a way that requires a product decision, not just a local fix.
- The worktree contains unrelated changes in files the stage needs to edit.
- A Red gate appears without explicit user wording.
- Verification cannot be defined or cannot run.

## Completion Report Shape / 完了報告

```text
Stage:
<title>

Changed:
- <file>: <what changed>

Preserved:
- <important boundaries not touched>

Verification:
- <command/check>: PASS/FAIL

Agent Orchestration:
- <agents used and what their outputs influenced>

Unverified:
- <anything not checked>

Current status:
- <git status summary>

Next:
- <one safest next stage>
```
