# ダイスとロスト仕様

## 基本判定

```yaml
normal_check:
  formula: stat + dice_1d20 >= target_number
```

## 難易度

```yaml
difficulty:
  easy: 8
  normal: 12
  hard: 16
  very_hard: 20
```

## 死に関わる判定

死に関わる判定は通常より甘くする。

```yaml
death_risk_check:
  formula: stat + dice_1d20 + safety_bonus >= target_number
  safety_bonus: 3
```

## ロスト条件

ロストはAIが勝手に決めない。
必ずシナリオ定義とゲーム側の判定に基づく。

```yaml
lost_condition:
  trigger:
    - hp_zero
    - failed_death_risk_check
    - specific_scenario_failure
  result:
    character.status: lost
    move_to: memorial_record
```
