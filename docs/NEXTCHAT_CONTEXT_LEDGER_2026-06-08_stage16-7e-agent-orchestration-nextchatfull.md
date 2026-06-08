# NextChat Context Ledger - 2026-06-08 - Stage16-7E Agent Orchestration

- Date/time: 2026-06-08 JST
- Scope: current Stage16-7E item-backed clue decision, agent-orchestration prompt
  design, and bundled preservation request
- Source session: current Codex thread in `D:\Codex\TRPG--web--`
- Destination: repo-local docs, software Git push, and Obsidian Git note
- Status: best-effort ledger; exact raw transcript is unavailable from this
  Codex environment

## User Intent

- Surface request: Shiki asked for a prompt to run the next work using agents,
  then explicitly requested `Nextchat full git push obsidian-git`.
- Deeper purpose: preserve the current verified Stage16-7E state, create a
  reusable prompt for autonomous agent orchestration, push the software repo,
  and save a graph-friendly Obsidian context note.
- Success criteria:
  - the next agent prompt is available in repo docs;
  - NextChat handoff and context ledger exist;
  - only intended files are committed and pushed;
  - Obsidian Git note records the same context;
  - historical untracked docs remain untouched.

## User Instructions

- exact: "Stage16-7E: item-backed authored clue docs-first decision"
- exact: "blanket migration 禁止。runtime/storage/UI/replay hint/route gate/ending/scenario prose は変更しない。"
- exact: "出力: item別の判定表、追加候補がある場合は最大1件、実装するなら次 stage に分離。"
- exact: "次に持双できそうな範囲をエージェントオーケストラを使って考えてみて。"
- exact: "エージェントを使って走るためのプロンプトを。教えてください。"
- exact: "Nextchat full git push obsidian-git"

## Standing Instructions And Preferences

- Persona: respond as Mei Earthlight, using `うち`, casual `ッス` tone, and call
  the user `しき`.
- Project repo: `D:\Codex\TRPG--web--`.
- Git keyword rule: `Git push` means commit and push this software repo, not
  Obsidian Git.
- NextChat rule: `nextchat` / `NextChat Full` means create project-local
  handoff and context ledger; raw archive is only exact if a primary transcript
  source is available.
- Obsidian Git: save a graph-friendly note to the Obsidian vault and keep hub
  links.
- Preserve repo hygiene: do not stage unrelated historical handoff/archive docs.

## Chronology

1. Stage16-7E was requested as a docs-first item-backed authored clue decision.
2. `items.yaml`, `clues.yaml`, `lib/adventure/evidence.ts`, Stage16 clue docs,
   development progress, and implementation notes were reviewed.
3. `docs/stage16-7e-item-backed-authored-clue-decision.md` was created.
4. `docs/development-progress.md` and `docs/implementation-notes.md` were
   updated with Stage16-7E decisions.
5. Docs-only verification passed with `git diff --check` and a trailing
   whitespace scan.
6. Shiki asked what could be driven next using the agent orchestra.
7. Two Explorer subagents were spawned:
   - Explorer A checked docs/spec boundaries.
   - Explorer B checked code/data risk around evidence ids and duplicate keys.
8. Both Explorers converged on Stage16-7F-A as the safest next stage: decide
   duplicate evidence policy before implementation.
9. Shiki asked for the agent-running prompt and bundled NextChat Full, Git push,
   and Obsidian Git.
10. `docs/stage16-7f-a-agent-orchestration-prompt.md` was created as the
    reusable next-stage prompt.

## Decisions And Rationale

- Decision: Stage16-7E remains docs-only.
  Reason: requested scope was a decision table, not implementation.
  Tradeoff: no runtime proof is needed, but Stage16-7F still needs a policy
  decision before code.

- Decision: do not blanket-migrate item evidence to `clues.yaml`.
  Reason: current inventory evidence already uses item name, description, and
  source scene.
  Tradeoff: item-backed clue authoring stays narrow and explicit.

- Decision: preserve only `relatives_wedding_rings` as a possible future
  item-backed clue candidate.
  Reason: the item source and player-facing acquisition source differ enough to
  justify better authored source context later.
  Tradeoff: implementation is deferred.

- Decision: next autonomous stage should be Stage16-7F-A duplicate evidence
  policy, not Stage16-7F implementation.
  Reason: an item-reveal clue can generate `item:<id>`, while inventory-derived
  evidence also uses `item:<id>`, risking duplicate meaning and React key
  duplication.
  Tradeoff: one more docs stage before a small implementation.

## Artifacts And Pointers

Created:

- `docs/stage16-7e-item-backed-authored-clue-decision.md`
- `docs/stage16-7f-a-agent-orchestration-prompt.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7e-agent-orchestration-nextchatfull.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7e-agent-orchestration-nextchatfull.md`

Modified:

- `docs/development-progress.md`
- `docs/implementation-notes.md`

Referenced:

- `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/clues.yaml`
- `lib/adventure/evidence.ts`
- `components/adventure/AdventurePlayer.tsx`
- `tests/adventure-view-model.test.ts`
- `docs/codex-autonomous-workflow.md`

Raw archive:

- unavailable; no exact transcript/session primary source is exposed in this
  Codex environment.

## Verification

- `git diff --check -- docs\development-progress.md docs\implementation-notes.md`:
  PASS, LF-to-CRLF warnings only.
- trailing-whitespace scan for Stage16-7E changed docs: PASS.
- Runtime tests: intentionally not run for docs-only Stage16-7E.
- CodeGraph: unavailable because this repo is not initialized with CodeGraph.

## Current Git State Before Commit

Observed before this handoff bundle:

```text
## main...origin/main
 M docs/development-progress.md
 M docs/implementation-notes.md
?? docs/stage16-7e-item-backed-authored-clue-decision.md
```

There are many pre-existing untracked historical handoff/archive docs. They are
not part of this bundle unless explicitly selected.

## Risks And Open Questions

- Stage16-7F implementation is not safe until duplicate evidence/key policy is
  decided.
- If authored item clues suppress inventory evidence, `lib/adventure/evidence.ts`
  needs a small precedence rule plus focused tests.
- If implementation is deferred, current item-derived evidence remains valid.
- Historical untracked handoff/archive docs remain unresolved repo hygiene noise.

## Next Actions

1. Commit and push only the intended Stage16-7E/prompt/handoff/ledger files.
2. Save this context to Obsidian Git.
3. In the next working session, run the prompt in
   `docs/stage16-7f-a-agent-orchestration-prompt.md`.

## Resume Prompt

```text
Read D:\Codex\TRPG--web--\docs\stage16-7f-a-agent-orchestration-prompt.md and
execute Stage16-7F-A as a docs-only duplicate evidence policy decision.
Use Explorer agents for docs/spec and code/data read-only checks, then write the
policy doc only after integrating their results. Do not implement
`relatives_wedding_rings` clue yet. Keep `/` as AdventurePlayer, `/debug` as
ScenarioExplorer, preserve `EvidenceEntry[]`, do not change storage, replay
hints, route gates, endings, scenario prose, or old untracked handoff/archive
files. Verify with `git diff --check`, trailing-whitespace scan, and
`git status --short --branch`.
```
