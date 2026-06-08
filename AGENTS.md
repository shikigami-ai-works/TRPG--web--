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
