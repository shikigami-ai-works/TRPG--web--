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

正式なエンディングデータ構造は `docs/schemas/ending.schema.yaml` を参照する。

```yaml
endings:
  - id: ending_id
    title: string
    ending_type: true | good | normal | bad | lost
    description: string
    hidden_description: string
    unlock_conditions:
      all:
        - condition_expr
      any:
        - condition_expr
      any_missing:
        - condition_expr
    result:
      player_returns: boolean
      npc_returns: boolean
      player_stays_with_npc: boolean
      npc_memory_inheritance: boolean
      relationship_asset_preserved: boolean
    unlocks: []
    rewards: []
    ending_tree:
      visible_before_unlock: boolean
      blurred_title: string
      route_hint: string
```

## 判定順序

エンディングは `scenario.ending_resolution_order` の順に評価する。
複数のエンディング条件が同時に成立する可能性があるため、より強い失敗条件や特殊条件を先に置く。

例:

```yaml
ending_resolution_order:
  - boundary_collapse
  - stay_with_akari
  - return_with_akari
  - return_without_akari
```

終盤の選択肢から直接 `ending_id` へ飛ばすと、条件不足でも望んだエンドに到達できてしまう。
条件判定が必要な終盤選択肢では、シーン側に `resolve_ending: true` を置き、ゲーム側が上記順序で解決する。

## 条件式

エンディング条件は短縮文字列ではなく、構造化条件を基本にする。

```yaml
unlock_conditions:
  all:
    - flag: player_attempts_return
      value: true
    - trust:
        npc_id: minase_akari
        operator: ">="
        value: 70
  any:
    - flag: ritual_reproduced
      value: false
    - counter:
        id: boundary_contamination
        operator: ">="
        value: 3
```

`any_missing` は、列挙した条件のうち1つ以上が満たされない場合に成立する。
「帰還はできるがNPC連れ帰り条件が欠けている」などの通常失敗分岐に使う。
