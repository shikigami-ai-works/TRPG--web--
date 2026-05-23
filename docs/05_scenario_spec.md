# シナリオ仕様

## 基本方針

シナリオは事前に用意する。
AIは演出とNPCロールを補助するが、シナリオ進行やクリア条件はゲーム側が持つ。

## シナリオ構造

```yaml
scenario:
  id: string
  title: string
  summary: string
  required_npc_roles: []
  scenes: []
  clear_conditions: []
  lost_conditions: []
  endings: []
  rewards: []
```

## シーン構造

```yaml
scene:
  id: string
  title: string
  description: string
  available_actions: []
  npc_ids: []
  checks: []
  next_scene_rules: []
```

## MVP用シナリオ標準長

- 5〜7シーン
- NPC 2〜3人
- 判定 3〜5回
- エンディング 3種類
