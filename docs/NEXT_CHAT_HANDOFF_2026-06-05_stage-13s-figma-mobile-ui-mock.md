# NEXT CHAT HANDOFF 2026-06-05 Stage 13S Figma Mobile ADV UI Mock

## Resume Point

Repo: `D:\Codex\TRPG--web--`

Shiki requested `ネクストチャットフル` after Stage 13S Figma mobile UI mock work. Continue from the Web ADV v0.2 direction and the newly created Figma/design docs.

## Read First

1. `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_stage-13s-figma-mobile-ui-mock.md`
2. `docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md`
3. `docs/web-adv-v0-2-player-experience-spec.md`
4. `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`

Figma file:

- `https://www.figma.com/design/yWr82m5xQQ3mH62VWJrE4M`
- Page: `Stage 13S Mobile ADV UI Mock`
- A: `Stage13S A - Classic ADV / 390x844` (`1:7`)
- B: `Stage13S B - Investigation Drawer-Heavy / 390x844` (`1:78`)
- C: `Stage13S C - Immersive Horror / 390x844` (`1:156`)

Local SVG backup:

- `docs/assets/stage-13s-web-adv-mobile-ui-mock.svg`

## Exact Archive Pointer

NextChat Full archive manifest:

- `.context-archive/manifests/2026-06-05T144253Z0000-web-adv-v0-2-stage-13s-figma-mock-nextchat-full.manifest.json`

Archive index:

- `.context-archive/context_index.sqlite3`

Verify text:

- `Stage 13S`
- Found: true
- FTS enabled: true
- Chunk count: 8

Exact archived sources include the v0.2 player spec, autonomous workflow doc, previous UI preservation ledger/handoff, Stage 13S Figma mock doc, and SVG backup. Full chat transcript was not available; surrounding chat reasoning is best-effort in the ledger.

## Key Decisions

- Stage 13S produced three structural mobile-first variants:
  - A. Classic ADV
  - B. Investigation Drawer-Heavy
  - C. Immersive Horror
- Recommended Stage 14R seed is A+B hybrid:
  - A skeleton for safe reading and first implementation.
  - B bottom sheet density for Evidence/Log/Status.
  - C contamination effects only as restrained state layer.
- Shiki agrees that more Figma assets/references could generate more variation. That is a valid optional Stage 13S-2 before coding.
- Figma is a planning/design asset; do not treat it as runtime implementation.

## Current Repo State

Known uncommitted files before this handoff included:

- `M docs/codex-autonomous-workflow.md`
- `?? docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2-ui-preservation.md`
- `?? docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2-ui-preservation.md`
- `?? docs/STAGE_13S_FIGMA_MOBILE_ADV_UI_MOCK.md`
- `?? docs/assets/`
- `?? docs/web-adv-v0-2-player-experience-spec.md`

This handoff adds:

- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_stage-13s-figma-mobile-ui-mock.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-05_stage-13s-figma-mobile-ui-mock.md`

`.context-archive/` is ignored and should stay local unless Shiki explicitly requests raw archive publication.

## Next Best Options

Option 1: Stage 13S-2 asset scouting

- Search Figma/community/game UI references for ADV, horror, pixel-style, investigation, drawer, and evidence panel patterns.
- Expand the current 3 structural variants into 6-9 visual/style directions.
- Do not change runtime/scenario files.

Option 2: Stage 14R implementation

- Implement deterministic `AdventurePlayer` for scenes 1-3.
- Use A+B hybrid as the UI seed.
- Add `/debug` for `ScenarioExplorer`.
- Keep scenario YAML/current spec as the implementation contract.
- Run scenario validation, tests, typecheck, lint, build, and browser interaction audit.

## Do Not Do

- Do not commit or push unless Shiki says `Git push`.
- Do not run Obsidian Git unless Shiki explicitly asks.
- Do not change Kimidake scenario YAML/body/route gates during asset scouting.
- Do not implement AI GM before deterministic ADV loop is playable.
- Do not expose enabled placeholder controls in any player UI.
