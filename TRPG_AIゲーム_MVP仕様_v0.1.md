# TRPG AIゲーム MVP仕様 v0.1

## 目的

クトゥルフ神話TRPG風の探索、SAN値、技能、NPC同行を含む1人用TRPG風WebゲームのMVP仕様を記録する。

この文書は、Obsidian / GitHub / Codex / 実装AIへの引き継ぎ用である。

---

## 1. 全体方針

AIはゲームマスターではなく、NPCのロールプレイ補助として使う。

AIに任せること:

- NPCの台詞
- NPCの感情表現
- NPCの性格に沿った反応
- NPC行動候補の理由づけ
- 後日談テキスト

ゲーム側が管理すること:

- シナリオ進行
- 判定
- クリア条件
- ロスト条件
- 報酬
- 隠し情報の開示条件
- 状態管理

---

## 2. MVPに含めるもの

- プレイヤーキャラクター作成
- クトゥルフ風能力値
- SAN値
- SANチェック
- 一時的狂気
- 不定の狂気
- d100ロールアンダー判定
- 技能システム
- 技能最大15個制
- 技能枠削減による追加ポイント取得
- 短い無料シナリオ1本
- AIロール補助NPC
- 好感度NPC
- NPC連絡先
- NPC同行
- 簡易ロスト処理
- 簡易エンディング記録

MVPで後回しにするもの:

- 本番課金
- 複数シナリオ運用
- 複雑なエンディングツリー
- 本格的なショップ
- 有料シナリオ販売
- ロスト復活課金

---

## 3. 能力値

能力値はクトゥルフ神話TRPG風を強く参考にする。
SAN値は必須。

```yaml
character_stats:
  STR: 筋力
  CON: 体力
  POW: 精神力
  DEX: 敏捷性
  APP: 外見・印象
  SIZ: 体格
  INT: 知性
  EDU: 教養
  SAN: 正気度
  HP: 耐久力
  MP: 精神力リソース
```

---

## 4. 能力値作成方法

```yaml
stat_generation:
  method: "random_plus_adjust"
  styles:
    stable:
      label: "安定型"
      description: "平均寄りの能力値になりやすい"
    extreme:
      label: "尖り型"
      description: "高低差の大きい能力値になりやすい"
  flow:
    - "安定型または尖り型を選ぶ"
    - "能力値をランダム生成"
    - "一定回数まで振り直し可能"
    - "少量のポイントで微調整可能"
```

完全ポイント制ではなく、ランダム生成と微調整を組み合わせる。

---

## 5. 判定方式

判定はd100ロールアンダー方式。
能力値固定ではなく、状況や選択肢によって目標値を変える。

```yaml
dice_check:
  type: "d100_roll_under"
  success_condition: "roll <= target_number"
```

例:

```yaml
check_examples:
  easy:
    target: 80
    label: "DiceRoll80"
  normal:
    target: 50
    label: "DiceRoll50"
  hard:
    target: 30
    label: "DiceRoll30"
  desperate:
    target: 20
    label: "DiceRoll20"
```

プレイヤーの選択肢によって判定難易度が変化する。

```yaml
choice_based_difficulty:
  safe_choice:
    target: 80
    cost: "時間・報酬減少・情報不足"
  balanced_choice:
    target: 50
    cost: "標準"
  risky_choice:
    target: 20
    cost: "失敗時ペナルティ大"
    reward: "成功時リターン大"
```

---

## 6. SAN値ルール

SAN値ルールは完全導入する。

```yaml
san:
  min: 0
  max: 99
  current: "character.current_san"

san_check:
  type: "d100_roll_under"
  success_condition: "roll <= current_san"
```

SANチェック発生条件:

```yaml
san_check_triggers:
  - 怪異を目撃する
  - 死体を見る
  - NPCが目の前でロストする
  - 禁忌の知識を得る
  - 自分や仲間が瀕死になる
  - 異常な空間に踏み込む
  - 神話的存在と接触する
```

SAN減少はイベントごとに設定する。

```yaml
san_loss_example:
  corpse:
    success: 0
    failure: "1d3"
  monster:
    success: 1
    failure: "1d6"
  cosmic_truth:
    success: "1d3"
    failure: "1d10"
```

---

## 7. SAN値0の扱い

プレイヤーがSAN値0になった場合、自力では回復できない。
同行者や味方NPCが精神分析などのスキルで救助できなければ、探索者ロストとなる。

```yaml
san_zero_rule:
  trigger: "player.SAN <= 0"
  state: "san_collapse"
  immediate_result:
    - "プレイヤーは行動不能"
    - "通常選択肢を選べない"
    - "自力回復不可"
    - "同行者またはNPCによる救助判定に移行"
  rescue_condition:
    required_actor:
      - "同行NPC"
      - "味方NPC"
      - "他プレイヤーキャラクター"
    required_skill:
      - "精神分析"
      - "応急精神処置"
      - "医療"
      - "特殊イベントによる救済"
  rescue_window:
    type: "immediate"
    description: "SAN値が0になった場面、または直後の救助フェイズでのみ回復可能"
  if_rescue_success:
    result:
      - "SANを最低値まで回復"
      - "行動不能状態を解除"
      - "一時的狂気または後遺症を付与"
      - "探索継続可能"
  if_rescue_failure:
    result:
      - "探索者ロスト"
      - "シナリオから離脱"
      - "エンディング処理へ移行"
```

同行者の好感度で救助判定に補正を入れる。

```yaml
san_rescue_modifier:
  companion_affection:
    high:
      bonus: "+20"
    normal:
      bonus: "+0"
    low:
      penalty: "-20"
```

---

## 8. 狂気ルール

一時的狂気と不定の狂気を採用する。

```yaml
insanity:
  temporary_insanity:
    enabled: true
    trigger: "一度に一定以上SANを失う"
    duration: "短時間または数ターン"
    effect: "一時的な行動制限・強制行動・判定ペナルティ"
  indefinite_insanity:
    enabled: true
    trigger: "短期間に大量のSANを失う"
    duration: "シナリオ終了まで、または治療まで"
    effect: "継続的なペナルティ・特定状況での不利"
```

---

## 9. 技能システム

技能は2種類に分ける。

```yaml
skill_sources:
  derived_skills:
    label: "能力値由来技能"
    description: "能力値から自動的に得られる基本技能"
  learned_skills:
    label: "習得技能"
    description: "プレイヤーがポイントを使って取得・強化する技能"
```

能力値由来技能の例:

```yaml
derived_skills:
  STR: ["近接戦闘", "登攀", "組み付き"]
  CON: ["耐久", "毒耐性", "疲労耐性"]
  POW: ["SAN耐性", "意志", "精神抵抗"]
  DEX: ["回避", "隠密", "鍵開け"]
  APP: ["信用", "魅了", "第一印象"]
  SIZ: ["威圧", "押し込み", "体格利用"]
  INT: ["アイデア", "推理", "目星"]
  EDU: ["図書館", "オカルト", "医学"]
```

習得技能の例:

```yaml
learned_skills_examples:
  - 図書館
  - 目星
  - 聞き耳
  - 心理学
  - 説得
  - 言いくるめ
  - オカルト
  - 医学
  - 応急手当
  - 精神分析
  - コンピューター
  - 鍵開け
  - 隠密
  - 追跡
  - 射撃
  - 近接戦闘
  - 回避
  - 運転
  - 芸術
  - 制作
  - 科学
```

---

## 10. 技能ポイントと技能上限

```yaml
skill_system:
  initial_points: 300
  max_skill_value_at_creation: 80
  max_skill_value_after_growth: 95
  skill_limit:
    default: 15
    minimum: 8
  specialization_tradeoff:
    enabled: true
    bonus_points_per_removed_slot: 25
    max_removed_slots: 7
  known_skill_limit_rule:
    if_new_skill_exceeds_limit:
      player_must_forget_one_skill: true
  forgotten_skill:
    status: "forgotten"
    can_relearn: true
    relearn_cost: "normal_or_discounted"
```

技能枠を削ることで追加ポイントを得られる。

| 技能上限数 | 初期技能ポイント |
|---:|---:|
| 15個 | 300 |
| 14個 | 325 |
| 13個 | 350 |
| 12個 | 375 |
| 11個 | 400 |
| 10個 | 425 |
| 9個 | 450 |
| 8個 | 475 |

制限:

- 技能上限は8個未満にできない。
- 作成時の技能最大値は80。
- 成長後の技能最大値は95。
- 新しい技能を覚えて上限を超える場合、既存技能を1つ忘れる。
- 忘れた技能は記録され、後で再習得可能。

---

## 11. NPC同行と生存戦略

NPC同行は生存戦略の一部にする。

```yaml
companion_role:
  can_join_next_scenario: true
  can_be_lost: true
  can_help_san_zero_rescue: true
  rescue_success_modified_by_affection: true
```

NPCとの好感度と連絡先は、物語上だけでなく攻略上も重要になる。

---

## 12. シナリオ方針

MVPでは無料公開シナリオを1つ参考または拝借して、短いシナリオとして実装する。

注意:

- 無料シナリオでも、改変・商用利用・ゲーム実装・AI利用・再配布が可能か確認する。
- MVP開発中はプロトタイプ参考として扱う。
- 公開・販売する前に利用条件を必ず確認する。

```yaml
scenario_source:
  type: "free_public_scenario"
  usage: "prototype_reference"
  commercial_use: "to_be_confirmed"
  ai_adaptation: "to_be_confirmed"
  redistribution: "to_be_confirmed"
```

---

## 13. 次に決めるべきこと

1. MVP技能リストの確定
2. 能力値から技能初期値をどう計算するか
3. 一時的狂気・不定の狂気の具体表
4. シナリオを場面・選択肢・判定・分岐に変換するデータ形式
5. キャラクター作成画面のUI
6. NPCデータ構造
7. 無料シナリオ候補の選定と利用条件確認

---

## 14. 設計思想

このゲームは、AIに全部を任せるゲームではない。
ゲーム側がルールと状態を管理し、AIはNPCとして演じる。

プレイヤーがSAN崩壊した時、助けてくれる同行者がいるか。
その同行者とどれだけ関係を築いていたか。
そこにこのゲームの核がある。

関係性が生存率に変わるTRPG風Webゲームを目指す。
