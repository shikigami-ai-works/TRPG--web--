# Stage 13S: Figma Mobile-First ADV UI Mock

作成日: 2026-06-05

## Result

Figmaの権限更新後、Figmaキャンバスへの自動配置まで完了した。

- Figma file: https://www.figma.com/design/yWr82m5xQQ3mH62VWJrE4M
- Figma page: `Stage 13S Mobile ADV UI Mock`
- Board node: `1:2`
- Frame A: `Stage13S A - Classic ADV / 390x844` (`1:7`)
- Frame B: `Stage13S B - Investigation Drawer-Heavy / 390x844` (`1:78`)
- Frame C: `Stage13S C - Immersive Horror / 390x844` (`1:156`)
- Selection matrix: `Stage13S Selection Matrix - local assets and tools` (`7:2`)
- Project SVG backup: `docs/assets/stage-13s-web-adv-mobile-ui-mock.svg`

Verification from Figma readback:

- Frame count: 3
- Each frame size: `390x844`
- A/B/C all include status, stage, ADV text box, and bottom nav.
- B/C include drawer or drawer-peek layers.
- Selection matrix verified on the same board; the primary 390x844 frames remain unchanged.

## Source Inputs

- Repo: `D:\Codex\TRPG--web--`
- Main spec: `docs/web-adv-v0-2-player-experience-spec.md`
- Handoff: `docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md`
- Local Figma asset shelf: `D:\Codex\figma assets\`
- Local game tool shelf: `D:\Codex\game tools\`

## Capability And Agent Use

This stage used a fuller selection pass because the first UI direction will strongly shape Stage 14R.

- `capability-preflight`: selected relevant skills/tools and excluded code/runtime work.
- `frontend-design`: strengthened the A/B/C comparison around actual player experience rather than generic mobile UI.
- `context-optimization`: kept large local asset folders as ranked summaries instead of pulling huge archives into context.
- Figma MCP with `figma-use`: read the existing editable board and added the asset/tool selection matrix.
- Multi-agent explorers:
  - Asset explorer: ranked the local Figma asset shelf for A/B/C use.
  - Tool explorer: inspected the game tool zips without installing, launching visible GUI, or extracting large files.

Skipped deliberately:

- No scenario YAML, runtime code, story body, or archived handbook edits.
- No final production image/font/icon import.
- No broad extraction of multi-GB map packs.
- No Stage 14R implementation yet.

## Local Asset Selection

Use these files as references for the next Figma refinement or Stage 14R visual vocabulary. They are not approved final assets yet.

| Rank | Local asset | Best use | Variant support | Notes |
|---:|---|---|---|---|
| 1 | `D:\Codex\figma assets\game\Mobile Game UI_UX by econev (Community).fig` | Mobile game HUD density, button rhythm, screen composition | A/B, light C | Heavy `.fig`; import/readback in Figma before use. |
| 2 | `D:\Codex\figma assets\game\Pixel Game User Interface (Community).fig` | ADV text box borders, choice buttons, pixel-adjacent UI language | A/B/C | Good style reference; rebuild components rather than paste as final art. |
| 3 | `D:\Codex\figma assets\tinyRPG_manaSoulGUI_v_1_0.zip` | 9-slice panels, tabs, headers, close/options controls, portrait frames | A/B/C | Sprite/zip reference, not a Figma component library yet. |
| 4 | `D:\Codex\figma assets\game\Mobile Game Settings (Community).fig` | Bottom nav, modal/drawer, status/settings organization | B/A | Better for evidence/log/status drawers than for the stage itself. |
| 5 | `D:\Codex\figma assets\game\application mobile top up game online (Community).fig` | Compact cards, history rows, resource/status presentation | B/A | Avoid making the investigation UI feel like a payment app. |
| 6 | `D:\Codex\figma assets\Mobile App Design for Health App, Game App Concept (Community).fig` | 390x844-ish mobile composition reference | A/B | Useful for spacing, less useful for game mood. |
| 7 | `D:\Codex\figma assets\not-jam-font-pack-zip.zip` | Horror/terminal/pixel headings and contamination flavor | C/A | Check license and Japanese glyph coverage before any production use. |
| 8 | `D:\Codex\figma assets\game\Game Icons (Community).fig`, `RPG Awesome Icons Set by Iconduck`, `Game Icons by Iconduck` | Evidence, Log, Status, Inventory, Trust icon candidates | A/B | Confirm license, line weight, and world-fit. |
| 9 | `D:\Codex\figma assets\Sci-Fi UI Dashboard (Community).make` | Desktop-expanded right panel and old-terminal status mood | B/C | `.make` is not normal direct Figma design input. |
| 10 | `D:\Codex\figma assets\Liquid Glass Material Editor (Community).make` | Boundary contamination overlay texture study | C | Use sparingly; readability has priority. |

Defer or avoid for Stage 13S:

- `Core_Mapmaking_Pack_*.zip`: huge 3-4GB archives; map/production-art oriented, not useful for this mobile UI selection pass.
- Music-player `.fig` files: possible dark-card reference, but weaker than the game shelf.
- `Dashboard Kit.fig`: import/read risk observed; not worth blocking this stage.
- Raw `.fig` as direct Codex input: import into Figma or export needed SVG/PNG/PDF references first.

## Game Tool Check

`D:\Codex\game tools\` was inspected without installation, visible GUI launch, or production extraction.

| Tool/archive | Usability | Stage 13S decision |
|---|---|---|
| `rahituber-win-stable.zip` | Looks Windows-usable after extraction; contains `RahiTuber_64.exe`, PortAudio DLLs, UI resources, license/readme files. | Do not change the UI direction. Keep as a later portrait blink/talk/pose verification tool. |
| `Demo_Sprites.zip` | Looks usable as RahiTuber sample material; contains idle/talk/blink PNGs, spritesheets, and XML configs. | Useful later for character asset structure: idle, talk, blink, layered sprites. Not a player UI asset. |
| `rahituber-win.zip` | Looks Windows-usable but less preferable than stable for first check. | Keep as fallback/comparison only. |
| `rahituber-linux-beta-x64.zip` | Linux build; not useful for Windows-native verification here. | Ignore for Stage 13S. |

Future test command, only when portrait tooling is in scope:

```powershell
New-Item -ItemType Directory -Force 'D:\Codex\TRPG--web--\.runtime\tool-check'
Expand-Archive -LiteralPath 'D:\Codex\game tools\rahituber-win-stable.zip' -DestinationPath 'D:\Codex\TRPG--web--\.runtime\tool-check\rahituber-win-stable'
Expand-Archive -LiteralPath 'D:\Codex\game tools\Demo_Sprites.zip' -DestinationPath 'D:\Codex\TRPG--web--\.runtime\tool-check\Demo_Sprites'
```

Do not let RahiTuber pull Stage 14R toward avatar tooling. It belongs to a later character asset pipeline.

## Common Frame Contract

All three primary mock frames are `390x844` CSS px.

Shared slots:

- Top compact status: boundary contamination, memory, Akari trust, evidence/log counts.
- Stage: smartphone portrait background slot, character slot, contamination visual layer.
- ADV text box: nameplate, Japanese body text, tap/advance affordance.
- Choice tray: max 3-4 visible choices, hidden unmet requirements by default.
- Bottom nav: Evidence, Log, Status drawer entry.
- Mobile detail behavior: bottom sheet drawer.
- Desktop translation: right side panel or right drawer; do not enlarge the phone frame into empty side gutters.

## Variant A: Classic ADV

Purpose:

- Safest first implementation baseline for Stage 14R.
- Prioritizes reading flow, paper-theater composition, and predictable control placement.

Layout:

- Status: `22,24,346,46`
- Stage: `22,82,346,384`
- Text box: `22,478,346,188`
- Choices: `22,678` onward, three stacked choices.
- Bottom nav: `10,794,370,40`

Use this if:

- Shiki wants the first playable shell to land quickly.
- The current risk is implementation complexity rather than visual identity.

Risk:

- TRPG investigation flavor may feel too understated unless evidence/log moments are animated well.

## Variant B: Investigation Drawer-Heavy

Purpose:

- Best expresses TRPG investigation and evidence/log play.
- Makes bottom sheet behavior explicit before implementation.

Layout:

- Status: `22,24,346,42`
- Stage: `22,78,346,282`
- Text box: `22,372,346,146`
- Evidence drawer open state: `10,534,370,260`
- Bottom nav: `10,794,370,40`

Use this if:

- Shiki wants the game to feel like investigation first, novel second.
- Stage 14R should prove evidence/log/status drawers early.

Risk:

- The open drawer compresses stage and text; careful typography and sheet height rules are required.

## Variant C: Immersive Horror

Purpose:

- Strongest unique visual identity.
- Makes boundary contamination and memory instability visible without hiding required text.

Layout:

- Status: `22,22,346,36`
- Stage: `22,66,346,498`
- Text box: `22,574,346,166`
- Status drawer peek: `72,748,246,34`
- Bottom nav: `10,794,370,40`

Use this if:

- Shiki wants the first impression to be horror/uncanny rather than standard ADV.
- The team is willing to spend extra audit time on readability and overlap.

Risk:

- Highest chance of visual effects competing with text and choice clarity.

## Recommendation For Stage 14R

Use an A+B hybrid:

- Adopt Variant A as the default layout skeleton.
- Borrow Variant B's bottom sheet and evidence/log/status density.
- Keep Variant C's contamination effects as a restrained state layer, not the default first-screen look.

This gives Stage 14R a safer deterministic implementation path while preserving the future visual identity.

## Acceptance Checks For The Chosen Direction

- At `390x844`, text, choices, drawer, and bottom nav do not overlap.
- At `430x932`, the layout gains breathing room without changing the interaction model.
- At `1280x720` and `1440x900`, evidence/log/status move to a desktop-expanded side panel or right drawer.
- No enabled control exists without a user-observable outcome.
- Contamination effects never obscure mandatory choices or required story text.
- Unmet requirements remain hidden unless the locked state itself is a story beat.

## Next Step Prompt

```text
Stage 14R: Deterministic AdventurePlayer vertical-slice shell

Objective:
Implement the first deterministic player-facing ADV shell for scenes 1-3 using the existing scenario pack/runtime and the v0.2 spec, with Variant A+B as the layout seed.

Scope:
Add `components/adventure/*` and `lib/adventure/*` modules, change `/` to render `AdventurePlayer`, add `/debug` for `ScenarioExplorer`, and keep existing scenario YAML/body/runtime contracts intact.

Layout seed:
Use Variant A as the default smartphone ADV skeleton. Add Variant B style bottom drawers for Evidence, Log, and Status. Keep Variant C contamination effects as a restrained optional state layer only.

Constraints:
Do not rewrite scenario YAML, story body, ending gates, or the archived handbook. Do not implement AI GM yet. Do not expose placeholder-enabled buttons.

Verification:
Run `npm run validate:scenarios`, `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build`. Then run a browser/UI interaction audit at `390x844`, `430x932`, `1280x720`, and `1440x900`.

Done:
The player can open `/`, read/advance scenes 1-3 as a paper-theater ADV, make choices, see dice/story results, view evidence/log/status/trust through drawers or side panel, and still use `ScenarioExplorer` from `/debug`.
```
