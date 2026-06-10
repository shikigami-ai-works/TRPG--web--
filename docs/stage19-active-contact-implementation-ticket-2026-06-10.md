# Stage19A Implementation Ticket - Static Contact Copy And Audit Polish

Created: 2026-06-10 JST

Use this ticket only after the Stage19 scope contract is accepted. This is the
only implementation ticket Stage19 opens.

## Objective

Polish the existing static Akari relationship/contact record surface only if a
small clarification or audit guard is still needed after Stage18A.

This ticket must not implement communication with Akari. It may only adjust
static copy, static display structure, focused regression assertions, audit
assertions, or documentation around the existing eligibility detail.

## Read First

- `AGENTS.md`
- `docs/codex-autonomous-workflow.md`
- `docs/workflows/software-development-orchestra.md`
- `docs/stage18-active-contact-contract-2026-06-10.md`
- `docs/stage18-active-contact-implementation-ticket-2026-06-10.md`
- `docs/stage19-active-contact-scope-contract-2026-06-10.md`
- `docs/development-progress.md`
- `docs/implementation-notes.md`

Read-only implementation context:

- `components/adventure/AdventurePlayer.tsx`
- `lib/scenarios/relationship-contact-record.ts`
- `scripts/adventure-player-ui-audit.cjs`
- `tests/scenario-regression.test.ts`

## Target Scope

Allowed implementation files, only if needed:

- `components/adventure/AdventurePlayer.tsx`
- `lib/scenarios/relationship-contact-record.ts`
- `scripts/adventure-player-ui-audit.cjs`
- `tests/scenario-regression.test.ts`

Allowed docs:

- `docs/development-progress.md`
- `docs/implementation-notes.md` only if a new implementation judgment is made
  that is not already captured by the Stage18 or Stage19 contracts.

## Out Of Scope

Do not implement:

- message input;
- send, reply, generated-response, call, or contact actions;
- notification simulation or unread badges;
- messenger timeline or chat history;
- AI Akari, generated replies, free chat, RAG, model calls, or external
  services;
- cloud/account/cross-device persistence;
- `CompletedRunRecord` or localStorage schema migration;
- relationship state that changes after the completed run;
- scenario YAML/body edits;
- route gate, ending condition, replay hint, reward, or story canon changes;
- a second contact surface outside the existing post-ending card;
- Git commit/push, tag, release, PR, NextChat Full, Obsidian Git, archive
  cleanup, or file deletion.

## Constraints

- Prefer no code change if the Stage18A copy and audit already satisfy the
  Stage19 contract.
- If code changes are needed, keep them to static copy or static display only.
- Do not add an enabled control. If a future need for expand/collapse appears,
  stop and create a new UI interaction contract first.
- Do not show raw IDs such as `active_contact_record`, `return_with_akari`,
  `reward_akari_relationship_asset`, `minase_akari`, storage keys, route
  conditions, or reward IDs in player-facing copy.
- Keep player copy away from ownership, prize, romance reward, live chat,
  always-callable contact, AI chat, messenger, notification, and generated
  reply framing.
- Preserve `/` as `AdventurePlayer` and `/debug` as `ScenarioExplorer`.
- Preserve `EvidenceEntry[]` as the AdventurePlayer-facing evidence boundary.

## Steps

1. Recheck `git status --short --branch --untracked-files=all` and
   `git log -1 --oneline --decorate`.
2. Inspect the current Stage18A card copy, helper copy, test assertions, and
   audit assertions.
3. Decide whether a change is needed.
4. If no change is needed, record that Stage19A is skipped and stop.
5. If a change is needed, make exactly one small static copy/audit polish.
6. Update focused tests or audit assertions only if the changed copy requires
   it.
7. Update `docs/development-progress.md`.
8. Update `docs/implementation-notes.md` only for a new spec-missing
   implementation judgment.

## Verification

If docs-only:

```powershell
git diff --check
rg -n "^#|message input|send|reply|call|notification|unread|messenger|timeline|chat history|AI|RAG|CompletedRunRecord|localStorage|scenario YAML|route gate|ending condition|replay hint|reward|canon" docs/stage19-active-contact-scope-contract-2026-06-10.md docs/stage19-active-contact-implementation-ticket-2026-06-10.md docs/development-progress.md
git status --short --branch --untracked-files=all
```

If TypeScript, UI, tests, or audit tooling change:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:adventure-player
git diff --check
git status --short --branch --untracked-files=all
```

## Done Criteria

- Either no Stage19A implementation is needed, or exactly one small static
  copy/audit polish is complete.
- No active communication behavior is added.
- No storage/schema, AI/RAG, scenario, route, reward, replay hint, or canon
  contract is opened.
- Every enabled player-facing control in the touched surface still has a
  visible audited outcome.
- Verification passes or the failure is recorded with the next safe stop.

## Failure Handling

Stop before editing if the work requires:

- a contact action;
- new storage or migration behavior;
- generated or AI-backed text;
- scenario data or story changes;
- broader UI interaction design;
- cleanup of unrelated untracked docs;
- Git, NextChat, Obsidian, release, archive, or deletion work.

## Report

Report:

- whether Stage19A was skipped or changed files;
- any copy/audit adjustment made;
- boundaries preserved;
- verification commands and results;
- current git status;
- the next safest stage.
