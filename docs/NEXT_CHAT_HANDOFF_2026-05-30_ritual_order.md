# 次チャット引き継ぎ 2026-05-30 儀式順序固定

## 最初に読むこと

対象プロジェクトは `D:\Codex\TRPG--web--`。

現在の主作業は、TRPG/VN シナリオ「きみだけが覚えている事故」の終盤進行と本文整合。

この handoff は、既存の `docs/NEXT_CHAT_HANDOFF_2026-05-30.md` を上書きせず、同日作業の続きとして作成したもの。

## 固定された重要仕様

しきの指示により、終盤の順序は以下で固定。

1. 帰還の環本拠地に入る。
2. 遺留品、記録、見守り網、教団の人数感を確認する。
3. 四方の部屋で儀式を乱す。
4. 儀式を止めに来た親族両親と衝突する。
5. 両親は死亡する。
6. この時点では親族夫婦の結婚指輪は取得しない。
7. この時点では指輪を儀式に使う発想もまだない。
8. その後、導師・真壁透一郎と戦う。
9. 勝敗にかかわらず真壁はいなくなる。
10. 無人の儀式場に探索者と灯だけが残る。
11. そこで初めて、二人分の帰還儀式へ組み替える可能性に気づく。
12. ペアの媒介として親族夫婦の結婚指輪が適切ではないかと思いつく。
13. 親族夫婦の遺体のところへ戻り、指輪を取得する。
14. 指輪を使って儀式を行う。

重要な意味付け:

- 指輪は殺害報酬ではない。
- 指輪は親族戦直後に便利アイテムとして取得しない。
- 指輪は、真壁が消えて無人の儀式場に二人だけ残された後に、初めて「ペア」「結びつき」「二人分の帰還」の媒介として意味が立ち上がる。

## 教団人数の理由付け

帰還の環は大人数組織として扱う。

ただし、多数構成員は戦闘員ではない。

- 表の人員: 受付、相談員、ボランティア、遺族会参加者。
- 中間層: 見守り係、記録係、遺留品管理係。
- 儀式参加者: 別室の祈り手、喪失や願いを炉へ束ねられる人々。
- 直接戦闘の相手: 灯を縛る接続を持つ親族夫婦と、儀式を束ねる真壁。

このため、クライマックスは「信徒を大量に倒す場面」ではなく、「大勢の願いで動く儀式の中で、直接の刃として親族夫婦が現れる」構図にする。

## 直近の作業結果

以下を修正済み。

- `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
  - 直接敵は親族夫婦であり、多数構成員は見守り網・記録係・祈り手として儀式を支える、と明文化。
  - 帰還儀式の解決手順に、親族衝突、真壁戦、無人の儀式場、指輪発想、指輪取得を明記。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
  - `fight_makabe` を `realize_return_ritual_reproduction` より前へ移動。
  - `realize_return_ritual_reproduction` のラベルを「無人の儀式場で二人だけの帰還儀式を再現できると気づく」に変更。
  - `take_wedding_rings` のラベルを「二人分のペア媒介」として明確化。
  - 真壁戦失敗時の reveal にも、真壁が消えて無人の儀式場に二人だけ残ることを追記。
- `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`
  - 結婚指輪は殺害直後には取得せず、真壁戦後にペア媒介として取得しに戻る、と明文化。
- `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml`
  - 真壁の hidden note に、多数構成員は直接戦闘役ではないことを追記。
  - 親族夫婦の event / hidden note に、死亡時点では指輪未取得・儀式媒介の意味も未発生であることを追記。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`
  - 古い「殺害したその場で指輪が儀式材料になる」説明を削除。
  - 固定順序と教団人数の理由付けへ更新。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/07_scene5.md`
  - 親族戦、殺害、指輪取得、指輪発想を削除。
  - scene5 は「帰還の環潜入、遺留品回収、人数感、親族夫婦の存在の気配、真壁による四方の部屋への誘導」までに整理。

## 最新の検証結果

実行済み。

```powershell
npm run validate:scenarios
npm run test
```

結果:

- `npm run validate:scenarios`: 1 pack, 0 errors, 0 warnings
- `npm run test`: 17 passed

追加確認:

```powershell
rg -n "殺害したその場|その場で.*指輪|指輪.*使える|持っていかないと|手の中には.*結婚指輪|そして、親族夫婦の結婚指輪" docs/scenario-body-kimidake_ga_oboeteiru_jiko scenarios/kimidake_ga_oboeteiru_jiko
```

結果: 該当なし。

## Git状態

この handoff 作成時点:

- branch: `main`
- remote: `origin https://github.com/shiki-ai-works/TRPG--web--`
- 直前の最新commit: `a056bb4 Reorder Kimidake ritual confrontation flow`
- 変更ファイル:
  - `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`
  - `docs/scenario-body-kimidake_ga_oboeteiru_jiko/07_scene5.md`
  - `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`
  - `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml`
  - `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
  - `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
  - `docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md`
- 既存の `docs/NEXT_CHAT_HANDOFF_2026-05-30.md` は未追跡で存在していたため、上書きしなかった。
- Windows 環境で `C:\Users\sakur/.config/git/ignore` の permission warning が出るが、repo 変更ではない。

## 残リスク

- 最新仕様メモ: この handoff 作成後に `08_scene6.md` と `09_scene7.md` を作成済み。最新順序では、`scene6` は指輪取得まで進めず、`scene7` で未開封の誕生日プレゼントを探索者の帰還燃料にする案を断った後、親族夫婦の結婚指輪を思いついて取得し、帰還儀式を再現する。
- `07_scene5.md` は最新順序に合わせて切り戻したが、次は `08_scene6.md` を新規作成または拡張して、四方の部屋以降の本文を具体化する必要がある。
- `01_overview.md` とYAMLは固定順序に追従したが、他の古い本文断片に旧順序が残っていないか、次回以降に広めに確認してもよい。
- 親族戦、真壁戦、無人の儀式場、指輪を思いつく場面は、本文上の感情の段差が重要。戦闘処理だけで流さない。

## 次チャットでやるとよいこと

1. `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md` と `09_scene7.md` は作成済み。次は現行本文とYAMLの整合確認、または次の仕様整理を行う。
2. 最新本文では、必ず以下の順序を守る。
   - 儀式を乱す。
   - 親族夫婦と衝突する。
   - 親族夫婦は死亡するが、指輪はまだ取らない。
   - 真壁と戦う。
   - 勝敗にかかわらず真壁はいなくなる。
   - 無人の儀式場に二人だけ残る。
   - 二人分の儀式再現が必要だと気づく。
   - 未開封の誕生日プレゼントを探索者の帰還燃料にする案を断る。
   - 境界の向こう側を願っていた親族夫婦の指輪をペア媒介として思いつく。
   - 遺体のところへ戻って指輪を取る。
   - 指輪と四方アーティファクトで帰還儀式を再現する。
3. 変更後に `npm run validate:scenarios` と `npm run test` を通す。

## 再開時の短い指示例

```text
D:\Codex\TRPG--web-- の「きみだけが覚えている事故」を続けます。
docs/NEXT_CHAT_HANDOFF_2026-05-30_ritual_order.md を読んでください。
この handoff は一部古く、最新仕様では「儀式を乱す→親族夫婦戦→まだ指輪は取らない→真壁戦→無人の儀式場に二人→二人分の儀式再現が必要だと気づく→未開封の誕生日プレゼントを帰還燃料にする案を断る→親族夫婦の指輪を思いつく→遺体から指輪取得→儀式再現→送り火→空席の椅子で帰還」で固定です。
08_scene6.md と 09_scene7.md は作成済みなので、次は現行本文とYAMLの整合確認または次の仕様整理を進めてください。
```
