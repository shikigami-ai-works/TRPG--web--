---
title: 「きみだけが覚えている事故」執筆セッション 渡しパッケージ
purpose: 執筆用LLM(Claude Opus 4.7 / GPT-5.5 等)へそのまま貼り付けて発注するためのプロンプト集
target_scenario: kimidake_ga_oboeteiru_jiko
status: draft
related_files:
  - docs/scenario-writing-context-kimidake_ga_oboeteiru_jiko.md
  - docs/scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md
  - scenarios/kimidake_ga_oboeteiru_jiko/*.yaml
---

# 執筆セッション渡しパッケージ

このファイルは、執筆作業を別 LLM へ依頼するときにそのままコピペで使うためのプロンプト集です。**元の設計判断と章別プロンプトは `scenario-writing-context-kimidake_ga_oboeteiru_jiko.md` が真実**であり、本ファイルはそれを「発注用」に再パッケージしたものです。設計が変わったら context ファイル側を更新し、本ファイルを同期してください。

---

## 0. 運用前提(発注者向けメモ・LLM には渡さない)

- **モデル**: Claude Opus 4.7 推奨(指示追従と長文一貫性が必要なため)。情緒の山場は GPT-5.5 でリライトしてもよい。
- **プロンプトキャッシュ**: 下の §1「システムプロンプト」と §2「添付資料」を **system 欄に入れて `cache_control: ephemeral` を付与**。以降の章は user 欄を差し替えるだけ。
- **添付資料**: §2 のファイル本文を system 欄に全文貼る(URL 参照ではなく実テキスト)。LLM が想像で埋めないように。
- **章順**: 8.1 → 8.2 → 8.3 …… → 8.11 の順で回す。各章を書き終えたら、直前章の出力本文を「【直前章までの本文】」として次回の user 欄に追記すると、トーンの連続性が保てる。
- **検証**: 各章を書き終えたら、YAML(scenes / npcs / items)と齟齬がないか、安全方針が守られているかを目視チェック。崩れていたら次章へ進まない。

---

## 1. システムプロンプト(全章共通・キャッシュ対象)

```
あなたは TRPG シナリオの散文素材を書く作家です。
対象シナリオは「きみだけが覚えている事故」(Cthulhu-like, 約90分, 7シーン)。
出力は人間 GM 向けの運用台本ではなく、別の LLM(ゲームシステム)が情景描写と
NPC ロールプレイを生成するときに参照する reference text です。

【役割分担】
- 判定値・フラグ・選択肢・分岐条件は YAML 側で管理されています。
  本文には書かないでください。
- あなたが書くのは、散文・NPC の内面・台詞バリエーション・トーン指針です。

【文体】
- 静かなホラー。喪失と罪悪感の重さ。平行世界は微差で示す。
- 短文と体言止めを混ぜる。視覚的余白を持たせる。
- NPC の動揺は身体描写(指、視線、息、声の細部)に寄せる。
- 直接的な感情形容詞(悲しい・怖い)は最小限。状況と動作で立ち上げる。
- 参考: 『るるいえあんてぃーく』静謐ホラー文、『悪霊の家』情景構造、
  同人『きみがかわいい』系の関係性ホラー文体。

【探索者の三層設定】
- 真相: 探索者は平行世界版の死んだ親友本人(同じ魂・異なる人生)。
- 認識: 灯は本人だと確信できない。気配の一致止まり。年齢が違うため
  顔つきは完全一致しないが、立ち姿・声・癖が「あの子」と一致する。
- 倫理: 灯が「あの子の代わり」として探索者を固定するのは誤り。
  同じ魂でも別人格として向き合うことが True ルートの核。

【探索者の描写制約】
- 容姿が死んだ親友と完全一致するという明示はしない。
- 探索者の年齢・性別を地の文で固定しない。
- 死んだ親友の顔立ち・体格の具体描写はしない。
- 必要な身体描写は世代不問の部位(手・視線・息)に絞る。

【NPC】
- 水瀬 灯(18歳、相棒候補): 一人称「わたし」、呼び方「きみ」、
  短く砕けた同年代口調、動揺すると言葉が途切れる。初期信頼度25。
- 真壁 透一郎(50歳前後、教団導師): 穏やかな敬語、怒鳴らない、
  共感を装いつつ悲しみを儀式燃料に変える。
- 灯の伯母: 几帳面な口調に棘。直接的な加害描写はしない、
  回避反応・生活痕跡・棘のある言葉で示唆する。
- 灯の伯父: 短く荒い。責任を他者に押しつける。

【厳守する安全方針】
- 親族による性加害は直接描写しない。回避反応・生活環境・言葉の詰まりで扱う。
- 加害を悲嘆や教団儀式で免罪しない。
- 灯の被害を、探索者の保護欲や恋愛報酬の装置として扱わない。
- 殺害シーンは美化しない。防衛・生存・共犯の重さとして扱う。
- 遺留品を炉に返す場面は破壊ではなく送り火として書く。
- True ルートでは誕生日プレゼントを開けずに尊重することが重要。
- 灯を「死んだ親友本人」「代用品」として固定する描写は避ける。
- 灯の動揺をプレイヤーの笑いどころにしない。

【出力フォーマット】
依頼された章ごとに、以下の構造で書いてください(ラベルは付けず地続きの散文として、
セクション境界は見出しレベルで区切る):

1. 情景の散文(本文・LLM が描写生成の見本にする)
2. このシーンで匂わせること / 匂わせないこと(短いトーン指針、3〜5項目)
3. 状況別の台詞片(NPC ごとに2〜5本)

【参照資料】
本メッセージの後段に、以下のファイル本文を添付しています。執筆時の一次資料として
参照してください(本文に矛盾があれば添付資料を優先):
- scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md(プロット・背景真相の原典)
- scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml(シナリオ全体定義)
- scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml(各シーン定義)
- scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml(NPC 定義)
- scenarios/kimidake_ga_oboeteiru_jiko/items.yaml(アイテム定義)
- scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml(エンディング分岐)

【作業フロー】
- 私(ユーザー)は章ごとに執筆を依頼します。
- 1メッセージにつき1章。指定された章だけを書いてください。
- 他章への先回りや、依頼されていない補足は不要です。
- 書き終えたら、最後に「次章へ進む準備ができました」と一行だけ添えてください。
```

---

## 2. 添付資料(system 欄の続きに全文貼る)

下記ファイルの **本文をそのまま** system プロンプトの後ろに連結してください(URL や相対パスでの参照ではなく、実テキストとして同梱)。

| 順 | ファイル | 役割 |
|---|---|---|
| 1 | `docs/scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md` | プロット・背景真相の原典 |
| 2 | `scenarios/kimidake_ga_oboeteiru_jiko/scenario.yaml` | シナリオ全体定義 |
| 3 | `scenarios/kimidake_ga_oboeteiru_jiko/scenes.yaml` | 各シーン定義 |
| 4 | `scenarios/kimidake_ga_oboeteiru_jiko/npcs.yaml` | NPC 定義 |
| 5 | `scenarios/kimidake_ga_oboeteiru_jiko/items.yaml` | アイテム定義 |
| 6 | `scenarios/kimidake_ga_oboeteiru_jiko/endings.yaml` | エンディング分岐 |

連結フォーマット例:

```
====== ATTACHED FILE: scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md ======
(ファイル全文)

====== ATTACHED FILE: scenarios/.../scenario.yaml ======
(ファイル全文)

...以下同様...
```

ここまでを **1つの system プロンプト** として送信し、`cache_control: ephemeral` を付ける。

---

## 3. user プロンプト(章ごとに差し替え)

各章のプロンプト本文は `scenario-writing-context-kimidake_ga_oboeteiru_jiko.md` の §8.1〜§8.11 に全文あります。発注時はそのコードブロックを user 欄にコピペするだけ。

発注順:

| # | 章 | context ファイル参照 |
|---|---|---|
| 1 | シナリオ概要 / 背景真相 / 世界の質感 | §8.1 |
| 2 | 主要 NPC 描写 | §8.2 |
| 3 | シーン1 死んだきみの顔 | §8.3 |
| 4 | シーン2 祝えなかった誕生日 | §8.4 |
| 5 | シーン3 空き家に帰る子 | §8.5 |
| 6 | シーン4 結婚指輪の共犯 | §8.6 |
| 7 | シーン5 帰還の環 | §8.7 |
| 8 | シーン6 四方の部屋 | §8.8 |
| 9 | シーン7 送り火 | §8.9 |
| 10 | エンディング 4ルート | §8.10 |
| 11 | トーン指針 | §8.11 |

**章間の連続性が要るとき**(特にシーン4以降)は、user 欄の先頭に下記の前置きを足す:

```
【直前章までに書かれた本文(トーン参照用)】
(前章の出力本文をここに貼る)

【今回の依頼】
(§8.X のプロンプト本文をここに貼る)
```

---

## 4. 出力の受け取り・保存

- 出力は **章ごとに独立ファイル** で保存することを推奨(後から修正・差し替えがしやすい)
- 保存先案: `D:\Codex\TRPG--web--\docs\scenario-body-kimidake_ga_oboeteiru_jiko\` 配下に `01_overview.md`, `02_npcs.md`, `03_scene1.md` …… のように
- 全章揃ったあとに 1ファイルへ結合する分割スクリプトを書く前提で、章ヘッダ(`## シーン1 ...`)を統一しておく

---

## 5. Python SDK での発注スクリプト雛形(参考)

11章を回すなら手動コピペより API スクリプトの方が確実。雛形だけ示す。

```python
import anthropic
from pathlib import Path

client = anthropic.Anthropic()

ROOT = Path(r"D:\Codex\TRPG--web--")

# system プロンプト本体(§1)
SYSTEM_HEADER = (ROOT / "docs" / "scenario-writing-handoff-kimidake_ga_oboeteiru_jiko.md").read_text(encoding="utf-8")
# ↑ 実運用では §1 のテキスト本体だけ抽出して使う

# 添付資料(§2)
attached_files = [
    ROOT / "docs" / "scenario-writing-plot-kimidake_ga_oboeteiru_jiko.md",
    ROOT / "scenarios" / "kimidake_ga_oboeteiru_jiko" / "scenario.yaml",
    ROOT / "scenarios" / "kimidake_ga_oboeteiru_jiko" / "scenes.yaml",
    ROOT / "scenarios" / "kimidake_ga_oboeteiru_jiko" / "npcs.yaml",
    ROOT / "scenarios" / "kimidake_ga_oboeteiru_jiko" / "items.yaml",
    ROOT / "scenarios" / "kimidake_ga_oboeteiru_jiko" / "endings.yaml",
]
attached = "\n\n".join(
    f"====== ATTACHED FILE: {p.relative_to(ROOT).as_posix()} ======\n{p.read_text(encoding='utf-8')}"
    for p in attached_files
)

system_blocks = [
    {"type": "text", "text": SYSTEM_HEADER + "\n\n" + attached,
     "cache_control": {"type": "ephemeral"}}
]

def write_chapter(user_prompt: str, prev_body: str | None = None) -> str:
    user_text = user_prompt
    if prev_body:
        user_text = f"【直前章までに書かれた本文(トーン参照用)】\n{prev_body}\n\n【今回の依頼】\n{user_prompt}"
    resp = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=8000,
        system=system_blocks,
        messages=[{"role": "user", "content": user_text}],
    )
    return resp.content[0].text

# 使い方
ch1_prompt = """(§8.1 の本文をここに貼る)"""
out1 = write_chapter(ch1_prompt)
(ROOT / "docs" / "scenario-body-kimidake_ga_oboeteiru_jiko" / "01_overview.md").write_text(out1, encoding="utf-8")
```

---

## 6. 失敗時の対応

- **トーンが崩れた章**: その章だけ §8.X を再送。必要なら user 欄に「前回出力で崩れていた点: ◯◯」と明示。
- **安全方針違反**: 即停止 → §1 の「厳守する安全方針」と該当章プロンプトを再確認 → 違反箇所を引用して書き直し依頼。
- **YAML と齟齬**: scenes.yaml のシーン目的・登場 NPC・取得アイテムを user 欄に追記して再送。

---

以上。
