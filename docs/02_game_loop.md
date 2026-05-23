# ゲームループ仕様

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

## 状態管理の原則

AIの出力は演出であり、ゲーム状態の唯一の正本ではない。
状態変更は必ずゲーム側のルール処理を通す。

## シナリオ中に更新される主な状態

- 現在シーン
- プレイヤーHP/状態
- NPC状態
- NPC好感度
- 入手アイテム
- フラグ
- ダイス判定結果
- エンディング候補
