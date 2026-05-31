# Next Chat Handoff 2026-05-31

## 最初に読むこと

- Project: `D:\Codex\TRPG--web--`
- 現行仕様正本: `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
- 作業対象シナリオ: `きみだけが覚えている事故` (`kimidake_ga_oboeteiru_jiko`)
- まず正本を読み、旧 handoff / 古い執筆文脈と食い違う場合は、現行仕様正本、YAML、現行本文を優先する。

## 今回の作業結果

- 旧 handoff / 古い執筆文脈 6 ファイルの冒頭へ、現行仕様正本への案内を最小追記した。
- 既存本文は履歴として残し、全面リライトや旧文脈の削除はしていない。
- `docs/implementation-notes.md` は、旧文脈を全面改稿せず参照優先順位で整理する判断が既に記録済みだったため、今回は変更していない。

## 変更ファイル

- `docs/NEXT_CHAT_HANDOFF_2026-05-30.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30_scene7_return_fire.md`
- `docs/scenario-writing-context-kimidake_ga_oboeteiru_jiko.md`
- `docs/scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md`
- `docs/scenario-writing-handoff-kimidake_ga_oboeteiru_jiko.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-31.md` (このファイル)

## 固定仕様・禁止する戻り

- scene6 では指輪取得まで進めない。
- scene7 で、灯が未開封プレゼントを探索者の帰還燃料にしようとし、探索者がそれを断った後に初めて親族夫婦の結婚指輪を思いつく。
- 指輪は殺害報酬や便利アイテムではない。
- 未開封プレゼントを探索者の帰還燃料にしない。
- 灯を死んだ親友の代わりとして扱わない。

## 最新の検証結果

- `npm run validate:scenarios`: pass。1 pack / 0 errors / 0 warnings。
- `npm run test`: pass。17 tests passed。
- 対象 docs の末尾空白チェックは前段で pass。

## Git 状態

- 作業ブランチ: `main`
- 直近 commit: `b1753e1 Document Kimidake current spec`
- この handoff 作成時点では、旧文脈案内追記とこの handoff が未コミット。
- しきから `NextChat, Obsidian Git, Git push` の依頼あり。次にこの handoff を含めて software repo へ commit / push する。

## 次にやるべきこと

次の実作業は、アプリ上の通しプレイ監査が最優先。旧文脈の誘導は済んだので、現行仕様どおりの終盤順序が実際の画面操作で破綻なく体験できるかを確認する。

## 再開プロンプト

```text
You are continuing work in D:\Codex\TRPG--web--.
Read docs/NEXT_CHAT_HANDOFF_2026-05-31.md first, then docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md.

Objective:
MVP アプリ上で「きみだけが覚えている事故」を通しプレイ監査し、現行仕様どおりに進行・表示・分岐できるかを洗い出す。

Context:
旧 handoff / 古い執筆文脈には現行仕様正本への案内追記済み。終盤固定順序は、scene6 で指輪取得まで進めず、scene7 で未開封プレゼント案を断った後に初めて指輪を思いつく順序。

Target Scope:
- app/page.tsx
- components/ScenarioExplorer.tsx
- lib/scenarios/*
- scenarios/kimidake_ga_oboeteiru_jiko/*.yaml
- docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md
- docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md
- docs/scenario-body-kimidake_ga_oboeteiru_jiko/09_scene7.md

Constraints:
まず監査と記録に徹する。軽微な明白バグ以外はその場で直さず、修正候補として整理する。
終盤固定順序を変えない。
実装判断が必要になった場合は docs/implementation-notes.md に残す。

Verification:
- npm run validate:scenarios
- npm run test
- ブラウザで主要終盤導線を実操作

Report:
確認したルート、通った検証、見つけた問題、修正候補の優先順位、次に実装すべき 1 件を短く報告する。
```
