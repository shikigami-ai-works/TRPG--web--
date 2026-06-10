# Stage19 Active Contact Scope Contract

Created: 2026-06-10 JST

Status: Stage19 docs-first closeout contract after Stage18A. This document
closes the Stage18A eligibility-detail implementation and defines the only
next scope that may be opened without a new contract.

## 0. Position

Stage19 starts from `cf308aa Add stage18a contact eligibility detail`.

Stage18A is complete: the Akari relationship/contact card now has a
deterministic, record-only eligibility detail derived from completed run
history and existing scenario metadata. The card remains static/read-only and
has no enabled or focusable contact controls.

Stage19 does not implement active communication. Its job is to close the
Stage18A result and decide whether any next work can proceed without opening
message, storage, AI, scenario, route, reward, or canon contracts.

## 1. Sources Surveyed

Stage19 reviewed:

- `AGENTS.md`
- `docs/codex-autonomous-workflow.md`
- `docs/workflows/software-development-orchestra.md`
- `docs/development-progress.md`
- `docs/stage18-active-contact-contract-2026-06-10.md`
- `docs/stage18-active-contact-implementation-ticket-2026-06-10.md`
- `docs/implementation-notes.md`
- `components/adventure/AdventurePlayer.tsx`
- `lib/scenarios/relationship-contact-record.ts`
- `scripts/adventure-player-ui-audit.cjs`
- `tests/scenario-regression.test.ts`

Observed repo state at Stage19 start:

- Branch: `main`
- Latest commit after fetch: `cf308aa Add stage18a contact eligibility detail`
- `HEAD`, `origin/main`, and `origin/HEAD` point to `cf308aa`
- The worktree contains unrelated untracked preservation, archive, and prompt
  docs. Stage19 does not clean, stage, move, or delete them.

CodeGraph note:

- The CodeGraph MCP server reported this project is not initialized.
- Stage19 did not run `codegraph init -i` because this stage is docs-only and
  native targeted reads were sufficient.

## 2. Stage18A Closeout Finding

Stage18A is complete and pushed at `cf308aa`.

The completed implementation:

- adds `eligibilityDetail` to `RelationshipContactRecord`;
- derives the detail from existing completed-run records and ending metadata;
- renders the detail as static text in the existing post-ending Akari card;
- keeps raw category IDs implementation-facing;
- keeps player-facing text away from ownership, prize, live chat, AI, and
  messenger framing;
- updates regression tests for category-specific eligibility details;
- updates the AdventurePlayer audit so the card must stay static/read-only and
  must have no enabled or focusable controls.

Stage18A did not add:

- message input;
- send, reply, generated-response, call, or contact actions;
- notification simulation or unread badges;
- messenger timeline or chat history;
- AI Akari, generated replies, free chat, RAG, model calls, or external
  services;
- `CompletedRunRecord` or localStorage schema migration;
- scenario YAML/body edits;
- route gate, ending condition, replay hint, reward, or story canon changes.

## 3. Stage19 Decision

The next scope may remain open only for static display, audit, and explanation
cleanup around the existing record-only Akari card.

Allowed without another contract:

- copy-only clarification that preserves the current record-derived meaning;
- static display polish inside the existing relationship/contact card;
- audit or regression guards that prove the card remains static/read-only;
- docs that explain the Stage18A closeout and active-communication boundary.

Not allowed without a separate contract:

- any real communication behavior;
- any new relationship state after a completed run;
- any new persistence shape, storage key, migration, or history schema;
- any generated reply, AI/RAG context, model call, or external service;
- any scenario, route, reward, replay-hint, or canon change.

日本語メモ: Stage19 の判断は「灯に連絡する機能へ進む」ではないッス。いま開いてよいのは、既存カードの静的な説明、監査、記録整理までッス。

## 4. Approved Next Minimal Ticket

Stage19 approves exactly one optional next implementation ticket:

```text
Stage19A: Static Contact Copy And Audit Polish
```

This ticket may be skipped if the current Stage18A copy and audit guard are
already sufficient. If executed, it must stay within static copy/audit polish
and must not add any contact action or new data contract.

The ticket is written in
`docs/stage19-active-contact-implementation-ticket-2026-06-10.md`.

## 5. Required Separate Contracts

Stop and create a separate docs-first contract before any work that requires:

- message input;
- send/reply/call/contact action;
- notification, unread badge, messenger, timeline, or chat history behavior;
- AI Akari, generated reply, free chat, RAG, model calls, or external services;
- `CompletedRunRecord` or localStorage schema migration;
- scenario YAML/body edits;
- route gate, ending condition, replay hint, reward, or story canon changes;
- a second contact surface outside the existing post-ending record card;
- enabled UI controls whose visible outcome is not already specified and
  covered by audit.

## 6. ASOC Result

Main Orchestrator kept final authority for Stage19.

Explorer work:

- confirmed Stage18A's implementation is record-only and static;
- confirmed the Stage18 contract already blocks active communication,
  storage/schema, AI/RAG, scenario, route, reward, and canon changes;
- confirmed the next allowed scope can stay static display/audit/explanation
  only.

Auditor work:

- confirmed Stage19 should not touch product code;
- confirmed unrelated untracked docs remain outside this stage;
- requires docs-only verification after this contract and progress ledger are
  written.

Worker and Preserver were not used:

- Worker was unnecessary because Stage19 writes one docs contract path and one
  related ticket path under Main Orchestrator control.
- Preserver was disabled because Git commit/push, NextChat Full, Obsidian Git,
  archive cleanup, and file deletion are forbidden in this stage.

## 7. Stage19 Completion Criteria

Stage19 is complete when:

- this contract exists;
- Stage18A is recorded as complete at `cf308aa`;
- the next stage boundary is limited to static display, audit, and explanation
  cleanup;
- exactly one optional next ticket exists, or the contract states that no next
  implementation is needed;
- active communication, storage/schema, AI/RAG, scenario, route, reward, and
  canon work remain closed;
- `docs/development-progress.md` reflects the Stage19 state;
- docs-only verification is recorded.

## 8. Verification

Verification is recorded in `docs/development-progress.md` and the Stage19
completion report for this cycle.
