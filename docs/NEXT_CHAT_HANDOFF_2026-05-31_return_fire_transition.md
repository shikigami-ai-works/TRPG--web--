# 次チャット引き継ぎ 2026-05-31 return fire transition

## 最初に読むこと

- Project: `D:\Codex\TRPG--web--`
- 現行仕様正本: `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
- 作業対象シナリオ: `きみだけが覚えている事故` (`kimidake_ga_oboeteiru_jiko`)
- 直近の重要 commit: `18383cd Fix Kimidake return fire transition`
- 旧 handoff / 古い執筆文脈と食い違う場合は、現行仕様正本、YAML、現行本文を優先する。

## 今回の作業結果

- MVPアプリ上で「きみだけが覚えている事故」の終盤導線を監査した。
- P1問題として、scene6で `realize_return_ritual_reproduction` を押さなくても `scene_007_return_fire` へ進めることを発見した。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml` の scene6 `next_scene_rules` を修正し、scene7遷移条件を `has_flag:makabe_gone` から `has_flag:ritual_reproduction_realized` に変更した。
- `tests/scenario-regression.test.ts` に「Makabe退場だけでは送り火へ進めず、帰還儀式再現の気づき後にだけ進める」回帰テストを追加した。
- software repo は `18383cd Fix Kimidake return fire transition` として `origin/main` へ push 済み。

## 固定仕様・禁止する戻り

- scene6 では指輪取得まで進めない。
- scene6 では、真壁退場後に二人分の帰還儀式へ組み替える必要へ気づく。
- scene7 で、灯が未開封プレゼントを探索者の帰還燃料にしようとし、探索者がそれを断った後に初めて親族夫婦の結婚指輪を思いつく。
- 指輪は殺害報酬や便利アイテムではない。
- 未開封プレゼントを探索者の帰還燃料にしない。
- 灯を死んだ親友の代わりとして扱わない。

## 最新の検証結果

- `npm run validate:scenarios`: pass。1 pack / 0 errors / 0 warnings。
- `npm run test`: pass。18 tests passed。
- ブラウザ再監査: pass。
  - 気づき前に scene6 の進行を押すと `scene_006_four_rooms_ritual` のまま `boundary_collapse`。
  - `realize_return_ritual_reproduction` 後に進行すると `scene_007_return_fire` へ入り、`refuse_unopened_gift_as_return_fuel` が有効。
- 監査証跡は `.runtime/` に残っているが、gitには含めていない。

## 変更ファイル

- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
- `tests/scenario-regression.test.ts`
- `docs/NEXT_CHAT_HANDOFF_2026-05-31_return_fire_transition.md` (このファイル)

## Git状態

- 作業ブランチ: `main`
- `main` は `origin/main` と同期済み。
- 直近 commit: `18383cd Fix Kimidake return fire transition`
- この handoff 作成時点で、software repo のコード修正は push 済み。
- 未追跡として `.runtime/` が残っている。これは監査スクリプトとスクリーンショットの証跡で、gitに含めない。
- この handoff ファイルは `nextchat` 用の新規ローカル成果物。`Git push` が必要なら、別途このファイルだけを stage/commit/push する。

## 残リスク

- `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` の「直近検証」はまだ 17 passed 表記のまま。今回のテスト追加後は 18 passed なので、次に仕様正本を触るときに更新候補。
- 監査で見つかった P3: `take_wedding_rings` は取得後もボタンが有効表示のまま残る。inventory は重複しないため破壊的ではないが、UIとして紛らわしい。
- `.runtime/` は証跡として未追跡のまま残っている。今後も原則gitに含めない。

## 次チャットでやるとよいこと

次の一手は、P3の「指輪取得済み表示」整理が小さく安全。

具体的には、`take_wedding_rings` を `once_per_run: true` にする、または `relatives_wedding_rings` 未所持を requirements に加えるなど、既存UIの使用済み/無効化ルールに合わせて選ぶ。実装前に `ActionList` の `once_per_run` 表示と、YAML側の他アクションの使い方を確認する。

## 再開時の短い指示例

```text
You are continuing work in D:\Codex\TRPG--web--.
Read docs/NEXT_CHAT_HANDOFF_2026-05-31_return_fire_transition.md first, then docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md.

Objective:
「きみだけが覚えている事故」の scene7 で、`take_wedding_rings` 取得後も選択肢が有効表示のまま残る P3 UI 問題を小さく修正する。

Context:
scene6 -> scene7 の P1遷移条件修正は `18383cd Fix Kimidake return fire transition` で push 済み。終盤固定順序は、scene6で帰還儀式再現に気づき、scene7で未開封プレゼント案を断った後に初めて指輪を思いつく順序。

Target Scope:
- scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml
- tests/scenario-regression.test.ts
- components/ScenarioExplorer.tsx (必要な場合のみ)

Constraints:
`.runtime/` は監査証跡なのでgitに含めない。
終盤固定順序を変えない。
実装判断が仕様書にない場合は docs/implementation-notes.md に残す。
長文プロンプトを書く場合は最後に「要するに」欄で短い動作説明を添える。

Verification:
- npm run validate:scenarios
- npm run test
- 必要ならブラウザで scene7 の指輪取得後表示だけ確認する。

Report:
変更内容、検証結果、Git状態、次にやるべき1件を短く報告する。

要するに:
このプロンプトは、scene7の指輪取得済みUIだけを小さく直し、終盤順序を崩さず検証する動きッス。
```
