# 忍者バトル風キャラクター作成ルール

## 目的

秘密、使命、対立、忍術、短期決戦、ドラマチックな正体開示を扱うシナリオ向けのキャラクター作成ルール。

既存TRPGの忍者バトル系シナリオの考え方を参考にするが、このゲーム用の独自仕様として扱う。

## 向いているシナリオ

- 忍者同士の任務
- 秘密を抱えたPvE/PvNPC風展開
- 対立と協力が入り混じる物語
- 隠された使命
- 奥義や切り札の演出

## 能力値

探索ホラー風とは別に、忍者バトル向けの能力値を使う。

```yaml
stats:
  body: 体術。身体能力、近接戦闘、耐久に使う。
  technique: 技術。忍具、罠、隠密行動に使う。
  speed: 速度。回避、先制、移動に使う。
  mind: 精神。幻術、恐怖、精神干渉への抵抗に使う。
  shadow: 隠密。潜入、変装、気配遮断に使う。
  charisma: 魅力。交渉、誘惑、威圧、人心操作に使う。
```

## 副次ステータス

```yaml
derived_stats:
  vitality:
    description: 戦闘継続力。
    formula: body + mind
  initiative:
    description: 行動順や先制判定。
    formula: speed + technique
  secrecy:
    description: 秘密保持、潜入、正体隠し。
    formula: shadow + mind
```

## 作成方式

```yaml
creation:
  method: point_buy
  initial_points: 60
  stat_min: 1
  stat_max: 12
  recommended_average: 6
```

## 忍法・技

MVPでは複雑な技表を作らず、少数のアクションタグとして扱う。

```yaml
arts:
  attack: 攻撃技
  guard: 防御技
  move: 移動・回避技
  trick: 罠・撹乱技
  illusion: 幻術・精神干渉
  support: 味方支援
```

## 秘密と使命

忍者バトル風シナリオでは、キャラクターに公開情報と非公開情報を持たせる。

```yaml
mission:
  public_goal: 公開使命
  secret_goal: 秘密使命
  secret_reveal_condition: 公開条件
```

## 判定

```yaml
check:
  formula: related_stat + art_bonus + dice_1d20 >= target_number
```

## 特徴

- キャラクターごとに秘密や使命を持つ。
- 対立と協力を両立させる。
- 戦闘は複雑にしすぎず、短期決戦に寄せる。
- NPCにも秘密や使命を設定できる。
- 正体開示や奥義演出はAIの文章生成と相性がよい。
