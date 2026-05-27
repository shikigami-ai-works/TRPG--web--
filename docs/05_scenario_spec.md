# シナリオ仕様

## 基本方針

シナリオは事前に用意する。
AIは演出とNPCロールを補助するが、シナリオ進行やクリア条件はゲーム側が持つ。

MVPではオリジナルシナリオ制作を必須にしない。
無料公開シナリオ、または利用許諾を確認した既存シナリオを、ゲーム用データへ変換して順次追加できる構造にする。

## シナリオ追加方針

シナリオはゲーム本体のコードに直接埋め込まない。
シナリオごとに独立したデータパックとして管理する。

想定ディレクトリ:

```text
scenarios/
  scenario_id/
    scenario.yaml
    npcs.yaml
    scenes.yaml
    endings.yaml
    items.yaml
    license.md
```

## 利用許諾とライセンス管理

外部の無料公開シナリオを使う場合、必ず利用条件を確認する。
特に以下を記録する。

- 作者名
- 配布元URL
- 利用許諾
- 改変可否
- 商用利用可否
- クレジット表記義務
- 再配布可否

シナリオデータには `license.md` を同梱し、出典と利用条件を明記する。

## シナリオ構造

正式なスキーマメモは `docs/schemas/scenario.schema.yaml`、シーン単体は `docs/schemas/scene.schema.yaml` を参照する。

```yaml
scenario:
  id: string
  title: string
  ruleset_id: cthulhu_like | shinobi_like | original
  summary: string
  source:
    author: string
    url: string
    license_note: string
    commercial_use: allowed | denied | unknown
    modification: allowed | denied | unknown
    redistribution: allowed | denied | unknown
    credit_required: boolean
  play_time:
    estimated_minutes: number
    scene_count: number
  required_npc_roles: []
  files:
    npcs: npcs.yaml
    scenes: scenes.yaml
    endings: endings.yaml
    items: items.yaml
    license: license.md
  scenes: []
  endings: []
  ending_resolution_order: []
  content_warnings: []
  safety_notes: []
  mechanics:
    initial_flags: {}
    counters: {}
    carry_out_groups: []
  clear_conditions: []
  lost_conditions: []
  rewards: []
```

## シーン構造

```yaml
scene:
  id: string
  title: string
  description: string
  scene_type: intro | exploration | conversation | danger | climax | ending
  available_actions: []
  npc_ids: []
  checks: []
  next_scene_rules: []
```

## 状態管理

AIは演出とNPCロールを補助するだけで、フラグ、カウンター、信頼度、所持品、エンディング判定はゲーム側が管理する。

シナリオ開始時、ゲーム側は `scenario.mechanics.initial_flags` と `scenario.mechanics.counters` をそのまま初期状態としてロードする。
シーン中の選択肢や判定結果は、`state_changes` を適用してゲーム状態を更新する。

```yaml
state_changes:
  trust_delta:
    npc_id: number
  add_flags:
    - flag_id
  set_flags:
    flag_id: boolean
  counter_delta:
    counter_id: number
  add_items:
    - item_id
  remove_items:
    - item_id
  enforce_carry_out_limit:
    group: group_id
    max_count: number
```

`add_flags` は指定フラグを `true` にする簡易表記。
falseへ戻す必要がある場合は `set_flags` を使う。

## 条件式

エンディング条件など、複合条件が必要な箇所では構造化条件を使う。
Next.js側では再帰的なUnion型として扱う。

```yaml
condition_expr:
  all:
    - condition_expr
  any:
    - condition_expr
  any_missing:
    - condition_expr
  flag:
    flag: flag_id
    value: boolean
  counter:
    counter:
      id: counter_id
      operator: ">="
      value: number
  trust:
    trust:
      npc_id: npc_id
      operator: ">="
      value: number
  item:
    item:
      id: item_id
      owned: boolean
```

既存のシーン遷移やアクション条件では、MVP実装を軽くするため短縮文字列も許可する。

```yaml
condition_shortcut:
  - always
  - default
  - has_flag:<flag_id>
  - has_item:<item_id>
  - choice:<action_id>
  - counter:<counter_id><operator><number>
  - owned_items_in_group:<group_id><operator><number>
  - carry_out_selection_count:<group_id><operator><number>
```

新しく複雑な条件を追加する場合は、短縮文字列より構造化条件を優先する。

## エンディング判定

終盤の選択肢は、特定エンディングへ直行させず `resolve_ending: true` を使う。
ゲーム側は `scenario.ending_resolution_order` の順に `endings.yaml` の `unlock_conditions` を評価し、最初に一致したエンディングを採用する。

これにより「二人で帰る」を選んでも、条件不足なら `return_without_akari` や `boundary_collapse` に落とせる。

## 追加運用

新しいシナリオを追加するときは、以下の順で作業する。

1. 利用条件を確認する。
2. `scenarios/scenario_id/` を作成する。
3. `license.md` に出典と利用条件を書く。
4. `scenario.yaml` に概要と管理情報を書く。
5. `scenes.yaml` にシーンと遷移を書く。
6. `npcs.yaml` にNPC定義を書く。
7. `endings.yaml` にエンディング条件を書く。
8. 必要なら `items.yaml` を追加する。
9. `docs/schemas/*.yaml` にない独自項目を増やした場合は、先にスキーマへ追記する。
10. ゲーム側で一覧に表示できるか確認する。

## MVP用シナリオ標準長

1シナリオあたりの目安:

- 5〜7シーン
- NPC 2〜3人
- 判定 3〜5回
- エンディング 3種類

ただし外部シナリオを変換する場合は、元シナリオの構成を尊重し、MVP向けに必要な範囲だけを切り出してもよい。
