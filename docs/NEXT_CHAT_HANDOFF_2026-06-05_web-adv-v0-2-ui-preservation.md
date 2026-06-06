# NEXT CHAT HANDOFF 2026-06-05 Web ADV v0.2 UI Preservation

## Project

- Repo: `D:\Codex\TRPG--web--`
- Branch: `main`
- Current preservation request: `NextChat, Ful l`, interpreted as `NextChat Full`.

## Read First

1. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md`
2. `docs/web-adv-v0-2-player-experience-spec.md`
3. `docs/codex-autonomous-workflow.md`
4. `docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2.md`
5. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2.md`
6. `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`

## Exact Archives

Current project docs were exact-archived in `.context-archive`.

- Manifest: `.context-archive/manifests/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs.manifest.json`
- Raw doc archive 1: `.context-archive/raw/2026-06-05/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs-001.md.gz`
- Raw doc archive 2: `.context-archive/raw/2026-06-05/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs-002.md.gz`
- Index: `.context-archive/context_index.sqlite3`
- Verify text: `NextChat Full archive`
- Verify text found: true

Earlier exact handbook archive remains the primary design source:

- Manifest: `.context-archive/manifests/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json`
- Raw gzip: `.context-archive/raw/2026-06-05/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook-001.txt.gz`
- SHA-256: `abf24ce0496b44acda5dd8c113ed4535e684951041668f7e7b57a27b5bfc9a70`

Note: exact archived sources are the project docs and the earlier handbook attachment. The surrounding chat is preserved here as best-effort context, not a verbatim transcript.

## Current Decisions

- Keep the game as a Web app.
- Build a high-quality paper-theater Web ADV player UI.
- Treat `ScenarioExplorer` as debug/validation tooling, not the final player surface.
- Use mobile-first vertical UI as the baseline.
- UI baseline: `390x844`.
- Larger phone audit: `430x932`.
- Desktop must use a `desktop-expanded layout`, not a simple enlarged mobile portrait screen.
- Mobile details use bottom sheet drawers for evidence/log/status.
- Desktop can use a right side panel or right drawer.
- Visual asset direction is A案: high-resolution pixel-style illustration.
- Smartphone background master: `2160x3840`.
- PC background master: `3840x2160`.
- Standing portrait master: `2048x3072`.
- Distribution background target: `1080x1920` - `1440x2560`.
- Use Figma for editable low-to-mid fidelity UI mocks before final visual asset generation.
- Important spec-evidence attachments must be saved to `.context-archive` with raw archive, manifest, SHA-256, byte count, and source scope.

## Current Local Files

Expected current status includes:

- Modified: `docs/codex-autonomous-workflow.md`
- Untracked/new: `docs/web-adv-v0-2-player-experience-spec.md`
- New: `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md`
- New: `docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md`

Raw `.context-archive/` files are ignored by Git and should not be staged unless Shiki explicitly asks to version raw archives.

## Boundaries

- Do not commit or push unless Shiki explicitly asks.
- Do not run Obsidian Git unless Shiki explicitly asks.
- Do not rewrite scenario YAML, story body, or runtime code during the next planning step.
- Do not treat current draft prose as frozen.
- If new spec-evidence attachments arrive, preserve them with `NextChat Full archive` into `.context-archive`.

## Recommended Next Step

Best next visual step:

```text
Stage 13S: Figma mobile-first ADV UI mock

Objective:
Create editable Figma-ready UI mock guidance for three smartphone portrait ADV layouts based on `docs/web-adv-v0-2-player-experience-spec.md`.

Scope:
Use 390x844 frames. Compare classic ADV, investigation drawer-heavy, and immersive horror variants. Keep evidence/log/status drawer behavior and desktop-expanded requirements in mind.

Constraints:
Do not change scenario YAML, runtime code, story body, or the archived handbook. Do not create final production assets yet.

Done:
Shiki can choose one UI direction before Stage 14R implementation.
```

Best next implementation step if Shiki skips Figma:

```text
Stage 14R: Deterministic AdventurePlayer vertical-slice shell

Objective:
Implement the first deterministic player-facing ADV shell for scenes 1-3 using the existing scenario pack/runtime and the v0.2 spec.
```
