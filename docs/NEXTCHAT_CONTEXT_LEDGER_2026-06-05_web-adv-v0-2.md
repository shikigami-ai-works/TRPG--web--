# NEXTCHAT CONTEXT LEDGER 2026-06-05 Web ADV v0.2

## Scope

- Repo: `D:\Codex\TRPG--web--`
- Branch at preservation time: `main`
- Latest pushed commit known in this context: `f18241ba0c6d30eb7197966b4efc6d49ee1af98f`
- User request preserved: `その方針でいくことにする。そう決めたことをコンテキストごと保存して、NextChatfull`
- Preservation mode: NextChat Full, with exact raw archive where an exact source exists.

## Source Fidelity

This ledger separates exact preservation from best-effort reconstruction.

- Exact raw archive: the user-provided attachment `C:\Users\sakur\.codex\attachments\a042527e-3e4f-45c8-9b85-5d9792e81857\pasted-text.txt`.
- Best-effort context: the surrounding chat decisions and reasoning, reconstructed from visible conversation context and current workspace state.
- No exact full chat transcript was available to this Codex turn, so this ledger must not be treated as a verbatim transcript.
- Hidden prompts, credentials, private raw logs, and irrelevant tool output were not preserved.

## Confirmed Product Direction

しき decided to proceed with this direction:

- Keep the project as a Web app.
- Preserve the scenario direction and existing story material.
- Do not keep polishing the current management/debug UI as the final player experience.
- Split the game into a player-facing paper-theater ADV experience and supporting debug/validation tooling.
- Treat the existing `ScenarioExplorer` direction as useful for scenario inspection, validation, and development support, not as the final immersive player UI.
- Build a new high-quality Web ADV player experience, even if that means rewriting large parts of the game engine or starting the player surface from scratch.

Short form:

```text
シナリオは残す。エンジンは分ける。画面は作り直す。
Webアプリのまま、紙芝居風ADVとして上質なゲーム体験を作る。
```

## Important Nuance About Scenario Text

Scenario prose is explicitly not frozen.

- The current story, setting, route intent, character intent, and emotional core should be preserved.
- The exact scenario text may still change in future writing passes.
- Do not overfit engine contracts, UI labels, or tests to draft prose alone.
- When prose changes, verify whether `current-spec`, YAML, tests, UI contracts, and player-facing behavior actually need updates.
- The durable contract should be based on current-spec, scenario YAML, validated route behavior, tests, and the latest accepted handoff, not on old handoff prose alone.

## Handbook Source

The attached handbook was archived as the exact raw source for the future direction.

- Attachment: `C:\Users\sakur\.codex\attachments\a042527e-3e4f-45c8-9b85-5d9792e81857\pasted-text.txt`
- Raw archive: `D:\Codex\TRPG--web--\.context-archive\raw\2026-06-05\2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook-001.txt.gz`
- Manifest: `D:\Codex\TRPG--web--\.context-archive\manifests\2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json`
- Search index: `D:\Codex\TRPG--web--\.context-archive\context_index.sqlite3`
- SHA-256: `abf24ce0496b44acda5dd8c113ed4535e684951041668f7e7b57a27b5bfc9a70`
- Byte count: `32991`
- Indexed chunk count: `4`
- Verification phrase found: `状態で見える世界が変わるTRPGノベルADV`

## Handbook Design Contract

The archived handbook points toward this product shape:

- A solo TRPG-like novel exploration ADV with Japanese pixel-anime 2D presentation.
- A fixed scenario skeleton with AI GM adjudication layered on top.
- The AI GM is an adjudicator and presenter, not a free story author.
- The rule engine owns dice, skills, inventory, flags, route state, evidence, relationships, and persistent state.
- A predefined choice pool exists; AI may choose which choice IDs are visible, but should not invent arbitrary new choices.
- The core promise is: `状態で見える世界が変わるTRPGノベルADV`.

Key player-facing systems from the handbook:

- Full-screen 2D/pixel-anime background and character portrait presentation.
- Text window and nameplate like a paper-theater or visual novel ADV.
- Click/tap advance for prose.
- Choices shown only when relevant.
- Dice and check results presented as story events, not as raw debug mechanics.
- Evidence list or evidence board.
- Skill/state panel, preferably collapsible or secondary.
- NPC trust and memory state.
- Investigation log as a player-facing record.
- SAN, contamination, recognition distortion, memory loss, or similar state that changes text, background, choices, and perception.
- Missed choices, fail-forward costs, dangerous-choice foreshadowing, certainty/speculation distinction, and dice log as story record.

Suggested MVP shape from the handbook:

- 1 scenario.
- 3 to 5 scenes.
- 15 to 30 predefined choices.
- Minimal player state.
- 1 NPC.
- AI GM choice selection or presentation assistance.
- Rules engine dice/state.
- Evidence list.
- Fail-forward.
- Contamination/memory.
- Simple log.

## Architecture Direction

The next architecture should separate at least three concerns:

1. Scenario data and rule runtime.
   - Existing YAML and runtime logic remain valuable.
   - Scenario state transitions, checks, flags, inventory, evidence, and endings should stay deterministic and testable.

2. Player-facing Web ADV surface.
   - New experience, likely a new `AdventurePlayer` or equivalent.
   - Full-screen ADV layout with background, portrait, text box, choices, dice/result presentation, evidence/log/status overlays.
   - Designed for immersion first, not admin visibility.

3. Development/debug surface.
   - Existing `ScenarioExplorer` can remain as a scenario inspector and validator.
   - It should not define the final player experience.

AI GM integration should be delayed until the deterministic ADV loop is strong enough to test without AI. The AI layer should later be constrained to adjudication, narration assistance, and visibility selection within predefined scenario/rule boundaries.

## Smartphone / Native App Consideration

しき asked whether a future smartphone game app would change the decision.

The preserved answer:

- A fully local AI GM on smartphones is difficult because of model size, battery, heat, latency, and update constraints.
- A server AI GM introduces cost, authentication, privacy, safety, and availability concerns.
- Therefore, the safest direction is still Web app first, with a strong deterministic core.
- Later mobile options can include PWA, responsive mobile Web, Capacitor/Tauri-like wrappers, or native shell work if the Web version proves the experience.
- Do not design the core game so that every moment depends on live AI.

## Current Repo Baseline

Important current files:

- `components/ScenarioExplorer.tsx`: current scenario UI; useful but should be treated as debug/validation surface, not final ADV player UI.
- `app/page.tsx`: currently loads scenario packs and renders `ScenarioExplorer`.
- `lib/scenarios/types.ts`: scenario pack and runtime data types.
- `lib/scenarios/runtime.ts`: initial state, state changes, requirements, conditions, endings, carry-out logic.
- `lib/scenarios/check-resolution.ts`: player profile and dice/check resolution.
- `docs/codex-autonomous-workflow.md`: autonomous workflow and boundaries.
- `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`: current scenario spec entry point.
- `docs/NEXT_CHAT_HANDOFF_2026-06-04.md`: previous handoff created after the last push; currently expected to be untracked unless committed later.

Recent pushed work before this preservation:

- Commit: `f18241ba0c6d30eb7197966b4efc6d49ee1af98f`
- Message: `Improve Kimidake UI labels and workflow docs`
- It improved visible label mapping and added workflow/audit documentation.

## Superseded Or Deferred Previous Next Stage

The 2026-06-04 handoff suggested:

```text
Stage 13: Low-frequency UI raw label sweep.
```

That stage is now lower priority. It is not wrong, but it belongs to the old path of polishing `ScenarioExplorer` as the visible app surface.

New priority:

```text
Stage 13R: Web ADV v0.2 player-experience specification.
```

The raw label sweep can be deferred unless it blocks debug usability or leaks into the new player ADV surface.

## Standing Workflow Rules

- For broad work, choose one safe next stage.
- Write a concrete executable prompt for that stage.
- Execute the prompt unless the user only asked for the prompt or asked to pause.
- Preserve unrelated user changes in dirty worktrees.
- Do not commit, push, tag, release, make PRs, run Obsidian Git, or perform external network/dependency work unless explicitly requested.
- If UI is changed, every visible interactive element must have a real user-observable outcome.
- If frontend implementation occurs, verify with typecheck, lint, build, relevant tests, scenario validation, and browser/UI interaction checks when applicable.

## Preservation Actions Completed

- Added `.context-archive/` to `.gitignore` so raw archives stay out of normal Git.
- Archived the exact attached handbook into `.context-archive`.
- Created this context ledger.
- Created a concise NextChat handoff for the next session.

## Next Stage Prompt

Use this prompt in the next chat unless しき changes direction:

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

Spec contents:
1. Product promise and player fantasy.
2. First vertical slice scope.
3. Player screen layout.
4. Core interaction loop.
5. Scenario/runtime separation.
6. Choice, dice, evidence, contamination, memory, NPC trust, and log presentation.
7. What remains deterministic versus what AI GM may later adjudicate.
8. Component/module proposal with target file names.
9. Migration plan from ScenarioExplorer to AdventurePlayer without losing debug capability.
10. Acceptance criteria for a first playable slice.
11. Verification plan, including UI interaction audit expectations.

Verification:
Run git diff --check after writing the spec. If only docs changed, do not run the full frontend suite unless the spec edit touches code or package files. Report the exact files changed, what was intentionally deferred, and the safest next implementation stage.

Done criteria:
The next Codex session can open one Markdown spec and implement the first Web ADV vertical slice without reconstructing this chat.
```
