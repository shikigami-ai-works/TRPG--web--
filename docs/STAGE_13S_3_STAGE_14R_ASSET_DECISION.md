# Stage 13S-3: Stage 14R Asset Decision Gate

Proof date: 2026-06-06

This note fixes the temporary asset/reference boundary for Stage 14R. The
license evidence source of truth is
`docs/STAGE_13S_2_LICENSE_SAFE_ADV_ASSET_SHORTLIST.md`.

## Decision

Stage 14R may proceed with project-native UI implementation, CSS/SVG
placeholders, and a narrow CC0 reference/import set. Stage 14R must not download
or import paid assets, unclear-license assets, local Figma Community art, or
AI-generated/AI-assisted visual assets unless Shiki explicitly opens a later
approval gate.

Status meanings:

- `use-now`: allowed for Stage 14R temporary implementation, with license proof
  retained from the Stage 13S-2 shortlist before any asset file is copied.
- `reference-only`: may inform layout, palette, proportions, or structure; no
  pixels/vectors/files may be copied into production.
- `defer`: keep out of Stage 14R; revisit in commissioning, generation, or
  purchase/review stage.
- `avoid`: do not use for Stage 14R direction.

## Exact Allowed Source Set

`use-now` source set:

- Project-native CSS/React components, silhouettes, placeholders, generated
  CSS noise, and inline SVG drawn specifically for this repo.
- Kenney Pixel UI Pack: https://kenney.nl/assets/pixel-ui-pack
- Kenney UI Pack: https://kenney.nl/assets/ui-pack
- Kenney UI Pack RPG Expansion: https://kenney.nl/assets/ui-pack-rpg-expansion
- Tiny RPG - Mana Soul GUI: https://tiopalada.itch.io/tiny-rpg-mana-soul-gui
- Not Jam Font Pack: https://not-jam.itch.io/not-jam-font-pack
- Kenney Game Icons: https://kenney.nl/assets/game-icons
- Kenney Board Game Icons: https://kenney.nl/assets/board-game-icons
- Kenney Particle Pack: https://kenney.nl/assets/particle-pack

`reference-only` source set:

- CyberNoir - Streets by greenly: https://greenly.itch.io/cybernoir-streets
- Kenney Fantasy UI Borders: https://kenney.nl/assets/fantasy-ui-borders
- Haunted Hotel Asset Pack by Not Jam:
  https://not-jam.itch.io/haunted-hotel-asset-pack
- OpenGameArt Kenney mirror:
  https://opengameart.org/content/pixel-ui-pack-750-assets
- Local Figma Community files under `D:\Codex\figma assets\game\`
- Local `Sci-Fi UI Dashboard (Community).make`
- RahiTuber software and `Demo_Sprites.zip` as pipeline/structure reference
  only
- POMPACK Modern Mystery Characters:
  https://pompack.itch.io/mystery-character-sprite-set

`defer` source set:

- Game-icons.net: https://game-icons.net/faq.html
- FreePixel Pixel Art Horror Survival Theme Pack:
  https://freepixel.art/pack/pixelvault-theme-horror-survival
- FreePixel Pixel Art Cyberpunk Vol 2:
  https://freepixel.art/pack/pixelvault-cyberpunk-assets
- Liminal Games free horror bedroom backgrounds:
  https://liminal-space-dev.itch.io/free-horror-bedroom-vn-backgrounds
- DJY66 horror background packs, Obscura Vox, Nexa Visuals, and QunBackground

## Asset Class Gate

| Asset class | Stage 14R status | Allowed temporary set | Reference-only | Defer | Avoid |
| --- | --- | --- | --- | --- | --- |
| `backgrounds` | `use-now` | CSS gradients/noise/flat color scene placeholders drawn in repo | CyberNoir for noir/crop mood only | Liminal, DJY66, FreePixel, QunBackground, original final backgrounds | Paid/unclear downloads and AI-assisted background use |
| `characters` | `use-now` | CSS/inline-SVG silhouettes, nameplates, empty portrait slots | POMPACK as style/pose reference; RahiTuber layer structure only | Commissioned/generated standing portraits and sprite layer tests | `Demo_Sprites.zip` art reuse and any external character import |
| `ui/textbox` | `use-now` | Native textbox components; Kenney Pixel UI, Kenney UI Pack, Tiny RPG as CC0 scaffold sources; Not Jam for Latin/style checks only | Kenney Fantasy UI Borders for danger-border mood | Final bespoke textbox art and Japanese font decision | Local Figma UI pixel copying |
| `ui/choices` | `use-now` | Native choice buttons/states; Kenney Pixel UI, Kenney UI Pack, Tiny RPG as CC0 scaffold sources | Kenney Fantasy UI Borders for locked/danger mood | Final dangerous/locked state redraws | Unverified Figma choice components |
| `ui/drawers` | `use-now` | Native drawer panels; Kenney UI Pack, RPG Expansion, Tiny RPG as CC0 scaffold sources | Local mobile/settings Figma files for organization only | Final drawer skin and motion polish | Copying local Figma assets without source recovery |
| `ui/icons` | `use-now` | Kenney Game Icons, Kenney Board Game Icons, or repo-drawn inline SVG | None needed for Stage 14R | Game-icons.net attribution-managed import; custom evidence/log/status icon set | Mixed-license Iconduck/local Figma icon imports |
| `evidence props` | `use-now` | Text cards, CSS chips, Kenney Board Game Icons, repo-drawn placeholders | Haunted Hotel for low-res horror prop mood | Bespoke photo/note/testimony card art; FreePixel props after review | Raw commercial pack imports |
| `contamination effects` | `use-now` | CSS overlays, masks, repo-drawn SVG noise, Kenney Particle Pack textures | Haunted Hotel small FX mood | FreePixel, Obscura, DJY66, and generated final effects | AI-assisted or paid effect packs without later approval |
| `desktop side-panel references` | `use-now` | Native side-panel layout, Kenney UI Pack panels, Kenney Board Game Icons | Local Figma dashboard/sci-fi files for density/layout only | Final desktop investigative panel design pass | Telerik/Kendo, music-player kits, Liquid Glass default look, copied dashboard assets |

## Stage 14R Rules

- Do not add binary art packs to the repo unless they are in the `use-now`
  source set and the Stage 13S-2 proof row is cited in the implementation note.
- Prefer native CSS/React surfaces over importing raster UI art.
- Keep all commercial-with-conditions, paid, unclear-license, local Figma, and
  AI-assisted visual candidates out of implementation files.
- Use silhouettes/placeholders for characters; do not solve production portrait
  art in Stage 14R.
- Treat Not Jam fonts as optional Latin/style reference until Japanese glyph
  coverage is checked.
- Any new asset candidate found during Stage 14R must be classified in a later
  license note before use.

## Done Boundary

Stage 14R can begin from this rule: build the ADV surface with native UI,
placeholders, and the listed CC0 scaffold/icon/effect sources only. Everything
else is reference-only, deferred, or avoided until a later explicit approval
gate.
