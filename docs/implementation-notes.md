# Implementation Notes

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
