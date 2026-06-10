# Stage18 Active Contact Contract

Created: 2026-06-10 JST

Status: Stage18 docs-first active-contact contract. This document approves only
the next deterministic implementation ticket described here; it does not
approve message input, send/reply behavior, storage migration, AI, RAG,
messenger, notification, route/reward, or scenario changes.

## 0. Position

Stage18 starts after Stage17 closed as a passive Akari relationship/contact
record layer.

The current product surface is still deterministic, static/read-only, and
completed-history-derived. Stage18 exists to define the contract that must
exist before any active contact behavior is implemented.

Stage18 must not treat the Stage17 implementation-facing category
`active_contact_record` as a working message, reply, call, notification,
messenger, AI Akari, or RAG feature. In Stage17 it means only that a completed
run supports a preserved contact-facing record.

## 1. Sources Surveyed

Ticket 1 read these sources:

- `AGENTS.md`
- `docs/codex-autonomous-workflow.md`
- `docs/workflows/software-development-orchestra.md`
- `docs/stage17-completion-contract-2026-06-10.md`
- `docs/stage17-completion-audit-2026-06-10.md`
- `docs/stage17-contact-relationship-system-spec.md`
- `docs/stage17b-3-contact-interaction-decision.md`
- `docs/stage17b-4-passive-record-detail-audit-2026-06-10.md`
- `docs/development-progress.md`
- `docs/web-adv-v0-2-player-experience-spec.md`

Observed repo state:

- Current branch: `main`
- Latest observed commit: `86df8cb Close stage17 passive record layer`
- Dirty state: many unrelated untracked handoff/archive/prompt docs are
  present and are not part of this Stage18 contract file.

## 2. Boundary Findings

Stage17 completion establishes these facts:

- Akari's current post-ending surface is a passive relationship/contact record.
- The record is derived from completed-run history, ending metadata, rewards,
  final trust, and relationship labels already available in the project.
- The AdventurePlayer card is static/read-only and currently has no enabled or
  focusable contact controls.
- Stage17 did not add message input, send/reply/call/contact actions,
  notifications, unread badges, messenger timeline, chat history, AI Akari,
  generated replies, free chat, RAG, storage migration, route changes, reward
  changes, replay-hint changes, or scenario edits.
- Any continuation into active contact behavior requires a new docs-first
  contract before implementation.

The active-contact risk is semantic as much as technical. The phrase can mean:

1. A deterministic record or affordance that says contact may be possible.
2. A UI detail surface that explains why a contact-facing record is preserved.
3. A real communication feature with input, send, reply, notifications, AI, or
   timeline behavior.

Stage18 must choose and name exactly which meaning is allowed before code work
starts.

## 3. Stage18 Definition

For Stage18, `active contact` means:

```text
a deterministic, completed-record-derived eligibility and explanation layer for
whether a future player-visible contact affordance may exist.
```

It is not a message feature yet. It may define and later implement a small
record detail or affordance surface, but only if that surface:

- reads existing completed-run and ending metadata;
- does not mutate relationship state after the completed run;
- does not create a contact timeline;
- does not generate replies;
- does not add storage fields;
- gives every enabled UI control a visible user-observable outcome.

Stage18 deliberately chooses the first meaning from the Ticket 1 survey:

1. Allowed now: deterministic record eligibility and explanation.
2. Still gated: actual communication, storage expansion, messenger/AI behavior,
   route/reward/canon changes, or generated reply systems.

日本語メモ: Stage18 の active contact は、まだ「灯に送る」ではないッス。まずは「到達済み記録から、接触めいた表示を出してよいか」を説明できる契約と、次の最小UI候補を固定する段階ッス。

## 4. Stage18 Does Not Implement

Stage18 does not implement:

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

## 5. Product Meaning By Record Category

These category names remain implementation-facing. Player-facing copy must use
soft record language rather than raw category IDs.

| Category | Stage18 product meaning | Allowed UI implication | Forbidden implication |
| --- | --- | --- | --- |
| `active_contact_record` | Akari and the player returned with preserved relationship state. | The UI may say a returned-world contact-facing trace exists and may expose a deterministic details affordance. | Do not imply the player can already send a message, receive a reply, call Akari, or open a live chat. |
| `memory_contact_trace` | The player returned, but Akari did not; memory or promise trace remains. | The UI may explain that the trace remains as a memory/promise, not a live channel. | Do not promote high trust alone into returned-world contact. |
| `shared_boundary_record` | The player stayed with Akari beyond the boundary. | The UI may frame the bond as preserved together in the boundary. | Do not frame it as a phone/contact address in the returned world. |
| `lost_relationship_trace` | This run did not preserve Akari memory/contact state. | The UI may explain that this run left no contact trace while prior stronger records may still exist in history. | Do not erase previous completed records or imply a hidden route was unlocked. |
| `no_record` | No completed run supports an Akari record yet. | The UI may hide the surface or show a locked/no-record summary if consistent with surrounding post-ending UI. | Do not reveal unreached ending details, route IDs, or future contact states. |

## 6. Source-Of-Truth Boundary

Stage18 may read or rely on:

- completed run history filtered to the current scenario id;
- current and best Akari relationship/contact records already derived from
  completed history;
- ending metadata already available through the scenario data;
- reached ending title/type/result only when already visible to the player;
- unlock and reward labels after player-facing formatting;
- Akari NPC metadata: display name, contact capability, affection threshold,
  lost/contact flags, and companion capability;
- final trust from existing completed-run records;
- current Stage17 helper categories and history-wide ranking.

Stage18 must not read or infer active contact from:

- generated AI chat output;
- hidden system prompts, external memory, or model state;
- raw scenario prose as a storage contract;
- unreached ending descriptions;
- raw route-gate condition strings;
- localStorage internals or raw storage keys in player text;
- missing-route or missing-evidence inference across history;
- any value that requires extending `CompletedRunRecord`.

## 7. Storage And Schema Boundary

The next implementation ticket must not change `CompletedRunRecord`,
localStorage keys, storage migration, saved-run history shape, or cloud/account
sync.

If future work needs new storage, it requires a separate storage contract before
implementation. That contract must define:

- the exact new field names and versions;
- migration behavior for existing localStorage data;
- deletion/rollback behavior;
- privacy and export implications;
- regression tests for old and new records;
- how old completed runs map to the new fields without inventing contact state.

Until that contract exists, all Stage18 behavior must be derived from existing
records and current scenario metadata.

## 8. UI Boundary And Visible Outcomes

The safest Stage18 implementation shape is one deterministic detail affordance
or read-only detail surface. It may be static, or it may use exactly one
expand/collapse-style control if needed.

Allowed UI shapes:

- static explanatory detail under the existing post-ending Akari card;
- a disabled affordance with clear record-only copy, if the product needs to
  show that active communication is not open;
- one enabled details control that expands/collapses deterministic explanation
  text.

Any enabled control must have a visible user-observable outcome. Acceptable
outcomes are:

- details expand;
- details collapse;
- focus/ARIA state changes together with visible detail state;
- a deterministic post-ending sheet section opens or closes.

Forbidden enabled outcomes:

- console-only handlers;
- placeholder links;
- message boxes;
- send/reply/call buttons;
- unread badges;
- notification toggles;
- chat timelines;
- controls that imply Akari can be contacted without implementing a real,
  contracted outcome.

If no clear visible outcome is needed, the UI should remain static.

## 9. Copy Boundary

Keep Stage17's softer record language:

- `灯との縁`
- `残った記憶`
- `関係のしるし`
- `連絡先の痕跡`
- `戻る理由`
- `そばに残った記録`
- `到達済みの記録から読み取れる縁`

Stage18 may also use:

- `連絡先そのものではなく、記録として残った痕跡`
- `この欄は、到達済みの記録から読み取れる縁だけを表示しています。`
- `まだ送信や返信の機能ではありません。`

Avoid copy that implies:

- Akari is owned, acquired, rescued as a prize, or a romance reward;
- the player can always talk to Akari;
- a live chat, AI conversation, messenger app, notification, or generated reply
  already exists;
- raw route IDs, reward IDs, NPC IDs, trust thresholds, or localStorage internals
  are player-facing concepts.

Forbidden player-facing words or concepts unless a later contract explicitly
implements them:

- `送信`
- `返信`
- `通話`
- `未読`
- `通知`
- `メッセンジャー`
- `いつでも話せる`
- `AI灯と会話する`
- `攻略報酬`
- `入手したNPC`
- `所有`

## 10. AI/RAG Boundary

AI Akari, generated replies, free chat, RAG-backed responses, model calls, or
external services are not opened by Stage18.

Before any later AI/RAG work, a separate contract must define:

- what Akari is allowed to know;
- what completed-run facts are passed into context;
- how spoilers and unreached endings are masked;
- what generated text may never change, including route gates, ending meaning,
  canon, rewards, required clues, or relationship state;
- deterministic fallback behavior when generation is unavailable;
- audit and test strategy for prompt injection, hallucinated contact state, and
  player-facing false promises;
- privacy and local/external model boundaries.

## 11. Verification Matrix

| Change type | Required verification |
| --- | --- |
| Docs-only Stage18 contract or ticket | `git diff --check`, changed-file review, and `git status --short --branch --untracked-files=all`. |
| TypeScript helper or deterministic eligibility logic | `npm run typecheck`, `npm run lint`, `npm run test`, and `git diff --check`. |
| AdventurePlayer UI detail/affordance | Typecheck, lint, tests, `npm run build`, `npm run audit:adventure-player`, visible-control outcome review, and `git diff --check`. |
| Scenario YAML/body | Out of scope for Stage18; if reopened later, run `npm run validate:scenarios`, relevant tests, and story/canon review. |
| Storage/schema/localStorage | Out of scope for Stage18; requires separate storage contract plus migration tests before implementation. |
| AI/RAG/external services | Out of scope for Stage18; requires separate AI/RAG contract, security/privacy review, and deterministic fallback tests. |
| Git/NextChat/Obsidian/publish | Red-gate action; run only after explicit Shiki wording and scoped diff/status review. |

## 12. Stop Gates

Stop before implementation if the next stage requires:

- new storage fields or localStorage migration;
- scenario YAML/body edits;
- ending condition, route gate, replay hint, reward, or canon changes;
- AI generation, RAG, model calls, or external service calls;
- active communication semantics;
- message input or send/reply/call actions;
- notification/unread/messenger timeline behavior;
- product copy that promises contact behavior not actually implemented;
- enabled controls without a defined visible outcome;
- broad cleanup of unrelated untracked handoff/archive docs;
- Git, NextChat, Obsidian Git, release, tag, PR, or deletion without explicit
  Shiki direction.

## 13. Approved Next Implementation Candidate

Stage18 approves exactly one next implementation candidate:

```text
Stage18A: Akari Contact Eligibility Detail
```

Objective:

```text
Add a deterministic, record-only details surface that explains why the current
Akari relationship/contact record is active, fragmentary, boundary-bound,
lost, or unavailable, using existing completed-run history and ending metadata.
```

Required constraints:

- no message input;
- no send/reply/call/contact action;
- no notification, unread badge, messenger timeline, AI, RAG, or generated
  reply;
- no `CompletedRunRecord` or localStorage schema changes;
- no scenario YAML/body, route gate, ending condition, replay hint, reward, or
  canon changes;
- no new relationship state after the completed run;
- no enabled UI control unless it visibly expands/collapses deterministic
  details and is covered by the AdventurePlayer audit.

Preferred implementation shape:

- add a small deterministic explanation to the existing post-ending Akari card;
- if interaction is needed, use exactly one expand/collapse details control;
- update or add focused tests/audit assertions so the details remain record-only
  and do not imply messaging, AI chat, notifications, or ownership/reward
  framing.

Ticket 3 must turn this candidate into a standalone executable prompt before
any code is edited.

If any proposed candidate requires new storage, active communication semantics,
AI generation, route/reward changes, or scenario edits, Stage18 should stop and
create a narrower docs-first contract instead.

## 14. Stage18 Contract Result

Stage18 is complete as a docs-first active-contact contract when:

- this document exists and names active contact as deterministic eligibility
  and explanation, not communication;
- the next implementation candidate is exactly one minimal ticket;
- forbidden active-contact behavior is listed as out of scope;
- UI visible-outcome requirements are defined;
- storage/schema and AI/RAG are gated behind later contracts;
- docs-only verification passes.

Next safe ticket:

```text
Ticket 3: Next Implementation Ticket Draft
```

Ticket 3 should create `docs/stage18-active-contact-implementation-ticket-2026-06-10.md`
and must not implement product code.
