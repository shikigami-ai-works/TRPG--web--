# 次チャット引き継ぎ 2026-06-01 workflow freeze

## 最初に読むこと

- Project: `D:\Codex\TRPG--web--`
- 現行仕様正本: `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
- 作業対象シナリオ: `きみだけが覚えている事故` (`kimidake_ga_oboeteiru_jiko`)
- 直近の project-local handoff:
  - `docs/NEXT_CHAT_HANDOFF_2026-06-01_scene7_ending_verification.md`
  - `docs/NEXT_CHAT_HANDOFF_2026-06-01_browser_scene7_wedding_rings.md`
  - `docs/NEXT_CHAT_HANDOFF_2026-06-01_post_scene7_publish.md`
- 旧 handoff / 古い執筆文脈と食い違う場合は、現行仕様正本、YAML、現行本文、最新 handoff、最新検証結果を優先する。

## ユーザー指示

- exact: `この先のワークフローを考えて。`
- exact: `１、２、３をやって`
- exact: `Git push, obsolete git`
- exact: `obsidiangit、`
- exact: `NextChat`

解釈:

- `１、２、３` は、前段で提案した workflow の 1 Repo Hygiene、2 Kimidake Documentation Freeze、3 Regression Gate を実行する依頼として扱った。
- `Git push` は software repo `D:\Codex\TRPG--web--` の commit/push として実行した。
- `obsidiangit、` が後から明示されたため、Obsidian vault への graph-friendly context note 保存も実行した。
- 今回の `NextChat` は project-local handoff 作成依頼。Git push / Obsidian Git はこの handoff 作成時点では追加で明示されていないため、handoff 作成だけで止める。

## 完了した作業

### 1. Repo Hygiene

- `.gitignore` に `.runtime/` を追加した。
- `.runtime/` は Chrome headless / CDP fallback などの監査証跡置き場として残すが、Git 管理しない方針にした。
- これにより、`.runtime/` は通常の `git status` に未追跡として出ない。

### 2. Kimidake Documentation Freeze

- `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` を 2026-06-01 更新にした。
- 2026-06-01 の scene7 app 側確認結果、最新 handoff、文書凍結ルール、検証ゲートを current-spec へ反映した。
- 古い handoff / 執筆用ファイルは全面改稿せず、履歴として残す方針にした。
- 現行仕様の入口は `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` に固定する。

### 3. Regression Gate

実行済み:

- `npm run validate:scenarios`
  - 1 pack / 0 errors / 0 warnings
- `npm run typecheck`
  - pass
- `npm run lint`
  - pass / No ESLint warnings or errors
- `npm run test`
  - 18 tests / 18 pass
- `npm run build`
  - pass
- `git diff --check`
  - exit 0
  - LF/CRLF warning のみ

## Git / Publish 状態

Software repo:

- Repo: `D:\Codex\TRPG--web--`
- Remote: `https://github.com/shiki-ai-works/TRPG--web--`
- Branch: `main`
- Status before this handoff: `main...origin/main`
- Latest commit:
  - `815ebef Document Kimidake workflow freeze`
- Push:
  - `origin/main` へ push 済み
  - `533c8b4..815ebef`

Recent software commits:

- `815ebef Document Kimidake workflow freeze`
- `533c8b4 Add Kimidake post scene7 publish handoff`
- `9f86814 Add Kimidake scene7 ending verification handoff`

Obsidian vault:

- Vault repo: `D:\Obsidian\MyVault`
- Remote: `https://github.com/shiki-ai-works/obsidian-vault`
- Branch: `main`
- Status before this handoff: `main...origin/main`
- Latest commit:
  - `edb71d7 Add TRPG Kimidake workflow freeze context`
- Push:
  - `origin/main` へ push 済み
  - `7309545..edb71d7`

Obsidian note:

- `D:\Obsidian\MyVault\Codex\Projects\TRPG--web--\2026-06-01-kimidake-workflow-freeze-and-repo-hygiene.md`
- Hub links:
  - `D:\Obsidian\MyVault\Codex\Codex Index.md`
  - `D:\Obsidian\MyVault\Codex\Projects\TRPG--web--\TRPG--web-- Index.md`

Known non-blocking warning:

- `git status` などで `C:\Users\sakur/.config/git/ignore` permission denied warning が出る。
- これまでの status / add / commit / push は成功しているため、現時点では非ブロッキング。

## 重要ファイル

- `.gitignore`
- `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
- `docs/implementation-notes.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-01_post_scene7_publish.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-01_scene7_ending_verification.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-01_browser_scene7_wedding_rings.md`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`
- `tests/scenario-regression.test.ts`
- `components/ScenarioExplorer.tsx`

## 現行ルール

- Kimidake の固定終盤順序は変更しない。
- 指輪は殺害報酬ではない。
- 未開封プレゼントは探索者の帰還燃料として受け取らない。
- 灯を死んだ親友の代替として扱わない。
- 古い handoff / 執筆用ファイルは履歴として残し、正本化しない。
- 仕様判断で衝突した場合は、current-spec、YAML、現行本文、最新 handoff を優先する。
- `.runtime/` は監査証跡として読んでよいが、Git には含めない。

## 残リスク

- `favicon.ico` 404 は軽微な未対応 asset として残っている。
- scene7 app 側確認は pass 済みだが、全編のユーザー体験レビューは別タスク。
- 古い handoff / 執筆用ファイルは履歴として残っているため、次チャットも最初に current-spec を読む必要がある。
- この handoff 自体は作成直後は未 commit / 未 push。

## 次チャットでやるとよいこと

次の一手は、軽い小タスクとして `favicon.ico` 404 を潰すこと。

推奨順:

1. `git status --short --branch` で、この handoff 以外の変更がないか確認する。
2. `favicon.ico` の扱いを確認する。
3. 既存の Next.js / app conventions に合わせて最小修正する。
4. `npm run typecheck`、`npm run lint`、`npm run build` を通す。
5. 必要なら `Git push` と `Obsidian Git` を別deliverableとして実行する。

もし handoff 保存を先に行うなら:

1. `docs/NEXT_CHAT_HANDOFF_2026-06-01_workflow_freeze.md` だけを stage する。
2. `.runtime/` は stage しない。
3. 推奨 commit message:

```text
Add Kimidake workflow freeze handoff
```

## 再開時の短い指示例

```text
You are continuing work in D:\Codex\TRPG--web--.
Read docs/NEXT_CHAT_HANDOFF_2026-06-01_workflow_freeze.md first.

Objective:
Kimidake scene7後の workflow freeze / repo hygiene / Regression Gate / Git push / Obsidian Git は完了済み。次に、未対応の favicon.ico 404 を小さく直すか、この handoff を repo に保存する。

Context:
Latest software commit is 815ebef Document Kimidake workflow freeze on main, pushed to origin/main. Latest Obsidian vault commit is edb71d7 Add TRPG Kimidake workflow freeze context, also pushed. .runtime/ is now ignored by .gitignore and must not be committed. Current spec entry point is docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md.

Constraints:
- Do not change Kimidake fixed ending order.
- Do not touch scenario YAML/prose/tests unless the chosen task requires it.
- .runtime/ remains audit evidence only and must not be staged.
- Git push means software repo push.
- Obsidian Git means graph-friendly vault save and should be done only when explicitly requested.

Verification:
- Handoff-only work: git status and staged file check.
- favicon/UI work: npm run typecheck, npm run lint, npm run build.
- Scenario data work: npm run validate:scenarios and npm run test.

Report:
Report changed files, verification, commit/push status, and the next one concrete step.
```
