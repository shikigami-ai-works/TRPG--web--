# 次チャット引き継ぎ 2026-05-27 21:48

## 最初に読むこと

このプロジェクトは `D:\Codex\TRPG--web--` の Next.js 製 TRPG/VN MVP。
現在は `scenarios/kimidake_ga_oboeteiru_jiko/` のシナリオデータを読み込み、シーン進行、選択肢、判定、信頼度、フラグ、カウンター、所持品、持ち帰り選択、エンディング判定、localStorage セーブ/ロード、ラン履歴、シナリオデータ検証まで動く。

重要な運用ルール:

- 仕様書通りに実装する。
- 仕様外の判断・変更・妥協点・意思決定は `docs/implementation-notes.md` に残す。
- 大きめの作業では「次の一手を一つ決める → 丁寧な実行プロンプトを書く → そのプロンプトを実行する」を基本手順にする。このルールは `AGENTS.md` と Obsidian vault にも保存済み。
- `Git push` / `Git up` は、このソフトウェアプロジェクト本体を commit + push する意味。`Obsidian Git` と明示された場合のみ Obsidian vault に保存する。
- 3000番ポートは使用中の可能性があるため、ブラウザ確認では基本 `http://localhost:3001` を使う。

## 直近の作業結果

- シナリオデータ検証ツールを完成させた。
- `lib/scenarios/validation.ts` を追加し、以下を検出できるようにした。
  - ID参照切れ
  - 到達不能シーン / 到達不能エンド
  - `next_scene_rules` の矛盾
  - item / carry_out_group の不整合
  - 条件式オブジェクトが複数演算子キーを同時に持つ不正形状
- `scripts/validate-scenarios.ts` を追加し、`npm run validate:scenarios` で実行できるようにした。
- `tests/scenario-regression.test.ts` に、正常シナリオ検証と壊れたシナリオ検証の回帰テストを追加した。
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml` の `return_without_akari.unlock_conditions` を仕様通りのネストへ修正した。
- 簡易YAMLパーサが `rewards: []` を配列として読まないため、`boundary_collapse` の任意空配列は省略した。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml` に、参照切れだった `dismiss_akari_regret` アクションを追加した。
- `docs/implementation-notes.md` に今回の仕様外判断を追記した。
- `AGENTS.md` に `Global Next-Step Prompt Workflow` を追記した。
- Obsidian vault に以下を保存済み。
  - `Codex/Projects/TRPG--web--/2026-05-27-next-step-prompt-workflow.md`
  - `Codex/Projects/TRPG--web--/2026-05-27_213025-scenario-validation-ready-for-project-git-push.md`

## 最新の検証結果

シナリオ検証ツール完成後、以下はすべて通過済み。

- `npm run validate:scenarios`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

`npm run test` は 7 tests pass。

## 重要ファイル

- `AGENTS.md`
- `docs/implementation-notes.md`
- `lib/scenarios/validation.ts`
- `scripts/validate-scenarios.ts`
- `tests/scenario-regression.test.ts`
- `package.json`
- `tsconfig.test.json`
- `lib/scenarios/loader.ts`
- `lib/scenarios/runtime.ts`
- `lib/scenarios/storage.ts`
- `lib/scenarios/types.ts`
- `components/ScenarioExplorer.tsx`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`

## Git状態

直近コミット:

- `2c469f5 Add scenario data validation tool`

このコミットは `origin/main` へ push 済み。

作成前確認では `main...origin/main` で差分なし。ただし、この handoff ファイル作成後は `docs/NEXT_CHAT_HANDOFF_2026-05-27_214853.md` が未コミット差分として残る。

Git操作時の注意:

- `git status` 実行時に `C:\Users\sakur/.config/git/ignore` の permission warning が出ることがあるが、前回の commit/push は成功している。

## 残リスク

- `simple-yaml.ts` はプロジェクト内YAMLのサブセット用。`rewards: []` のようなインライン空配列は現状避ける運用。将来、表現が複雑化したら正式YAMLパーサ導入を検討する。
- シナリオ検証の到達不能エンド判定は静的な遷移グラフ基準。条件式の完全な充足可能性までは解いていない。
- UIの完全E2Eは常設テスト化していない。
- 現在の判定は手動成功/失敗で、ダイスロール実装は未着手。
- AI NPC会話、セーブスロット、エンディングツリー詳細UIは未実装。

## 次チャットでやるとよいこと

次の一手は `エンディング履歴詳細UI / エンディングツリー表示` が自然。

理由:

- シナリオ検証ツールでデータ側の防御が固まった。
- すでに localStorage の完了ラン履歴と到達済みエンディング集計がある。
- 次はプレイヤー/開発者がエンディング進捗を見やすくするUIを足すと、現在のMVP体験が前に進む。

候補タスク:

1. `ScenarioExplorer` の履歴パネルに、到達済みエンディング詳細を展開表示する。
2. `ending_tree.visible_before_unlock`、`blurred_title`、`route_hint` を使って、未到達エンディングも含むツリー/一覧を表示する。
3. 到達済みなら正式タイトル・説明、未到達ならぼかしタイトル・ヒントだけを表示する。
4. 必要なら `storage.ts` の `getReachedEndings` 出力をUI向けに拡張する。
5. 仕様外判断は `docs/implementation-notes.md` に追記する。
6. 検証は `npm run validate:scenarios / typecheck / lint / test / build` を通す。

## 再開時の短い指示例

```md
TRPG--web-- の続きです。
docs/NEXT_CHAT_HANDOFF_2026-05-27_214853.md と docs/implementation-notes.md と AGENTS.md を読んで、現状を把握して。

次の一手は「エンディング履歴詳細UI / エンディングツリー表示」です。
まず実装前に、次の一手用の丁寧な実行プロンプトを作ってから、そのプロンプトに従って実装してください。

要件:
- `components/ScenarioExplorer.tsx` の保存/履歴パネル周辺を中心に実装する。
- 到達済みエンディングの詳細を見られるようにする。
- `ending_tree.visible_before_unlock`、`blurred_title`、`route_hint` を使い、未到達エンディングも含む一覧またはツリーを表示する。
- 既存のlocalStorage履歴仕様を壊さない。
- 仕様外判断は `docs/implementation-notes.md` に残す。
- 検証は `npm run validate:scenarios / npm run typecheck / npm run lint / npm run test / npm run build` を通す。
```
