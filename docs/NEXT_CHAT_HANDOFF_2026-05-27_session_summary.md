# 次チャット引き継ぎ 2026-05-27 セッション決定まとめ

## 最初に読むこと

このプロジェクトは、AIでTRPGを全部自動化するゲームではなく、AI NPCとの関係性を資産化する「シナリオ攻略型・記憶継承TRPG Webゲーム」。

今回のセッションでは、MVP候補のオリジナル短編シナリオについて、NPC「水瀬 灯」、信頼度設計、四方アーティファクト、エンディング4種、記憶継承の扱い、Codex運用キーワードを整理した。

次は、決定済み要素を `scenario.yaml` に落とし込む段階。

## 直近の作業結果

### NPC基本設定

- NPC名は **水瀬 灯（みなせ あかり）**。
- 灯は主人公探索者と同い年の18歳。
- 一人称は「わたし」。
- 主人公探索者への呼び方は基本的に「きみ」。
- 口調は短く砕けた同年代口調。動揺時は言葉が途切れやすい。
- 平行世界側の探索者とは、同年代の親友として誕生日旅行に同行していた。

灯の未練:

> 親友だけが自分を助けて死んだと思っていた。

### 事故と背景

- 平行世界側の探索者が18歳になる誕生日祝いとして、二家族で旅行が企画された。
- 夜行バス事故で、平行世界側の探索者の家族、灯の両親、平行世界側の探索者が死亡した。
- 灯だけが生き残った。
- 事故から現在まではほぼ49日。
- 灯は事故後10日ほど入院し、両家の葬式後に親族へ引き取られた。
- 親族は事故で息子を失った遺族で、教団「帰還の環」とつながっている。
- 親族による灯への性加害は、悲嘆や教団儀式とは別の加害として扱い、免罪しない。

### 教団と導師

- 教団名は **帰還の環（きかんのわ）**。
- 表向きは喪失や事故の当事者が集まる自助グループ。
- 裏では、世界の境界を越える儀式を行っている。
- 教団導師の目的は、ヨグ・ソトースの先触れを研究し、交信し、召喚すること。
- 導師本人は仮設定として **真壁透一郎（まかべ とういちろう）** で進める。
- 実装IDは `makabe_touichiro`。
- 導師の最終確定は後回し。

### 直接の敵と共犯関係

- シナリオ上の直接の敵は、灯を引き取った親族。
- 親族は、主人公探索者を殺せば次こそ自分の息子が代わりに呼ばれると思い込んでいる。
- 親族の家庭で、主人公探索者を殺そうとした親族の母親を灯が殺める。
- それを見て激昂した親族の父親を、主人公探索者が殺める。
- この事件により、主人公探索者と灯は共犯になる。
- 二人は親族夫婦の結婚指輪を使って、帰還のための儀式を再現する。

## 信頼度設計

```yaml
npc_trust:
  max: 100
  initial: 25
  return_required: 70
  memory_bonus_empty_nameplate: 10

trust_gain:
  say_not_replacement: 10
  respect_gift_unopened: 15
  protect_akari_without_possessing: 10
  let_akari_speak_regret: 10
  share_guilt_truthfully: 15
  promise_return_together: 10

trust_loss:
  act_as_dead_friend: -15
  open_birthday_gift: -10
  dismiss_akari_regret: -10
  abandon_akari_in_crisis: -20
  make_akari_bear_guilt: -20
```

補足:

- `act_as_dead_friend` は悪意ある偽装ではなく、灯に寄り添いすぎて、つい死んだ親友本人として振る舞ってしまうこと。
- `open_birthday_gift` は信頼度-10。ただし、NPC連れ帰り条件では「恋文の入った誕生日プレゼントは開けない」を別フラグとして扱う。
- `make_akari_bear_guilt` は、共犯の罪を共有せず、灯だけに背負わせること。

## 四方アーティファクト

```yaml
artifacts:
  - id: boundary_ember
    name: 境界の火種
    role: boundary_detection
    carry_effect:
      detect_boundary_event_once: true
      bonus_to_ritual_detection: 20
    cost:
      boundary_contamination: 1

  - id: empty_nameplate
    name: 空席の名札
    role: npc_memory_inheritance
    carry_effect:
      npc_initial_trust_bonus: 10
      unlock_memory_fragment: true
      unlock_choice:
        - 今度は一緒に帰ろう
    cost:
      npc_nightmare_level: 1

  - id: stopped_pocket_watch
    name: 止まった懐中時計
    role: time_interference
    carry_effect:
      reroll_once: true
      allow_past_vision_once: true
    cost:
      sanity_damage: 1d3
      or_boundary_contamination: 1

  - id: ash_vial
    name: 灰の小瓶
    role: truth_investigation
    carry_effect:
      unlock_cult_trace: true
      bonus_to_truth_investigation: 15
      unlock_next_scenario_hook: true
    cost:
      dead_memory_flashback: true
```

四方の部屋の勝利条件:

- 四方の部屋からアーティファクトを2つ以上持ち去ることで、一時的に教団の儀式を邪魔できる。
- 導師を倒した後、アーティファクトを3つ以上もとの場所に戻すことで、主人公探索者と灯が帰還のための儀式を再現できる。
- 帰還時に最終的に持ち帰れる四方アーティファクトは1つまで。
- 2つ以上を持ち帰ろうとすると、帰還儀式を再現できなくなる。

## エンディング

エンディングはこの4つで決定。

```yaml
endings:
  - id: return_with_akari
    name: 双つ灯の生還
    result: 二人で帰る

  - id: return_without_akari
    name: 空席に残る灯
    result: 一人で帰る

  - id: stay_with_akari
    name: 境界に灯るふたり
    result: 二人で残る
    memory_inheritance: true

  - id: boundary_collapse
    name: 境界の狭間に揺れる
    result: 帰還失敗
```

### エンド条件

```yaml
ending_conditions:
  return_with_akari:
    trust_at_least: 70
    gift_opened: false
    regret_resolved: true
    shared_guilt: true
    ritual_reproduced: true

  return_without_akari:
    player_can_return: true
    npc_can_return: false
    memory_inheritance: true

  stay_with_akari:
    player_chooses_to_stay: true
    akari_survives: true
    memory_inheritance: true

  boundary_collapse:
    ritual_reproduced: false
    or_boundary_contamination_too_high: true
```

### 境界に灯るふたりの継承

- 主人公探索者が帰らず、灯と共にこちらの世界に残留するエンド。
- 帰還はしないが、灯との関係性は次周以降へメモリーとして引き継がれる。
- 次周以降、灯は主人公探索者に対して、初対面なのに置いていかれなかった感覚を持つ。
- 「置いていかないで」系の会話や選択肢に変化が出る。

```yaml
ending:
  id: stay_with_akari
  name: 境界に灯るふたり
  result:
    player_returns: false
    npc_returns: false
    player_stays_with_npc: true
    npc_memory_inheritance: true
    relationship_asset_preserved: true
  unlocks:
    - stayed_together_memory
    - abandonment_fear_softened
    - boundary_residue_trace
```

## Codex運用ルールの追加

このセッションで、グローバル `C:\Users\sakur\.codex\AGENTS.md` に以下を追記した。

- `Git push` / `Git up` / `Git uｐ`
  - 現在のソフト本体リポジトリをコミットして `origin` へpushする合図。
  - Obsidian Git とは解釈しない。
- `Obsidian Git`
  - Obsidian vault へコンテキストMarkdownを保存・コミットする合図。
- `nextchat` / `next chat` / `次チャット` / `引き継ぎMarkdown` / `セッションに引き継ぐ`
  - 現在プロジェクトの `docs/` に次チャット用Markdownハンドオフを作る合図。

また、プロジェクトローカルにも [AGENTS.md](D:/Codex/TRPG--web--/AGENTS.md) を追加し、Gitキーワード運用を明記した。

## Obsidian保存済みコンテキスト

`Obsidian Git` 指示により、以下へセッションコンテキストを保存済み。

- Repository: `shiki-ai-works/obsidian-vault`
- Path: `Codex/Projects/TRPG--web--/2026-05-27-scenario-context.md`
- Commit: `24554d5243c3e3896d923a49c371d556c2766b81`

## 重要ファイル

- `docs/14_original_scenario_decisions.md`
  - 最新のシナリオ決定要素。
- `docs/NEXT_CHAT_HANDOFF_2026-05-26_scenario_decisions.md`
  - 既存の次チャット引き継ぎ。今回も更新済み。
- `docs/NEXT_CHAT_HANDOFF_2026-05-27_scenario_context.md`
  - 今回作成・更新したシナリオ実装前コンテキスト。
- `docs/NEXT_CHAT_HANDOFF_2026-05-27_session_summary.md`
  - このファイル。
- `AGENTS.md`
  - このリポジトリ内のGitキーワード運用。
- `C:\Users\sakur\.codex\AGENTS.md`
  - グローバルCodex指示。Gitキーワードとnextchatキーワードを追記済み。

## 最新の検証結果

実行済み:

```powershell
git status --short --branch
```

直近の状態:

```text
## main...origin/main
 M docs/14_original_scenario_decisions.md
 M docs/NEXT_CHAT_HANDOFF_2026-05-26_scenario_decisions.md
?? AGENTS.md
?? docs/NEXT_CHAT_HANDOFF_2026-05-27_scenario_context.md
```

警告:

```text
warning: unable to access 'C:\Users\sakur/.config/git/ignore': Permission denied
```

このハンドオフ作成後は、さらに `docs/NEXT_CHAT_HANDOFF_2026-05-27_session_summary.md` が未追跡として増える。

## 残リスク

- 導師本人のキャラ設定は仮決め。真壁透一郎で進めるが、最終確定は後回し。
- `scenario.yaml` への変換は未着手。
- TRPG--web--本体リポジトリの変更はまだローカル未コミット。
- グローバル `C:\Users\sakur\.codex\AGENTS.md` はワークスペース外の変更なので、このリポジトリのGitには含まれない。

## 次チャットでやるとよいこと

1. `scenario.yaml` の既存構造を確認する。
2. `docs/14_original_scenario_decisions.md` をもとに、シーン、フラグ、信頼度変動、アイテム、エンド条件へ分解する。
3. 決定済みYAML断片を `scenario.yaml` に統合する。
4. 必要なら `Git push` または `Git up` 指示で、TRPG--web--本体リポジトリをコミット・pushする。

## 再開時の短い指示例

```text
TRPG--web--のMVP候補オリジナル短編シナリオをscenario.yaml化したい。
前回までに、水瀬 灯、帰還の環、真壁透一郎の仮設定、親族との共犯事件、四方アーティファクト、信頼度設計、4つのエンディングと条件まで決めた。
docs/14_original_scenario_decisions.md と docs/NEXT_CHAT_HANDOFF_2026-05-27_session_summary.md を読んで、シーン、フラグ、報酬、エンド分岐をscenario.yamlへ落とし込んで。
```
