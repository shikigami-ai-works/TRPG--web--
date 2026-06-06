# Stage 13S-2: License-safe ADV Asset Shortlist

Proof date: 2026-06-06

## Purpose

This document classifies external and local asset candidates for the pixel-style horror investigation ADV direction before Stage 14R.

The goal is not to pick final art. The goal is to let Shiki choose a safe acquisition/reference path for:

- `backgrounds`
- `characters`
- `ui/textbox`
- `ui/choices`
- `ui/drawers`
- `ui/icons`
- `evidence`
- `effects/contamination`
- `desktop/side-panel`

## Direction Guardrails

Use assets as support for a horror investigation ADV, not as a generic pixel RPG.

Prefer:

- Smartphone portrait ADV readability.
- High-resolution pixel-style backgrounds or references.
- Standing portrait structure and expression planning.
- 9-slice panels, text boxes, choice buttons, drawers, icons, evidence cards, small status tags, and restrained contamination overlays.
- Desktop-expanded evidence/log/status side-panel references.

Avoid:

- Tile-map-first thinking for the main player surface.
- HP/MP-first HUD language, sword/magic icon language, bright generic mobile HUDs.
- Effects that obscure required story text or mandatory choices.
- Raw `.fig` files as if they were direct code assets.

## Recommended Acquisition Path

1. Use CC0 UI assets for the Stage 14R prototype shell: Kenney Pixel UI, Kenney UI Pack/RPG Expansion, Tiny RPG Mana Soul GUI, Kenney icons, Not Jam fonts.
2. Use CC0 backgrounds only as temporary or mood reference unless they are already close to the portrait ADV scene need: CyberNoir is strong mood reference, Liminal/DJY66 are usable only if AI-assisted art is acceptable.
3. Treat characters as the biggest production gap. There is no perfect CC0 standing-portrait set in the current shortlist. Use POMPACK only if the non-pixel line-art look is acceptable, or commission/generate original portraits.
4. Use FreePixel as a commercial-with-conditions scratchpad only after saving the specific per-pack/page license proof and accepting its generative-technology caveat.
5. Use local Figma Community files as layout/reference material only until the original Community URL, creator, and attribution line are recovered.

## CC0-safe

These are safe enough for prototype use if their current source proof is saved before acquisition. AI caveats still matter for public production art.

| Asset | Source URL | License label | Attribution requirement | Commercial use | Redistribution restriction | AI-generated or AI-assisted caveat | Proof date | Best in-game asset class | Production note |
|---|---|---|---|---|---|---|---|---|---|
| Kenney Pixel UI Pack | https://kenney.nl/assets/pixel-ui-pack | Creative Commons CC0 | Not required; optional Kenney credit is okay | Allowed | CC0; do not use Kenney logo as endorsement | None visible on page | 2026-06-06 | `ui/textbox`, `ui/choices`, `ui/drawers` | Best first UI skeleton source. Use panels/buttons/scrollers; recolor to horror ADV palette. |
| OpenGameArt Pixel UI Pack 750 assets | https://opengameart.org/content/pixel-ui-pack-750-assets | CC0 | Credit "Kenney.nl" or "www.kenney.nl" is listed as not mandatory | Allowed | CC0 | None visible on page | 2026-06-06 | `ui/textbox`, `ui/choices`, `ui/drawers` | Mirror/reference for Kenney Pixel UI. Prefer official Kenney URL for acquisition. |
| Kenney UI Pack | https://kenney.nl/assets/ui-pack | Creative Commons CC0 | Not required | Allowed | CC0; do not imply Kenney endorsement | None visible on page | 2026-06-06 | `ui/textbox`, `ui/choices`, `ui/drawers`, `desktop/side-panel` | Good neutral panel/button base if Pixel UI is too tiny. |
| Kenney UI Pack RPG Expansion | https://kenney.nl/assets/ui-pack-rpg-expansion | Creative Commons CC0 | Not required | Allowed | CC0; do not imply Kenney endorsement | None visible on page | 2026-06-06 | `ui/drawers`, `ui/choices`, `status` | Use panels, sliders, and drawers only. Avoid RPG combat framing in player UI. |
| Kenney Fantasy UI Borders | https://kenney.nl/assets/fantasy-ui-borders | Creative Commons CC0 | Not required | Allowed | CC0; do not imply Kenney endorsement | None visible on page | 2026-06-06 | `ui/textbox`, `ui/choices` | Use sparingly for uncanny text borders; avoid ornate fantasy tone. |
| Tiny RPG - Mana Soul GUI | https://tiopalada.itch.io/tiny-rpg-mana-soul-gui and local `D:\Codex\figma assets\tinyRPG_manaSoulGUI_v_1_0.zip` | Creative Commons Zero v1.0 Universal | Not required by license | Allowed | CC0; creator asks not to use resources for AI model feeding or crypto uses | Page says no generative AI was used | 2026-06-06 | `ui/textbox`, `ui/choices`, `ui/drawers`, `characters` portrait frames | Strong local 9-slice/buttons/cursors source. Honor creator request even if CC0. |
| Not Jam Font Pack | https://not-jam.itch.io/not-jam-font-pack and local `D:\Codex\figma assets\not-jam-font-pack-zip.zip` | Creative Commons Zero v1.0 Universal | Not required | Allowed | CC0 | Page says no generative AI was used | 2026-06-06 | `ui/textbox`, `ui/choices`, `ui/icons` labels | Good Latin pixel UI/font reference. Check Japanese glyph coverage before shipping. |
| Kenney Game Icons | https://kenney.nl/assets/game-icons | Creative Commons CC0 | Not required | Allowed | CC0; do not imply Kenney endorsement | None visible on page | 2026-06-06 | `ui/icons`, `evidence` | Safe icon fallback. May need redraws for evidence/log/status specificity. |
| Kenney Board Game Icons | https://kenney.nl/assets/board-game-icons | Creative Commons CC0 | Not required | Allowed | CC0; do not imply Kenney endorsement | None visible on page | 2026-06-06 | `ui/icons`, `evidence`, `desktop/side-panel` | Better than fantasy combat icons for cards, evidence, tokens, counters. |
| Kenney Particle Pack | https://kenney.nl/assets/particle-pack | Creative Commons CC0 | Not required | Allowed | CC0; do not imply Kenney endorsement | None visible on page | 2026-06-06 | `effects/contamination` | Use as source texture/noise for boundary contamination, not flashy combat VFX. |
| CyberNoir - Streets by greenly | https://greenly.itch.io/cybernoir-streets | CC0 | Not required | Allowed | CC0 | None visible on page | 2026-06-06 | `backgrounds` | Strong noir/crime VN mood. Landscape 3072x2048, so crop/recompose for smartphone portrait. |
| Haunted Hotel Asset Pack by Not Jam | https://not-jam.itch.io/haunted-hotel-asset-pack | Creative Commons Zero v1.0 Universal | Not required | Allowed | CC0; creator does not endorse NFT/direct resale of unmodified assets | Page says no generative AI was used | 2026-06-06 | `evidence`, `ui/icons`, `effects/contamination` | Useful low-res horror reference for keys/cards/small FX, not final ADV backgrounds. |
| FREE HORROR BEDROOM VN BACKGROUNDS by Liminal Games | https://liminal-space-dev.itch.io/free-horror-bedroom-vn-backgrounds | Creative Commons Zero v1.0 Universal plus page terms | No attribution required | Allowed | Page asks not to redistribute or resell the pack itself | Page says AI-generated and AI assisted | 2026-06-06 | `backgrounds` | License-safe if AI-assisted art is acceptable. Use as temp/mood or after explicit AI-art approval. |

## Commercial-with-conditions

These can be useful, but they are not CC0 or have platform/product conditions. Save a screenshot/PDF of the exact page and license before purchase or download.

| Asset | Source URL | License label | Attribution requirement | Commercial use | Redistribution restriction | AI-generated or AI-assisted caveat | Proof date | Best in-game asset class | Production note |
|---|---|---|---|---|---|---|---|---|---|
| FreePixel Pixel Art Horror Survival Theme Pack | https://freepixel.art/pack/pixelvault-theme-horror-survival | FreePixel asset license / free and commercial-ready | Not required per FreePixel page and FAQ | Allowed | Do not resell or redistribute raw assets; include only in larger creative work | FreePixel terms say assets may use generative technology | 2026-06-06 | `evidence`, `effects/contamination`, `backgrounds` props | Useful scratchpad for horror props. Not CC0; save per-pack proof and accept AI/provenance risk. |
| FreePixel Pixel Art Cyberpunk Vol 2 | https://freepixel.art/pack/pixelvault-cyberpunk-assets | FreePixel asset license / free and commercial-ready | Not required per FreePixel page and FAQ | Allowed | Do not resell or redistribute raw assets; include only in larger creative work | FreePixel terms say assets may use generative technology | 2026-06-06 | `backgrounds`, `evidence`, `desktop/side-panel`, `ui/icons` | Broad cyberpunk asset pool. Use for reference/prototype, not as the only art identity. |
| Game-icons.net | https://game-icons.net/faq.html | CC-BY or Public Domain depending on icon | Credit authors; link/credits page recommended | Allowed | Follow CC BY terms and author credit requirements | None visible in FAQ | 2026-06-06 | `ui/icons`, `evidence` | Good if attribution management is acceptable. Prefer Kenney CC0 when icon coverage is enough. |
| POMPACK Modern Mystery Characters | https://pompack.itch.io/mystery-character-sprite-set | POMPACK product terms; copyright not waived | Optional credit: "POMPACK" or "@sozaiPOMPACK" | Allowed within product terms | No redistribution/sale of materials themselves; no false ownership claims | Page says no generative AI was used | 2026-06-06 | `characters` | Strong mystery/VN fit, paid and non-pixel line-art. Use if Shiki accepts style shift or as commission reference. |
| Figma Community free files, general rule | https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing | Free files default to CC BY 4.0 unless creator adds/replaces terms | Attribution required to original creator | Allowed under CC BY 4.0 | Paid files have stronger no-resale/no-redistribution limits | Per file, not globally visible | 2026-06-06 | `desktop/side-panel`, `ui/drawers`, `ui/textbox` references | Applies only after the exact Community source page and creator are recovered for each local `.fig`. |
| RahiTuber software | https://rahisaurus.itch.io/rahituber and local `D:\Codex\game tools\rahituber-win-stable.zip` | BSD-style software license in local archive | Binary/source redistributions must carry license notices; social credit optional | Software use allowed | Preserve license notices in redistribution | Not visible for software | 2026-06-06 | `characters` pipeline reference | Tool only. Does not grant rights to Demo_Sprites or final portraits. Keep for later blink/talk verification. |

## Needs-license-review

Do not use these as production assets until the missing proof is recovered. They may be useful as references.

| Candidate | Source URL | License label | Attribution requirement | Commercial use | Redistribution restriction | AI-generated or AI-assisted caveat | Proof date | Best in-game asset class | Review needed |
|---|---|---|---|---|---|---|---|---|---|
| Local Figma `Mobile Game UI_UX by econev (Community).fig` | Local only: `D:\Codex\figma assets\game\Mobile Game UI_UX by econev (Community).fig`; original Community URL not recorded | Likely Figma Community file rules, exact source unknown | Unknown until creator/source recovered | Unknown until source recovered | Unknown until source recovered | Unknown | 2026-06-06 | `ui/drawers`, `desktop/side-panel` | Recover Figma Community page, creator, and attribution line before copying assets. |
| Local Figma `Pixel Game User Interface (Community).fig` | Local only: `D:\Codex\figma assets\game\Pixel Game User Interface (Community).fig`; original Community URL not recorded | Likely Figma Community file rules, exact source unknown | Unknown until creator/source recovered | Unknown until source recovered | Unknown until source recovered | Unknown | 2026-06-06 | `ui/textbox`, `ui/choices` | Good visual reference, but no production copy until source and license are documented. |
| Local Figma `Mobile Game Settings (Community).fig` | Local only: `D:\Codex\figma assets\game\Mobile Game Settings (Community).fig`; original Community URL not recorded | Likely Figma Community file rules, exact source unknown | Unknown until creator/source recovered | Unknown until source recovered | Unknown until source recovered | Unknown | 2026-06-06 | `ui/drawers`, `desktop/side-panel` | Reference drawer/settings organization only. |
| Local Figma `Game Icons (Community).fig` and Iconduck game icon files | Local only under `D:\Codex\figma assets\game\`; exact source/set unknown | Mixed icon licenses possible | Unknown until per-set license recovered | Unknown until per-set license recovered | Unknown until per-set license recovered | Unknown | 2026-06-06 | `ui/icons`, `evidence` | Prefer Kenney CC0 or Game-icons.net direct source. |
| Local Figma `Sci-Fi UI Dashboard (Community).make` | Local only: `D:\Codex\figma assets\Sci-Fi UI Dashboard (Community).make`; original source not recorded | Figma Make/Community terms uncertain for this file | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | `desktop/side-panel` | Use as mood/reference only. Do not copy assets into production. |
| Local `Demo_Sprites.zip` from RahiTuber shelf | Local only: `D:\Codex\game tools\Demo_Sprites.zip`; source/license not found in archive listing | Unknown | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | `characters` pipeline reference | Structure reference only for idle/talk/blink/layers. No production reuse. |
| DJY66 PS1 Horror Environment Pack | https://djy66.itch.io/pixel-horror-backgrounds-8k-retro-pixel-art-pack | Commercial product terms, not CC0 | Credit appreciated, not required per page | Allowed by page terms | No resale/redistribution/repackage of original files | Page says AI-assisted workflow | 2026-06-06 | `backgrounds` | Paid. Do not download yet. Review license file after purchase only if AI-assisted background style is accepted. |
| DJY66 Free 8K Horror Pixel Art Backgrounds sample | https://djy66environment-assets.itch.io/free-8k-horror-pixel-art-backgrounds-sample | Devlog/search proof says CC0; asset page itself lacks a visible license field in the captured source | Unknown on asset page; devlog says CC0 | Likely allowed if devlog proof is saved | Unknown on asset page | Page comment says it is upscaled pixel-style, not traditional hand-placed pixel art | 2026-06-06 | `backgrounds` | Keep in review until direct license proof from asset page/download README is captured. |
| Obscura Vox horror packs | https://obscuravox.itch.io/ | Per-product paid license not captured | Unknown until product page/license file | Unknown until product page/license file | Unknown until product page/license file | Unknown from profile | 2026-06-06 | `backgrounds`, `ui/textbox`, `ui/choices`, `effects/contamination` | Potentially useful horror UI/background/VFX catalog, but no acquisition without per-product terms. |
| Nexa Visuals detective/cyberpunk UI references | https://itch.io/profile/nexavisuals | Commercial royalty-free claims appear in posts, exact per-pack terms vary | Unknown until product page/license file | Likely allowed for some packs, unverified | Unknown until per-pack license file | Several posts say AI-assisted visual reference images | 2026-06-06 | `desktop/side-panel`, `ui/drawers`, `backgrounds` | Reference-only unless Shiki accepts AI-assisted moodboards and the exact product license is saved. |
| QunBackground VN background packs | https://qunbackground.itch.io/ | Commercial/license-safe marketing claim; exact product terms not captured | Unknown until product page/license file | Likely allowed, unverified | Unknown until product page/license file | Unknown | 2026-06-06 | `backgrounds` | Non-pixel anime VN direction. Review only if moving away from pixel-style art. |

## Avoid-for-now

These are not useful for the next stage or carry too much scope/license/style risk.

| Candidate | Source URL | License label | Attribution requirement | Commercial use | Redistribution restriction | AI-generated or AI-assisted caveat | Proof date | Best in-game asset class | Avoid reason |
|---|---|---|---|---|---|---|---|---|---|
| `Core_Mapmaking_Pack_Part1_v1.09.zip`, `Part2`, `Part3` | Local only: `D:\Codex\figma assets\Core_Mapmaking_Pack_*.zip` | Unknown | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | None for Stage 14R | Multi-GB, map/tile first, license not reviewed, not the mobile ADV surface. |
| Music-player Figma files | Local only: `D:\Codex\figma assets\music\*.fig` | Unknown | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | None | Not aligned with horror investigation ADV. |
| `Telerik & KENDO UI Kit 3.2 for Material (Community).fig` | Local only: `D:\Codex\figma assets\Telerik & KENDO UI Kit 3.2 for Material (Community).fig` | Third-party UI kit terms not reviewed | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | None | Branded/professional UI kit; unnecessary licensing and style risk. |
| Dashboard/PowerBI/Carbon chart files | Local only: `D:\Codex\figma assets\Dashboard Kit.fig`, `(Alpha) Carbon Charts Library (Community).fig`, `Power BI Sales Analysis Dashboard (Community).make` | Unknown | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | `desktop/side-panel` reference only | May inspire dense side panels, but do not copy production assets. |
| `Liquid Glass Material Editor (Community).make` | Local only: `D:\Codex\figma assets\Liquid Glass Material Editor (Community).make` | Unknown | Unknown | Unknown | Unknown | Unknown | 2026-06-06 | None | Wrong default look for this ADV and risks readability. At most study as contamination texture inspiration. |
| RahiTuber as Stage 14R driver | https://rahisaurus.itch.io/rahituber | Tool license, not art license | License notices if redistributed | Software use allowed | Preserve notices for redistributed software | Not visible | 2026-06-06 | None for Stage 14R | Useful later for character blink/talk testing, but should not steer the player UI implementation. |

## Asset-class Coverage

| Asset class | Safe first option | Conditional option | Gap / action |
|---|---|---|---|
| `backgrounds` | CyberNoir for noir mood; Liminal if AI-assisted accepted | FreePixel cyberpunk/horror, DJY66 paid/free after review | Need original portrait ADV backgrounds for production. |
| `characters` | No strong CC0 production pick | POMPACK commercial-with-conditions; FreePixel sprites for structural scratchpad | Commission/generate original standing portraits. |
| `ui/textbox` | Kenney Pixel UI, Tiny RPG Mana Soul, Kenney UI Pack | Local Figma UI references after source recovery | Build project-native components; do not paste Figma art blindly. |
| `ui/choices` | Kenney Pixel UI, Tiny RPG Mana Soul | Kenney Fantasy UI Borders for danger states | Redraw dangerous/locked choice states in project style. |
| `ui/drawers` | Kenney UI Pack/RPG Expansion, Tiny RPG Mana Soul | Figma mobile/settings files after source recovery | Stage 14R can implement with CSS/React components first. |
| `ui/icons` | Kenney Game Icons, Kenney Board Game Icons | Game-icons.net with attribution | Prefer CC0 for lower attribution burden. |
| `evidence` | Kenney Board Game Icons, Haunted Hotel small props | FreePixel horror props, Game-icons.net | Need bespoke photo/note/testimony card art later. |
| `effects/contamination` | Kenney Particle Pack, Haunted Hotel small FX | FreePixel horror effects, Obscura/DJY66 after review | Use restrained CSS/SVG effects first. |
| `desktop/side-panel` | Kenney UI Pack components, Board Game Icons | Figma dashboard/sci-fi files as reference only | Design project-native side panel; do not copy local Community assets without attribution proof. |

## License-proof Checklist Before Production Use

For every asset actually acquired or copied into the project, save a proof bundle before use:

- Source page URL.
- Creator name.
- License label exactly as shown.
- Attribution line if required or optional.
- Commercial-use statement.
- Redistribution/resale restriction.
- AI-generated/AI-assisted/no-AI disclosure if visible.
- Proof date.
- Screenshot or PDF of the source page.
- Downloaded archive `LICENSE`, `README`, or terms file if present.
- Final in-game asset class and first use location.

Recommended project path for future proofs:

```text
docs/asset-license-proofs/YYYY-MM-DD/<source-slug>/
```

Do not put paid or unclear-license downloads into the repo until the license review is complete.

## Stage 14R Recommendation

Proceed to Stage 14R with project-native UI components and CC0 references only:

- Use Kenney/Tiny RPG/Not Jam as UI scaffold references.
- Use CyberNoir or CSS-generated placeholders only for temporary backgrounds.
- Use silhouette/placeholder character panels until original standing portraits are commissioned or generated.
- Use Kenney icons for evidence/log/status.
- Keep FreePixel, POMPACK, Obscura, Nexa, and local Figma Community files out of production assets until Shiki explicitly approves the condition set.
