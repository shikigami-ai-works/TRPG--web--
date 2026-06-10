# Stage17 Completion Contract

Created: 2026-06-10 JST

## Result

Stage17 is complete as a passive Akari relationship/contact record layer.

The completed product shape is intentionally narrow: the AdventurePlayer
post-ending surface can show the relationship/contact trace that is already
readable from reached records, completed-run history, and ending metadata. It
does not create a live contact channel.

日本語メモ: Stage17 は「灯へ連絡できる機能」ではなく、「到達済みの記録から読み取れる縁を残す層」として閉じるッス。ここから先の送信・返信・通知・AI会話は、別の docs-first 契約が必要ッス。

## Completion Definition

Stage17 is considered complete when all of the following are true:

- Stage17A defines the deterministic relationship/contact record contract.
- Stage17B-1 derives Akari's record from existing completed-run history and
  ending metadata without expanding `CompletedRunRecord`.
- Stage17B-2 shows the Akari record on the AdventurePlayer post-ending surface
  as static/read-only UI.
- Stage17C verifies visible AdventurePlayer controls and guards the record copy
  against messenger, AI chat, raw ID, and reward-ownership framing.
- Stage17B-3 explicitly keeps active contact behavior gated.
- Stage17B-4/B-5 add and audit the passive record-only clarification copy.
- Stage17E publishes and preserves the passive-record bundle after Shiki's
  explicit `Git push`, `nextchatフルアーカイブ`, and `Obsidian Git` request.

The current committed software state satisfying that definition is:

```text
06d4ce4 Add stage17 passive record disclosure
```

## In Scope

- Completed-run-history-derived Akari relationship/contact record.
- Static/read-only AdventurePlayer post-ending copy.
- Existing ending metadata, reward labels, final trust, and relationship labels
  only as already stored or derived.
- Audit guards that keep the surface passive, deterministic, and copy-safe.
- Documentation that names the completion boundary and the next gated contract.

## Out Of Scope

The following remain unimplemented and must not be treated as part of Stage17
completion:

- message input;
- send/reply/call/contact actions;
- notifications or unread badges;
- messenger timeline or chat history;
- AI Akari, generated replies, free chat, or RAG-backed replies;
- `CompletedRunRecord` or localStorage schema migration;
- relationship state that changes after the completed run;
- scenario YAML/body edits;
- route gate, ending condition, replay hint, or reward behavior changes.

## Verification Baseline

The passive record disclosure and closeout bundle was verified with:

- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run test`: PASS, 39 tests.
- `npm run build`: PASS.
- `npm run audit:adventure-player`: PASS on final rerun.
- `git diff --check`: PASS, LF-to-CRLF warnings only.

Latest recorded runtime evidence for the Stage17 closeout audit:

- `.runtime/adventure-player-ui-audit-2026-06-10T10-47-28-948Z/`

## Next Ticket Candidate

If Stage17 continues beyond the passive record layer, the next ticket must be a
docs-first contract for active contact behavior. It should define the product
meaning, persistence boundary, UI outcomes, copy restrictions, verification
requirements, and stop gates before any implementation.

Until that contract exists, do not implement active contact behavior.
