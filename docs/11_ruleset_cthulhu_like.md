# 探索ホラー風キャラクター作成ルール

## 目的

探索、恐怖、正気度、調査、ロストの緊張感を扱うシナリオ向けのキャラクター作成ルール。

既存TRPGの探索者作成の考え方を参考にするが、このゲーム用の独自仕様として扱う。

## 向いているシナリオ

- 怪異調査
- クローズドサークル
- 都市伝説
- 遺跡探索
- ホラー
- 謎解き

## 能力値

```yaml
stats:
  strength: 筋力
  constitution: 体力
  dexterity: 器用
  appearance: 外見
  intelligence: 知性
  willpower: 意志
  education: 教養
  luck: 幸運
```

## 副次ステータス

```yaml
derived_stats:
  hp:
    formula: constitution + strength
  sanity:
    formula: willpower * 5
  idea:
    formula: intelligence * 5
  knowledge:
    formula: education * 5
```

## 作成方式

```yaml
creation:
  method: point_buy
  initial_points: 80
  stat_min: 3
  stat_max: 18
  recommended_average: 10
```

## スキル

```yaml
skills:
  observe: 観察
  listen: 聞き耳
  search: 探索
  persuade: 説得
  occult: オカルト
  medicine: 応急処置
  stealth: 隠密
  combat: 戦闘
```

## 判定

```yaml
check:
  formula: related_stat + skill_bonus + dice_1d20 >= target_number
```

## 特徴

- 精神的危機を扱う。
- 調査と推理が中心。
- 死に関わる判定は甘めにする。
- ロストした場合は追憶として記録に残す。
