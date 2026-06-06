# NEXTCHAT CONTEXT LEDGER 2026-06-06 Stage 13S Asset License Selection

## Scope

- Repo: `D:\Codex\TRPG--web--`
- Trigger: `nextchatfull`
- Date: 2026-06-06
- Scope: Stage 13S Figma mobile ADV UI mock continuation, local Figma/game-tool asset selection, pixel-style ADV asset clarification, external asset search, and license-loose asset prioritization.

## Raw Archive Status

Raw preservation for this turn is **best-effort**, not exact transcript preservation.

Reason:

- The current Codex session did not expose an exported primary transcript/log to archive directly.
- A visible-session reconstruction was written instead.
- Hidden system/developer prompts, internal reasoning, secrets, credentials, and unrelated logs were omitted.

Best-effort source:

- `.context-archive/sources/2026-06-06/2026-06-06T171601_stage-13s-asset-license-selection-visible-reconstruction.md`

The raw gzip/manifest paths are created by the archive script and listed below after verification.

Archive result:

- Manifest: `.context-archive/manifests/2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full.manifest.json`
- Raw gzip: `.context-archive/raw/2026-06-06/2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full-001.md.gz`
- Index: `.context-archive/context_index.sqlite3`
- Archive ID: `2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full-001`
- SHA-256: `d80e45371d21358ff3a8d52b062d548ab7127ff238fd4512f16a5a1e793f2bc7`
- Byte count: `13681`
- Char count: `13169`
- Chunk count: `4`
- FTS enabled: `true`
- Verify text: `ホラー寄り紙芝居ADV + 調査ノート + ピクセル風質感`
- Verify text found: `true`

## User Intent

Shiki first wanted Stage 13S to produce editable Figma-ready guidance for three smartphone portrait ADV layouts based on `docs/web-adv-v0-2-player-experience-spec.md`.

Important explicit constraints:

- Use `390x844` frames.
- Compare classic ADV, investigation drawer-heavy, and immersive horror variants.
- Keep evidence/log/status drawer behavior and desktop-expanded requirements in mind.
- Do not change scenario YAML, runtime code, story body, or the archived handbook.
- Do not create final production assets yet.
- Shiki should be able to choose one UI direction before Stage 14R implementation.
- Inspect local Figma assets at `D:\Codex\figma assets\`.
- Inspect game tools at `D:\Codex\game tools\`.
- Use agents/skills fully because first selection matters.

Later clarification changed the asset-selection lens:

- The game is not a generic pixel game.
- It is an investigation/paper-theater ADV that uses pixel-style images.
- Asset selection should prioritize assets that fit a pixel-style horror/investigation ADV, not RPG/tile-map game assets.
- Shiki then asked to search externally and to prioritize loose licenses.

## Standing Rules For Next Chat

- Address Shiki as `しき`.
- In chat, persona should use first person `うち` and ッス tone.
- Do not commit or push unless Shiki says `Git push`, `Git up`, or `Git uｐ`.
- Do not run Obsidian Git unless Shiki explicitly asks.
- Do not stage `.context-archive/`.
- Preserve unrelated dirty worktree changes.
- Do not edit scenario YAML, runtime code, story body, or archived handbook during asset scouting.
- Treat `docs/web-adv-v0-2-player-experience-spec.md` and current scenario YAML/spec as implementation anchors.
- Treat draft scenario prose as player-facing/reference material, not immutable route canon.

## Work Performed

### Figma Read/Write

Figma file:

- https://www.figma.com/design/yWr82m5xQQ3mH62VWJrE4M

Verified existing page and board:

- Page: `Stage 13S Mobile ADV UI Mock`
- Board: `Stage13S Board - Web ADV v0.2 Mobile UI Mock` (`1:2`)
- Existing frames:
  - `Stage13S A - Classic ADV / 390x844` (`1:7`)
  - `Stage13S B - Investigation Drawer-Heavy / 390x844` (`1:78`)
  - `Stage13S C - Immersive Horror / 390x844` (`1:156`)

Added:

- `Stage13S Selection Matrix - local assets and tools` (`7:2`)

Verification:

- Board size after update: `1424x1460`.
- Selection matrix size: `1380x326`.
- Selection matrix text nodes: 19.
- The three 390x844 frames remained unchanged.

### Local Markdown Update

Updated:

- `docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md`

Added:

- Selection matrix node pointer.
- Capability/agent use summary.
- Local Figma asset ranking.
- Game tool check summary.
- Future RahiTuber extraction command for later portrait tooling only.

No scenario YAML, runtime code, story body, or archived handbook files were changed.

## Skills, Tools, And Agents Used

- `nextchat-full-archive`: used for this preservation run.
- `capability-preflight`: used before nontrivial design/workflow work.
- `frontend-design`: used to evaluate UI direction.
- `context-optimization`: used to avoid pulling huge local assets into active context.
- `figma-use`: loaded before Figma MCP calls.
- Figma MCP:
  - Read page/board structure.
  - Added the selection matrix.
  - Verified nodes after the write.
- Multi-agent explorer agents:
  - Asset explorer inspected `D:\Codex\figma assets\`.
  - Tool explorer inspected `D:\Codex\game tools\`.
  - Both were closed after completion.
- Web search:
  - Used to verify current license/source details for license-loose asset candidates.

## Key Decisions

### UI Direction

Keep A+B hybrid as Stage 14R seed:

- Use Variant A as the default smartphone reading shell.
- Borrow Variant B bottom sheet/drawer density for Evidence/Log/Status.
- Keep Variant C contamination/memory effects as restrained optional state styling.

Reason:

- A is safest for deterministic implementation and text readability.
- B proves the investigation loop early.
- C is valuable for identity, but risky if it competes with required story text and choices.

### Asset Philosophy

This game should not look like a generic pixel RPG.

Correct art direction:

```text
ホラー寄り紙芝居ADV + 調査ノート + ピクセル風質感
```

Use pixel assets as:

- High-resolution pixel-style illustration direction for backgrounds/characters.
- Subtle UI texture: pixel borders, 9-slice panels, small icons, noise, edge effects.
- Investigation affordances: evidence cards, log rows, status tags, photos, notes.

Avoid:

- RPG HP/MP bars.
- Sword/magic icon language.
- Tile-map-first assets.
- Bright generic mobile game HUDs.
- Effects that obscure required text or mandatory choices.

### Game Tools

RahiTuber is useful later, but not now.

- It can help verify standing portrait blink/talk/pose structure.
- It should not pull Stage 14R into avatar tooling.
- `Demo_Sprites.zip` is a structural reference for idle/talk/blink/layered sprites, not reusable production art.

## Asset Classes

Recommended project-facing asset classes:

| Class | Role | Priority |
|---|---|---:|
| `backgrounds` | Smartphone portrait ADV backgrounds | Highest |
| `characters` | Transparent standing portraits and expression/distance variants | Highest |
| `ui/textbox` | Textbox, nameplate, advance affordance | Highest |
| `ui/choices` | Choice buttons, dangerous choice style, locked choice style | High |
| `ui/drawers` | Evidence/Log/Status/Inventory bottom sheets and desktop side panels | High |
| `ui/icons` | Evidence, log, memory, trust, contamination, inventory | Medium |
| `evidence` | Photos, notes, testimony cards, contradiction tags | High |
| `effects/contamination` | Boundary contamination, memory pollution, edge noise, color drift | Medium |
| `effects/dice` | Check result presentation | Medium |
| `desktop` | Desktop-expanded right panel parts | Later high |

First collection priority:

1. Smartphone portrait backgrounds.
2. Character standing portraits.
3. ADV textbox/nameplate.
4. Evidence/Log/Status drawer parts.
5. Contamination overlays.
6. Icons.

## Local Asset Shelf Findings

Path:

- `D:\Codex\figma assets\`

Highest-use local references:

1. `game\Mobile Game UI_UX by econev (Community).fig`
2. `game\Pixel Game User Interface (Community).fig`
3. `tinyRPG_manaSoulGUI_v_1_0.zip`
4. `game\Mobile Game Settings (Community).fig`
5. `game\application mobile top up game online (Community).fig`
6. `Mobile App Design for Health App, Game App Concept (Community).fig`
7. `not-jam-font-pack-zip.zip`
8. `game\Game Icons (Community).fig`, `RPG Awesome Icons Set by Iconduck`, `Game Icons by Iconduck`
9. `Sci-Fi UI Dashboard (Community).make`
10. `Liquid Glass Material Editor (Community).make`

Do not use now:

- `Core_Mapmaking_Pack_*.zip`
- music-player kits
- raw `.fig` as direct Codex input
- Liquid Glass as a default production look

## Game Tool Findings

Path:

- `D:\Codex\game tools\`

Results:

- `rahituber-win-stable.zip`: likely Windows-usable; future portrait blink/talk tool.
- `Demo_Sprites.zip`: useful RahiTuber sample structure; no production reuse until license clarified.
- `rahituber-win.zip`: fallback/comparison.
- `rahituber-linux-beta-x64.zip`: ignore for Windows-native workflow.

No install, visible GUI launch, or extraction was performed.

## License-Loose External Asset Findings

Verified sources used:

- [Kenney Pixel UI Pack](https://kenney.nl/assets/pixel-ui-pack)
  - Current search result listed license as Creative Commons CC0.
  - Good for UI skeleton, panels, buttons, cursors.
- [OpenGameArt Pixel UI pack (750 assets)](https://opengameart.org/content/pixel-ui-pack-750-assets)
  - Current search result listed license as CC0.
  - Search result stated credit to Kenney is not mandatory.
  - Good for panels/buttons/bars/scrollers.
- [CyberNoir - Streets by greenly](https://greenly.itch.io/cybernoir-streets)
  - Current search result listed license as `CC0 - Do whatever you want with it`.
  - Good rainy/noir/crime VN mood reference.
  - Landscape `3072x2048`; smartphone portrait backgrounds still need custom crop/recomposition.
- [FreePixel subscription/license page](https://support.freepixel.com/subscription/)
  - Current search result said personal/commercial use is allowed, premium no attribution, and free assets usually require attribution unless otherwise stated.
  - Not CC0; save license proof per asset.
- [FreePixel commercial-use FAQ](https://freepixel.art/blog/commercial-use-faq-can-i-use-these-assets-in-my-game)
  - Current search result said assets are free to use in commercial contexts and attribution is not required, but exact per-asset page terms still matter.

Recommended production-safe order:

1. Kenney/OpenGameArt CC0 for UI skeleton and prototype interface.
2. Greenly CyberNoir CC0 for temporary noir/VN background references.
3. FreePixel only after per-asset license capture.
4. Game-icons.net only if attribution management is acceptable.
5. Nexa Visuals / Obscura Vox / DJY66 only after explicit license review.

## Current Files And State

Observed before this preservation:

```text
 M docs/codex-autonomous-workflow.md
?? docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_stage-13s-figma-mobile-ui-mock.md
?? docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md
?? docs/NEXT_CHAT_HANDOFF_2026-06-05_stage-13s-figma-mobile-ui-mock.md
?? docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md
?? docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md
?? docs/assets/
?? docs/web-adv-v0-2-player-experience-spec.md
```

This NextChat Full run adds:

- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-06_stage-13s-asset-license-selection.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-06_stage-13s-asset-license-selection.md`
- `.context-archive/sources/2026-06-06/2026-06-06T171601_stage-13s-asset-license-selection-visible-reconstruction.md`
- `.context-archive/raw/2026-06-06/2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full-001.md.gz`
- `.context-archive/manifests/2026-06-06T081900Z0000-stage-13s-asset-license-selection-nextchat-full.manifest.json`

`.context-archive/` should remain local and unstaged by default.

## Verification

Verified in Figma:

- Figma page exists.
- Board `1:2` exists.
- Frames A/B/C are still `390x844`.
- Selection matrix `7:2` exists.

Verified locally:

- `docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md` contains updated local asset and game tool sections.
- `git status --short` was inspected.
- Web sources for license-loose recommendations were rechecked using current search results.

Archive script verification:

- Manifest path was produced.
- Raw gzip path was produced.
- SQLite index path was produced.
- Verify phrase was searchable.

## Risks And Caveats

- Current raw archive is best-effort, not exact transcript.
- Some external asset pages may change license terms; save local proof before production use.
- Some candidate assets may be AI-assisted; record this if Shiki cares about human-made-only assets.
- `.fig` files are Figma import/backup material, not direct implementation assets.
- FreePixel is not CC0; do not treat it like Kenney/OpenGameArt.
- CyberNoir backgrounds are landscape; do not assume they solve the smartphone portrait background requirement.

## Next Step

Recommended next step before Stage 14R:

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

Alternative next step:

- Move to Stage 14R deterministic `AdventurePlayer` implementation using A+B hybrid.
