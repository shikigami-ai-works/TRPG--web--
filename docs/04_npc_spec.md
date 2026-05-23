# NPC仕様

## 基本方針

NPCはAIが演じるが、ゲーム状態はゲーム側が管理する。
NPCは単発の会話相手ではなく、連絡先、後日談、同伴、成長、ロストによって継続的価値を持つ。

## NPC生成

```yaml
npc_generation:
  input:
    - scenario_required_role
    - gender_policy
    - age_range
    - personality_tags
    - role
  output:
    - name
    - gender
    - age
    - role
    - personality
    - speech_style
    - motivation
```

## 好感度

```yaml
affection:
  min: 0
  max: 100
  contact_unlock_threshold: 70
  after_story_threshold: 80
```

## 連絡先解放

```yaml
npc_contact_unlock:
  trigger: scenario_clear
  condition:
    npc.has_affection_system: true
    npc.affection: ">= contact_unlock_threshold"
    npc.is_lost: false
  result:
    add_to_player_contacts: true
```

## NPC同伴

```yaml
npc_companion:
  requires_contact: true
  max_companion_count: 1
  can_bring_items: true
  can_be_lost_in_scenario: true
```

## 性格タグ初期案

- brave
- cautious
- social
- logical
- emotional
- mysterious
- protective
- selfish
