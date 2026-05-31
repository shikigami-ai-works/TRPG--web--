# 次チャット引き継ぎ 2026-05-30 scene7 送り火

> 現行仕様案内: このファイルは作業履歴です。今後はまず `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` を確認し、食い違う場合は現行仕様正本、YAML、現行本文を優先してください。特に scene6 では指輪取得まで進めず、scene7 で未開封プレゼント案を断った後に初めて指輪を思いつく順序が固定です。

## 最初に読むこと

対象プロジェクトは `D:\Codex\TRPG--web--`。

現在の作業対象は、TRPG/VN シナリオ「きみだけが覚えている事故」の終盤本文とシナリオデータ整合。

この handoff は、既存の以下を上書きせず、現行仕様を補正して保存するもの。

- `docs/NEXT_CHAT_HANDOFF_2026-05-30.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`

上記2つには古い順序の記述が一部あったため、今回の作業で「最新仕様メモ」を追記済み。次チャットでは、このファイルの内容を優先する。

## 現在の固定仕様

終盤順序は以下で固定。

1. 帰還の環本拠地に入る。
2. 遺留品、記録、見守り網、教団の人数感を確認する。
3. 四方の部屋で儀式を乱す。
4. 儀式を止めに来た親族夫婦と衝突する。
5. 親族夫婦は死亡する。
6. 親族夫婦の死亡直後には結婚指輪を取らない。
7. この時点では指輪を儀式に使う発想もまだない。
8. 導師・真壁透一郎と戦う。
9. 勝敗にかかわらず真壁はいなくなる。
10. 無人の儀式場に探索者と灯だけが残る。
11. 二人分の帰還儀式へ組み替える必要に気づく。
12. scene7「送り火」で、灯が未開封の誕生日プレゼントを探索者の帰還燃料にしようとする。
13. 探索者はそれを断る。
14. そこで初めて、親族夫婦の結婚指輪を二人分のペア媒介として思いつく。
15. 親族夫婦の遺体のところへ戻り、指輪を外す。
16. 四方アーティファクトと結婚指輪で帰還儀式を再現する。
17. 未開封の誕生日プレゼントと盗まれたキーホルダーを送り火として返す。
18. 空席の椅子を使って最終帰還分岐へ入る。

重要な意味付け:

- 指輪は殺害報酬ではない。
- 指輪は親族戦直後に便利アイテムとして取得しない。
- 未開封の誕生日プレゼントは、死んだ平行世界側の探索者宛てなので炉の燃料にはなり得る。
- ただし探索者がそれを受け取ると、灯のさよならを奪い「あの子」の位置に座ることになるため断る。
- 灯の手元のキーホルダーは、所有者である灯がまだ生きているため帰還燃料にしない。
- 親族夫婦は「境界の向こう側」にいると信じた息子を思い続けていた二人なので、その対の結婚指輪が境界を越える願いの媒介になる。
- Aルートは、探索者が空席の椅子に座り、灯が自分で探索者の膝の上に座り、二人で炉から吐き出される炎を見る。接触は所有や依存ではなく、同じ光を見る信頼の証として扱う。
- 一人帰還は、探索者だけが同じ空席の椅子に座り、膝の上が空いたまま炉の明かりと灯の顔を見て光に包まれる。

## 直近の作業結果

作成済み:

- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md`
  - scene6「四方の部屋」本文を新規作成。
  - 四方の部屋は重い謎解きではなく、灯と探索者の会話で意味が開く構成にした。
  - scene6では、四方の部屋、親族夫婦戦、真壁戦、無人の儀式場、二人分の帰還儀式へ組み替える必要に気づくところまで。
  - 指輪取得は行わない。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/09_scene7.md`
  - scene7「送り火」本文を新規作成。
  - 未開封プレゼント案を断る、指輪を思いつく、遺体へ戻って指輪を外す、帰還儀式再現、送り火、最終分岐までを本文化。
  - Aルートと一人帰還の空席の椅子演出を追加。

修正済み:

- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`
  - 終盤順序を最新仕様へ更新。
  - 未開封プレゼントと親族夫婦の指輪の媒介理由を明文化。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
  - `gift_refused_as_return_fuel` 初期フラグを追加。
  - `ritual_solution` を最新順序へ更新。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
  - `take_wedding_rings` と `return_artifacts_for_ritual` を `scene_007_return_fire` 側へ移動。
  - `refuse_unopened_gift_as_return_fuel` を追加。
  - `burn_keepsakes_as_farewell` は `ritual_reproduced` 後に実行する流れへ調整。
- `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`
  - `relatives_wedding_rings` の説明を、プレゼント案を断った後で取得する順序へ更新。
- `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml`
  - 親族夫婦の hidden note を最新順序へ更新。
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`
  - Aルート「双つ灯の生還」を空席の椅子 + 膝上 + 同じ炎を見る演出へ更新。
  - 一人帰還「空席に残る灯」を、同じ空席の椅子を一人で使う対比へ更新。
- `tests/scenario-regression.test.ts`
  - 指輪取得が `makabe_gone`、`ritual_reproduction_realized`、`gift_refused_as_return_fuel` の後でないと成立しないことを確認するテストへ更新。
- `docs/NEXT_CHAT_HANDOFF_2026-05-30.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`
  - 古い「scene6で指輪取得」系の記述に、最新仕様の補正を追記。

## 最新の検証結果

実行済み。

```powershell
npm run validate:scenarios
npm run test
```

結果:

- `npm run validate:scenarios`: Scenario validation: 1 pack, 0 errors, 0 warnings
- `npm run test`: 17 passed

追加確認:

```powershell
rg -n "手持ち遺留物|自分の手元の遺留物|手元の遺留物|キーホルダー.*帰還燃料|キーホルダー.*帰還媒介|scene_006.*指輪|指輪取得を `scene_006|scene_006_four_rooms_ritual.*指輪|儀式再現着想、指輪取得|次は 08_scene6|08_scene6.md を作成|ペア媒介として指輪を思いつく→遺体" docs scenarios tests --glob '!node_modules/**'
```

結果:

- 旧仕様として問題になる残骸はなし。
- `docs/NEXT_CHAT_HANDOFF_2026-05-30.md` に「旧メモでは scene6 に指輪取得を置いていたが、最新仕様では...」という補正説明だけが残る。

## 重要ファイル

- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md`
  - scene6 本文。
  - 指輪取得なし。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/09_scene7.md`
  - scene7 本文。
  - プレゼント案拒否、指輪取得、儀式再現、送り火、空席の椅子分岐。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
  - 現在の実行順序の中心。
  - `scene_007_return_fire` 内に `refuse_unopened_gift_as_return_fuel`、`take_wedding_rings`、`return_artifacts_for_ritual` がある。
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`
  - Aルートと一人帰還の説明を最新演出へ更新済み。
- `tests/scenario-regression.test.ts`
  - 最新順序の回帰テスト。

## Git状態

この handoff 作成時点:

- branch: `main`
- upstream: `origin/main`
- 未コミット変更あり。
- Git status で `C:\Users\sakur/.config/git/ignore` の permission warning が出るが、repo変更ではない。

変更ファイル:

- `docs/NEXT_CHAT_HANDOFF_2026-05-30.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md` 新規
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/09_scene7.md` 新規
- `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
- `tests/scenario-regression.test.ts`
- このファイル: `docs/NEXT_CHAT_HANDOFF_2026-05-30_scene7_return_fire.md`

## 残リスク

- かなり本文量が増えたため、次は人間目線で `08_scene6.md` と `09_scene7.md` を通読して、重複やテンポの重さを確認するとよい。
- 旧 handoff 類は補正追記済みだが、完全な現行仕様書ではない。このファイルと `01_overview.md`、`08_scene6.md`、`09_scene7.md`、`scenes.yaml` を優先する。
- `docs/scenario-writing-context-kimidake_ga_oboeteiru_jiko.md` など長い古い作業文脈ファイルは、今回広範囲には更新していない。
- Git未コミット状態なので、次に `Git push` する場合は、差分を確認してからコミットする。

## 次チャットでやるとよいこと

1. `git status --short --branch` を確認する。
2. `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md` と `09_scene7.md` を通読し、テンポ・重複・順序破綻がないかレビューする。
3. 必要なら文体調整のみ行う。仕様順序は変えない。
4. `npm run validate:scenarios` と `npm run test` を再実行する。
5. 問題なければ `Git push` 指示に従ってコミット・プッシュする。

## 再開時の短い指示例

```text
D:\Codex\TRPG--web-- の「きみだけが覚えている事故」を続けます。
docs/NEXT_CHAT_HANDOFF_2026-05-30_scene7_return_fire.md を読んでください。
最新仕様では、scene6 は指輪取得まで進めず、scene7 で未開封の誕生日プレゼントを探索者の帰還燃料にする案を断った後、親族夫婦の結婚指輪を思いついて取得し、帰還儀式を再現します。
Aルートは、探索者が空席の椅子に座り、灯が自分で探索者の膝の上に座り、二人で炉から吐き出される炎を見ながら元の世界へ帰る演出です。
次は 08_scene6.md と 09_scene7.md を通読し、仕様を変えずにテンポ・重複・整合だけ確認してください。
```
