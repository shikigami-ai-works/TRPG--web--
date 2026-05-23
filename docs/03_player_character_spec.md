# プレイヤーキャラクター仕様

## 基本方針

プレイヤーキャラクターは次のシナリオへ持ち越せる探索者である。
成長、ロスト、記録によってプレイヤーの物語資産になる。

キャラクター能力値は、クトゥルフTRPGなどのテーブルトークRPGに見られる探索者作成の考え方を参考にする。
ただし、既存ルールをそのまま複製せず、このゲーム用の独自能力値として整理する。

## ステータス

```yaml
status:
  active: 使用可能
  lost: ロスト済み
  memorial: 追憶・記録用
```

## 能力値設計方針

能力値は、戦闘だけでなく、探索、交渉、観察、精神的危機、NPCとの関係に使えるものにする。

クトゥルフ系TRPGの探索者作成を参考にしつつ、Webゲームとして扱いやすいよう、以下の独自ステータスにまとめる。

```yaml
stats:
  strength: 筋力。力仕事、近接行動、物理的抵抗に使う。
  constitution: 体力。耐久、病気、毒、疲労、ロスト回避に使う。
  dexterity: 器用。手先の作業、回避、素早い行動に使う。
  appearance: 外見。第一印象、社交、NPC反応補正に使う。
  intelligence: 知性。推理、知識整理、謎解きに使う。
  willpower: 意志。恐怖、狂気、精神的圧力への抵抗に使う。
  education: 教養。専門知識、調査、文献理解に使う。
  luck: 幸運。偶発的な危機回避や救済判定に使う。
```

## 副次ステータス

能力値から計算される補助的な値。

```yaml
derived_stats:
  hp:
    description: 耐久力。0になると危険状態またはロスト判定へ進む。
    formula: constitution + strength
  sanity:
    description: 精神安定度。恐怖や異常現象への耐性。
    formula: willpower * 5
  idea:
    description: ひらめき、直感的理解。
    formula: intelligence * 5
  knowledge:
    description: 知識判定の基礎値。
    formula: education * 5
```

## 能力値の作成方式

MVPでは、完全ランダムではなく、プレイヤーが理解しやすいポイント配分方式を優先する。

```yaml
stat_creation:
  method: point_buy
  initial_points: 80
  stat_min: 3
  stat_max: 18
  recommended_average: 10
```

将来的には、TRPGらしいランダム生成モードも追加候補とする。

```yaml
optional_random_creation:
  status: future_candidate
  purpose: tabletop_rpg_feeling
```

## スキル

能力値とは別に、シナリオ中の具体行動に使うスキルを持たせる。
MVPではスキル数を絞る。

```yaml
skills:
  observe: 観察、目星、周囲の違和感発見。
  listen: 聞き耳、物音や会話の察知。
  search: 探索、物品調査、隠し物発見。
  persuade: 説得、交渉、NPCとの会話。
  occult: オカルト、怪異、儀式知識。
  medicine: 応急処置、治療。
  stealth: 隠密、尾行、気配を消す。
  combat: 戦闘、攻撃、防御。
```

## 判定の基本

```yaml
check:
  formula: related_stat + skill_bonus + dice_1d20 >= target_number
```

例:

```yaml
observe_check:
  related_stat: intelligence
  skill: observe

persuade_check:
  related_stat: appearance
  skill: persuade

sanity_check:
  related_stat: willpower
  skill: none
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
    use:
      - increase_character_stats
      - increase_skills
```

## ロスト

ロストしたキャラクターは原則として復元しない。
復元課金を中心にしない。
ロスト後も記録や追憶として閲覧可能にする。

## 注意点

既存TRPGの能力値名やキャラクター作成思想は参考にするが、ルールや文章をそのまま複製しない。
このゲームでは、独自のWebゲーム向け探索者作成ルールとして再設計する。
