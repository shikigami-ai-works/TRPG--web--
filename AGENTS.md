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
