# Codex 自動進行ワークフロー
最終更新: 2026-06-04

この文書は、`D:\Codex\TRPG--web--` で Codex にどこまで自動で任せてよいかを固定する運用ルールである。作業を止めるための文書ではなく、しきの短い指示から次の安全な工程を選び、プロンプトを立て、実行し、検証し、必要な判断を残すための基準として使う。

## 基本方針

Codex は、広い作業を一気に抱え込まず、1工程ごとに「実行プロンプト」を明文化してから進める。プロンプトには目的、背景、対象ファイル、制約、禁止事項、検証、完了条件、失敗時の扱い、報告形式を含める。

スキルやエージェントは、工程ごとに必要なものだけ選ぶ。すべてを機械的に起動するのではなく、読む、設計する、実装する、監査する、検証する、引き継ぐ、のどこに効くかを説明してから使う。

エージェントは、即時のブロッカーではない独立監査や、書き込み範囲が分離できる実装に使う。次の一手がその結果なしに進められない場合は、Codex 本体が先に処理する。

Git push、Obsidian Git、nextchat は別の成果物である。しきが明示したときだけ実行し、通常の自動進行のついでに混ぜない。

## ソフト開発オーケストラ

ソフト開発で `Agent Orchestration`、`オーケストラ`、`自走レーン`、`なるべく自走` のような指示が出た場合は、実行テンプレとして `docs/workflows/software-development-orchestra.md` を使う。

この文書は自動進行の上位方針を定める。`docs/workflows/software-development-orchestra.md` は、実際のソフト開発 stage を切るための運用票であり、Main Orchestrator、Self-drive level、Explorer / Worker / Auditor / Preserver の役割、Stage Prompt、検証 matrix、記録先を定義する。

原則として、Codex 本体が Main Orchestrator として最終判断を持つ。サブエージェントの出力は材料として扱い、差分、検証、プロジェクト指示との整合を Codex 本体が確認してから採用する。

## 保存・添付・nextchat の扱い

このプロジェクトでは、作業中の相談、再開用 handoff、添付原文保存、仕様根拠保存を別レイヤーとして扱う。目的が違うため、同じ「保存」として混ぜない。

| 状況 | 既定の扱い | 使う合図 |
|---|---|---|
| 軽い相談、設計の壁打ち | 保存しない。必要なら後で仕様書やdesign logに要点だけ残す。 | なし |
| 次チャットで再開したい | NextChat Full を既定にする。project-local の `NEXT_CHAT_HANDOFF`、必要な context ledger、exact source がある場合の `.context-archive` raw archive / manifest / SHA-256 / byte count を作る。exact source がない場合は best-effort と明記する。 | `nextchat`、`次チャット`、`引き継ぎMarkdown`、`NextChat Full` |
| 軽量な引き継ぎだけ欲しい | raw archive を作らず、project-local の `NEXT_CHAT_HANDOFF` だけを簡潔に作る。これは明示された場合だけ使う。 | `軽量で`、`handoff-only`、`簡潔な引き継ぎだけ` |
| 添付や長文を原文で残したい | `.context-archive` に raw archive、manifest、SHA-256、byte count、必要なら検索indexを残す。NextChat Full の一部として扱う。 | `全文保存`、`添付も原文保存`、`raw archive` |
| 仕様の根拠にする添付 | `.context-archive` への原文保存を必須にする。仕様書には manifest path と参照理由を書く。 | `仕様の根拠`、`一次資料`、`この添付を根拠にする` |

`NEXT_CHAT_HANDOFF` は再開用の整理メモであり、添付や長文の一字一句保存とは別物である。現在の既定では bare `nextchat` も NextChat Full として扱い、exact source がある場合は handoff 要約だけで済ませず `.context-archive` に原文保存する。軽量 handoff-only は、しきが明示した場合だけ使う。

仕様の根拠にする添付は、`NextChat Full archive` 相当の raw preservation として保存する。単に要約や引用を仕様書へ貼るだけでは完了扱いにしない。

仕様根拠添付の保存手順:

1. 添付または長文の exact source がローカルファイルとして参照できるか確認する。
2. exact source がある場合は、archive root を `.context-archive` にして raw archive を作る。
3. manifest に raw gzip path、SHA-256、byte count、source name、scope、作成時刻が残っていることを確認する。
4. 必要なら `.context-archive/context_index.sqlite3` に検索indexを作る。
5. 仕様書または design log には raw text を貼り込まず、manifest path、SHA-256、何の判断根拠にしたかを書く。
6. exact source がない場合は、raw preservation は `best-effort` または unavailable と明記し、一字一句保存済みとは報告しない。

しきが重要そうな添付、長文、外部資料を渡し、それが仕様判断や実装判断の根拠になりそうな場合、Codex は作業を進める前に「これは raw archive に残すか」を短く確認してよい。ただし、しきが `NextChat Full`、`全文保存`、`添付も原文保存`、`raw archive` と明示した場合は確認せず保存工程へ進む。

保存先の使い分け:

- `docs/*SPEC*.md`: 決まった仕様、実装契約、acceptance criteria。
- `docs/*design-log*.md`: 迷い、比較、仮決め、なぜそう決めたか。
- `docs/implementation-notes.md`: 実装中に仕様書へ書かれていなかった判断、妥協、変更。
- `.context-archive/`: 添付や長文の exact raw archive。通常のGit成果物に混ぜない。

## シナリオ本文の扱い

`docs/scenario-body-kimidake_ga_oboeteiru_jiko/*.md` の本文は今後も変わり得る。本文の語り、ラベル、細部表現だけを根拠に、YAML、UI、テスト、ending 条件を過剰同期しない。

固定契約として扱うものは、優先順に次の通り。

1. `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md`
2. `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml`
3. `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml`
4. `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml`
5. `tests/scenario-regression.test.ts`
6. 最新の検証済み handoff と実行証跡

本文を直す工程では、本文の体験と上記契約が矛盾していないかを確認する。本文改稿が action ID、flag、counter、ending 解決順、UI 表示条件、プレイヤーが見える選択肢に影響する場合だけ、YAML とテストを同時に更新する。

## 自動で進めてよい範囲

Codex は、次の作業をしき確認なしで進めてよい。

- 既存docsを読み、現行仕様の入口、参照優先順位、古い handoff の扱いを整理する。
- `docs/implementation-notes.md` に、仕様書外の判断、妥協、将来正式化すべき事項を追記する。
- current-spec、YAML、テストが明確に示す狭い不整合を修正する。
- 既存仕様を壊さない範囲で、小さな回帰テストや validation を追加する。
- UI上で enabled に見える操作が実際に何も起こさない場合、期待される挙動が仕様から明確なら修正する。
- docsだけの整備、検証ログの要約、再開手順の明確化を行う。
- `.runtime/` をローカル監査証跡として読み、結果を要約する。
- `git status`、`git diff`、`npm run validate:scenarios`、`npm run test`、`npm run typecheck`、`npm run lint`、`npm run build` などのローカル検証を実行する。

## しき確認が必要な範囲

Codex は、次の作業では自動で突き進まず、しきの明示指示を待つ。

- Git の commit、push、tag、release、PR 作成。
- Obsidian Git への保存。
- nextchat handoff の新規作成。ただし、しきが `nextchat`、`次チャット`、`引き継ぎMarkdown` などを言った場合は作成する。
- 物語の正史、ending の意味、登場人物の生死や関係性、主要な感情結論を変える本文改稿。
- 新しいルールセット、戦闘方式、能力値体系、AI NPC 会話、RAG、ComfyUI、外部モデル連携の導入。
- 依存パッケージ追加、外部ネットワーク、外部サービス連携、配布物作成。
- `.runtime/` の CDP helper を tracked tooling へ昇格する作業。
- 大量削除、履歴の書き換え、古い handoff の全面改稿。

## 工程ごとの実行プロンプト形式

各工程は、次の形式で始める。

```text
Stage N: <短い工程名>

目的:
<この工程で達成すること。1つだけに絞る。>

背景:
<current-spec、handoff、ユーザー指示、直前の検証結果など。>

対象:
<読む/編集するファイル、実行するコマンド、使うスキルやエージェント。>

制約:
<触らないファイル、本文可変の扱い、git境界、外部依存、UI操作境界。>

禁止事項:
<勝手にpushしない、古いhandoffを現在指示として再実行しない、本文だけで契約を変えない等。>

検証:
<この工程に必要な最小検証。docsだけなら git diff --check、シナリオ契約なら validate/test、UIならブラウザ監査など。>

完了条件:
<次のCodexが迷わず再開できる状態。>

失敗時:
<何を記録し、どこで止まり、次に何を確認するか。>

報告:
<変更点、検証結果、未解決リスク、次の推奨工程。>
```

## 検証ゲート

docsだけを変更した場合でも、契約文書に触ったときは `git diff --check` を通す。シナリオ current-spec、YAML、本文の関係に触れた場合は `npm run validate:scenarios` と `npm run test` を通す。

TypeScript、React UI、共通ロジック、依存関係、ビルド設定に触れた場合は、`npm run typecheck`、`npm run lint`、`npm run build` を追加する。

UIを変更した場合は、見える interactive element を列挙し、それぞれのユーザー可視アウトカムを確認する。ボタン、リンク、タブ、トグル、チェックボックス、メニュー、クリック可能カードが enabled なら、状態変更、遷移、モーダル、フォーカス、保存、ダウンロード、toast などの結果が必要である。

ブラウザや CDP 監査を行った場合は、`.runtime/` の証跡を成果物として stage しない。必要な事実だけ docs や報告に要約する。

## エージェント利用ルール

Explorer は、既存docsやコードの読み専監査に使う。たとえば「handoffとcurrent-specの矛盾」「Scene 7契約のdrift」「自動化境界の抜け」のように、独立した問いを渡す。

Worker は、書き込み範囲が明確に分離できる場合だけ使う。複数 worker を使う場合は、それぞれの所有ファイルを明示し、互いの編集を戻さないよう指示する。

エージェント結果はそのまま採用せず、Codex 本体が差分、検証、プロジェクト指示との整合を確認する。読み専監査の結論は、必要に応じて current-spec または implementation-notes に要約して残す。

## 報告形式

工程完了時は、次を短く報告する。

- 実行した Stage
- 変更したファイル
- 触らなかった重要範囲
- 検証コマンドと結果
- CDP / ブラウザ監査を行った場合は、要約と `.runtime/` 内の証跡パス
- 現在の `git status --short --branch`
- 残るリスク
- 次に進めるなら最も安全な Stage

Git 操作をしていない場合は、commit や push をしたように報告しない。Git 操作をした場合だけ、実際の commit、push、PR の結果を報告する。
