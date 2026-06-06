# NEXT CHAT HANDOFF 2026-06-06 Stage 13S Asset License Selection

## Resume Point

Repo: `D:\Codex\TRPG--web--`

Shiki said `nextchatfull` after Stage 13S Figma UI mock work, local asset/tool selection, a design-direction correction, external asset search, and license-loose asset prioritization.

## Read First

1. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-06_stage-13s-asset-license-selection.md`
2. `docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md`
3. `docs/web-adv-v0-2-player-experience-spec.md`
4. `docs/NEXT_CHAT_HANDOFF_2026-06-05_stage-13s-figma-mobile-ui-mock.md`
5. `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`

## Archive Pointer

This run uses best-effort raw preservation, not an exact transcript.

Best-effort source:

- `.context-archive/sources/2026-06-06/2026-06-06T171601_stage-13s-asset-license-selection-visible-reconstruction.md`

Archive result:

- Manifest: `.context-archive/manifests/2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full.manifest.json`
- Raw gzip: `.context-archive/raw/2026-06-06/2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full-001.md.gz`
- Index: `.context-archive/context_index.sqlite3`
- Archive ID: `2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full-001`
- SHA-256: `d80e45371d21358ff3a8d52b062d548ab7127ff238fd4512f16a5a1e793f2bc7`
- Byte count: `13681`
- FTS enabled: `true`

Verify phrase:

- `ホラー寄り紙芝居ADV + 調査ノート + ピクセル風質感`
- Found: `true`

## Figma State

Figma file:

- https://www.figma.com/design/yWr82m5xQQ3mH62VWJrE4M

Page:

- `Stage 13S Mobile ADV UI Mock`

Board:

- `Stage13S Board - Web ADV v0.2 Mobile UI Mock` (`1:2`)

Frames:

- A: `Stage13S A - Classic ADV / 390x844` (`1:7`)
- B: `Stage13S B - Investigation Drawer-Heavy / 390x844` (`1:78`)
- C: `Stage13S C - Immersive Horror / 390x844` (`1:156`)

Added this session:

- `Stage13S Selection Matrix - local assets and tools` (`7:2`)

Verified:

- A/B/C remain `390x844`.
- Board now includes editable asset/tool selection matrix.

## Current Decisions

- Stage 14R seed remains A+B hybrid:
  - A skeleton for safe ADV reading.
  - B bottom drawers for Evidence/Log/Status.
  - C contamination effects only as restrained optional state styling.
- This game is not a generic pixel game.
- Correct asset direction is:

```text
ホラー寄り紙芝居ADV + 調査ノート + ピクセル風質感
```

- Pixel assets should support high-resolution pixel-style ADV backgrounds, standing portraits, subtle UI texture, investigation drawers, evidence props, and contamination overlays.
- Avoid RPG HP bars, sword/magic icon language, tile-map-first assets, and bright generic mobile HUDs.
- RahiTuber is later portrait blink/talk verification, not a Stage 13S or Stage 14R UI direction.

## Local Asset Findings

Relevant local paths:

- `D:\Codex\figma assets\`
- `D:\Codex\game tools\`

Most useful local Figma references:

- `game\Pixel Game User Interface (Community).fig`
- `tinyRPG_manaSoulGUI_v_1_0.zip`
- `game\Mobile Game UI_UX by econev (Community).fig`
- `game\Mobile Game Settings (Community).fig`
- `not-jam-font-pack-zip.zip`
- game icon `.fig` files for Evidence/Log/Status candidates

Avoid/defer:

- Multi-GB map packs.
- Music-player kits as primary references.
- Raw `.fig` direct-to-code assumptions.
- Liquid Glass as default production look.

## License-Loose External Candidates

Rechecked sources:

- [Kenney Pixel UI Pack](https://kenney.nl/assets/pixel-ui-pack): Creative Commons CC0.
- [OpenGameArt Pixel UI pack 750 assets](https://opengameart.org/content/pixel-ui-pack-750-assets): CC0 / Kenney.
- [CyberNoir - Streets by greenly](https://greenly.itch.io/cybernoir-streets): CC0, noir/crime VN backgrounds, landscape.
- [FreePixel license/subscription notes](https://support.freepixel.com/subscription/): commercial use appears allowed, but free/premium attribution terms differ.
- [FreePixel commercial-use FAQ](https://freepixel.art/blog/commercial-use-faq-can-i-use-these-assets-in-my-game): useful but not CC0 proof per asset.

Production-safe order:

1. Kenney/OpenGameArt CC0 for UI skeleton.
2. Greenly CyberNoir CC0 for temporary background/mood reference.
3. FreePixel only with per-asset license proof saved.
4. Game-icons.net only if attribution management is acceptable.
5. Nexa/Obscura/DJY66 only after explicit license review.

## Next Recommended Step

Use this prompt next:

```text
Stage 13S-2: License-safe ADV asset shortlist

Objective:
Create a production-aware asset shortlist for the pixel-style horror investigation ADV direction.

Scope:
Classify external and local candidates into CC0-safe, commercial-with-conditions, needs-license-review, and avoid-for-now. Cover backgrounds, characters, ui/textbox, ui/choices, ui/drawers, ui/icons, evidence props, contamination effects, and desktop side-panel references.

Constraints:
Do not change scenario YAML, runtime code, story body, or archived handbook. Do not download paid/unclear-license assets yet. Do not create final production art.

Verification:
For every recommended asset, record source URL, license label, attribution requirement, commercial-use status, redistribution restriction, AI-generated/AI-assisted caveat if visible, proof date, and best in-game asset class.

Done:
Shiki can choose a safe asset acquisition/reference path before Stage 14R implementation or before commissioning/generating final art.
```

Alternative:

- If Shiki says to implement, proceed to Stage 14R deterministic `AdventurePlayer` using the A+B hybrid.

## Do Not Do

- Do not commit or push unless Shiki says `Git push`.
- Do not run Obsidian Git unless explicitly requested.
- Do not stage `.context-archive/`.
- Do not alter scenario YAML/body/route gates during asset scouting.
- Do not implement AI GM before deterministic ADV loop is playable.
