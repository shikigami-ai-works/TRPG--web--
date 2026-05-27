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

正式なNPCデータ構造は `docs/schemas/npc.schema.yaml` を参照する。

```yaml
affection:
  enabled: boolean
  min: 0
  max: 100
  value: number
  initial: number
  contact_unlock_threshold: 70
  after_story_threshold: 80
```

`value` は現在値、`initial` はシナリオ開始時の初期値。
周回報酬や記憶継承で初期値を上げる場合は、シナリオ開始時に `initial + bonus` を `value` へ反映する。

## NPCデータ構造

```yaml
npcs:
  - id: npc_id
    name: string
    reading: string
    role: role_id
    roles:
      - role_id
    generated_by_ai: boolean
    gender: string
    age: number
    age_label: string
    status: active | lost | tentative
    personality_tags:
      - string
    has_affection_system: boolean
    affection:
      enabled: boolean
      min: number
      max: number
      value: number
      initial: number
      contact_unlock_threshold: number
      after_story_threshold: number
    ai_roleplay:
      first_person: string
      player_call: string
      speech_style: string
      motivation: string
      hidden_note: string
      sample_lines:
        - string
```

`role` は主ロール、`roles` は検索・必須ロール判定用の複数ロール。
Next.js側では `role: RoleId` と `roles: RoleId[]` の両方を持つ型にする。

年齢は実装上の比較やフィルタをしやすくするため `age: number` を基本にする。
幅を持つ年齢や表示文言は `age_label` に入れる。

## 連絡先解放

```yaml
npc_contact_unlock:
  trigger: scenario_clear
  condition:
    npc.has_affection_system: true
    npc.affection.value: ">= contact_unlock_threshold"
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

## 旧好感度メモ

```yaml
affection_legacy_note:
  min: 0
  max: 100
  contact_unlock_threshold: 70
  after_story_threshold: 80
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
