# Implementation Notes

## 2026-05-28 MVP Player Check Profile Persistence

- 探索者プロフィールは既存の `SavedRunState` / `CompletedRunRecord` には混ぜず、`trpg-web:v1:check-profile:<scenarioId>` の別キーで保存する形にした。ラン進行データとキャラクター設定の責務を分け、既存セーブ/履歴の移行を発生させないため。
- 「最初から」は進行中ランだけを消し、探索者プロフィールは維持する。探索者設定リセットは別操作として扱うため、探索者パネルに「初期値」ボタンを追加した。
- プロフィール読み込み時は保存JSONのversionやscenarioIdが合わない場合、該当キーを削除して `DEFAULT_MVP_CHECK_PROFILE` へフォールバックする。壊れた値で判定UIを止めないことを優先した。
- 保存済みプロフィール内の数値は、編集時と同じ0〜99の丸めルールで正規化する。正式なポイントバイや能力値上限は未仕様なので、MVPでは安全な数値範囲への修復に留める。
- シナリオ切替時は切替先scenarioIdのプロフィールを読む。現在は複数キャラクター管理ではなく、シナリオ単位のMVP探索者設定として扱う。

## 2026-05-28 MVP Player Check Profile UI

- 探索者プロフィールは `ScenarioExplorer` のReact stateとして持ち、既存の進行中ラン保存データや完了ラン履歴には含めない形にした。今回の目的は判定値編集のMVP接続であり、キャラクター永続化・複数キャラ管理・セーブデータ移行を同時に広げないため。
- プロフィール初期値は `DEFAULT_MVP_CHECK_PROFILE` をクローンして使い、シナリオ切替と「最初から」では初期値に戻す。保存ラン再開時は保存形式を変えないため、プロフィールは現在画面の値を維持する。
- 編集UIは `stats` と `skills` の数値入力に限定し、名前、ポイントバイ合計、成長、ロスト記録は扱わない。まず `rollScenarioCheck` に渡す補正値をプレイヤーが調整できることを優先した。
- プロフィール数値は空欄や不正値を0にし、上限を99に丸める。正式な能力値レンジやポイントバイ検証は別タスクに残し、MVPではUI破損と極端な入力だけを避ける。
- 判定欄の補正表示は現在の探索者プロフィールから再計算するようにした。これにより、入力変更後の次の「振る」が保存データを介さず即座に反映される。

## 2026-05-28 MVP Dice Check Roll

- 引き継ぎで次候補だったエンディング進捗UIは現在のリポジトリでは実装済みだったため、残リスクのうちMVP体験に直結する「ダイス自動ロール」を次の一手にした。
- キャラクター作成とキャラクター永続化全体はまだ仕様化途中のため、今回は保存データ構造を変えず、`DEFAULT_MVP_CHECK_PROFILE` の固定プロフィールで `stat + skill_bonus + 1d20 >= target_number` を解決する形にした。将来のキャラクター選択UI実装時に、同じ純粋関数へ実プロフィールを渡せるようにするため。
- 既存の手動成功/失敗ボタンは残した。シナリオ検証、回帰確認、バランス未調整時のデバッグ導線を維持するため。
- `scene_006_final_ritual` の `check_defeat_makabe` は `related_stat: combat` のようにスキル名寄りの値を持つため、MVPロールでは `stats[related_stat]` がなければ `skills[related_stat]` を補正値として読むフォールバックを入れた。正式にはシナリオデータ側の `related_stat` / `skill_or_art` の使い分けを後で整理する。
- 現行シナリオの目標値は手動判定前提で作られており、ポイントバイ平均値と合わせると成功率が高めになる可能性がある。今回はロール機構の接続を優先し、難易度再調整は別タスクに残す。

## 2026-05-27 Ending Progress UI

- エンディング進捗表示は保存データ構造を変更せず、既存の完了ラン履歴 `CompletedRunRecord[]` と `getReachedEndings(history)` から `endingId` 単位で到達済み判定する形にした。localStorage移行を発生させず、既存セーブ/履歴を壊さないため。
- エンディング一覧の表示順は `scenario.ending_resolution_order` を優先し、そこに含まれないエンディングを末尾に追加する形にした。仕様にUI表示順は未定義だが、解決順がプレイヤーの到達判定順に近いため。
- 未到達エンディングは `ending_tree.visible_before_unlock` が true のものだけ表示し、タイトルは `blurred_title`、本文は `route_hint` に限定した。正式説明、`hidden_description`、解禁、報酬は到達後だけ表示し、伏せ情報の露出を避ける。
- 報酬表示は新しいマスタ参照を増やさず、`RewardDefinition.description` があればそれを優先し、なければ `type` / `npc_id` / `item_ids` / 数値フィールドの簡易ラベルにした。MVPの確認UIとして、保存仕様やシナリオデータ形式を広げない判断。
- エンディング進捗UIの回帰確認は、ブラウザE2Eを常設化せず `lib/scenarios/ending-progress.ts` の表示データ整形を純粋関数として切り出し、既存の `node --test` 回帰テストに載せる形にした。外部依存を増やさず、localStorage履歴と伏せ表示ルールの破損を軽量に検出するため。

## 2026-05-27 Scenario Data Validation Tool

- シナリオ検証は `loadScenarioPack` 本体には混ぜず、`lib/scenarios/validation.ts` の純粋関数として分離した。UIやランタイムの読み込み挙動を変えず、CLIと回帰テストから同じ検証を呼べるようにするため。
- 実行入口は外部依存を増やさず、既存の `tsc -p tsconfig.test.json` で `.test-build/` にビルドしてから `scripts/validate-scenarios.ts` を Node.js で実行する形にした。
- 到達不能エンドの判定は、開始シーンから `next_scene_rules.next_scene_id` をたどり、到達可能なシーンの `ending_id` と `resolve_ending` の解決順を候補にする静的判定にした。条件式の完全充足可能性までは解かず、MVPの遷移構造で「そもそも遷移先にならない」エンドを検出する。
- `next_scene_rules` は `next_scene_id` / `ending_id` / `resolve_ending` のうち1つだけを持つものとして検証する。複数指定や未指定は、実行時に解釈が曖昧になるためエラー扱いにした。
- 条件式オブジェクトは `all` / `any` / `any_missing` / `flag` / `counter` / `trust` / `item` / `choice` のうち1キーだけを持つものとして検証する。`return_without_akari` の `unlock_conditions` は同階層に `all` と `any` が並んでいたため、仕様通り `all` の中に `any` をネストする形へ修正した。
- flag/counter は `scenario.mechanics.initial_flags` と `scenario.mechanics.counters` を宣言元として扱い、state_changes や条件式が未宣言IDを参照した場合はエラーにした。ランタイムは暗黙生成できるが、仕様データのtypo検出を優先した。
- `simple-yaml` は `rewards: []` のようなインライン空配列を配列として読まないため、同梱シナリオの任意空配列は省略する形にした。正式YAMLパーサ導入前のMVPデータ表記ルールとして扱う。
- `scenario.mechanics.trust_loss.dismiss_akari_regret` は過去のシナリオ決定メモにある信頼度低下選択だったため、参照を削除せず `scene_002_accident_trace` に実アクションとして追加した。
- アプリ本体の `tsconfig.json` が `target: es5` のため、検証コードでは `.entries()` や `Set` / `Map` への `for...of` を避け、配列 `forEach` と `Array.from` に寄せた。tsconfig変更で影響範囲を広げるより、検証ツール側を既存設定へ合わせる判断にした。

## 2026-05-27 Regression Tests

- 回帰テスト基盤は外部依存を増やさず、`tsc -p tsconfig.test.json` でテスト対象を `.test-build/` に一時ビルドし、Node.js標準の `node --test` で実行する構成にした。既存依存だけで動かせることを優先した。
- テストは過剰なE2Eではなく、`lib/scenarios/runtime.ts` と `lib/scenarios/storage.ts` の単体/小規模統合テストを中心にした。UIのボタン操作は既存の手動/ヘッドレス確認に任せ、ゲームルールの破損検知を優先した。
- `kimidake_ga_oboeteiru_jiko` の到達条件テストは、手書きの最終状態だけでなく、実際のシナリオYAML内の action/check ID を順に適用して true / normal / lost / good を検証する形にした。これによりシナリオデータ側のID変更や条件変更も検出しやすくした。
- localStorage は Node.js 実行環境に存在しないため、テスト内に最小の `MemoryStorage` を用意して `window.localStorage` として差し込む判断にした。ブラウザ固有APIの完全再現ではなく、現行storage実装が使う範囲だけを再現する。
- テストビルド出力 `.test-build/` は生成物として `.gitignore` に追加した。

## 2026-05-27 Save Load and Run History

- 進行中ランの保存先は `trpg-web:v1:active-run:<scenarioId>` とし、シナリオID単位で誤ロードしない構造にした。保存データにも `version` と `scenarioId` を持たせ、キーと内容が一致しない場合は破棄する。
- ページロード時は保存済みランを自動復元せず、UI上で「再開」を押したときに復元する。保存あり/最初からの分岐をプレイヤーに明示するための判断。
- 保存データは `ScenarioRuntimeState` に近い形を保ちつつ、ラン履歴の重複保存を防ぐため `completedRunId` を追加で保持する。仕様の最低保存項目は維持し、実装上の二重記録防止メタ情報として扱う。
- リセット/最初から操作では進行中ランの localStorage だけを削除し、完了ラン履歴は残す。未仕様だったため、到達済みエンディングの閲覧価値を優先した。
- リセット直後の初期状態は自動保存しない。プレイヤーが操作して初期状態から差分が出た時点で保存する。これにより「リセットで進行中ランを消す」という挙動を保つ。
- 壊れた進行中ランは削除し、壊れた履歴は全体破損なら削除、配列内の不正レコードは無視する。壊れたデータでUIを止めるより、読める履歴を残す判断にした。
- エンディング到達時の履歴保存は `endingId` が入ったラン状態を検知して一度だけ行う。完了ラン履歴では同じエンディングの複数回到達を残し、到達済みエンディング一覧は表示時に `endingId` で重複排除する。
- `four_room_artifacts_carried_out` は既存どおり `carryOutSelections` のチェック状態から同期されるため、進行中ラン保存と完了履歴の両方に `carryOutSelections` を含めた。
- localStorage が使えない、または quota/private mode 等で例外が出る環境では、保存処理は失敗扱いで無視し、React state のプレイ進行は止めない。
- ブラウザ検証を表示文言に依存させないため、主要ボタンと持ち帰りチェックボックスに `data-*` 属性を追加した。UI表示やシナリオ仕様には影響しないテスト用フックとして扱う。
- 検証では `localhost:3001` を使い、途中シーンでのリロード後再開、true / normal / lost / good の履歴保存、持ち帰り2個による `boundary_collapse` と `four_room_artifacts_carried_out=2` を確認した。

このファイルは、仕様書に明記されていなかった実装上の判断、変更、妥協点、今後正式仕様へ戻すべき事項を記録する。

## 2026-05-30 Kimidake Current Spec Entry Point

- `きみだけが覚えている事故` は、旧 handoff と長い作業文脈ファイルに途中経過が残っているため、現行仕様の入口として `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` を新規作成した。
- 旧 handoff 類を全面改稿せず、現行仕様ドキュメントから参照優先順位と古い文脈の扱いを明示する方針にした。履歴を消すより、どのファイルを正とするかを明確にする判断。
- 現行仕様の正本は、この新規ドキュメントだけに閉じず、実行データである `scenarios/kimidake_ga_oboeteiru_jiko/*.yaml` と、本文基準である `docs/scenario-body-kimidake_ga_oboeteiru_jiko/01_overview.md`、`08_scene6.md`、`09_scene7.md` を合わせて扱う。

## 2026-05-31 Kimidake Wedding Rings Action Reuse

- `scene_007_return_fire` の `take_wedding_rings` は、取得済み後も requirements 自体は満たされたままになるため、UI上の再使用防止は既存の `once_per_run` / `usedActionIds` ルールに合わせることにした。未所持条件を新設せず、既存の「一度だけ押せる物語アクション」として扱う判断。
- 所持品重複は `applyStateChanges` 側の `add_items` 重複排除でも守られるが、プレイヤーには取得済みが「使用済み」として見える方が自然なので、YAML側に `once_per_run: true` を追加し、回帰テストで再使用不可と重複なしを確認する形にした。

## 2026-06-01 Kimidake Workflow Freeze and Repo Hygiene

- `.runtime/` は app 側確認や CDP fallback の監査証跡を置くために残すが、成果物としては管理しない方針にした。毎回 `git status` に未追跡として出ると誤 stage の危険があるため、repo の `.gitignore` に `.runtime/` を追加した。
- Kimidake の古い handoff / 執筆用ドキュメントは履歴として保存し、全面改稿しない。現行仕様の入口は `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` に固定し、2026-06-01 の scene7 app 側確認と最新 handoff への参照をそこへ集約する判断にした。
- 変更後の検証ゲートは、シナリオ本体に触った場合は `npm run validate:scenarios` と `npm run test`、UIや共有コードに触った場合は `npm run typecheck`、`npm run lint`、`npm run build` まで広げる運用に整理した。

## 2026-06-01 Kimidake Final Choice UX Gate

- 全編UXレビューのCDP確認で、`scene_007_return_fire` の最終選択肢が `return_artifacts_for_ritual` / `burn_keepsakes_as_farewell` 前から押せる状態だったため、`promise_return_together` と3つの最終選択肢に `has_flag:regret_resolved` を要求するようにした。
- 現行仕様の固定順序では、未開封プレゼント案を断り、指輪を取り、帰還儀式を再現し、送り火として遺留品を返してから最終分岐に入るため、最終選択肢のUI gate は `regret_resolved` に寄せるのが最小変更と判断した。
- `stay_with_akari` も「最後の炉で、帰還ではなく灯と残る選択をする」結末なので、帰還しない選択であっても送り火前には出さない方針に揃えた。

## 2026-06-04 Kimidake Current Spec Routing Refresh

- 2026-06-02 の final-choice gate / non-true ending CDP 監査と `f8161ff Document Kimidake Scene 7 UX audit` が最新の repo 保存点になったため、`docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` の参照優先順位と直近検証を更新した。
- シナリオ本文は今後も改稿され得るため、本文表現だけを根拠に YAML / UI ラベル / 分岐条件を過剰同期しない方針を維持する。固定契約は current-spec と YAML、本文はプレイヤー体験や描写意図の参照レイヤーとして扱う。
- 今回はドキュメントルーティングの更新のみで、YAML、シナリオ本文、UI 実装、`.runtime/` 証跡には触れない判断にした。
- 6/2 handoff 群は作成時点の Git 状態や次作業を含むため、現在の再開指示として直接再実行しない方針を current-spec に明記した。古い handoff は改稿せず、現在状態の解釈を current-spec 側で上書きする。
- Scene 7 の current-spec、本文、YAML、ending 条件、回帰テストを契約レベルで照合し、固定順序、`regret_resolved` gate、持ち帰り制限、true / normal / good / lost の解決条件に実装修正が必要な drift は見つからなかった。本文表現は可変レイヤーなので、ラベルの細部は今回同期対象にしない。
- ending 解決順の実体は `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml` の `ending_resolution_order` にあるため、今後の契約監査で `endings.yaml` だけを見て順序判断しないよう current-spec の作業ルールへ明記した。
- `.runtime/browser-check-*.cjs` の CDP helper は、現時点ではローカル監査証跡兼 fallback 手順として残し、tracked tooling へ昇格しない判断にした。現在の helper は `D:/Codex/TRPG--web--`、ローカル Chrome / Node パス、固定ポート、`.runtime` 出力、ブラウザ終了処理を前提にしているため、そのまま `scripts/` 配下へ移すと再利用可能な開発ツールではなく環境依存スクリプトになる。正式化する場合は、対象ルート、repo root、Chrome/Node 実行ファイル、ポート、成果物出力先、cleanup 範囲を設定化した小さな runner と `npm` script として別タスクで設計する。
- しきの「自力で判断して進める」「スキルやエージェントを工程ごとに活用する」という運用指示を、`docs/codex-autonomous-workflow.md` としてプロジェクト内に固定した。Git push、Obsidian Git、nextchat、正史変更、依存追加、`.runtime` helper 正式化は明示指示が必要な境界として残し、docs整理、小さな契約修正、検証、読み専監査は自動進行可能な範囲として整理した。
- 読み専エージェント監査から、工程報告に CDP 証跡パスと現在の `git status --short --branch` を含める提案を採用した。一方で local handoff は `nextchat` 系の明示指示に結びつく成果物なので、自動進行の通常工程には含めない判断を維持した。
- Stage 7 として初期 UI の CDP 監査を行い、`docs/ux-audit-kimidake-initial-ui-2026-06-04.md` に結果を残した。Browser plugin / node_repl は Windows sandbox refresh で落ちたため、既存 `.runtime` CDP helper と同系統の一時 helper を使った。確認範囲では主要 enabled 操作に可視アウトカムがあり、console error / network failure は 0 件だった。一方で、能力値・技能・action type の内部寄りラベルがプレイヤー画面に出ているため、次の小さな UX 改善候補として記録した。
- Stage 8 として、能力値、技能、scene type、action type、主要カウンター、主要フラグ、持ち帰りグループを UI 表示上だけ日本語ラベル化した。YAML の ID、保存形式、`data-*` 監査属性、テスト契約は変えない判断にした。これは本文改稿ではなく、既存 scenario data の player-facing 表示改善として扱う。
- Stage 9 として、表示ラベル改善後に既存 CDP helper で scene 1 から `return_with_akari` true ending まで代表 happy path を再確認した。`return_artifacts_for_ritual` / `burn_keepsakes_as_farewell` / final choice の gate は維持され、最終状態は `return_with_akari` / `true` / `双つ灯の生還`。console error、network 404、network loading failure は 0 件だった。
- Stage 10 として、表示ラベル改善後に `return_without_akari`、`stay_with_akari`、`boundary_collapse` も既存 CDP helper で再確認した。normal / good / lost の到達、送り火後の final choice enable、`boundary_collapse` の持ち帰り超過 warning が維持され、console error、network 404、network loading failure は 0 件だった。
- Stage 11 として、初期 UI 監査に残っていた scenario directory、ruleset、profile name の内部寄り表示を UI 表示上だけ日本語化した。`pack.directory` は小文字実値に CSS uppercase が重なっていたため、表示フォーマッタで uppercase lookup を追加した。YAML ID、保存キー、`data-*` 監査属性は維持し、`.runtime/initial-ui-2026-06-04T08-36-05-160Z.json` で `KIMIDAKE_GA_OBOETEIRU_JIKO` の本文露出が消えたことを確認した。
- Stage 12 として、ending progress、最近のラン履歴、ending view に残る `lost` / `good` / `true` / `normal` などの ending type を UI 表示上だけ `ロスト` / `グッド` / `トゥルー` / `ノーマル` へ置き換えた。`ending_type` のデータ値、保存履歴、解決順、テスト契約は変えていない。`.runtime/initial-ui-2026-06-04T08-40-32-751Z.json` で初期 UI の ending progress 表示が日本語化されたことを確認した。
- Stage 12 の non-true CDP 再監査では、local `.runtime` helper が ending view の可視テキストを読んでいるにもかかわらず旧 raw 値 `normal` / `good` / `lost` を期待していたため一度失敗した。helper の期待値を表示ラベル `ノーマル` / `グッド` / `ロスト` に合わせ、`.runtime/scene7-nontrue-endings-2026-06-04T08-44-56-579Z.json` で `return_without_akari` / `stay_with_akari` / `boundary_collapse` の再監査が通った。これは tracked tooling の正式化ではなく、今回のローカル証跡 helper の期待更新として扱う。

## 2026-05-27 Scenario MVP Vertical Slice

### シナリオ読み込み

- `scenarios/` 直下のディレクトリから、先頭が `_` で始まるものをテンプレート扱いとして除外し、それ以外をシナリオデータパックとして読み込むことにした。
- 外部依存を増やさずに動かすため、MVPでは `lib/scenarios/simple-yaml.ts` にプロジェクト内YAMLのサブセット用パーサを実装した。
- 上記パーサは汎用YAML完全互換ではない。現時点では、このリポジトリのシナリオYAMLで使うマッピング、配列、文字列、数値、boolean、nullを読む目的に限定する。
- 将来、外部配布シナリオや複雑なYAMLを扱う段階では、`yaml` または `js-yaml` などの正式パーサ導入を再検討する。

### Next.js構成

- 既存リポジトリに `app/`、`components/`、`lib/` が存在しなかったため、App Router構成で最小アプリを新規追加した。
- `app/page.tsx` はサーバー側でシナリオデータを読み込み、クライアントコンポーネント `ScenarioExplorer` へ渡す構成にした。
- シナリオデータは現時点でビルド時/リクエスト時にローカルファイルから読む。DBやAPI経由の読み込みは未実装。

### 状態管理

- MVPではセーブデータ永続化をまだ行わず、`ScenarioExplorer` のReact stateだけで進行状態を保持する。
- `scenario.mechanics.initial_flags` と `scenario.mechanics.counters` をラン開始時の正とし、未定義フラグを暗黙生成しない方針にした。
- `add_flags` は指定フラグを `true` にする短縮処理、`set_flags` はtrue/falseを明示的に設定する処理として実装した。
- 信頼度は `trust_delta` で加減算し、下限0、上限は `npc_trust.max` または100に丸める。
- 判定処理はまだダイス自動ロールではなく、UI上で「成功」「失敗」を手動選択する形にした。

### 条件式とエンディング判定

- `unlock_conditions.all / any / any_missing` は再帰的な条件式として実装した。
- シーン内の簡易条件は `condition_shortcut` 文字列として実装した。
- 終盤選択肢はエンディングへ直接遷移させず、`resolve_ending: true` を経由して `scenario.ending_resolution_order` 順に判定する。
- これにより「二人で帰る」を選んでも、条件不足なら通常エンドや崩壊エンドに落ちる。

### 持ち帰り選択

- `carry_out_groups` は、同じ報酬グループ内で持ち帰れる数を制限するために使う。
- `four_room_artifacts_carried_out` は、持ち帰り選択UIのチェックボックス操作で更新するカウンターとして実装した。
- エンディング到達後に持ち帰り選択を変更すると判定結果と表示状態がズレるため、エンディング表示後はチェックボックスを無効化した。
- 持ち帰り条件の短縮文字列は、意味が曖昧だった `select_items_from_group` / `remaining_items_in_group` を使わず、`owned_items_in_group` と `carry_out_selection_count` に整理した。

### UIの判断

- `available_actions` のうち `type: check` は、選択肢欄に出すと押しても状態が変わらない紛らわしいボタンになるため、MVP UIでは非表示にし、`checks` 欄の成功/失敗ボタンだけを表示することにした。
- 画面は操作検証を優先し、シナリオ一覧、シーン、選択肢、判定、状態、持ち帰り、ログを1画面で確認できる管理画面寄りのレイアウトにした。
- 本格的なTRPG演出、ダイスアニメーション、AI NPC会話UIは未実装。

### 開発環境

- Next.js標準lintを非対話で実行するため `.eslintrc.json` を追加した。
- `next lint` 実行に必要だったため、`eslint` と `eslint-config-next` をdevDependencyへ追加した。
- `node_modules/`、`.next/`、ログ、tsbuildinfoなどを除外する `.gitignore` を追加した。
- しき側で3000番ポートが使用中とのことだったため、検証用サーバーは3001番ポートを使った。

## 2026-05-27 Save/Load + Run History

### 永続化の責務分離

- localStorageのキー生成、保存データの型、読み込み時の簡易バリデーション、履歴集計は `lib/scenarios/storage.ts` に分け、`ScenarioExplorer` はReact stateとの接続とUI表示を担当する形にした。
- 保存データには `version: 1` を持たせた。現時点ではマイグレーション処理は未実装だが、バージョン不一致データは壊れた保存データとして扱う。
- 進行中ランは `trpg-web:v1:active-run:${scenarioId}` に保存し、シナリオID単位で分離した。
- 完了ラン履歴は `trpg-web:v1:run-history` にまとめて保存し、表示時に `scenarioId` で絞り込む形にした。複数シナリオを横断して履歴移行する余地を残すため。

### 壊れた保存データの扱い

- 進行中ランのJSONが壊れている、必須フィールドが足りない、`scenarioId` が現在のシナリオと一致しない場合は、そのactive-runキーを削除して読み込まない。
- 履歴はJSON全体が壊れている場合のみ履歴キーを削除する。配列内に混ざった不正レコードは無視し、有効な履歴だけ表示する。
- localStorageにアクセスできない環境では保存・履歴機能は何もしない。ブラウザ外実行やストレージ制限時にMVP本体を壊さないため。

### 自動保存とリセット

- 初期状態のままではactive-runを作らず、シーン移動、選択、フラグ・カウンター・信頼度・所持品・ログなどに差分が出た時点から自動保存する。
- 既存のリセット/「最初から」は、進行中ランのactive-runだけを削除し、完了ラン履歴は残す判断にした。到達済みエンディングは周回実績に近く、誤って消えると検証とプレイヤー体験の両方で損失が大きいため。
- エンディング到達時に `completedRunId` をstateと保存データへ持たせ、同じエンディング画面の再描画やリロードで同一完了ランが二重保存されにくいようにした。

### ラン履歴と到達済み表示

- 同じエンディングへの複数回到達は、完了ラン履歴としてすべて保存する。
- 到達済みエンディング一覧は `endingId` で重複排除し、最新到達日時が新しい順に表示する。表示上は同一エンドの到達回数も添える。
- 履歴件数の上限や削除UIは仕様化されていないため未実装。localStorage容量に近づく場合は、将来の設定項目として扱う。

### 未実装・今後の正式仕様化候補

- ダイス自動ロールと能力値参照。
- 周回、記憶継承の永続化。
- AI NPC会話とシーン状態の接続。
- アイテム使用アクションと代償 `cost` の自動適用。
- `simple-yaml` を正式YAMLパーサへ置き換えるかどうかの判断。

### 検証メモ

- `npm run typecheck`、`npm run lint`、`npm run build` を通した。
- ブラウザ操作で `return_with_akari`、`return_without_akari`、`boundary_collapse`、`stay_with_akari` の4エンド到達を確認した。
- 検証用サーバーは `http://localhost:3001` で起動した。3000番はユーザー環境で使用中のため避けた。

## 2026-06-06 Stage 14R-1 AdventurePlayer Shell

- Stage 14R-1 added a player-facing `AdventurePlayer` beside the existing debug UI instead of rewriting `ScenarioExplorer`. `/` now renders the player ADV shell, while `/debug` keeps the previous scenario inspection surface available.
- The first slice stops at `scene_003_empty_house` with a slice-complete state instead of advancing into scene 4. This keeps Stage 14R scoped to scenes 1-3 while preserving the existing scenario YAML and runtime rules.
- Player checks are treated as one-use player-facing choices in the ADV adapter by adding the check id to `usedActionIds` after a roll. This is UI/session behavior only; the base scenario runtime was not changed.
- Evidence entries are derived from existing flags and inventory in `lib/adventure/evidence.ts`. No new clue YAML was added because the v0.2 spec allowed a temporary adapter for the first slice.
- Visuals use native CSS placeholders, silhouettes, panels, and generated texture effects only. No paid, unclear-license, local Figma, or AI-assisted visual asset was downloaded or copied into the implementation.
- Evidence source labels are mapped from scene IDs to scene titles in the adapter so the player-facing drawer does not expose raw scenario IDs.
- The mobile drawer is mounted only while open. This avoids leaving offscreen close buttons or drawer content reachable by keyboard focus while the drawer is visually closed.
- The top status strip shows Akari trust as a relationship band and combines evidence/log counts. Raw trust numbers remain in the Status drawer detail rather than the always-visible strip.
- The text-advance control is hidden after the Stage 14R slice-complete state because the completion text is static and should not leave an enabled control with no visible result.

## 2026-06-06 Stage 14R-1 Post-Push Review

- The AdventurePlayer evidence and memory adapters now use the existing scenario flag IDs (`akari_regret_spoken`, `gift_respected_unopened`, `dead_friend_home_respected`, and `confirmed_empty_house_identity`) rather than introducing alias-style adapter names. This keeps the scenario YAML contract unchanged while restoring player-facing evidence/status updates for scenes 2-3.
- Stage 14R slice completion now requires the existing `akari_rested_in_empty_house` flag before the player-facing completion control appears. This keeps the first playable outcome aligned with "Scene 3で灯を休ませるところまで" without changing `scene_003_empty_house.next_scene_rules` or any scenario YAML.
- The Status drawer now includes a story objective line derived from the AdventurePlayer adapter state. This gives the hidden slice-complete gate a player-facing story cue without adding tutorial text or changing scenario data.

## 2026-06-06 Stage 14R-2 Player Log Polish

- The AdventurePlayer slice-completion log now uses a player-facing investigation note instead of the developer-facing `Stage 14R first playable slice complete` marker. This keeps the Log drawer in story language while leaving the adapter-only slice gate, scenario YAML, and route rules unchanged.
- The visible completion button, completion text, stage caption, status objective, and completion event now avoid the production-facing term `縦切り`. The internal `sliceComplete` implementation naming remains because it describes the adapter boundary and is not exposed to the player.
- AdventurePlayer check-result logs now say `出目` instead of the raw `d20` token. The dice formula and `rollScenarioCheck` behavior are unchanged; only the player-facing log wording was polished.
- The completion surface no longer shows a direct `debugを開く` link. `/debug` remains available as the `ScenarioExplorer` route for validation, but the player-facing completion state now keeps development navigation out of the visible choices.

## 2026-06-07 Stage 14R-3 Investigation Log Readability

- The AdventurePlayer adapter now keeps the runtime `state.log` strings intact while deriving structured `logEntries` for the player-facing Log drawer. This avoids changing scenario data or the runtime log contract, but lets the UI show 行動 / 判定 / 場面 / 結末 / 記録 labels and split long roll details away from the main log line.
- The Log drawer now renders each entry as a compact card instead of a plain ordered text list. This was chosen as the first Stage 14R-3 readability pass because it improves investigation scanability without adding new controls, persistence, assets, or scenario schema.
- Evidence cards now separate the category pill from the source line and label the source as `出どころ`. This is UI-only scanability polish; the derived evidence mapping, flag contract, and scenario data remain unchanged.
- Status drawer rows now separate the primary player-facing state label from supporting numeric values such as `侵食値` and `信頼値`. The underlying contamination/trust state and top status strip behavior are unchanged.

## 2026-06-07 Stage 15 AdventurePlayer Scene 4-7 Expansion

- Stage 15 removed the Stage 14R adapter-only stop at `scene_003_empty_house` and now lets `advanceAdventureScene` follow the existing YAML `next_scene_rules` from scene 3 into scene 4. This preserves the scenario contract instead of adding a new route gate or changing YAML. The tradeoff is that the old Stage 14R "first slice complete" UI is no longer available in the player route; that state is now historical rather than a live player outcome.
- The player route now treats `state.endingId` as a terminal AdventurePlayer state. Actions, checks, and scene advance return a no-op event after an ending is reached, while the UI shows a dedicated ending surface with the ending type, title, description, and restart control. This prevents final choices from remaining clickable after resolution without changing `resolveEnding`.
- Scene-specific objective labels for scenes 4-7 were added in the AdventurePlayer view model rather than in scenario YAML. This is a presentation-layer cue only, chosen because Stage 15 should not introduce `presentation.yaml` or rewrite scenario data. A future formal presentation data file could move these labels out of code.
- AdventurePlayer now exposes four-room carry-out selection inside the Status panel by reusing the existing `toggleCarryOutItem`, `getCarryOutGroups`, and `groupOwnedItems` runtime helpers. This keeps carry-out counters and ending conditions aligned with the debug surface. The tradeoff is that carry-out remains a lightweight checkbox control, not a full post-clear reward/save UX.
- Browser/UI verification used a local `.runtime/stage15-adventureplayer-ui-audit.cjs` CDP helper rather than adding tracked test tooling. This keeps Stage 15 focused on product behavior and preserves the existing convention that `.runtime/` is local evidence unless Shiki explicitly approves turning it into reusable tooling.
- Stage 15 intentionally did not add real player-facing save/load, AI GM, free input, API/Tauri integration, new assets, or clue schema files. Those remain later stages because the current goal is deterministic scene 4-7 playability using existing YAML and runtime behavior.

## 2026-06-07 Stage 16-0 to Stage 16-4 Post-Ending Save Replay Spec

- Stage16-1 through Stage16-4 were kept in one implementation-preparation spec file, `docs/stage16-post-ending-save-replay-spec.md`, instead of creating four smaller docs. This keeps the post-ending UX, save/resume, ending progress, and replay motivation decisions in one place because Stage16-5 will need to implement them as one connected player-facing layer. The tradeoff is a longer single document, but it avoids scattering cross-references before code work begins.
- Stage16-2 recommends reusing the existing `trpg-web:v1:active-run:<scenarioId>` and `trpg-web:v1:run-history` localStorage contracts rather than inventing an AdventurePlayer-only save key. The reason is that `lib/scenarios/storage.ts` already serializes the runtime fields AdventurePlayer needs, including `endingId`, `completedRunId`, and carry-out selections. The tradeoff is that `/` and `/debug` continue to share the same deterministic scenario storage model, which is acceptable because `ScenarioExplorer` remains the debug view over the same runtime contract.
- AdventurePlayer resume is specified as automatic restore with a visible fresh-start escape hatch, while completed run history remains preserved on restart. This is a player-facing adjustment from the older debug UI pattern where resume was more explicitly manual; the reason is that Stage16 is about reducing friction for full player runs, not debug inspection.
- Stage16-3 keeps ending progress derived from completed run history instead of adding a separate unlocked-ending key. The tradeoff is that progress reflects completed endings only; this is safer than maintaining two unlock sources that could drift.
- Stage16-4 limits "missing evidence" style replay hints to the current ended active run because `CompletedRunRecord` does not currently store final flags, used action IDs, or evidence IDs. If that active ended run is unavailable, the spec says to omit evidence-gap hints rather than guess from history. A future formal clue/evidence schema can widen this later, but Stage16 does not add it.
- Stage16-5A was defined as the smallest next code implementation candidate: wire AdventurePlayer to existing save/resume/history helpers and add a minimal post-ending record entry. Full ending progress sheets and replay hint surfaces are allowed as follow-up slices if Stage16-5A becomes too broad.

## 2026-06-07 Stage 16-5A AdventurePlayer Save Resume Implementation

- `appendCompletedRunOnce` was added to `lib/scenarios/storage.ts` as the single helper gap needed by AdventurePlayer. It records a completed run only when `state.endingId` exists and `state.completedRunId` is still empty, then writes the resulting `completedRunId` back into runtime state. The reason is to keep duplicate-prevention close to the shared storage contract instead of duplicating that logic inside the React component. The accepted tradeoff is that a storage failure writes an `:unpersisted` marker, so the same ended React state will not retry forever if localStorage is blocked; a future recovery/backfill UI would need a separate explicit design.
- AdventurePlayer now auto-restores a valid `trpg-web:v1:active-run:<scenarioId>` on load instead of adding a manual resume chooser. This follows the Stage16-2 low-friction recommendation. The visible escape hatch is a quiet `最初から` control when a restored or saved non-ended run has meaningful progress.
- AdventurePlayer saves only meaningful runtime changes by comparing against `createInitialState(pack)` with `hasMeaningfulProgress`. Drawer open/close, panel switching, and text page advance are intentionally not saved because they are presentation state, not scenario runtime state.
- The post-ending surface adds only a minimal reached-run record status, story-facing outcome summary, read-only carry-out summary, and buttons that focus/open the existing Log, Evidence, and Status drawers. This intentionally defers the full ending progress/reward sheet and replay hint surface to Stage16-5B/5C so Stage16-5A stays small.
- `もう一度たどる` clears only the active run and starts a fresh runtime state. Completed run history and check profile storage are preserved because reached endings are replay motivation and should not be erased by normal restart.
