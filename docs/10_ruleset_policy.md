# ルールセット方針

## 目的

このゲームでは、探索ホラー系、忍者バトル系など、複数タイプのTRPG風シナリオを扱う。
そのため、キャラクター作成、能力値、判定、ロスト、成長は単一ルールに固定しない。

シナリオごとに `ruleset_id` を持たせ、対応するキャラクター作成ルールと判定ルールを切り替えられる構造にする。

## 基本方針

- シナリオは対応するルールセットを持つ。
- キャラクターは対応ルールセットごとに作成する。
- 探索ホラー系シナリオには探索者向けキャラクター作成を使う。
- 忍者バトル系シナリオには忍者向けキャラクター作成を使う。
- 既存作品の公式ルールや文章はそのまま複製しない。
- 各ルールセットは、このゲーム用に再設計した独自仕様として管理する。

## ruleset_id

```yaml
rulesets:
  cthulhu_like:
    label: 探索ホラー風ルール
    focus:
      - investigation
      - horror
      - sanity
      - survival

  shinobi_like:
    label: 忍者バトル風ルール
    focus:
      - secret
      - mission
      - rival_relationship
      - ninja_battle
      - dramatic_reveal

  original:
    label: 独自ルール
    focus:
      - flexible
```

## シナリオ側の指定

```yaml
scenario:
  id: string
  title: string
  ruleset_id: cthulhu_like | shinobi_like | original
```

## キャラクター側の指定

```yaml
player_character:
  id: string
  name: string
  ruleset_id: cthulhu_like | shinobi_like | original
```

## 互換性方針

原則として、異なるルールセットのキャラクターは、そのまま別ルールセットのシナリオへ持ち込まない。

MVPでは、ルールセットごとにキャラクターを分ける。
将来的にはイベント用の変換ルールを検討する。

## 共通キャラクター情報

```yaml
common_character:
  id: string
  name: string
  ruleset_id: string
  appearance_note: string
  personality_note: string
  status: active | lost | memorial
  inventory: []
  scenario_history: []
```

## ルールセット別キャラクター情報

```yaml
ruleset_character_data:
  cthulhu_like: {}
  shinobi_like: {}
  original: {}
```
