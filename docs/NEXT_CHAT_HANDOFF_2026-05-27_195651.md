# Next Chat Handoff 2026-05-27 19:56

## 最初に読むこと

このプロジェクトは `D:\Codex\TRPG--web--` の Next.js 製 TRPG/VN MVP。現在は `scenarios/kimidake_ga_oboeteiru_jiko/` のシナリオデータパックを Next.js アプリから読み込み、シーン進行、選択肢、判定、信頼度、フラグ、カウンター、所持品、持ち帰り選択、エンディング判定、セーブ/ロード、ラン履歴まで最小縦切りで動く状態。

重要な運用ルール:
- 仕様書通りに実装する。
- 仕様外の判断・変更・妥協点・意思決定は `docs/implementation-notes.md` に残す。
- 3000番は使用中の可能性があるため、検証URLは `http://localhost:3001` を使う。

## 直近の作業結果

- `scenarios/kimidake_ga_oboeteiru_jiko/` のデータパックを追加。
- 独自項目をスキーマ化し、scenario/npc/item/scene/ending 周辺ドキュメントを更新。
- Next.js App Router の最小アプリを追加。
- `ScenarioExplorer` でシナリオ一覧、詳細、シーン表示、選択肢、判定、状態更新、持ち帰り選択、エンディング判定を実装。
- `lib/scenarios/storage.ts` を追加し、localStorage の自動保存/再開/履歴/到達済みエンド集計を実装。
- 保存/履歴UIを追加。
- `tests/scenario-regression.test.ts` を追加し、runtime/storage/シナリオ到達条件の回帰テストを追加。

## 最新の検証結果

通過済み:
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

`npm run test` は 5 tests pass:
- `applyStateChanges`
- `toggleCarryOutItem`
- `resolveEnding`
- save/load/restore/corrupt save handling
- run history/reached endings dedupe

ブラウザ/HTTP確認:
- `http://localhost:3001` は再起動済み。
- root と `_next/static/chunks/main-app.js` がどちらも `200`。

## 重要ファイル

- `app/page.tsx`
- `components/ScenarioExplorer.tsx`
- `lib/scenarios/loader.ts`
- `lib/scenarios/runtime.ts`
- `lib/scenarios/storage.ts`
- `lib/scenarios/types.ts`
- `tests/scenario-regression.test.ts`
- `tsconfig.test.json`
- `docs/implementation-notes.md`
- `docs/schemas/scenario.schema.yaml`
- `docs/schemas/scene.schema.yaml`
- `docs/schemas/ending.schema.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/`

## Git状態

作成時点のブランチは `main`。この handoff 作成後、ユーザー指示により Obsidian Git 保存と GitUP を実行予定。

差分は大きいが、主なカテゴリは以下:
- シナリオデータパック追加
- スキーマ/仕様ドキュメント更新
- Next.js 縦切り実装
- localStorage セーブ/ロード + ラン履歴実装
- 回帰テスト追加
- 実装判断メモ追加

## 残リスク

- `simple-yaml.ts` はこのプロジェクトのYAMLサブセット用。将来、YAML表現が複雑化したら正式パーサ導入を検討する。
- UIの完全E2Eは常設テスト化していない。現状は runtime/storage とシナリオ到達条件の単体/小規模統合テストで守る方針。
- 現在の判定は手動成功/失敗で、ダイスロール実装は未着手。
- AI NPC会話、セーブスロット、エンディングツリー詳細UIは未実装。

## 次にやるとよいこと

1. 差分レビュー後、必要なら1コミットにまとめる。
2. シナリオデータ検証ツールを追加する。
   - ID参照切れ
   - 到達不能エンド
   - next_scene_rules の矛盾
   - item/carry_out_group の不整合
3. UIのエンディング履歴詳細とエンディングツリー表示を追加する。
4. ダイス/技能判定UIへ進む。

## 再開用プロンプト

```md
TRPG--web-- の続きです。
docs/NEXT_CHAT_HANDOFF_2026-05-27_195651.md と docs/implementation-notes.md を読んで、現状を把握して。
次はシナリオデータ検証ツールを追加したい。
仕様書通りに実装し、仕様外判断は docs/implementation-notes.md に残して。
検証は npm run typecheck / npm run lint / npm run test / npm run build を通して。
```
