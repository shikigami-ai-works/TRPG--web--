# アイテム仕様

## 基本方針

アイテムはシナリオ中に入手でき、条件を満たせば持ち帰れる。
次のシナリオへ持ち込めるため、継続プレイの資産になる。

## アイテム構造

```yaml
item:
  id: string
  name: string
  type: consumable | equipment | key_item | story_item
  description: string
  effects: []
  can_carry_out: true
  can_bring_into_scenario: true
```

## 持ち帰り条件

```yaml
carry_out:
  condition:
    scenario_result: clear
    item_is_owned_at_clear: true
```

## NPCに持たせる

連絡先NPCを同伴する場合、アイテムを持たせられる。
ただし、NPCがロストした場合、そのアイテムも失われる可能性がある。
