# きみだけが覚えている事故 現行仕様

最終更新: 2026-06-01

このドキュメントは、TRPG/VN シナリオ「きみだけが覚えている事故」の現行仕様を一本化するための入口である。旧 handoff や古い作業文脈には途中経過が残っているため、今後このシナリオを読む、直す、アプリへ載せるときは、まずこのファイルを確認する。

## 参照優先順位

1. このファイル: 現行仕様の入口、固定順序、参照先整理。
2. `scenarios/kimidake_ga_oboeteiru_jiko/*.yaml`: アプリが実行するシナリオデータ。
3. `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`: 物語概要、背景真相、世界の質感。
4. `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md` と `09_scene7.md`: 終盤本文の現行基準。
5. `docs/NEXT_CHAT_HANDOFF_2026-06-01_scene7_ending_verification.md`、`docs/NEXT_CHAT_HANDOFF_2026-06-01_browser_scene7_wedding_rings.md`、`docs/NEXT_CHAT_HANDOFF_2026-06-01_post_scene7_publish.md`: 直近の app 側確認、指輪 UI 確認、publish 状態の引き継ぎ。
6. `docs/NEXT_CHAT_HANDOFF_2026-05-30_scene7_return_fire.md`、`docs/NEXT_CHAT_HANDOFF_2026-05-30.md`、`docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`、`docs/scenario-writing-*.md`: 履歴として参照する。現行仕様と食い違う場合は、このファイル、YAML、現行本文、最新 handoff を優先する。

## 現在の状態

- シナリオID: `kimidake_ga_oboeteiru_jiko`
- タイトル: `きみだけが覚えている事故`
- 想定プレイ時間: 約90分
- シーン数: 7
- 形式: 文章シナリオ + YAML化された進行データ + MVPアプリ用の実行/検証ロジック
- 直近検証: 2026-06-01 に `scene_007_return_fire` 終盤を app 側で実プレイ確認済み。`refuse_unopened_gift_as_return_fuel` -> `take_wedding_rings` -> `return_artifacts_for_ritual` -> `burn_keepsakes_as_farewell` -> final choice を通過し、`return_with_akari` / `true` / `双つ灯の生還` に到達した。コマンド検証は `npm run validate:scenarios` が 1 pack / 0 errors / 0 warnings、`npm run test` が 18 passed。

## 物語の核

探索者は平行世界へ迷い込み、その世界では平行世界側の探索者本人が夜行バス事故で死亡している。探索者は、死んだもう一人の自分を親友として覚えている少女・水瀬灯と出会う。

このシナリオの感情的な軸は、灯を「死んだあの子の代わり」として救わないこと。同じ魂を持つかもしれないが、別の人生を生きた別人として、灯の前に立つこと。

教団「帰還の環」は、喪失者支援団体を装い、信徒の悲しみと遺留品を燃料にして境界観測実験を進めている。導師・真壁透一郎は、失った人を取り戻す儀式と信じさせながら、ヨグ・ソトースの先触れに関わる境界の道を開こうとしている。

## 安全・描写ルール

- 親族による性加害は直接描写しない。回避反応、生活環境、服の乱れ、腕のあざ、言葉の詰まりで示す。
- 親族夫婦の加害は悲嘆や教団儀式で免罪しない。
- 灯を探索者の保護欲や恋愛報酬を強める装置として扱わない。
- 遺留品を炉へ返す場面は、思い出の破壊ではなく、教団が縛った未練を送り火として返す行為にする。
- 殺害を肯定しない。親族夫婦との衝突は、生存と脱出のために越えた取り返しのつかない線として扱う。

## シーン構成

| Scene | YAML ID | 本文 | 現行役割 |
|---|---|---|---|
| 1 | `scene_001_parallel_arrival` | `03_scene1.md` | 平行世界到着、水瀬灯との遭遇。 |
| 2 | `scene_002_accident_trace` | `04_scene2.md` | 事故の痕跡、灯の未練、平行世界の違和感。 |
| 3 | `scene_003_empty_house` | `05_scene3.md` | 平行世界側の探索者の空き家、灯を休ませる。 |
| 4 | `scene_004_returning_family` | `06_scene4.md` | 親族夫婦が迎えに来る。灯が帰らないと選ぶ。 |
| 5 | `scene_005_cult_facility` | `07_scene5.md` | 帰還の環本拠地、遺留品、記録、人数感、四方の部屋への導線。 |
| 6 | `scene_006_four_rooms_ritual` | `08_scene6.md` | 四方の部屋、儀式妨害、親族夫婦戦、真壁戦、二人分の帰還儀式へ組み替える必要に気づく。指輪取得はしない。 |
| 7 | `scene_007_return_fire` | `09_scene7.md` | 未開封プレゼント案を断る、指輪を思いつく、取得する、帰還儀式を再現する、送り火、最終分岐。 |

## 終盤固定順序

この順序は固定。以後の本文、YAML、UI、テストはこの順序を崩さない。

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

## 終盤の重要判断

### 指輪

親族夫婦の結婚指輪は、殺害報酬でも便利アイテムでもない。親族夫婦は「境界の向こう側」にいると信じた息子を思い続けていた二人なので、その対の指輪が境界を越える願いの媒介になる。

指輪を思いつけるのは、灯が未開封の誕生日プレゼントを探索者の帰還燃料にしようとし、探索者がそれを断った後だけである。ここで初めて、「燃えるもの」と「境界を越える願い」は同じではないと分かる。

### 未開封の誕生日プレゼント

未開封の誕生日プレゼントは、平行世界側の探索者へ渡されるはずだったもの。宛て先の相手はもう死んでいるため炉の燃料にはなり得る。

ただし、探索者がそれを受け取ると、灯のさよならを奪い「あの子」の位置に座ることになる。True方向では、探索者はそれを受け取らず、灯が開けないまま送り火として返す。

### ライオンのキーホルダー

事故現場から盗まれた片割れは、教団に固定された未練として炉へ返す。灯の手元の片割れは、所有者である灯がまだ生きているため、帰還燃料にしない。灯が持ち続けるものとして扱う。

### 四方アーティファクト

四方アーティファクトは、儀式妨害と帰還儀式再現の両方に関わる。

- 教団儀式妨害には2つ以上を動かす。
- 帰還儀式再現には3つ以上を戻す。
- 持ち帰れる四方アーティファクトは最大1つ。
- 2つ以上持ち帰ると、帰還路が不安定になり `boundary_collapse` 側へ近づく。

### 空席の椅子

Aルートでは、探索者が空席の椅子に座り、灯が自分で探索者の膝の上に座り、二人で炉から吐き出される炎を見る。接触は所有や依存ではなく、同じ光を見る信頼の証として扱う。

一人帰還では、探索者だけが同じ空席の椅子に座る。膝の上が空いたまま、炉の明かりと灯の顔を見て光に包まれる。

## YAML実装の対応

重要な action / flag:

- `realize_return_ritual_reproduction`: 真壁退場後、二人分の帰還儀式へ組み替える必要に気づく。
- `refuse_unopened_gift_as_return_fuel`: 未開封プレゼントを探索者の帰還燃料にする案を断る。
- `take_wedding_rings`: プレゼント案を断った後、親族夫婦の指輪を取りに戻る。
- `return_artifacts_for_ritual`: 3つ以上の四方アーティファクトと結婚指輪で帰還儀式を再現する。
- `burn_keepsakes_as_farewell`: 未開封プレゼントと盗まれたキーホルダーを送り火として炉へ返す。
- `choose_return_with_akari`: 灯と二人で帰る。`burn_keepsakes_as_farewell` で `regret_resolved` が立った後だけ選べる。
- `choose_return_alone`: 探索者だけが帰る。`burn_keepsakes_as_farewell` で `regret_resolved` が立った後だけ選べる。
- `choose_stay_with_akari`: 灯と共にこちらの世界に残る。`burn_keepsakes_as_farewell` で `regret_resolved` が立った後だけ選べる。

重要な flags:

- `makabe_gone`
- `relatives_killed`
- `ritual_reproduction_realized`
- `gift_refused_as_return_fuel`
- `ritual_reproduced`
- `regret_resolved`
- `shared_guilt`
- `player_attempts_return`
- `requested_akari_return`
- `player_chooses_to_stay`

## エンディング

| Ending ID | 種別 | 内容 | 主な条件 |
|---|---|---|---|
| `return_with_akari` | true | 探索者と灯が二人で元の世界へ帰る。 | 灯の信頼70以上、未開封プレゼント、未練解決、共犯の罪の共有、帰還儀式再現、持ち帰り1個以下。 |
| `return_without_akari` | normal | 探索者だけが帰る。灯は境界のこちら側に残る。 | 探索者の帰還条件は満たすが、灯の連れ帰り条件が欠ける。 |
| `stay_with_akari` | good | 探索者は帰らず、灯と共にこちらの世界に残る。 | 灯が生存し、探索者が残留を選ぶ。 |
| `boundary_collapse` | lost | 帰還儀式の再現に失敗し、境界が崩れる。 | 境界侵食が高すぎる、儀式再現失敗、または四方アーティファクト持ち帰りすぎ。 |

`scenario.ending_resolution_order` は `boundary_collapse`、`stay_with_akari`、`return_with_akari`、`return_without_akari` の順。崩壊や残留の条件が先に解決される。

## 古い文脈の扱い

以下のファイルは作業履歴として有用だが、現行仕様の正本ではない。

- `docs/NEXT_CHAT_HANDOFF_2026-06-01_scene7_ending_verification.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-01_browser_scene7_wedding_rings.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-01_post_scene7_publish.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30.md`
- `docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`
- `docs/scenario-writing-context-kimidake_ga_oboeteiru_jiko.md`
- `docs/scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md`
- `docs/scenario-writing-handoff-kimidake_ga_oboeteiru_jiko.md`

特に旧ファイルに「scene6で指輪取得」「親族戦直後に指輪取得」「未開封プレゼント拒否前に指輪発想」へ読める記述がある場合、それは現行仕様ではない。

## 文書凍結ルール

2026-06-01 時点で、Kimidake の現行仕様ルーティングはこのファイルに凍結する。古い handoff や執筆用ファイルは履歴として残し、全面改稿しない。今後の更新は、まずこの current-spec、YAML、現行本文、必要なテストを同時に確認してから行う。

最新 handoff は検証証跡と再開手順のために読む。仕様判断で衝突した場合は、この current-spec、`scenarios/kimidake_ga_oboeteiru_jiko/*.yaml`、`docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md`、`09_scene7.md` を優先する。

## 今後の作業で守ること

- 本文を直すときは、`01_overview.md`、該当 scene 本文、YAML、必要ならテストを同時に確認する。
- 終盤仕様を変える場合は、このファイルも更新する。
- 実装上の判断や妥協点が仕様書にない場合は、`docs/implementation-notes.md` に残す。
- シナリオに触った変更後は少なくとも `npm run validate:scenarios` と `npm run test` を通す。
- UI、ビルド、共有コード、依存関係に触った変更後は `npm run typecheck`、`npm run lint`、`npm run build` も通す。

## 次の開発候補

1. アプリ上で `きみだけが覚えている事故` を最初から最後まで通しプレイし、UI/UXの不足を洗い出す。
2. 本文とYAMLの同期運用を決める。本文ドラフトをどこまでアプリ画面に表示するかも含めて整理する。
3. 旧 handoff / 古い作業文脈ファイルを、履歴と現行仕様の案内が分かる形に整理する。
