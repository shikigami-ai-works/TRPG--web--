# NEXTCHAT CONTEXT LEDGER 2026-06-05 Stage 13S Figma Mobile ADV UI Mock

## Scope

- Repo: `D:\Codex\TRPG--web--`
- Branch: `main`
- Preservation request: `ネクストチャットフル`
- Interpretation: `NextChat Full`
- Purpose: preserve the Web ADV v0.2 Stage 13S Figma mobile UI mock, local SVG backup, project-doc relocation, and next-step decisions for the next Codex session.

## Source Fidelity

This ledger separates exact archived local sources from best-effort reconstructed chat context.

- Exact archive available: current project docs/SVG listed in the manifest below.
- External live asset: Figma file `https://www.figma.com/design/yWr82m5xQQ3mH62VWJrE4M`; the editable Figma canvas was verified by MCP readback, but a full Figma export is not stored in `.context-archive`.
- Best-effort only: surrounding chat discussion and reasoning after the latest handoff. No exact full visible chat transcript was available to this Codex turn.
- Hidden prompts, credentials, secrets, internal reasoning, and unrelated tool output were not preserved.

## Exact Archived Sources

Current project docs and the local SVG backup were archived through the `nextchat-full-archive` workflow.

- Manifest: `.context-archive/manifests/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full.manifest.json`
- Index: `.context-archive/context_index.sqlite3`
- Verify text: `Stage 13S`
- Verify text found: true
- FTS enabled: true
- Indexed chunk count: 8

Archived source details:

| Source | SHA-256 | Byte count | Fidelity |
|---|---|---:|---|
| `docs/web-adv-v0-2-player-experience-spec.md` | `3cc8a7911f086a6030386fb155296cf98a8a1f8e7466dfc0aa3df270f113fdea` | 29146 | exact local doc source |
| `docs/codex-autonomous-workflow.md` | `48c993bb87c14a578466c2cc6f9d10258058c74ca7c34634e4cf8c49d589b817` | 10736 | exact local doc source |
| `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md` | `e521072ac0266d8a4b98113647538332ecd3cd5aaedc5d05e1194e8ccd48a950` | 7549 | exact local doc source |
| `docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md` | `fb2a52e099eb3cc49c5612ed4f0a45b5f129c3e01a9ef12327af1c5061687d1f` | 4487 | exact local doc source |
| `docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md` | `70840ff2ec0eb9ea6b60e885739675fdb0602645bb62b97217d018586d8e6d87` | 5594 | exact local doc source |
| `docs/assets/stage-13s-web-adv-mobile-ui-mock.svg` | `ad7a189d7f447c703370251f24e0acdb063984357664d4a5ffbea386f0871453` | 14416 | exact local SVG source |

Raw gzip files:

- `.context-archive/raw/2026-06-05/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full-001.md.gz`
- `.context-archive/raw/2026-06-05/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full-002.md.gz`
- `.context-archive/raw/2026-06-05/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full-003.md.gz`
- `.context-archive/raw/2026-06-05/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full-004.md.gz`
- `.context-archive/raw/2026-06-05/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full-005.md.gz`
- `.context-archive/raw/2026-06-05/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full-006.svg.gz`

Earlier exact archive remains important for the broader v0.2 decision and handbook:

- `.context-archive/manifests/2026-06-05T113630Z0000-web-adv-v0-2-ui-preservation-and-workflow-docs.manifest.json`
- `.context-archive/manifests/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json`

## Chronology

1. Shiki resumed from the Web ADV v0.2 UI preservation ledger and handbook.
2. Codex recommended Stage 13S before Stage 14R: create three smartphone portrait Figma mock variants at `390x844`.
3. Figma was initially limited by Starter/View access; after Shiki enabled full Figma access, `_whoami` reported `Full` seat on `pro`.
4. Codex created a Figma design file:
   - `https://www.figma.com/design/yWr82m5xQQ3mH62VWJrE4M`
   - Page: `Stage 13S Mobile ADV UI Mock`
   - Board node: `1:2`
5. Codex placed three editable `390x844` Figma frames:
   - `Stage13S A - Classic ADV / 390x844` (`1:7`)
   - `Stage13S B - Investigation Drawer-Heavy / 390x844` (`1:78`)
   - `Stage13S C - Immersive Horror / 390x844` (`1:156`)
6. Figma MCP readback verified:
   - frame count: 3
   - each frame size: `390x844`
   - all frames include status, stage, ADV text box, and bottom nav
   - B/C include drawer or drawer-peek layers
7. Codex created local fallback artifacts under the projectless workspace `outputs/`.
8. Shiki asked whether more Figma assets could create more variations. Codex answered yes: current work is structural variation, and asset scouting could expand visual/style variation.
9. Shiki asked whether the work could be moved into `TRPG--web--`. Codex copied:
   - `docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md`
   - `docs/assets/stage-13s-web-adv-mobile-ui-mock.svg`
10. Shiki requested `ネクストチャットフル`. Codex archived exact project docs/SVG and created this ledger plus a concise handoff.

## Current Decisions

### Stage 13S Outcome

Three baseline directions now exist:

- A. Classic ADV: safest first implementation baseline, strongest reading flow.
- B. Investigation Drawer-Heavy: best TRPG investigation feel, explicit evidence/log/status bottom sheet behavior.
- C. Immersive Horror: strongest visual identity, highest readability and overlap audit risk.

Recommended Stage 14R seed:

- Use an A+B hybrid.
- Adopt Variant A as the default smartphone ADV skeleton.
- Borrow Variant B's bottom sheet and evidence/log/status density.
- Keep Variant C's contamination effects as a restrained state layer, not the default first-screen look.

### Figma Asset Scouting Decision

Shiki's intuition is accepted: searching Figma community assets, UI kits, game UI references, mobile ADV UI, horror UI, and pixel-art-adjacent material can produce more visual variations than the initial structural mock.

Recommended optional next visual stage:

- Stage 13S-2: Figma asset scouting for ADV UI variation.
- Goal: expand from 3 structural options to 6-9 style/texture directions.
- Guardrail: do not let asset availability override the core game contract.
- Useful categories: text box frames, choice button treatments, mobile bottom sheets, evidence/log cards, horror overlays, pixel-style UI borders, investigation notebook motifs, old terminal/monitor motifs, paper-theater frame systems.

### Product/UI Direction Still Active

- Keep the project as a Web app.
- Preserve the Kimidake scenario direction and existing story material.
- Treat `ScenarioExplorer` as debug/validation tooling, not final player UI.
- Build a high-quality paper-theater Web ADV player surface.
- Defer AI GM until the deterministic ADV loop is specified and playable.
- Keep mobile-first vertical as baseline: `390x844` and `430x932` audit viewports.
- Desktop must use a `desktop-expanded layout` with right side panel or right drawer at `1280x720` and `1440x900`; do not simply enlarge the portrait phone screen.
- Figma is a design/planning asset, not the runtime product itself.

## Current Changed Files

`git status --short` before this NextChat Full run showed:

- `M docs/codex-autonomous-workflow.md`
- `?? docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md`
- `?? docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md`
- `?? docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md`
- `?? docs/assets/`
- `?? docs/web-adv-v0-2-player-experience-spec.md`

This run adds:

- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_stage-13s-figma-mobile-ui-mock.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-05_stage-13s-figma-mobile-ui-mock.md`

`.context-archive/` is ignored by `.gitignore` and intentionally remains local raw archive storage.

## Verification Completed

- Figma `_whoami` confirmed `Full` seat on `pro`.
- Figma file creation succeeded.
- Figma canvas write succeeded.
- Figma readback verified three `390x844` frames and required layer categories.
- SVG backup was parsed as XML successfully after copying into `TRPG--web--`.
- `git diff --check -- docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md docs/assets/stage-13s-web-adv-mobile-ui-mock.svg` reported no errors.
- NextChat Full archive script created manifest, gzip raw sources, SQLite index, and FTS chunks.
- Archive verify text `Stage 13S` was found.
- `.context-archive/` was confirmed present in `.gitignore`.

## Boundaries

- No commit or push was requested.
- No Obsidian Git was requested.
- No runtime code, scenario YAML, story body, or AI GM implementation was changed in the Stage 13S work.
- No Figma community asset scouting was performed yet; it remains a recommended optional next stage.
- No final production visual assets were generated.
- Exact full chat transcript was not available; chat reasoning is best-effort reconstructed.

## Next Recommended Stage

If Shiki wants more visual range before coding:

```text
Stage 13S-2: Figma asset scouting for ADV UI variation

Objective:
Use Figma community/assets/UI references to expand the current three structural ADV mocks into 6-9 visual/style directions without changing the Web ADV v0.2 product contract.

Scope:
Search for mobile game UI, visual novel UI, horror UI, pixel-style UI, investigation notebook/card UI, bottom sheets, and evidence/log/status panel patterns. Classify useful assets by what they improve: text box, choice tray, bottom drawer, evidence card, status strip, contamination overlay, or desktop side panel.

Constraints:
Do not change scenario YAML, runtime code, story body, or current route gates. Do not generate final production assets. Do not adopt assets that make required text/choices hard to read.

Done:
Shiki can choose whether Stage 14R should use the current A+B hybrid, or a richer asset-informed variant.
```

If Shiki wants to start coding:

```text
Stage 14R: Deterministic AdventurePlayer vertical-slice shell

Objective:
Implement the first deterministic player-facing ADV shell for scenes 1-3 using the existing scenario pack/runtime and the v0.2 spec, with Variant A+B as the layout seed.

Scope:
Add `components/adventure/*` and `lib/adventure/*` modules, change `/` to render `AdventurePlayer`, add `/debug` for `ScenarioExplorer`, and keep existing scenario YAML/body/runtime contracts intact.

Layout seed:
Use Variant A as the default smartphone ADV skeleton. Add Variant B style bottom drawers for Evidence, Log, and Status. Keep Variant C contamination effects as a restrained optional state layer only.

Verification:
Run `npm run validate:scenarios`, `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Then run a browser/UI interaction audit at `390x844`, `430x932`, `1280x720`, and `1440x900`.
```
