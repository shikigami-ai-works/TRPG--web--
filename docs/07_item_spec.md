# アイテム仕様

## 基本方針

アイテムはシナリオ中に入手でき、条件を満たせば持ち帰れる。
次のシナリオへ持ち込めるため、継続プレイの資産になる。

## アイテム構造

正式なアイテムデータ構造は `docs/schemas/item.schema.yaml` を参照する。

```yaml
items:
  - id: item_id
    name: string
    type: consumable | equipment | key_item | story_item
    description: string
    found_in_scene_id: scene_id
    carry_out_group: group_id
    effects: []
    cost: {}
    can_carry_out: boolean
    can_bring_into_scenario: boolean
    can_give_to_companion_npc: boolean
    lost_if_holder_lost: boolean
```

## 持ち帰り条件

```yaml
carry_out:
  condition:
    scenario_result: clear
    item_is_owned_at_clear: true
```

シナリオ固有の持ち帰り制限がある場合は、`scenario.mechanics.carry_out_groups` と各アイテムの `carry_out_group` を使う。

```yaml
carry_out_groups:
  - id: four_room_artifact
    item_ids:
      - boundary_ember
      - empty_nameplate
    max_count_at_clear: 1
```

ゲーム側はクリア時に、同じ `carry_out_group` の持ち帰り数が `max_count_at_clear` を超えないようにする。
エンディング条件で持ち帰り数を見る場合は、`four_room_artifacts_carried_out` のようなカウンターへ反映してから判定する。

## アイテム効果と代償

`effects` はUI表示、判定補正、フラグ解禁に使う。
実際にゲーム状態を変える即時処理は、シーンの `state_changes` を優先する。

```yaml
effects:
  - id: bonus_to_truth_investigation
    type: skill_bonus
    amount: 15
    description: 調査判定に一度だけ+15
cost:
  boundary_contamination: 1
```

`cost` は使用時や持ち帰り時の代償メモ。
MVP実装では、代償を自動適用する場合もシーンやアイテム使用アクションの `state_changes` に変換して処理する。

## NPCに持たせる

連絡先NPCを同伴する場合、アイテムを持たせられる。
ただし、NPCがロストした場合、そのアイテムも失われる可能性がある。
