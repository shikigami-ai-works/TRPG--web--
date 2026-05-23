# プレイヤーキャラクター仕様

## 基本方針

プレイヤーキャラクターは次のシナリオへ持ち越せる探索者である。
成長、ロスト、記録によってプレイヤーの物語資産になる。

## ステータス

```yaml
status:
  active: 使用可能
  lost: ロスト済み
  memorial: 追憶・記録用
```

## 初期能力値案

```yaml
stats:
  body: 身体
  dexterity: 器用
  intelligence: 知性
  intuition: 直感
  social: 交渉
  sanity: 精神
```

## 成長

```yaml
player_growth:
  trigger: scenario_end
  source:
    - scenario_clear_reward
    - performance_bonus
  reward:
    type: bonus_points
    use: increase_character_stats
```

## ロスト

ロストしたキャラクターは原則として復元しない。
復元課金を中心にしない。
ロスト後も記録や追憶として閲覧可能にする。
