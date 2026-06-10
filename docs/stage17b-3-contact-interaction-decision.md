# Stage17B-3 Contact Interaction Decision

Created: 2026-06-10 JST

## Result

Stage17B-3 keeps Akari's post-clear relationship/contact surface as a
deterministic record layer. It does not open active contact interaction yet.

日本語メモ: 現時点の「灯との縁」は、連絡アプリではなく到達記録ッス。次に足せるとしても、記録を読みやすくする受動的な詳細表示までで、送信・返信・通知・AI会話はまだ開けないッス。

## Decision

The current Stage17B-2 card remains the product baseline:

- static/read-only;
- derived from completed run history and ending metadata;
- no generated text;
- no message input;
- no send/reply/call/contact action;
- no notification, unread badge, or messenger timeline;
- no `CompletedRunRecord` schema expansion;
- no scenario YAML/body, route gate, ending condition, or replay hint change.

Stage17 may continue only through record-like, deterministic surfaces until
Shiki explicitly reopens active contact behavior.

## Allowed Next Micro-Slices

The following are safe candidates if Stage17 continues:

1. Passive record detail disclosure.
   - Add a small "details" view for why the current Akari record is active,
     fragmentary, boundary-bound, or unavailable.
   - If it uses a button, the button must visibly expand/collapse details and
     be covered by the AdventurePlayer audit.
   - It must not imply Akari can be messaged.

2. Copy-only clarification.
   - Tighten the relationship/contact copy so player text is softer and more
     explicit that the surface is a record.
   - Keep raw IDs, route conditions, ownership framing, romance reward framing,
     AI chat language, and messenger language out of player text.

3. Regression/audit guard.
   - Add or extend tests/audit checks that ensure the card remains record-only
     and has no enabled contact controls.
   - Prefer this if any future UI slice adds an enabled control.

## Rejected For Now

The following remain out of scope without a new docs-first contract:

- message input;
- send/reply/generated-response controls;
- call/contact buttons;
- unread badges or notification simulation;
- chat history or messenger timeline;
- AI Akari, RAG-backed replies, or free text conversation;
- cloud/account/cross-device persistence;
- `CompletedRunRecord` schema migration;
- relationship state that changes after the completed run;
- route gate, ending condition, replay hint, reward, or scenario prose changes.

## Stop Conditions

Stop before implementation if a proposed Stage17 follow-up needs any of:

- new storage fields or localStorage migration;
- scenario YAML/body edits;
- ending condition or route gate changes;
- AI generation or external service calls;
- active communication semantics;
- product copy that promises contact behavior not actually implemented;
- enabled controls without a visible user-observable outcome.

## Verification Contract

Any future Stage17 interaction-adjacent slice must verify:

- `npm run typecheck`;
- `npm run lint`;
- relevant tests, at minimum `npm run test` when TypeScript logic changes;
- `npm run build` when UI or shared code changes;
- `npm run validate:scenarios` if scenario data is touched;
- `npm run audit:adventure-player` if AdventurePlayer UI changes;
- `git diff --check`.

Docs-only follow-up work only needs changed-file review, `git diff --check`,
and `git status --short --branch`.

## Next Safe Stage

If Shiki wants Stage17 to continue without opening active contact behavior, the
safest next stage is:

```text
Stage17B-4: Passive Akari Record Detail Disclosure
```

That stage should either add no new enabled control, or add exactly one
expand/collapse-style detail control with a verified visible outcome.
