# Stage18A Implementation Ticket - Akari Contact Eligibility Detail

Created: 2026-06-10 JST

Use this as the next executable implementation prompt after the Stage18
docs-first active-contact contract is accepted.

## Objective

Add a deterministic, record-only Akari contact eligibility detail to the
existing post-ending AdventurePlayer relationship/contact card.

This is not a message feature. The goal is to make the current record surface
clearer: the card may explain why a contact-facing trace exists, but it must
also make clear that the surface is still derived from reached records and is
not a send/reply channel.

## Read First

- `AGENTS.md`
- `docs/codex-autonomous-workflow.md`
- `docs/workflows/software-development-orchestra.md`
- `docs/stage18-active-contact-contract-2026-06-10.md`
- `docs/stage17-completion-contract-2026-06-10.md`
- `docs/stage17-completion-audit-2026-06-10.md`
- `docs/stage17b-3-contact-interaction-decision.md`
- `docs/stage17-contact-relationship-system-spec.md`
- `docs/development-progress.md`

Read-only source context:

- `components/adventure/AdventurePlayer.tsx`
- `lib/scenarios/relationship-contact-record.ts`
- `tests/scenario-regression.test.ts`
- `scripts/adventure-player-ui-audit.cjs`

## Target Scope

Allowed implementation files:

- `components/adventure/AdventurePlayer.tsx`
- `scripts/adventure-player-ui-audit.cjs`
- `tests/scenario-regression.test.ts` only if TypeScript copy/helper coverage is
  needed
- `lib/scenarios/relationship-contact-record.ts` only if the safest place for
  the deterministic detail text is the existing helper

Allowed docs:

- `docs/development-progress.md`
- `docs/implementation-notes.md` only for implementation decisions not already
  covered by `docs/stage18-active-contact-contract-2026-06-10.md`

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
- production asset import;
- Git commit/push, tag, release, PR, NextChat Full, Obsidian Git, archive
  cleanup, or file deletion.

## Context Handling

Preserve exactly:

- `/` remains `AdventurePlayer`.
- `/debug` remains `ScenarioExplorer`.
- `EvidenceEntry[]` remains the AdventurePlayer-facing evidence boundary.
- The existing relationship/contact card remains completed-history-derived.
- The current record category names stay implementation-facing and must not
  appear in player text.

Use task excerpts:

- Stage18 contract definition and stop gates.
- Stage17 completion boundary.
- Current `RelationshipContactCard` markup.
- Current `relationship-contact-record.ts` copy helper.
- Current AdventurePlayer audit assertions around relationship/contact copy and
  enabled/focusable controls.

Omit:

- old Stage14-16 archive material;
- unrelated untracked handoff/archive docs;
- raw `.runtime/` evidence unless a new audit run creates fresh evidence.

## Constraints

- Prefer a static copy/detail addition over a new enabled control.
- If an enabled control is added, it must be exactly one expand/collapse details
  control with visible state change and audit coverage.
- Do not use placeholder links, console-only handlers, disabled-looking enabled
  controls, or hidden buttons.
- Do not show raw IDs such as `active_contact_record`, `return_with_akari`,
  `reward_akari_relationship_asset`, or `minase_akari` in player text.
- If using words like `送信` or `返信`, use them only as explicit negative copy
  such as `まだ送信や返信の機能ではありません。`
- Keep copy away from ownership, romance reward, prize, rescue reward, or
  always-callable framing.
- Preserve existing completed-run ranking and helper behavior unless a focused
  regression proves a local adjustment is necessary.

## Steps

1. Recheck worktree status and latest commit.
2. Inspect the existing Akari relationship/contact card and helper copy.
3. Choose the smallest implementation:
   - preferred: add one static negative/eligibility explanation sentence to the
     existing card;
   - acceptable: move that sentence into the helper if it is category-specific;
   - only if needed: add one expand/collapse details control with a visible
     outcome.
4. Update the AdventurePlayer audit so the card must remain record-only and
   must not gain enabled/focusable contact controls unless the chosen details
   control is explicitly audited.
5. Add or adjust focused tests only if helper behavior or category copy changes.
6. Update `docs/development-progress.md` with the implemented Stage18A result.
7. Update `docs/implementation-notes.md` only if the implementation required a
   decision not already covered by the Stage18 contract.

## Verification

Run:

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run audit:adventure-player
git diff --check
git status --short --branch --untracked-files=all
```

If scenario YAML/body is touched by mistake, revert that local change before
continuing. If it cannot be safely reverted because it overlaps Shiki's work,
stop and report.

## Done Criteria

- The Akari relationship/contact card has a clearer deterministic
  eligibility/detail explanation.
- The surface still has no message input, send/reply/call/contact action,
  notification, unread badge, messenger timeline, AI, RAG, generated reply, or
  storage/schema change.
- Every enabled player-facing control on the changed surface has a verified
  visible outcome.
- The AdventurePlayer audit verifies the card copy and interaction boundary.
- All verification commands pass, or any failure is reported with a narrowed
  fix/stop recommendation.

## Failure Handling

Stop before implementation if the work requires:

- new storage fields or localStorage migration;
- scenario YAML/body edits;
- ending condition, route gate, replay hint, reward, or canon changes;
- AI/RAG/model/external service calls;
- message input or send/reply/call behavior;
- a second contact surface outside the existing post-ending card;
- broad cleanup of unrelated untracked docs.

If tests fail because of the new Stage18A change, fix within the allowed scope
and rerun the relevant checks. If tests fail because of unrelated existing
state, report the failure and do not broaden scope.

## Report

Report:

- files changed;
- exact copy or UI behavior added;
- important boundaries preserved;
- verification commands and results;
- `.runtime/` audit evidence path if a new AdventurePlayer audit ran;
- current `git status --short --branch --untracked-files=all`;
- whether Git, NextChat, Obsidian, raw archive, network, dependency install, or
  external service actions were not run;
- the single safest next ticket after Stage18A.
