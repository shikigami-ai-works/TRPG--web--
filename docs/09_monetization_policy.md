# 収益設計方針

## 基本方針

課金は強さではなく、遊び方、保存領域、外見、物語体験の拡張に寄せる。
ロスト復活課金を中心にしない。

## 課金候補

```yaml
monetization:
  character_slot_expansion:
    type: one_time_purchase
  npc_contact_slot_expansion:
    type: one_time_purchase
  paid_scenarios:
    type: content_purchase
  appearance_change_items:
    type: cosmetic
  stat_reroll_items:
    type: build_adjustment
    total_stat_value_locked: true
  npc_after_story:
    unlock_by_affection: true
    monetization_status: to_be_decided
```

## 禁止寄りの方針

- 強力な能力値を直接販売しない
- ロスト復活をメイン課金にしない
- 有料シナリオ限定の強すぎる報酬を避ける
- プレイヤーに不快な損失圧をかけない
