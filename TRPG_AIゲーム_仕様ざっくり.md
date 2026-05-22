# TRPG AIゲーム ざっくり仕様

## 概要

AIが演じるNPCと出会い、関係を築き、キャラクターと記憶を次のシナリオへ持ち越していく、1人用TRPG風Webゲーム。

プレイヤーは探索者を作成し、事前に用意されたシナリオを攻略する。
シナリオ中にはAIがロール補助するNPCが登場し、会話、好感度、成長、ロスト、連絡先、同伴などを通じて継続的な物語が作られる。

## コア体験

- プレイヤーキャラクターを作る。
- シナリオを選ぶ。
- 探索、会話、判定、イベントを進める。
- NPCと関係を築く。
- シナリオをクリア、またはロストする。
- 成長、アイテム、NPC連絡先、エンディング記録を持ち帰る。
- 次のシナリオにキャラクターやNPCとの関係を引き継ぐ。

## 基本ループ

```yaml
core_loop:
  - create_or_select_player_character
  - select_scenario
  - choose_companion_npc_optional
  - bring_items_optional
  - play_scenario
  - resolve_clear_or_lost
  - grant_rewards
  - update_character_growth
  - update_npc_relationships
  - update_ending_tree
  - return_to_home
```

## AIの役割

AIはゲームマスターではなく、ロール側の補助役として扱う。

```yaml
ai_role:
  type: "roleplay_support"

  ai_can_do:
    - generate_npc_dialogue
    - describe_npc_emotion
    - suggest_npc_action_from_available_actions
    - generate_after_story_text
    - create_npc_profile_from_scenario_role

  ai_cannot_do:
    - decide_scenario_clear
    - decide_lost_without_game_rule
    - change_dice_result
    - create_reward_without_rule
    - reveal_hidden_information_without_trigger
    - override_scenario_state
```

NPC行動はAIに完全自由で決めさせず、ゲーム側が用意した行動候補から選ばせる。

```yaml
npc_action_decision:
  input:
    - current_scene
    - npc_personality
    - npc_affection
    - npc_status
    - available_actions
  output:
    - selected_action
    - dialogue
    - emotional_reason
```

## プレイヤーキャラクター

```yaml
player_character:
  can_create_freely: true
  can_grow: true
  can_be_lost: true
  can_carry_to_next_scenario: true

  slots:
    initial: "3_to_4"
    extra_slots: "paid_one_time_purchase"

  lost:
    default_restore: false
    move_to: "memory_record"
    can_be_viewed_after_lost: true
```

### 成長

```yaml
player_growth:
  trigger: "scenario_end"
  source:
    - scenario_clear_reward
    - performance_bonus

  reward:
    type: "bonus_points"
    use: "increase_character_stats"
```

## NPC

```yaml
npc:
  generated_by_ai: true
  generated_from:
    - scenario_required_role
    - gender
    - age
    - personality
    - role

  can_have_affection_system: true
  can_be_contact: true
  can_be_companion: true
  can_be_lost: true
  can_grow: true
```

### 好感度と連絡先

```yaml
npc_contact_unlock:
  trigger: "scenario_clear"
  condition:
    npc.has_affection_system: true
    npc.affection: ">= contact_unlock_threshold"
    npc.is_lost: false
  result:
    add_to_player_contacts: true
  failure:
    affection_too_low: "contact_not_unlocked"
    npc_lost: "contact_not_unlocked"
```

### NPC同伴

```yaml
npc_companion:
  requires_contact: true
  max_companion_count: 1
  can_bring_items: true
  can_be_lost_in_scenario: true
```

### NPC成長

```yaml
npc_growth:
  trigger: "scenario_end"
  condition:
    npc.is_lost: false

  growth_style:
    source: "npc_personality"
    examples:
      brave:
        preferred_stats: ["combat", "protect"]
      cautious:
        preferred_stats: ["evasion", "observation"]
      social:
        preferred_stats: ["negotiation", "affection_bonus"]
```

### 後日談エピソード

```yaml
npc_after_story:
  unlock_condition:
    npc.affection: ">= after_story_threshold"
  content_type: "personal_episode"
  generation: "ai_assisted"
```

## シナリオ

```yaml
scenario:
  prepared_in_advance: true
  has_required_npc_roles: true
  has_clear_conditions: true
  has_lost_conditions: true
  has_ending_tree: true

  distribution:
    free_scenarios: true
    paid_scenarios: true
```

シナリオ進行、クリア条件、分岐条件、ロスト条件はゲーム側で管理する。
AIは演出とロールを補助する。

## ダイスとロスト

死に関わる判定は、通常の判定よりプレイヤーに甘めにする。

```yaml
dice:
  normal_roll:
    rule: "to_be_defined"

  death_risk_roll:
    bias: "lenient"
    purpose: "avoid_too_easy_character_loss"
```

ロストは重いイベントとして扱う。
ロストしたキャラクターやNPCは、記録や追憶に残せる。

## アイテム

```yaml
item:
  can_be_found_in_scenario: true
  can_be_carried_out:
    condition: "scenario_clear && item_is_owned_at_clear"
  can_be_brought_into_scenario: true
  can_be_given_to_companion_npc: true
```

## 収益設計

```yaml
monetization:
  character_slot_expansion:
    type: "one_time_purchase"

  npc_contact_slot_expansion:
    type: "one_time_purchase"

  paid_scenarios:
    type: "content_purchase"

  appearance_change_items:
    type: "cosmetic"

  stat_reroll_items:
    type: "build_adjustment"
    total_stat_value_locked: true

  npc_after_story:
    unlock_by_affection: true
    monetization_status: "to_be_decided"
```

### 課金設計の方針

- 強さを直接売りすぎない。
- ロスト復活課金を中心にしない。
- 遊び方、保存枠、外見、物語体験を中心にする。
- 有料シナリオ限定の強すぎる報酬は避ける。

## エンディングツリー

```yaml
scenario_ending_tree:
  unlock_condition: "scenario_played_at_least_once"

  visibility:
    cleared_ending:
      title: "visible"
      description: "visible"
      route: "visible"

    uncleared_ending:
      title: "blurred"
      description: "hidden"
      route_hint: "partial_or_blurred"
```

到達済みのエンディングは明瞭に表示する。
未到達のエンディングはぼんやり表示し、まだ別ルートがあることだけ分かるようにする。

## 未決定事項

- 能力値の種類
- ダイス判定の具体的なルール
- シナリオ1本の標準構成
- NPC性格タグの種類
- 好感度の上昇条件
- 連絡先保存枠の初期数
- プレイヤーキャラ初期枠を3にするか4にするか
- ロスト復活を完全に入れないか、限定的に入れるか
- 有料シナリオの価格設計
- MVPの画面構成

