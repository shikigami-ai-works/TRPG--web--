# Next Chat Handoff 2026-05-30 Current Spec Unification

## 最初に読むこと

- Project: `D:\Codex\TRPG--web--`
- 目的: `きみだけが覚えている事故` の現行仕様を一本化したので、次はこの正本を起点に開発を進める。
- 最初に読むファイル: `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
- 次の安全な一手: 旧 handoff / 古い作業文脈ファイルの冒頭に、現行仕様ドキュメントへの案内を最小追記するか、アプリ上の通しプレイ確認へ進むかを選ぶ。

## 現在の状態

- `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` を新規作成した。
- このファイルを、現行仕様の入口、参照優先順位、終盤固定順序、YAML 実装対応、古い文脈の扱いをまとめる正本として扱う。
- `docs/implementation-notes.md` に、旧 handoff 類を全面改稿せず参照優先順位で整理する判断を記録した。
- scene6 / scene7 の固定順序は維持する。scene6 では指輪取得まで進めず、scene7 で未開封プレゼント案を断った後に指輪を思いつく。
- 指輪は殺害報酬や便利アイテムではない。未開封プレゼントは探索者の帰還燃料にしない。灯を死んだ親友の代わりとして扱わない。

## 重要ファイル

- `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`: 現行仕様の入口。今後の修正・実装はここを最初に確認する。
- `docs/implementation-notes.md`: 仕様に明記されていなかった判断の記録。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`: 物語概要、背景真相、世界の質感。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md`: scene6「四方の部屋」の本文基準。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/09_scene7.md`: scene7「送り火」の本文基準。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`: アプリが実行するシーン順序と action / flag の正本。

## 検証結果

- `npm run validate:scenarios`: pass。1 pack / 0 errors / 0 warnings。
- `npm run test`: pass。17 passed。
- `rg -n "[ \t]+$" docs\scenario-current-spec-kimidake_ga_oboeteiru_jiko.md docs\implementation-notes.md`: 末尾空白なし。
- 備考: 最初の `npm run validate:scenarios` は一度だけ空出力で exit 1 になったが、`tsc` と検証スクリプトを分解実行すると通り、その後の再実行でも pass した。

## Git 状態

- 作業ブランチ: `main`
- 作業前の直近 commit: `41c9173 Polish kimidake ending prose order`
- この handoff 作成時点の主な未コミット変更:
  - `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
  - `docs/implementation-notes.md`
  - `docs/NEXT_CHAT_HANDOFF_2026-05-30_current_spec_unification.md`
- `Git Push` 依頼済み。この handoff を含めて software repo へ commit / push する。

## 残リスク・注意点

- 旧 handoff 類や古い作業文脈ファイルには、途中経過の記述が残っている。
- ただし現行仕様ドキュメント側で参照優先順位を明記済み。旧ファイルを全面改稿するより、まず現行仕様入口へ誘導するのが安全。
- 今後、終盤仕様を変える場合は `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`、YAML、本文、必要ならテストを同時に更新する。

## 次チャットでやること

1. `git status --short --branch` と `git log -1 --oneline` を確認し、今回の push が反映されているか見る。
2. 旧 handoff / 古い作業文脈ファイルへ、現行仕様ドキュメント参照の短い案内を入れるか判断する。
3. もしくは、アプリ上で `きみだけが覚えている事故` を通しプレイし、UI/UX と本文表示粒度の不足を洗い出す。

## 再開プロンプト

```text
You are continuing work in D:\Codex\TRPG--web--.
Read docs/NEXT_CHAT_HANDOFF_2026-05-30_current_spec_unification.md first, then docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md.
Objective: 現行仕様の正本を起点に、次の一手を1つ選んで実行する。
Constraints: 終盤固定順序を変えない。scene6では指輪取得まで進めず、scene7で未開封プレゼント案を断った後に指輪を思いつく。指輪を殺害報酬や便利アイテムにしない。未開封プレゼントを探索者の帰還燃料にしない。灯を死んだ親友の代わりとして扱わない。
Verification: 変更後は少なくとも npm run validate:scenarios と npm run test を実行する。
Report: 読んだ範囲、変更ファイル、検証結果、残リスク、次にやるべきことを短く報告する。
```
