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

```yaml
scenario:
  id: string
  title: string
  source:
    author: string
    url: string
    license_note: string
    commercial_use: allowed | denied | unknown
    modification: allowed | denied | unknown
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
9. ゲーム側で一覧に表示できるか確認する。

## MVP用シナリオ標準長

1シナリオあたりの目安:

- 5〜7シーン
- NPC 2〜3人
- 判定 3〜5回
- エンディング 3種類

ただし外部シナリオを変換する場合は、元シナリオの構成を尊重し、MVP向けに必要な範囲だけを切り出してもよい。
