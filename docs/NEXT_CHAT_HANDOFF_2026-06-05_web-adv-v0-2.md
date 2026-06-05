# NEXT CHAT HANDOFF 2026-06-05 Web ADV v0.2

## Project

- Repo: `D:\Codex\TRPG--web--`
- Branch: `main`
- Latest pushed commit known here: `f18241ba0c6d30eb7197966b4efc6d49ee1af98f`
- Current user decision: keep this as a Web app, preserve the scenario direction, and build a high-quality paper-theater ADV player experience even if the player-facing engine/screen must be rebuilt.

## Read First

1. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2.md`
2. `docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2.md`
3. `docs/NEXT_CHAT_HANDOFF_2026-06-04.md`
4. `docs/codex-autonomous-workflow.md`
5. `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`

Exact archived handbook:

- Manifest: `.context-archive/manifests/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json`
- Raw gzip: `.context-archive/raw/2026-06-05/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook-001.txt.gz`
- Index: `.context-archive/context_index.sqlite3`
- SHA-256: `abf24ce0496b44acda5dd8c113ed4535e684951041668f7e7b57a27b5bfc9a70`

Note: the handbook attachment is preserved exactly. The chat reasoning around it is preserved as best-effort reconstructed context in the ledger, not as a verbatim transcript.

## Decision

Proceed with:

```text
シナリオは残す。エンジンは分ける。画面は作り直す。
Webアプリのまま、紙芝居風ADVとして上質なゲーム体験を作る。
```

The current `ScenarioExplorer` path was moving toward a scenario-management/debug UI. That remains useful, but it is not the intended final player experience.

## Product Shape

The new player-facing target is a solo TRPG-like Web ADV:

- full-screen 2D/pixel-anime paper-theater presentation
- background, character portrait, text box, nameplate, and click/tap advance
- choices shown only when relevant
- dice/check results presented narratively
- evidence, log, skill/status, memory, contamination, NPC trust, and route state surfaced as player UI
- deterministic rule engine first
- AI GM later, constrained to adjudication/presentation/choice visibility, not free story authorship

Core promise:

```text
状態で見える世界が変わるTRPGノベルADV
```

## Scenario Boundary

Scenario prose may still change.

Preserve the story direction, emotional core, route intent, current scenario spec, and validated YAML behavior. Do not overfit tests or architecture to draft prose alone. If prose changes, synchronize current-spec, YAML, tests, UI behavior, and implementation notes only where the actual contract changes.

## Previous Stage Status

The 2026-06-04 handoff suggested `Stage 13: Low-frequency UI raw label sweep`.

That is now deferred. It can still be done later for debug polish, but the next useful stage is:

```text
Stage 13R: Web ADV v0.2 player-experience specification
```

## Next Prompt

```text
Stage 13R: Web ADV v0.2 player-experience specification

Objective:
Define the next player-facing architecture and UX spec for turning D:\Codex\TRPG--web-- into a high-quality paper-theater Web ADV while preserving the current scenario direction. The output should be an implementation-ready spec, not code yet, unless the repo already contains a suitable spec and only needs a narrow update.

Context:
Read docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2.md, docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2.md, docs/NEXT_CHAT_HANDOFF_2026-06-04.md, docs/codex-autonomous-workflow.md, and docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md. Treat the exact archived handbook at .context-archive/manifests/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json as the primary design source for the new direction. Remember that chat context is best-effort reconstructed, while the attachment archive is exact.

Target:
Create docs/web-adv-v0-2-player-experience-spec.md.

Constraints:
Keep the project as a Web app. Preserve the scenario direction and existing story material. Do not treat current draft prose as frozen. Do not rewrite scenario YAML, story body, or runtime code during this spec stage unless a tiny correction is necessary to make the spec accurate. Treat ScenarioExplorer as a future debug/validation tool, not the final player UI. Defer AI GM implementation until the deterministic ADV loop is specified. Do not commit or push unless explicitly asked.

Verification:
Run git diff --check after writing the spec. If only docs changed, do not run the full frontend suite unless the spec edit touches code or package files. Report changed files, deferred work, and the safest next implementation stage.
```

## Local Git Notes

- `.context-archive/` was added to `.gitignore` during this preservation turn.
- `docs/NEXT_CHAT_HANDOFF_2026-06-04.md` was already untracked before this turn.
- This handoff and the context ledger are new local docs.
- No commit or push was requested in this preservation turn.
