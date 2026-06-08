# Next Chat Handoff - 2026-06-08 - Stage16-7E Agent Orchestration

Created: 2026-06-08 JST

Raw transcript/archive status: unavailable from this Codex environment. This is
a best-effort NextChat Full handoff based on visible session state and local
repository evidence. Hidden system/developer prompts, credentials, and unrelated
tool output are not included.

This handoff was created as part of Shiki's bundled request:

```text
エージェントを使って走るためのプロンプトを。教えてください。
Nextchat full git push obsidian-git
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
41aff85 Add autonomous orchestration project rule
```

## What Was Done

Stage16-7E was completed as a docs-only item-backed clue decision:

- Added `docs/stage16-7e-item-backed-authored-clue-decision.md`.
- Evaluated every item in `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`.
- Decided not to blanket-migrate item-derived evidence into `clues.yaml`.
- Kept item-derived evidence from `items.yaml` by default.
- Preserved only `relatives_wedding_rings` as a possible future item-backed
  authored clue candidate.
- Deferred implementation until a later Stage16-7F request.

The next agent orchestration prompt was saved at:

```text
docs/stage16-7f-a-agent-orchestration-prompt.md
```

The recommended next stage is:

```text
Stage16-7F-A: duplicate evidence policy decision
```

This stage should decide whether item-backed authored clues suppress matching
inventory-derived evidence, or whether the `relatives_wedding_rings` clue should
remain deferred.

## Key Risk

Do not implement `relatives_wedding_rings` as an item-backed clue until duplicate
handling is decided.

Reason:

- `deriveEvidenceEntries` already appends inventory items as `item:<id>`.
- A single item-reveal authored clue can also format its evidence id as
  `item:<id>`.
- AdventurePlayer uses evidence entry ids as React keys.
- A naive clue addition can create duplicate player meaning and duplicate keys.

## Files In Scope For This Bundle

Stage and commit only these files unless Shiki explicitly widens scope:

```text
docs/development-progress.md
docs/implementation-notes.md
docs/stage16-7e-item-backed-authored-clue-decision.md
docs/stage16-7f-a-agent-orchestration-prompt.md
docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7e-agent-orchestration-nextchatfull.md
docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7e-agent-orchestration-nextchatfull.md
```

Do not automatically stage older untracked handoff/archive files:

```text
docs/NEXT_CHAT_HANDOFF_2026-06-07_*
docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_*
docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7b-*
docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7c-*
docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7b-*
docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7c-*
docs/archive/
docs/scenario-choice-planning-kimidake_ga_oboeteiru_jiko.md
```

## Verification Already Passed

For Stage16-7E docs:

```text
git diff --check: PASS, LF-to-CRLF warnings only
trailing-whitespace scan: PASS
```

Runtime verification was intentionally not required because no code, scenario
YAML, storage schema, replay copy, route gate, or UI behavior changed.

## Boundaries To Keep

- Keep `/` as AdventurePlayer.
- Keep `/debug` as ScenarioExplorer.
- Do not change scenario body/prose.
- Do not change scene order, route gates, final-choice gates, or ending
  conditions.
- Do not extend `CompletedRunRecord`.
- Do not change Stage16-5C replay hint family names or visible copy.
- Do not add history-wide missing-evidence inference.
- Do not implement evidence board UX, deduction declaration, or new broad UI
  controls.
- Do not add AI GM, free input, AI narration, Figma, asset import, Tauri/API,
  cloud save, or external persistence.
- Do not stage or delete historical untracked preservation files unless Shiki
  explicitly opens that cleanup.

## Next Safe Stage

Use the saved prompt:

```text
docs/stage16-7f-a-agent-orchestration-prompt.md
```

The next safe work is docs-only:

```text
Stage16-7F-A: duplicate evidence policy decision
```

Do not start Stage16-7F implementation until Stage16-7F-A resolves duplicate
evidence/key handling or explicitly defers the item-backed clue.
