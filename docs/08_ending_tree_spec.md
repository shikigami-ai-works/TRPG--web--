# エンディングツリー仕様

## 基本方針

エンディングツリーはリプレイ動機を作るための仕組みである。
到達済みエンディングは明確に表示し、未到達エンディングは輪郭だけ見せる。

## 表示ルール

```yaml
scenario_ending_tree:
  unlock_condition: scenario_played_at_least_once
  visibility:
    cleared_ending:
      title: visible
      description: visible
      route: visible
    uncleared_ending:
      title: blurred
      description: hidden
      route_hint: partial_or_blurred
```

## エンディング構造

```yaml
ending:
  id: string
  title: string
  description: string
  unlock_conditions: []
  rewards: []
  is_reached: false
```
