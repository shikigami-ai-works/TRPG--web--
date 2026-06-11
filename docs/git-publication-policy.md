# Git統合ポリシー

Created: 2026-06-11 JST

この文書は `D:\Codex\TRPG--web--` のGit main repoへ何を入れてよいか、何をローカルまたは別保管に残すか、何を別コミットで採用判断するかを決めるための運用ポリシーである。

## 1. 目的

未追跡docs、NextChat handoff/ledger、historical archive、ASOC prompt、runtime証跡、raw archive、実装コードが同じ作業ツリーに並ぶと、`Git push` 時に無関係な資料まで混ざる危険がある。

このポリシーの目的は次の通り。

- main repoへcommitする対象を、実装・仕様・現行再開資料・今後も使う運用資料に限定する。
- `.runtime/`、`.context-archive/`、raw archive、exact transcript素材、一時ログを通常commitから外す。
- 古いhandoff/ledger群を現行restart sourceではなく historical archive として扱う。
- `git add .` を禁止し、狭い pathspec staging を標準にする。
- 採用判断に迷う資料は、実装commitへ混ぜず、停止または別コミット候補に分ける。

## 2. Git main repoに入れるもの

main repoに入れてよいものは、プロジェクトのソース、現行仕様、再開性、将来の開発判断に直接効く軽量な資料に限る。

### 実装コード

- `components/`、`lib/`、`app/`、`scripts/` などの実装ファイル。
- scenario runtime、UI、検証ツール、型定義など、プロダクトや開発体験に必要なコード。
- ただし scenario、storage、route、AI/RAG、active-contact などの契約を広げる変更は、必ず事前のdocs-first stageで開く。

### テスト

- `tests/` 配下の回帰テスト。
- 実装に対応する検証用テスト、監査ガード、型・lint・scenario validationに必要な補助ファイル。
- `.runtime/` に出る実行結果やスクリーンショットはテスト本体ではなく証跡なので、原則としてcommitしない。

### 現行仕様docs

- current-spec、stage contract、implementation ticket、audit reportなど、現在の仕様判断や受け入れ条件として使うdocs。
- `docs/implementation-notes.md` など、仕様書に書かれていない実装判断を残す文書。
- 古い状態を説明するだけのhandoffやledgerは、現行仕様docsとして扱わない。

### `docs/development-progress.md`

- 現在の進捗、完了済みstage、次の安全なstage、未決定事項を示す進捗台帳としてcommit対象にする。
- ただしraw logs、browser traces、screenshots、archive blobsは本文に貼り込まず、必要ならローカル証跡パスや要約だけを書く。

### 最新の再開用handoff/ledger

- 最新の `docs/NEXT_CHAT_HANDOFF_*.md` と `docs/NEXTCHAT_CONTEXT_LEDGER_*.md` は、次のセッションで読む入口として採用できる。
- 採用するのは通常、最新で現在のHEAD・進捗・境界と一致しているものだけにする。
- best-effort保存の場合は、exact transcriptではないことを明記したまま扱う。

### 今後も使う設計資料/プロンプト

- ASOCや開発運用で今後も再利用するプロンプト、stage template、workflow資料はcommit候補にできる。
- 採用する場合は `docs/prompts/`、`docs/workflows/`、または内容に合うdocs配下へ分類する。
- 分類・移動は別ステージで行い、実装commitには混ぜない。

## 3. Git main repoに原則入れないもの

次のものは原則としてmain repoに入れない。必要性があっても、通常の実装・仕様commitとは分けて判断する。

### `.runtime/`

- ブラウザ/CDP監査結果、スクリーンショット、JSON evidence、ローカル実行ログなどのruntime証跡置き場。
- 監査結果は必要なら要約をdocsに書く。`.runtime/` 配下の生データは通常stageしない。

### `.context-archive/`

- NextChat Fullや保存系のraw archive、manifest、gzip、SQLite index、best-effort sourceなどの保管場所。
- `.context-archive/` はローカル証跡領域であり、通常のGit成果物ではない。

### raw archive

- raw gzip、SQLite index、全文保存素材、exact transcript素材、byte countやSHA-256付きの一次保存物。
- これらは中央保存棚やローカルarchiveで扱い、main repoには軽量なhandoff/ledgerと参照要約だけを置く。

### 一時ログ

- テスト・build・browser・automationの一時出力。
- 失敗調査に必要な場合でも、まず `.runtime/` またはローカル作業領域へ置き、commit対象にしない。

### hidden prompts、credentials、private raw logs、API keys

- hidden prompts、credentials、private raw logs、API keysはdocsにもcommitにも含めない。
- 必要な判断は、秘密情報を除いた要約、公開可能な条件、または安全な参照名だけに変換する。

## 4. historical archiveの扱い

`docs/archive/uncommitted-docs/` は historical archive として扱う。

- ここにある `NEXT_CHAT_HANDOFF_*`、`NEXTCHAT_CONTEXT_LEDGER_*`、過去のplanning docは歴史資料である。
- 現行restart sourceではない。
- 古いstage statusやobsoleteな判断が残っている可能性があるため、現在状態の判断には `docs/development-progress.md`、最新handoff/ledger、`git status` を優先する。
- 採用するなら、実装commitや最新handoff採用commitへ混ぜず、historical archive採用として別コミットにする。
- 採用前に、秘密情報、private raw logs、不要なraw transcript、古い誤誘導が含まれないか確認する。

## 5. NextChat handoff/ledgerの扱い

NextChat handoff/ledgerは再開入口であり、全文archiveそのものではない。

- 通常の再開入口にするのは最新のものだけ。
- 古いhandoff/ledgerを複数まとめて実装commitへ混ぜない。
- 最新handoff/ledgerをcommitする場合は、現在のHEAD、進捗台帳、未追跡状況、禁止範囲が一致しているか確認する。
- best-effort ledgerはbest-effortのまま扱い、exact transcript保存済みとは書かない。
- raw archive、manifest、gzip、SQLite indexは `.context-archive/` または中央保存棚に残し、main repoへ入れない。

## 6. prompt / ASOC資料の扱い

ASOC prompt、Agent Orchestra prompt、stage prompt、運用テンプレートは、今後も使うなら分類してcommit候補にできる。

- 再利用するものは `docs/prompts/` などへ分類する案を採用する。
- workflow本体に近いものは `docs/workflows/` へ置く案も可。
- 1回限りの作業指示、古いASOC実行ログ、heartbeatの生ログはmain repoへ入れない。
- prompt内にhidden prompts、credentials、private raw logs、API keys、raw transcriptが含まれる場合はcommitしない。
- ただし今回のポリシーdoc作成では、prompt資料の移動や分類は行わない。別ステージで採用対象を選ぶ。

## 7. asset / production資料の扱い

制作資料、素材候補、production checklist、asset planningは、今後の制作判断に使うならdocs配下へ分類してよい。

- 制作資料は `docs/assets/` または `docs/production/` へ分類する案を基本にする。
- ライセンス確認、出典、採用可否、未採用理由が必要な資料は、公開可能な範囲で整理する。
- 実画像、巨大素材、生成物、スクリーンショット原本、未確認ライセンス素材はmain repoへ混ぜない。
- asset / production資料の分類も別ステージで行い、実装commitや最新handoff採用commitに混ぜない。

## 8. Git push前チェックリスト

`Git push` は software project repository のcommit/pushであり、Obsidian GitやNextChatとは別成果物である。実行前は必ず次を確認する。

1. `git status --short --branch --untracked-files=all`
2. 採用対象を明示する。例: 「policy docs追加だけ」「最新handoff採用だけ」「prompts整理だけ」
3. `git add .` は禁止。必ず狭い pathspec staging を使う。
4. 例: `git add -- docs/git-publication-policy.md`
5. 必要に応じて複数pathを明示する。handoff/ledgerもワイルドカードではなく、採用する実ファイル名を1つずつ書く。例: `git add -- docs/development-progress.md docs/NEXT_CHAT_HANDOFF_2026-06-11_example.md docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-11_example.md`
6. `git diff --cached --name-status`
7. `git diff --cached --check`
8. commit messageを確認する。コミット対象とmessageが一致しない場合は止める。
9. `git commit -m "<concise message>"`
10. `git push origin main`
11. push後に `git status --short --branch --untracked-files=all`
12. push後に `git log -1 --oneline --decorate`

チェック中に未採用のhistorical archive、raw archive、`.runtime/`、`.context-archive/`、古いNextChat資料がstagedに入った場合は、commit前に停止する。

## 9. 典型的なコミット分割例

混ぜると危ない資料は、次のように分割する。

### 最新handoff採用

- 対象: 最新の `docs/NEXT_CHAT_HANDOFF_*.md` と `docs/NEXTCHAT_CONTEXT_LEDGER_*.md`。
- 目的: 次セッションの再開入口をmain repoへ置く。
- 混ぜないもの: 古いhandoff/ledger、`.context-archive/`、raw archive、prompt整理、実装コード。

### policy docs追加

- 対象: `docs/git-publication-policy.md` のような運用ポリシー。
- 目的: Git統合やpublication判断を安全にする。
- 混ぜないもの: 未追跡docsの移動、archive採用、implementation、NextChat Full raw素材。

### prompts整理

- 対象: 今後も使うASOC promptやstage promptを `docs/prompts/` などへ整理する変更。
- 目的: 再利用可能なprompt資産を運用資料として公開可能にする。
- 混ぜないもの: 実装コード、最新handoff採用、historical archive一括採用。

### historical archive採用

- 対象: `docs/archive/uncommitted-docs/` のうち、しきが明示的に採用した歴史資料。
- 目的: 過去の判断やhandoffを歴史資料としてmain repoに残す。
- 混ぜないもの: 現行restart sourceの更新、実装コード、`.runtime/`、`.context-archive/`。

## 10. 判断に迷った時の停止条件

次の条件に当たる場合は、stageやcommitを進めず停止して、採用判断を取り直す。

- その資料が現行restart sourceなのか、historical archiveなのか判断できない。
- 最新handoff/ledgerと `docs/development-progress.md`、`git log -1` の内容が矛盾する。
- `git add .` でしか安全にstageできないように見える。
- staged diffに `.runtime/`、`.context-archive/`、raw archive、exact transcript素材、一時ログが含まれる。
- hidden prompts、credentials、private raw logs、API keysを含む可能性がある。
- active-contact / Stage20 / scenario / storage / route / AI/RAG の契約を開く必要が出た。
- 古いhandoff/ledgerを現行判断として使う必要が出た。
- commit messageで説明できない複数種類の変更が混ざっている。
- external service、Obsidian Git、NextChat Full、release/tag/PRなどRed gateが出たのに、しきの明示指示がない。

迷った場合の安全な次手は、`git status` と採用候補リストだけを提示し、移動・削除・stage・commit・pushをしないこと。
