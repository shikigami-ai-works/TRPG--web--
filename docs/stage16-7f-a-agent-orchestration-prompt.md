# Stage16-7F-A Agent Orchestration Prompt

Created: 2026-06-08 JST

Use this prompt to run the next autonomous agent orchestra for
`D:\Codex\TRPG--web--`.

```text
Stage16-7F-A: duplicate evidence policy decision

Objective:
Decide the policy for item-backed authored clues when a revealed clue and
existing inventory-derived evidence refer to the same item. This is a docs-first
decision stage before implementing the `relatives_wedding_rings` item-backed
clue candidate.

Context:
- Current repo: D:\Codex\TRPG--web--
- `/` must remain AdventurePlayer.
- `/debug` must remain ScenarioExplorer.
- Stage16-7E already decided not to blanket-migrate item evidence into
  `clues.yaml`.
- Stage16-7E kept item-derived evidence from `items.yaml` by default.
- Stage16-7E preserved only `relatives_wedding_rings` as a possible one-clue
  Stage16-7F candidate.
- Current risk: a clue revealed by `item: relatives_wedding_rings` can produce
  the same `item:<id>` evidence id as inventory-derived evidence, which may
  create duplicate meaning and duplicate React keys.

Read first:
- docs/stage16-7e-item-backed-authored-clue-decision.md
- docs/stage16-7c-clue-authoring-scope-decision.md
- docs/stage16-7-clue-evidence-schema-design.md
- docs/development-progress.md
- docs/implementation-notes.md
- lib/adventure/evidence.ts
- components/adventure/AdventurePlayer.tsx
- tests/adventure-view-model.test.ts

Agent orchestra:
- Explorer A: read docs only. Confirm the current Stage16-7E decision,
  boundaries, and next safe stage. Output the policy options and stop
  conditions.
- Explorer B: read code/data only. Confirm where evidence ids are generated,
  where inventory-derived entries are appended, where Evidence entries are used
  as React keys, and what tests would need to cover the policy.
- Worker: docs-only. After Explorer results, write or update a Stage16-7F-A
  decision doc. Do not edit code, YAML, scenario prose, route gates, UI, storage,
  replay hints, or tests in this stage.
- Auditor: verify the docs-only output with `git diff --check`, a trailing
  whitespace scan, and `git status --short --branch`.
- Preserver: do nothing unless Shiki explicitly asks for `nextchat`,
  `NextChat Full`, `Git push`, or `Obsidian Git`.

Target output:
- A docs-only decision file, recommended path:
  `docs/stage16-7f-a-duplicate-evidence-policy-decision.md`
- Updates to `docs/development-progress.md` and `docs/implementation-notes.md`
  only if new decisions are made.
- A clear recommendation for the later Stage16-7F implementation.

Policy options to evaluate:
1. Allow duplicate entries.
   Reject unless there is a strong product reason, because duplicate player
   meaning and duplicate React keys are likely.
2. Give authored item-backed clues precedence over item-derived evidence.
   If a revealed clue has a single item reveal, suppress the inventory-derived
   entry for that same item.
3. Keep inventory-derived evidence and avoid item-backed clue implementation.
   Accept if the extra clue copy is not worth adapter complexity.

Recommended default:
Choose option 2 only if Stage16-7F implementation remains exactly one clue for
`relatives_wedding_rings`; otherwise choose option 3 and defer implementation.

Constraints:
- No blanket migration from `items.yaml` to `clues.yaml`.
- No more than one future item-backed clue candidate.
- No route gate, ending condition, scene order, final-choice gate, or scenario
  prose changes.
- No `CompletedRunRecord` extension.
- No history-wide missing-evidence inference.
- No evidence board, checklist, deduction declaration, or new enabled UI
  controls.
- No replay hint family or visible copy changes.
- No AI GM, free input, AI narration, Figma, assets, Tauri/API, cloud save, or
  external persistence.
- Do not stage or delete old untracked handoff/archive docs.

Verification:
- Docs-only: `git diff --check`, trailing-whitespace scan, and
  `git status --short --branch`.
- If code/YAML/tests are accidentally touched, stop and either revert only your
  own accidental edits or split the work into a separate Stage16-7F
  implementation request.

Done criteria:
- A future agent can tell whether Stage16-7F should implement
  `relatives_wedding_rings` with authored-clue precedence, or defer it.
- Duplicate evidence/key risk is explicitly resolved or explicitly deferred.
- The current Stage16 boundaries remain intact.

Failure handling:
- If the policy cannot be decided without changing runtime/storage/UI or route
  behavior, stop and report that Stage16-7F-A is blocked pending Shiki approval.
- If repo state contains unrelated untracked handoff/archive files, leave them
  untouched and report them as existing repo noise.

Report:
- Selected agents and their jobs.
- Decision made.
- Files changed.
- Verification commands and results.
- Important untouched boundaries.
- The next safest stage.
```
