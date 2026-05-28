# 次チャット引き継ぎ 2026-05-29

## 最初に読むこと

このプロジェクトは `D:\Codex\TRPG--web--` の Next.js 製 TRPG/VN MVP。
今回の主作業は、オリジナルシナリオ「きみだけが覚えている事故」の本文草稿を Claude Code から Codex 側へ引き継ぎ、`docs/scenario-body-kimidake_ga_oboeteiru_jiko/` にシーン本文として整備すること。

## 直近の決定

- 水瀬灯は本文上では「15歳くらい」の少女として扱う。
- 「空き家に帰る子」の空き家は、灯の親族宅ではなく、平行世界側で死んだ探索者本人の家。
- 帰還の環は、表向きの喪失者支援・地域見守りネットワークとして、事故関係者や遺留品、生還者の動きを記録している。
- シーン4では、灯の居場所は超常追跡ではなく、帰還の環の善意めいた情報網によって割れる。
- 親族による加害の具体、性加害の直接描写、ヨグ・ソトースや境界儀式の詳細はまだ本文では開かない。
- 探索者は灯を所有・保護対象化するのではなく、灯自身が選ぶ横に立つ。

## 直近の作業結果

以下の本文ファイルを作成・上書きした。

- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/02_npcs.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/03_scene1.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/04_scene2.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/05_scene3.md`
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/06_scene4.md`

現在の本文決定稿:

- `03_scene1.md`: 15歳くらいの灯が、探索者に死んだ親友の面影を見て動揺する。
- `04_scene2.md`: 夜行バス事故、誕生日と卒業記念、ライオンのキーホルダー、未開封の誕生日プレゼント、帰還の環が浮上する。
- `05_scene3.md`: 灯が平行世界側で死んだ探索者本人の空き家へ案内し、二人が初めて少し休む。
- `06_scene4.md`: 帰還の環の情報網で居場所が割れ、伯母伯父が空き家へ「迎えに来る」。灯は「帰らない」と言う。

## 最新の検証結果

本文ファイルの作成・上書き確認のみ実施。
コードや YAML は今回触っていないため、`npm run validate:scenarios`、`npm run typecheck`、`npm run lint`、`npm run test`、`npm run build` は未実行。

## 重要ファイル

- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/`
- `docs/scenario-writing-context-kimidake_ga_oboeteiru_jiko.md`
- `docs/scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml`

## Git状態

このhandoff作成時点では、シナリオ本文フォルダとこのhandoffが未コミット差分として存在する。
ユーザーは GitHub へのアップロード、Obsidian Git 保存、nextchat 作成を依頼している。

## 残リスク

- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml` は旧設計のままで、シーン3が親族宅、シーン4が結婚指輪の共犯として定義されている。本文決定稿と不一致。
- `docs/scenario-body-kimidake_ga_oboeteiru_jiko/02_npcs.md` には灯が18歳と書かれている箇所が残っている。本文では15歳くらいが正。
- `scenario-writing-context-kimidake_ga_oboeteiru_jiko.md` も旧プロンプト構成のままなので、本文決定稿に合わせて更新が必要。
- `06_scene4.md` はユーザー清書版をそのまま決定稿として反映しており、句読点や文末の細部は未校正。

## 次チャットでやるとよいこと

次の一手は、本文決定稿に合わせたシナリオ設計データの同期。

候補:

- `02_npcs.md` の灯年齢を15歳前後へ更新する。
- `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml` のシーン3/4以降を、空き家シーンと帰還の環情報網シーンに合わせて再設計する。
- `docs/scenario-writing-context-kimidake_ga_oboeteiru_jiko.md` の章別プロンプトを、現在の本文決定稿へ同期する。
- 次本文として、親族夫婦との衝突、逃走、あるいは親族宅/帰還の環施設へ移るシーンを検討する。

## 再開時の短い指示例

```md
TRPG--web-- の続きです。
docs/NEXT_CHAT_HANDOFF_2026-05-29.md と docs/scenario-body-kimidake_ga_oboeteiru_jiko/ を読んで、現在のシナリオ本文決定稿を把握してください。

本文では水瀬灯は15歳くらい、シーン3は平行世界側で死んだ探索者の空き家、シーン4は帰還の環の情報網で親族夫婦に居場所が割れる話が正です。

次の一手は、本文決定稿に合わせて `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml` と関連ドキュメントのズレを洗い出し、修正方針を立てることです。
```
