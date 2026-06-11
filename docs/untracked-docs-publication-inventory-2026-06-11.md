# 未追跡docs公開判断インベントリ 2026-06-11

Created: 2026-06-11 JST

この文書は `D:\Codex\TRPG--web--` の未追跡docsを、main repoへ入れる候補、別コミット候補、historical archive候補、main repo非採用候補へ分類するための読取専用インベントリである。

今回のASOCサイクルでは、分類と次ステージ提案だけを行う。未追跡ファイルの移動、削除、stage、commit、pushは行わない。

## ASOC Loop 1

### Objective

現在の `git status --short --branch --untracked-files=all` に出ている未追跡docsを、Git統合ポリシーに従って分類する。

### Selected Assets

- Main Orchestrator: しきの意図、AGENTS.md、Git境界、最終判断を保持。
- Explorer: 未追跡docs、最新handoff/ledger、archive README、Git統合ポリシーを読み専で確認。
- Worker: このインベントリdocだけを作成。
- Auditor: diff、分類境界、Red操作未実行、検証結果を確認。
- Preserver: 未使用。NextChat Full、Obsidian Git、Git pushは今回の範囲外。

### Context Handling

読んだものは次の範囲に限定した。

- `docs/git-publication-policy.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-11_git-policy-prompt-nextchatfull.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-11_git-policy-prompt-nextchatfull.md`
- `docs/archive/uncommitted-docs/README.md`
- `git status --short --branch --untracked-files=all`
- `git log -1 --oneline --decorate`
- 未追跡docsのpath、size、先頭heading一覧

hidden prompts、credentials、private raw logs、API keys、raw archive本文は読取対象にしない。

## 現在の基準状態

- Branch: `main`
- HEAD: `e7def7d Add stage19a nextchat handoff`
- `HEAD`, `origin/main`, `origin/HEAD`: `e7def7d`
- 最新Stage19A handoff/ledger pairはtracked済み。
- 未追跡docsは多数残っているが、これは自動採用対象ではない。

## 分類サマリ

| 分類 | 件数 | 判断 |
| --- | ---: | --- |
| 最新handoff候補 | 2 | Git policy作業の最新NextChat pair。採用するなら最新handoff採用commitとして別扱い。 |
| policy docs候補 | 2 | `docs/git-publication-policy.md` とこのインベントリ。採用するならpolicy docs追加commit。 |
| historical archive候補 | 40 | 古いroot handoff/ledger 10件と `docs/archive/uncommitted-docs/` 30件。現行restart sourceではない。 |
| prompts候補 | 3 | 今後も使うなら `docs/prompts/` などへ分類する別ステージ候補。 |
| asset / production候補 | 1 | 制作資料として `docs/assets/` または `docs/production/` 分類候補。 |
| main repo非採用候補 | 0 | 現在の未追跡docs一覧にはraw archiveやruntime証跡の実体は出ていない。 |

この文書自身を作成した後は、未追跡docs数が1件増える。採用判断ではこのインベントリもpolicy docs候補として扱う。

## 1. 最新handoff候補

未追跡docsの中で最新の再開入口候補として扱えるのは次の2件。

- `docs/NEXT_CHAT_HANDOFF_2026-06-11_git-policy-prompt-nextchatfull.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-11_git-policy-prompt-nextchatfull.md`

判断:

- Git publication policy作業の直前文脈を保存したbest-effort NextChat pair。
- 現行のStage19A再開入口はすでにtracked済みなので、このpairは「Git policy作業ラインの最新handoff候補」として扱う。
- 採用するなら、policy docs追加commitやhistorical archive採用commitへ混ぜない。
- raw archive実体は `.context-archive/` 側にあり、main repoへ入れない。

推奨コミット単位:

```powershell
git add -- docs/NEXT_CHAT_HANDOFF_2026-06-11_git-policy-prompt-nextchatfull.md docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-11_git-policy-prompt-nextchatfull.md
```

このstageでは実行しない。

## 2. policy docs候補

次のdocsはGit統合判断そのものに関わるため、main repo採用候補。

- `docs/git-publication-policy.md`
- `docs/untracked-docs-publication-inventory-2026-06-11.md`

判断:

- `docs/git-publication-policy.md` は、main repoへ入れるもの、入れないもの、別コミットにするもの、`git add .` 禁止、pathspec staging、historical archive扱いを定義する。
- このインベントリは、現在の未追跡docsを分類した一時点の判断表である。
- 採用するなら「policy docs追加」として、NextChat pair、prompts整理、historical archive採用とは分ける。

推奨コミット単位:

```powershell
git add -- docs/git-publication-policy.md docs/untracked-docs-publication-inventory-2026-06-11.md
```

このstageでは実行しない。

## 3. historical archive候補

historical archive候補は、現行restart sourceではない。採用するなら別コミットで、歴史資料として採用する。

### root直下の古いNextChat pair

次の10件は、`docs/archive/uncommitted-docs/` にはまだ入っていないが、最新restart sourceではなくhistorical archive候補として扱う。

- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-09_doc-archive-nextchatfull-obsidiangit.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-09_stage17-contact-relationship-direction-nextchatfull.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-09_stage17b2-prompt-obsidiangit.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-10_stage17c-d-postpush-nextchatfull.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-10_stage18-active-contact-contract-nextchatfull.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-09_doc-archive-nextchatfull-obsidiangit.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-09_stage17-contact-relationship-direction-nextchatfull.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-09_stage17b2-prompt-obsidiangit.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-10_stage17c-d-postpush-nextchatfull.md`
- `docs/NEXT_CHAT_HANDOFF_2026-06-10_stage18-active-contact-contract-nextchatfull.md`

判断:

- 古いhandoff/ledgerは、現行restart sourceではない。
- commitするなら「root直下の古いNextChat pairをarchiveへ移す」または「historical archiveとして採用する」別ステージが必要。
- 移動・削除は今回しない。

### `docs/archive/uncommitted-docs/`

次の30件は、すでにarchive配下に集められているhistorical archive候補。

- `docs/archive/uncommitted-docs/README.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-06_stage14r_adventureplayer_post_push.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-06_stage14r_completion_gate_post_push.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage14r2_player_polish_post_push.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage14r3_post_push_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage14r4_choice_planning_workpack_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage16-5a-autonomous-prompt-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage16-5a_post_push_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage16-5b_to_5c_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage16-5c-post-push-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage16-7a-post-push-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-07_stage16_0_to_16_4_implementation_prompt_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7b-post-push-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7c-prompt-obsidiangit-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-08_stage16-7f-a-post-push-agent-orchestra-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-06_stage14r_adventureplayer_post_push.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-06_stage14r_completion_gate_post_push.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage14r2_player_polish_post_push.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage14r3_post_push_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage14r4_choice_planning_workpack_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage16-5a-autonomous-prompt-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage16-5a_post_push_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage16-5b_to_5c_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage16-5c-post-push-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage16-7a-post-push-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-07_stage16_0_to_16_4_implementation_prompt_nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7b-post-push-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7c-prompt-obsidiangit-nextchatfull.md`
- `docs/archive/uncommitted-docs/NEXT_CHAT_HANDOFF_2026-06-08_stage16-7f-a-post-push-agent-orchestra-nextchatfull.md`
- `docs/archive/uncommitted-docs/scenario-choice-planning-kimidake_ga_oboeteiru_jiko.md`

判断:

- `README.md` 自体が「not the current restart source」と定義している。
- stage14Rからstage16-7F-Aまでの古い文脈が中心で、現行restart sourceとして使わない。
- 採用するなら、秘密情報・raw transcript・obsoleteな誤誘導がないか別stageで監査する。

## 4. prompts候補

次の3件はprompt / ASOC資料候補。

- `docs/stage17-agent-skill-orchestra-roadmap-prompt.md`
- `docs/stage17b-2-agent-skill-orchestra-prompt.md`
- `docs/stage18-active-contact-contract-asoc-prompt.md`

判断:

- 今後も使うなら `docs/prompts/` などへ分類する案が自然。
- stage17/stage18文脈のpromptなので、現行実装や最新restart sourceへ混ぜない。
- active-contact、Stage20、scenario、storage、route、AI/RAGの実装を開く資料として使わない。あくまでprompt資料の分類候補として扱う。
- 移動するなら別stageで、公開可能性と秘密情報の有無を確認する。

## 5. asset / production候補

次の1件はasset / production資料候補。

- `docs/kimidake-graphic-asset-production-list.md`

判断:

- 制作資料として価値がある可能性がある。
- 採用するなら `docs/assets/` または `docs/production/` へ分類する案が自然。
- ライセンス、出典、未確認素材、生成物や巨大素材の混入がないか別stageで確認する。
- 実装commitやNextChat採用commitへ混ぜない。

## 6. main repo非採用候補

現在の `git status --short --branch --untracked-files=all` に出ている未追跡docsだけを見る限り、raw archive実体やruntime証跡実体は未追跡docsとして出ていない。

ただし、次の領域は引き続きmain repo非採用を原則にする。

- `.runtime/`
- `.context-archive/`
- raw gzip
- SQLite index
- exact transcript素材
- browser/CDP screenshotやJSON evidence
- 一時ログ
- hidden prompts、credentials、private raw logs、API keys

NextChat ledger内に `.context-archive/` のmanifestやraw gzip pathが書かれている場合でも、それは参照要約であってraw archive実体ではない。実体はstageしない。

## 推奨コミット分割

### Commit A: policy docs追加

候補:

- `docs/git-publication-policy.md`
- `docs/untracked-docs-publication-inventory-2026-06-11.md`

目的:

- 今後のGit統合判断と未追跡docs分類をmain repoで共有する。

禁止:

- `git add .`
- 古いhandoff/ledgerの混入
- `.runtime/`、`.context-archive/`、raw archiveの混入

### Commit B: Git policy NextChat pair採用

候補:

- `docs/NEXT_CHAT_HANDOFF_2026-06-11_git-policy-prompt-nextchatfull.md`
- `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-11_git-policy-prompt-nextchatfull.md`

目的:

- Git policy作業ラインの最新再開入口を残す。

判断:

- Commit Aと同時にするかは要注意。再開入口とpolicy docは性質が違うため、別コミット推奨。

### Commit C: prompts整理

候補:

- `docs/stage17-agent-skill-orchestra-roadmap-prompt.md`
- `docs/stage17b-2-agent-skill-orchestra-prompt.md`
- `docs/stage18-active-contact-contract-asoc-prompt.md`

目的:

- 今後も使うprompt資料を `docs/prompts/` などへ分類する。

判断:

- 移動先、命名、公開可能性を別stageで確認する。

### Commit D: asset / production資料整理

候補:

- `docs/kimidake-graphic-asset-production-list.md`

目的:

- 制作資料として `docs/assets/` または `docs/production/` へ分類する。

判断:

- ライセンス・出典・採用可否の確認が先。

### Commit E: historical archive採用

候補:

- root直下の古いNextChat pair 10件
- `docs/archive/uncommitted-docs/` 30件

目的:

- 歴史資料としてmain repoに残す。

判断:

- 現行restart sourceではないことを明示する。
- 必要ならroot直下の古いNextChat pairをarchive配下へ移すが、移動は別stageで行う。

## 判断停止条件

次の場合は採用やcommitへ進めない。

- latest handoff候補とhistorical archive候補が混ざる。
- prompts候補を実装指示として扱い始める。
- asset / production候補に未確認ライセンスや巨大素材が混ざる。
- `.runtime/`、`.context-archive/`、raw archive、exact transcript素材がstage対象に入りそうになる。
- `git add .` で済ませたくなる。
- active-contact、Stage20、scenario、storage、route、AI/RAG実装の話へ広がる。
- hidden prompts、credentials、private raw logs、API keysの有無を判断できない。

## ASO Loop 2 - policy docs採用準備監査

### Objective

policy docs候補2件を、採用前にもう一度監査する。

### Result

- 未追跡docs分類数を再集計した。最新handoff候補2件、policy docs候補2件、historical archive候補40件、prompts候補3件、asset / production候補1件で、このインベントリの分類と一致した。
- `docs/git-publication-policy.md` のGit push前チェックリストに、handoff/ledger staging例としてワイルドカードpathspecが残っていたため、実ファイル名を明示する例へ修正した。
- `git add .` 禁止、狭いpathspec staging、`.runtime/` と `.context-archive/` 非採用、historical archive別コミット、NextChat pair別コミットの方針は維持した。

### Verification

- `git diff --no-index --check -- NUL docs/git-publication-policy.md`: PASS、LF/CRLF warningのみ。
- `git diff --no-index --check -- NUL docs/untracked-docs-publication-inventory-2026-06-11.md`: PASS、LF/CRLF warningのみ。
- キーワード監査: `git add .`、`git add --`、`pathspec`、`.runtime`、`.context-archive`、`raw archive`、`historical archive`、`NextChat`、secret系境界、`Stage20`、`AI/RAG` の記載を確認。
- `.gitignore`: `.runtime/` と `.context-archive/` のignore設定を確認。
- `git check-ignore -v -- .runtime/ .context-archive/ .runtime/test-sentinel .context-archive/test-sentinel`: PASS。両ディレクトリと配下sentinel pathがignore対象。
- `git status --short --ignored=matching --untracked-files=all -- .runtime .context-archive`: PASS。両ディレクトリは `!!` ignored扱い。
- `git diff --cached --name-status`: 空。stageは何もない。

### Decision

policy docs候補は採用準備済み。ただしGit操作はしきが `Git push` を明示した時だけ行う。

## 次の安全なStage

次に進めるなら、最小の安全stageは次のどちらか。

1. policy docs採用準備:
   `docs/git-publication-policy.md` とこのインベントリだけをレビューし、`git diff --check` とキーワード確認を通す。Git操作はしきが `Git push` を明示した時だけ、狭いpathspecで行う。
2. Git policy NextChat pair採用判断:
   `docs/NEXT_CHAT_HANDOFF_2026-06-11_git-policy-prompt-nextchatfull.md` と `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-11_git-policy-prompt-nextchatfull.md` だけを最新handoff候補としてレビューする。

prompts整理、asset / production整理、historical archive採用は、その後の別ASOCサイクルに分ける。
