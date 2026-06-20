# Codex Project Instructions

## Git Keyword Commands

- When the user says `Git push`, `Git up`, or `Git uｐ`, treat it as a request to commit and push the software project repository itself.
- For this workspace, the software repository is `D:\Codex\TRPG--web--`.
- The target remote is this project's own GitHub repository, currently `origin` at `https://github.com/shiki-ai-works/TRPG--web--`.
- Do not interpret these keywords as an Obsidian Git request.
- Before committing, inspect `git status` and the relevant diff, avoid staging unrelated user changes unless they are part of the requested work, then commit with a concise message and push the current branch to `origin`.
- If the user explicitly says `Obsidian Git`, save the context to the Obsidian vault instead.

## Global Next-Step Prompt Workflow

- Treat this as a standing workflow for this project: decide exactly one next step, write a careful executable prompt for that step, then execute that prompt.
- When work is broad or ambiguous, first choose the safest next step that moves the project forward without overreaching.
- The prompt should preserve intent and include objective, context, target files, constraints, verification commands, done criteria, and reporting expectations.
- After writing the prompt, immediately use it as the working instruction unless the user asks only for the prompt or tells Codex to pause.

## Autonomous Orchestration

- Treat lightweight autonomous orchestration as the default for nontrivial work in this project: run a capability preflight, choose the smallest safe next stage, and decide whether Explorer, Worker, Auditor, or Preserver sub-agents are useful before execution.
- When Shiki asks for expanded autonomous execution, use the project workflow in `docs/codex-autonomous-workflow.md` and the saved prompt template under `D:\Codex\AI Automate Prompt\拡張自走レーン_監査エージェント運用プロンプト.md`.
- Do not treat expanded autonomy as permission to commit, push, delete files, change story canon, alter route gates, expand storage schemas, or run external services without explicit instruction.

<!-- REPO_LOCAL_GIT_GUARD_START -->
## Repo-local Git Guard

- Treat this repository as software Git. `Git push`, `Git up`, and `Git uｐ` mean inspect this repository, commit only intended project changes, then push only when explicitly requested.
- Do not use `git add .`, `git add -A`, or broad wildcards. Run `git status --short --branch`, inspect relevant diffs, then stage only explicit paths with `git add -- <path>`.
- Keep preservation/archive material out of normal Git unless Shiki explicitly approves that exact material: raw chat/session exports, transcript bodies, rollout JSONL, huge logs, `.context-archive/`, `Nextchat_full_archive/`, `full_archive/`, `raw_archive/`, compressed archives, SQLite/DB indexes, and bulky evidence.
- Do not commit secrets or local runtime state: `.env*` except reviewed examples, API keys, tokens, passwords, recovery codes, private keys, browser profiles, cookies, caches, or generated local state.
- `docs/PROGRESS.md`, `docs/implementation-notes.md`, and small handoff pointers may be tracked when the project uses them, but raw snapshots and heavy evidence should stay out.
- If forbidden artifacts are already tracked, report them first. Do not run `git rm --cached`, delete files, rewrite history, commit, or push without explicit approval.
- Keep pre-existing dirty files separate from preservation-policy edits, and report what was left untouched.
<!-- REPO_LOCAL_GIT_GUARD_END -->
