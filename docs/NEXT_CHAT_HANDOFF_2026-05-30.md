# 次チャット引き継ぎ 2026-05-30

## 最初に読むこと

対象プロジェクトは `D:\Codex\TRPG--web--`。

現在の主作業は、TRPG/VN シナリオ「きみだけが覚えている事故」の終盤進行と本文整合。

最新の重要決定:

- 親族殺害と結婚指輪による儀式素材化は必須。任意化・削除しない。
- ただし、指輪取得は殺害直後ではない。
- 終盤の順番は「儀式を乱す → それを止めようとする親族両親と戦う → 真壁と戦う → 真壁が勝敗にかかわらずいなくなる → 探索者と灯の二人で儀式再現を思いつく → 指輪を取得しに行く → 儀式を再現する」。
- シーン4の `06_scene4.md` は、しき提示の `D:\tRPGシナリオ07.MD` をそのまま反映済み。誤字・句読点・見出し形式は直さない。

## 直近の作業結果

2026-05-29 に以下を GitHub push 済み。

- `d5cd69f` `Update Kimidake scenario family ritual path`
  - シーン4からシーン5への接続を整理。
  - 親族殺害と結婚指輪取得を教団本拠地側の必須導線として維持。
  - `docs/scenario-body-kimidake_ga_oboeteiru_jiko/07_scene5.md` を追加。
- `a056bb4` `Reorder Kimidake ritual confrontation flow`
  - YAML 上の終盤順序を最新決定へ変更。
  - `makabe_gone` と `ritual_reproduction_realized` を追加。
  - 指輪取得を `scene_006_four_rooms_ritual` に移動。
  - 真壁戦は勝敗にかかわらず `makabe_gone` になり、次の送り火へ進める。
  - 回帰テストに、指輪取得順と真壁敗北時の退場確認を追加。

Obsidian Git 保存済み:

- `Codex/Projects/TRPG--web--/2026-05-29-kimidake-ritual-flow-update.md`
- Obsidian commit: `811bfea46603808d77ca2d52168604524ad3c7be`

## 最新の検証結果

最新 push 前に実行済み。

```powershell
npm run validate:scenarios
npm run test
```

結果:

- `npm run validate:scenarios`: 1 pack, 0 errors, 0 warnings
- `npm run test`: 17 passed

## 重要ファイル

- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
  - 終盤順序の中心。
  - `scene_005_cult_facility` から親族戦・指輪取得を外した。
  - 旧メモでは `scene_006_four_rooms_ritual` に指輪取得と儀式再現を置いていたが、最新仕様では `scene_006_four_rooms_ritual` は儀式妨害、親族戦、真壁戦、二人分の帰還儀式へ組み替える必要に気づくところまで。
  - 最新仕様では `scene_007_return_fire` で、未開封の誕生日プレゼントを探索者の帰還燃料にする案を断った後、親族夫婦の結婚指輪を思いつき、取得して帰還儀式を再現する。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
  - `makabe_gone` と `ritual_reproduction_realized` を追加。
  - clear 条件を、導師撃破固定ではなく「親族戦と真壁戦を終えて二人だけで儀式再現」へ変更。
- `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml`
  - `relatives_wedding_rings` は、親族夫婦死亡直後ではなく、送り火シーンでプレゼント案を断った後に取得する。
- `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml`
  - 親族夫婦は、儀式を乱された際に再登場して衝突する説明へ更新。
- `tests/scenario-regression.test.ts`
  - 指輪が真壁退場後、儀式再現着想後、かつ未開封プレゼントを帰還燃料にする案を断った後でないと取得できないことを確認。
  - 真壁戦に失敗しても `makabe_gone` になり、儀式再現へ進めることを確認。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/06_scene4.md`
  - しき本稿をそのまま反映済み。誤字修正禁止。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/07_scene5.md`
  - 旧順序の本文が残っている可能性あり。次の本文作業で要注意。

## Git状態

最新確認時点:

- branch: `main`
- latest commit: `a056bb4 Reorder Kimidake ritual confrontation flow`
- `git status --short` は実質クリーン。
- ただし Windows 環境で `C:\Users\sakur/.config/git/ignore` の permission warning が出る。repo の未反映変更ではない。

## 残リスク

- YAML は最新順序に合っているが、本文・執筆用ドキュメントはまだ完全には追従していない可能性がある。
- 特に `07_scene5.md` は、親族殺害や指輪着想が早すぎる描写を含む可能性がある。
- 次に本文を書くなら、まず「scene5本文を最新YAML順序に合わせる」か「08_scene6.md を新順序で書く」かを決める。
- `CodeGraph` はこの repo では未初期化だった。構造調査で必要なら `codegraph init -i` が必要。

## 次チャットでやるとよいこと

1. `docs/scenario-body-kimidake_ga_oboeteiru_jiko/07_scene5.md` を確認し、最新YAML順序に反する箇所を洗い出す。
2. 本文側の方針を決める。
   - 案A: 07_scene5 を修正し、親族殺害・指輪取得をシーン6へ送る。
   - 案B: 07_scene5 はドラフトとして残し、08_scene6 で最新順序を吸収する。
3. 次に書くなら `docs/scenario-body-kimidake_ga_oboeteiru_jiko/08_scene6.md`。
4. 本文編集後は `npm run validate:scenarios` と `npm run test` を通す。

## 再開時の短い指示例

```text
D:\Codex\TRPG--web-- の「きみだけが覚えている事故」を続けます。
docs/NEXT_CHAT_HANDOFF_2026-05-30.md を読んでください。
最新YAMLでは、終盤順序は「儀式を乱す→親族両親戦→真壁戦→二人で儀式再現を思いつく→指輪取得→儀式再現」です。
親族殺害と結婚指輪は必須ですが、指輪取得は真壁戦後です。
まず 07_scene5.md がこの順序と矛盾していないか確認し、次に本文側をどう直すか提案してください。
```
