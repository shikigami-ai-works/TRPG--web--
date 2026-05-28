# 次チャット引き継ぎ 2026-05-28

## 最初に読むこと

このプロジェクトは `D:\Codex\TRPG--web--` の Next.js 製 TRPG/VN MVP。
現在は `scenarios/kimidake_ga_oboeteiru_jiko/` のシナリオデータを読み込み、シーン進行、選択肢、判定、信頼度、フラグ、カウンター、所持品、持ち帰り選択、エンディング判定、localStorage セーブ/ロード、ラン履歴、エンディング進捗UI、シナリオデータ検証まで動く。

重要な運用ルール:

- 仕様書通りに実装する。
- 仕様外の判断・変更・妥協点・意思決定は `docs/implementation-notes.md` に残す。
- 大きめの作業では「次の一手を一つ決める → 丁寧な実行プロンプトを書く → そのプロンプトを実行する」を基本手順にする。
- `Git push` / `Git up` は、このソフトウェアプロジェクト本体を commit + push する意味。
- `Obsidian Git` / `obsidiangit` は、会話・作業文脈を Obsidian vault に保存する意味。
- `nextchat` は、このプロジェクト内に次チャット用Markdownを作る意味。

## 直近の作業結果

直近では、探索者プロフィールとダイス判定まわりを進めた。

- `lib/scenarios/check-resolution.ts` を追加し、`PlayerCheckProfile`、`DEFAULT_MVP_CHECK_PROFILE`、`rollScenarioCheck`、補正値計算、プロフィール正規化を実装した。
- `components/ScenarioExplorer.tsx` に「探索者」パネルを追加し、`stats` / `skills` を画面上で編集できるようにした。
- 判定欄の「振る」ボタンが、固定値ではなく現在の探索者プロフィールを使うようになった。
- 判定ログには出目、能力値、技能値、合計、目標値が残る。
- 既存の「手動成功」「手動失敗」はデバッグ/検証用に残した。
- `lib/scenarios/storage.ts` に `trpg-web:v1:check-profile:<scenarioId>` を使う探索者プロフィール保存/復元を追加した。
- `SavedRunState` と `CompletedRunRecord` の形式は変更していない。
- 「最初から」は進行中ランだけを消し、探索者プロフィールは維持する。
- 探索者パネルに `初期値` ボタンを追加し、プロフィールだけ初期化できるようにした。
- 壊れたプロフィールJSON、version不一致、scenarioId不一致、不正数値は安全に初期値へフォールバックまたは正規化する。
- `docs/implementation-notes.md` に以下を追記した。
  - MVP Dice Check Roll
  - MVP Player Check Profile UI
  - MVP Player Check Profile Persistence
- `tests/scenario-regression.test.ts` に、ダイス判定、プロフィール編集、プロフィール保存/復元、壊れた保存データの回帰テストを追加した。

## 最新の検証結果

探索者プロフィール保存/復元実装後、以下はすべて通過済み。

- `npm run validate:scenarios`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

`npm run test` は 15 tests pass。

表示確認:

- Browser MCP は Windows sandbox 側の `node_repl` 起動問題で接続に失敗することがある。
- 代替として `http://127.0.0.1:3001` のHTML上に `探索者`、`data-control="reset-player-profile"`、`data-profile-id="intelligence"`、`振る` が出ていることを確認済み。

## 重要ファイル

- `components/ScenarioExplorer.tsx`
- `lib/scenarios/check-resolution.ts`
- `lib/scenarios/storage.ts`
- `lib/scenarios/runtime.ts`
- `lib/scenarios/types.ts`
- `lib/scenarios/ending-progress.ts`
- `lib/scenarios/validation.ts`
- `tests/scenario-regression.test.ts`
- `docs/implementation-notes.md`
- `app/globals.css`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`

## Git状態

このhandoff作成直前の直近push済みコミット:

- `3324742 Add MVP player check profile UI`

現在の未コミット差分として、探索者プロフィール保存/復元実装とこのhandoffファイルがある。
この後の `Git push` では、今回の実装対象とこのhandoffを commit + push する予定。

今回の対象外として、以下の未追跡ファイル/フォルダが残っている。ユーザー作業または別タスク由来の可能性があるため、勝手にステージしないこと。

- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/`
- `docs/scenario-writing-handoff-kimidake_ga_oboeteiru_jiko.md`

`git status` 実行時に `C:\Users\sakur/.config/git/ignore` の permission warning が出ることがあるが、前回までの commit/push は成功している。

## 残リスク

- 探索者プロフィールはシナリオID単位保存であり、複数キャラクター管理ではない。
- 能力値/技能値は0〜99に丸めているが、正式なポイントバイ、能力値レンジ、技能値レンジは未実装。
- 判定成功率や必要出目の可視化は未実装。
- `check_defeat_makabe` は `related_stat: combat` のようにスキル名寄りの指定をしており、MVPではフォールバックで吸収している。正式にはシナリオデータ側の整理が必要。
- Browser MCP のローカル画面操作確認は環境都合で不安定。必要なら別手段でE2E確認を検討する。
- AI NPC会話、セーブスロット、正式キャラクター作成、成長、ロスト記録は未実装。

## 次チャットでやるとよいこと

次の一手は `MVPポイントバイ検証 / 判定バランス表示` が自然。

理由:

- 探索者プロフィールは編集・保存・復元できるようになった。
- ただし能力値/技能値を自由に盛れるため、TRPGらしい調整指標がない。
- 本格的なキャラクター作成に進む前に、合計値、推奨範囲、判定成功率の目安を表示すると、MVPの調整体験が前に進む。

候補タスク:

1. `PlayerCheckProfile` の stats / skills 合計値を計算する純粋関数を追加する。
2. MVP仮ルールとして stats合計80、stats各3〜18、skills合計20、skills各0〜10 を表示する。
3. 範囲外なら探索者パネルに警告を出す。
4. 現在シーンの各判定について、必要出目と成功率目安を表示する。
5. 既存の保存形式は変更しない。
6. 判断は `docs/implementation-notes.md` に残す。
7. `npm run validate:scenarios / typecheck / lint / test / build` を通す。

## 再開時の短い指示例

```md
TRPG--web-- の続きです。
docs/NEXT_CHAT_HANDOFF_2026-05-28.md と docs/implementation-notes.md と AGENTS.md を読んで、現状を把握して。

次の一手は「MVPポイントバイ検証 / 判定バランス表示」です。
まず実装前に、次の一手用の丁寧な実行プロンプトを作ってから、そのプロンプトに従って実装してください。

要件:
- `PlayerCheckProfile` の stats / skills 合計値と推奨範囲を表示する。
- MVP仮ルールは stats合計80、stats各3〜18、skills合計20、skills各0〜10 とする。
- 範囲外なら探索者パネルで警告表示する。
- 現在シーンの判定ごとに、必要出目と成功率目安を表示する。
- active-run、run-history、check-profile保存形式は変更しない。
- 未追跡の `docs/scenario-body-kimidake_ga_oboeteiru_jiko/` と `docs/scenario-writing-handoff-kimidake_ga_oboeteiru_jiko.md` は今回の対象外なら触らない。
- 仕様外判断は `docs/implementation-notes.md` に残す。
- 検証は `npm run validate:scenarios / npm run typecheck / npm run lint / npm run test / npm run build` を通す。
```
