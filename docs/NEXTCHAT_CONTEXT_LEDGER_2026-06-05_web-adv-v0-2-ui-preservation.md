# NEXTCHAT CONTEXT LEDGER 2026-06-05 Web ADV v0.2 UI Preservation

## Scope

- Repo: `D:\Codex\TRPG--web--`
- Branch: `main`
- Preservation request: `NextChat, Ful l`
- Interpretation: `NextChat Full`
- Purpose: preserve the current Web ADV v0.2 UI, visual asset, and preservation-workflow decisions for the next Codex session.

## Source Fidelity

This ledger separates exact archived sources from best-effort reconstructed chat context.

- Exact archive available: current project documents after the latest UI, asset, and preservation-workflow edits.
- Best-effort only: surrounding chat discussion and reasoning. No exact full visible chat transcript was available to this Codex turn.
- Hidden prompts, credentials, secrets, internal reasoning, and unrelated tool output were not preserved.

## Exact Archived Sources

Current project docs were archived through the `nextchat-full-archive` workflow.

- Manifest: `.context-archive/manifests/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs.manifest.json`
- Index: `.context-archive/context_index.sqlite3`
- Raw source 1: `.context-archive/raw/2026-06-05/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs-001.md.gz`
- Raw source 2: `.context-archive/raw/2026-06-05/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs-002.md.gz`
- Verify text: `NextChat Full archive`
- Verify text found: true
- FTS enabled: true
- Indexed chunk count: 7

Archived source details:

| Source | SHA-256 | Byte count | Fidelity |
|---|---|---:|---|
| `docs/web-adv-v0-2-player-experience-spec.md` | `3cc8a7911f086a6030386fb155296cf98a8a1f8e7466dfc0aa3df270f113fdea` | 29146 | exact local doc source |
| `docs/codex-autonomous-workflow.md` | `48c993bb87c14a578466c2cc6f9d10258058c74ca7c34634e4cf8c49d589b817` | 10736 | exact local doc source |

Earlier exact handbook archive remains the primary design source for the Web ADV direction:

- Manifest: `.context-archive/manifests/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json`
- Raw gzip: `.context-archive/raw/2026-06-05/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook-001.txt.gz`
- SHA-256: `abf24ce0496b44acda5dd8c113ed4535e684951041668f7e7b57a27b5bfc9a70`

## Current Decisions

### Product Direction

- Keep the project as a Web app.
- Preserve the Kimidake scenario direction and existing story material.
- Treat `ScenarioExplorer` as debug/validation tooling, not final player UI.
- Build a high-quality paper-theater Web ADV player surface.
- Defer AI GM until the deterministic ADV loop is specified and playable.

### Mobile-First UI Direction

The player UI baseline is now mobile-first vertical.

- UI baseline viewport: `390x844` CSS px.
- Larger smartphone audit viewport: `430x932` CSS px.
- Player layout: compact status bar, background/character stage, lower ADV text box, choice tray, bottom navigation.
- Evidence, log, and status details open through bottom sheet drawers on mobile.
- Desktop must not simply scale up the mobile portrait layout. Desktop uses a `desktop-expanded layout` with right side panel or right drawer for evidence/log/status.
- Desktop audit viewports include `1280x720` and `1440x900`.

### Visual Asset Direction

Shiki chose A案: high-resolution pixel-style illustration.

Temporary fixed sizes:

- UI baseline: `390x844`
- Smartphone background master: `2160x3840`
- PC background master: `3840x2160`
- Standing portrait master: `2048x3072`
- Distribution background: compress to `1080x1920` - `1440x2560`

Important asset rule:

- Avoid forcing one landscape background into mobile portrait by hard cropping.
- Important scenes should have separate smartphone portrait and PC landscape compositions when needed.
- First playable can use temporary backgrounds/portraits, but the UI frame should assume these resolution rules.

### Figma / Image Generation Direction

Figma should be used for editable low-to-mid fidelity UI mocks before final visual generation.

Recommended next visual stage:

- Create three smartphone portrait Figma frames at `390x844`.
- Compare: classic ADV, investigation drawer-heavy, immersive horror.
- Keep background/character/text/choices/bottom nav slots consistent.
- After selecting a layout, add pixel-style visual direction and later produce actual image assets.

### Preservation Workflow Direction

`docs/codex-autonomous-workflow.md` now records the preservation ladder.

- Light consultation: no save by default.
- `nextchat`: project-local `NEXT_CHAT_HANDOFF`.
- `NextChat Full`, `全文保存`, `添付も原文保存`, `raw archive`: preserve exact source to `.context-archive` when available.
- Spec-evidence attachments must be preserved to `.context-archive`; specs should reference manifest path and why the source matters.
- `NEXT_CHAT_HANDOFF` is a resume note, not exact source preservation.
- If no exact source exists, label preservation as `best-effort` or unavailable.

`.context-archive/` is already ignored by `.gitignore`.

## Current Changed Files

- `docs/web-adv-v0-2-player-experience-spec.md`
  - New untracked spec.
  - Contains Web ADV v0.2 player experience specification, mobile-first UI baseline, desktop-expanded behavior, component/module proposal, acceptance criteria, verification plan, visual asset resolution decision, and next implementation stage.
- `docs/codex-autonomous-workflow.md`
  - Modified tracked workflow doc.
  - Contains new preservation and attachment archive rules.
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md`
  - This ledger.
- `docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md`
  - Concise next-chat handoff to be created with this ledger.

Raw archives under `.context-archive/` are intentionally ignored by Git.

## Verification Completed In This Turn

- Archived exact current docs with `nextchat-full-archive` script.
- Archive manifest created.
- Raw gzip files created.
- SQLite index exists and FTS is enabled.
- Verify text `NextChat Full archive` found.
- `git diff --check` was run after docs edits and reported no whitespace errors; LF -> CRLF warnings appeared for edited docs.

## Boundaries

- No commit or push was requested.
- No Obsidian Git was requested.
- No runtime code, scenario YAML, story body, Figma file, or generated image was created in this preservation turn.
- Chat context in this ledger is best-effort reconstructed, not an exact transcript.
- Exact sources are the archived project docs and the earlier exact handbook attachment archive.

## Next Recommended Stage

If Shiki wants to continue visual planning:

```text
Stage 13S: Figma mobile-first ADV UI mock

Objective:
Create editable Figma-ready UI mock guidance for three smartphone portrait ADV layouts based on `docs/web-adv-v0-2-player-experience-spec.md`.

Scope:
Use 390x844 frames. Compare classic ADV, investigation drawer-heavy, and immersive horror variants. Keep evidence/log/status drawer behavior, mobile-first vertical UI, and desktop-expanded requirements in mind.

Constraints:
Do not change scenario YAML, runtime code, story body, or the archived handbook. Do not generate final production assets yet. Treat the output as layout exploration.

Done:
Shiki can pick one UI direction before Stage 14R implementation.
```

If Shiki wants to start coding instead:

```text
Stage 14R: Deterministic AdventurePlayer vertical-slice shell

Objective:
Implement the first deterministic player-facing ADV shell for scenes 1-3 using the existing scenario pack/runtime and the v0.2 spec.
```
