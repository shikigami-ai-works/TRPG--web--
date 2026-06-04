# Kimidake Initial UI Audit
最終更新: 2026-06-04

## 目的

`きみだけが覚えている事故` をアプリで最初に開いたときの UI と、初期画面に見える主要 interactive element の実挙動を確認する。シナリオ本文、YAML、UI 実装は変更せず、監査だけを行った。

## 実行方法

- 一時 helper: `.runtime/browser-check-initial-ui-cdp.cjs`
- 実行: Chrome headless / CDP fallback
- Next.js: helper 内で一時ポート起動
- 結果 JSON: `.runtime/initial-ui-2026-06-04T08-18-16-400Z.json`
- スクリーンショット: `.runtime/initial-ui-2026-06-04T08-18-16-400Z.png`
- dev server log: `.runtime/initial-ui-dev-2026-06-04T08-18-16-400Z.log`

`.runtime/` はローカル監査証跡であり、成果物として stage しない。

## 確認結果

初期表示は `scene_001_parallel_arrival`、見出しは `死んだきみの顔`。初期画面で見える主要ボタンは、シナリオ選択、リセット、初期値、進行、2つの選択肢、判定の振る/手動成功/手動失敗、再開、最初から。

`再開` は保存済みランがない初期状態では disabled。`最初から`、`進行`、選択肢、判定操作は enabled。プロフィール数値入力は 20 個表示され、`strength` の値を `10` から `42` に変更できた。

`初期値` ボタンを押すと、変更した `strength` が `10` に戻った。`最初から` ボタンはクリック可能で、初期 scene のまま新規ラン状態へ戻った。`進行` ボタンは `scene_001_parallel_arrival` から `scene_002_accident_trace` へ遷移し、見出しが `祝えなかった誕生日` に変わった。進行後は保存済みランが作成され、`再開` が enabled になった。

CDP 監査中の console error は 0 件、network loading failure は 0 件だった。

## UX 観察

初期画面の enabled な主要操作には、確認した範囲でユーザー可視の結果があった。死んだボタンは見つかっていない。

一方で、プレイヤー向け表示に `strength`、`constitution`、`library_use`、`conversation`、`story` のような内部寄り ID / type label がそのまま出ている。MVP の検証用途としては読めるが、通常プレイヤー向け UX としては日本語ラベルへ置き換える余地がある。

今回の監査は初期画面から scene 2 への代表操作までであり、全 scene / 全 ending の通し操作監査ではない。

## 2026-06-04 follow-up

上記の内部寄りラベル露出に対して、UI 表示のみを変更した。能力値、技能、scene type、action type、主要カウンター、主要フラグ、持ち帰りグループを日本語のプレイヤー向けラベルで表示し、ID、YAML、保存形式、`data-*` 監査属性は変更していない。

再監査証跡:

- 結果 JSON: `.runtime/initial-ui-2026-06-04T08-40-32-751Z.json`
- スクリーンショット: `.runtime/initial-ui-2026-06-04T08-40-32-751Z.png`
- dev server log: `.runtime/initial-ui-dev-2026-06-04T08-40-32-751Z.log`

再監査では、`conversation` / `story` が `会話` / `行動` として表示され、`strength` / `library_use` などの能力値・技能IDは `筋力` / `資料調査` などの表示に置き換わった。追加で scenario directory、ruleset、profile name、ending type もプレイヤー向け表示に置き換え、`bodyTextSample` から `KIMIDAKE_GA_OBOETEIRU_JIKO` の露出が消え、ending progress は `ロスト` / `グッド` / `トゥルー` / `ノーマル` と表示された。`進行` は `scene_002_accident_trace` へ遷移し、プロフィール変更と初期値リセットも引き続き動作した。console error と network loading failure は 0 件だった。

## 2026-06-04 full-route UI check

表示ラベル改善後に、既存の Scene 7 CDP helper と同系統の UI 操作で `scene_001_parallel_arrival` から true ending までの代表 happy path を再確認した。

証跡:

- 結果 JSON: `.runtime/scene7-ending-2026-06-04T08-42-14-579Z.json`
- スクリーンショット: `.runtime/scene7-ending-2026-06-04T08-42-14-579Z.png`
- dev server log: `.runtime/scene7-ending-dev-2026-06-04T08-42-14-579Z.log`

確認した主なルート:

- `say_not_replacement`
- `let_akari_speak_regret`
- `respect_gift_unopened`
- `check_cult_trace` success
- `let_akari_rest_in_empty_house`
- `respect_dead_friend_home`
- `check_empty_house_context` success
- `protect_akari_without_possessing`
- `stand_beside_akari_choice`
- `check_escape_returning_family` success
- `recover_stolen_keyholder`
- `recover_birthday_gift`
- `check_understand_cult_goal` success
- `take_boundary_ember`
- `take_empty_nameplate`
- `take_stopped_pocket_watch`
- `disrupt_ritual`
- `check_survive_relative_attack` success
- `share_guilt_truthfully`
- `check_hold_together_after_crime` success
- `check_defeat_makabe` success
- `realize_return_ritual_reproduction`
- `refuse_unopened_gift_as_return_fuel`
- `take_wedding_rings`
- `return_artifacts_for_ritual`
- `burn_keepsakes_as_farewell`
- `promise_return_together`
- `check_final_boundary_stability` success
- `choose_return_with_akari`

最終状態は `endingId: return_with_akari`、UI snapshot 上の `endingType: トゥルー`、`endingTitle: 双つ灯の生還`。console error、network 404、network loading failure は 0 件だった。

Scene 7 の checkpoint では、`return_artifacts_for_ritual` は `行動`、`promise_return_together` は `会話`、final choices は `最終選択` として表示された。`burn_keepsakes_as_farewell` の前は final choices が disabled で、送り火後に enabled になった。

## 2026-06-04 non-true route UI check

表示ラベル改善後に、既存の non-true ending CDP helper で `return_without_akari`、`stay_with_akari`、`boundary_collapse` も再確認した。

証跡:

- 結果 JSON: `.runtime/scene7-nontrue-endings-2026-06-04T08-44-56-579Z.json`
- スクリーンショット: `.runtime/scene7-nontrue-endings-2026-06-04T08-44-56-579Z.png`
- dev server log: `.runtime/scene7-nontrue-dev-2026-06-04T08-44-56-579Z.log`

到達結果:

- `return_without_akari` / UI snapshot `ノーマル` / `空席に残る灯`
- `stay_with_akari` / UI snapshot `グッド` / `境界に灯るふたり`
- `boundary_collapse` / UI snapshot `ロスト` / `境界の狭間に揺れる`

checkpoint では、Scene 7 開始時、指輪取得後、儀式再現後、送り火後、final ending、履歴反映、持ち帰り超過 warning を確認した。`boundary_collapse` では持ち帰り表示が `四方アーティファクト 2/1` となり、制限超過 warning が表示された。console error、network 404、network loading failure は 0 件だった。

## 次の候補

1. 次に UI を進める場合は、全 route の `bodyTextSample` / スクリーンショットから低頻度 raw ID を追加抽出する。
2. 低頻度に出る item / check / reward 由来 ID が残る場合、実画面監査で見つけたものから表示ラベルを追加する。
3. 監査helperを正式化する場合は、`docs/codex-autonomous-workflow.md` の通り、絶対パスや Chrome/Node パスを設定化する別タスクとして扱う。
