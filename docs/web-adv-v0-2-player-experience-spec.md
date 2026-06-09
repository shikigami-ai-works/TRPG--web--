# Web ADV v0.2 Player Experience Spec

最終更新: 2026-06-05

## 0. 位置づけ

この文書は、`D:\Codex\TRPG--web--` をプレイヤー向けの紙芝居風 Web ADV へ進めるための実装準備仕様である。対象はコード実装前の Stage 13R であり、次の実装セッションはこの文書を入口にして最初の縦切りを作れる状態を目標にする。

一次設計ソースは、正確アーカイブされた handbook である。

- Manifest: `.context-archive/manifests/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook.manifest.json`
- Raw gzip: `.context-archive/raw/2026-06-05/2026-06-05T083018Z0000-web-adv-v0-2-decision-and-handbook-001.txt.gz`
- SHA-256: `abf24ce0496b44acda5dd8c113ed4535e684951041668f7e7b57a27b5bfc9a70`

`docs/NEXT_CHAT_HANDOFF_2026-06-05_web-adv-v0-2.md` と `docs/NEXTCHAT_CONTEXT_LEDGER_2026-06-05_web-adv-v0-2.md` は、周辺チャット判断の best-effort 再構成として扱う。シナリオ契約は `docs/scenario-current-spec-kimidake_ga_oboeteiru_jiko.md` と `scenarios/kimidake_ga_oboeteiru_jiko/*.yaml` を優先する。シナリオ本文は今後も改稿され得るため、現在の draft prose を凍結契約にしない。

## 1. Product Promise And Player Fantasy

プロダクト約束:

```text
状態で見える世界が変わるTRPGノベルADV
```

プレイヤーに約束する体験は、管理画面でシナリオを操作することではない。プレイヤーは「自分だけが覚えている事故」を抱えた探索者として、平行世界の灯と出会い、調査、選択、判定、証拠、記憶、信頼、境界侵食の変化を通して、見える世界そのものが変わっていく紙芝居風 ADV を遊ぶ。

このゲームの幻想は、次の4つで成立する。

- ノベル ADV として読みやすい: 背景、キャラクター立ち絵、名前欄、テキストウィンドウ、クリック/タップ進行を中心にする。
- TRPG として裁定感がある: 選択、技能判定、ダイス、成功/失敗/代償、証拠整理、ログがゲーム内に残る。
- 状態で世界が変わる: 所持品、手がかり、NPC信頼、境界侵食、記憶、心理状態によって見える文、背景、選択肢、危険の匂わせが変わる。
- 物語の芯は固定する: 真相、重要NPC、必須手がかり、終盤順序、ending 条件は自由生成させず、決定的な rule runtime が握る。

`ScenarioExplorer` はこの幻想を直接担う画面ではない。今後は scenario/debug/validation tool として残し、プレイヤーの入口は新しい `AdventurePlayer` に切り替える。

## 2. First Vertical Slice Scope

最初の縦切りは、Web app のまま `kimidake_ga_oboeteiru_jiko` のプレイヤーADV体験を3シーン相当で成立させる。

対象範囲:

- Scenario: `kimidake_ga_oboeteiru_jiko`
- Scenes: `scene_001_parallel_arrival` から `scene_003_empty_house` まで
- NPC: 水瀬灯を中心に扱う
- Data source: 既存の `scenario.yaml`、`scenes.yaml`、`npcs.yaml`、`items.yaml`、`endings.yaml`
- Runtime: 既存の `createInitialState`、`applyStateChanges`、`canUseRequirements`、`resolveEnding`、`rollScenarioCheck` を土台にする
- Player outcome: Scene 3 で灯を休ませるところまでを「first playable slice complete」として表示する

縦切りで証明すること:

- 紙芝居風ADVレイアウトでプレイできる
- テキストをクリック/タップで進められる
- 進行可能な選択肢だけが表示される
- 判定がある行動ではダイス結果が物語イベントとして表示される
- 状態変化が evidence/status/log/trust に反映される
- 境界侵食や記憶の演出枠がある
- AI GM がなくても最後まで deterministic に動く

縦切りでやらないこと:

- 全7シーンの完全プレイアブル化
- AI GM、自由入力、AI裁定、AIナレーション
- 新しいシナリオ本文の大規模執筆
- YAML構造の大改造
- 推理宣言フェーズ、詳細証拠ボード、調査報告型 ending

## 3. Player Screen Layout

`AdventurePlayer` はフルビューポートのADV画面にする。現在の ScenarioExplorer のように全データを一覧する管理画面ではなく、プレイヤーが今いる場所、話している相手、読んでいる文章、選べる行動を中心に置く。

基本方針は mobile-first vertical UI とする。最初に成立させる体験は、スマホ縦持ちで片手でも読み進めやすい紙芝居ADVである。PC版はこのスマホ画面を単純に拡大するのではなく、同じ情報構造を広い画面へ展開する desktop-expanded layout として扱う。

スマホ縦持ちの基準構造:

```text
┌────────────────────┐
│ compact status bar │ 境界侵食 / 記憶 / 灯の信頼
├────────────────────┤
│                    │
│ background / Akari │ 背景と立ち絵を主役にする
│                    │
├────────────────────┤
│ nameplate          │
│ ADV text           │ タップで読み進める
│ advance indicator  │
├────────────────────┤
│ choice 1           │
│ choice 2           │ 最大3-4件を基本にする
├────────────────────┤
│ evidence log state │ 下部ナビからdrawerを開く
└────────────────────┘
```

スマホ縦持ちのレイアウト配分:

- Top status: 5-8% 程度。常時見せるが、数字の羅列にしない。
- Stage: 45-55% 程度。背景、灯の立ち絵、境界侵食演出を見せる。
- Text box: 28-38% 程度。日本語本文の読みやすさを優先する。
- Choice tray: 本文完了時だけ text box の下または text box 内下部に展開する。
- Bottom nav: 44-56px 程度。`Evidence`、`Log`、`Status` を開くためのアイコン/短いラベルにする。

スマホでは、証拠、ログ、技能、所持品、NPC trust detail を常時表示しない。これらは下から開く bottom sheet drawer にまとめ、本文読書中の視界を圧迫しない。drawer は半画面を基本にし、詳細が必要なときだけ全高に拡張できる。

### 3.1 Visual Asset Direction And Resolution

2026-06-05 時点の仮決まりとして、絵素材は A案の「高解像度ピクセル風イラスト」方針で進める。低解像度の本格ドット絵を nearest-neighbor で拡大する方式ではなく、2Kから4Kの間の素材マスターを作り、見た目としてピクセル風/ピクセルアニメ調に寄せる。

仮固定サイズ:

| 用途 | 基準サイズ | 用途メモ |
|---|---:|---|
| UI基準スマホ画面 | `390x844` CSS px | Figma/実装で最初に見る縦持ち基準。 |
| スマホ背景マスター | `2160x3840` px | 縦構図の背景素材。重要シーンはスマホ専用構図を優先する。 |
| PC背景マスター | `3840x2160` px | 横構図の背景素材。desktop-expanded layout 用。 |
| 立ち絵マスター | `2048x3072` px | 透過PNG/WebP想定。表情差分や距離感演出へ展開できる余白を残す。 |
| 実配信用背景 | `1080x1920` - `1440x2560` px | Web配信時に圧縮したスマホ向け実データ。必要に応じてPC向けも別出力する。 |

運用ルール:

- 画像生成やFigmaモックでは `390x844` のUI基準画面へ収まる見え方を先に確認する。
- 素材生成は `2160x3840` のスマホ縦背景を基本にし、PC向けに必要な場面だけ `3840x2160` を追加する。
- 1枚の横長背景をスマホで強引に縦クロップすることは避ける。重要な構図ではスマホ縦用とPC横用を分ける。
- ピクセル風の質感は、細密な4K絵をそのまま見せるのではなく、輪郭、色面、ノイズ、拡大時のエッジ処理で「ピクセルアニメ調」に寄せる。
- 配信用アセットはマスターから圧縮し、画質、読み込み速度、スマホGPU負荷を見て `1080x1920` から `1440x2560` の範囲で選ぶ。
- first playable slice では仮背景/仮立ち絵でもよいが、最終UIの枠はこの解像度方針を前提に作る。

PC/タブレットでは、同じ情報構造を広い画面へ展開する。

```text
┌────────────────────────────────────────────┐
│ compact status bar                         │
├──────────────────────────────┬─────────────┤
│ background / character / text│ side panel  │
│                              │ evidence    │
│ choices                      │ log/status  │
└──────────────────────────────┴─────────────┘
```

PCでは、証拠、ログ、状態を右側の side panel または右drawerで半常駐させてよい。スマホ縦画面をそのまま中央に巨大表示して左右を空白にする実装は避ける。PCの利点は、読書の没入感を保ちつつ調査情報をすばやく参照できることに使う。

基本レイヤー:

1. Stage background
   - シーン背景を画面全体に敷く。
   - first slice では実画像が未整備でも、scene type と state から生成したCSS背景でよい。
   - 境界侵食が上がると色、ノイズ、影、輪郭の演出が変わる。

2. Character layer
   - 現在の主要NPC、first slice では灯の立ち絵枠を表示する。
   - 実アセットが未整備ならシルエット/プレースホルダーを使用してよいが、プレイヤーUI内で「未実装」と説明するテキストは出さない。
   - NPC trust や scene state により表情/距離感を切り替える余地を残す。

3. ADV text box
   - 画面下部に名前欄、本文、進行インジケータを置く。
   - 本文は1イベントを複数ページに分割できる。
   - クリック/タップまたは Enter/Space で次ページへ進む。

4. Choice tray
   - 本文ページを読み終わったときだけ表示する。
   - enabled な選択肢は必ず実際の state change、check、scene transition、overlay open などのユーザー可視結果を持つ。
   - unmet requirements の選択肢は原則非表示にする。終盤の final-choice gate など、locked 状態そのものが体験に必要な場合だけ disabled 表示と短い理由を許す。

5. Status strip
   - 境界侵食、記憶、灯の信頼、所持品数、証拠数を小さく表示する。
   - 生数字は debug では有用だが、プレイヤー画面では「安定」「揺らぎ」「危険」などの段階表現を優先する。

6. Overlay drawers
   - Evidence
   - Investigation Log
   - Status/Skills
   - Inventory/Key Items
   - NPC Trust/Memory

モバイルでは、status strip は圧縮し、drawers は下から開く sheet として扱う。デスクトップでは右側または下部の overlay panel にしてよい。いずれの場合も、本文、選択肢、閉じるボタン、状態表示が重ならないことを acceptance に含める。

レスポンシブ境界:

- `<= 767px`: mobile vertical。bottom nav + bottom sheet を使う。
- `768px - 1023px`: tablet。bottom sheet を維持してよいが、横幅がある場合は右drawerを許す。
- `>= 1024px`: desktop-expanded。right side panel を基本にする。

縦横比の注意:

- スマホ縦持ちで最初に検証する。
- スマホ横持ちは初回sliceの主対象にしない。ただし画面が破綻しない最低限のレイアウトは保証する。
- PCでの最大本文幅を制限し、長い行で読みづらくしない。
- テキストボックス、選択肢、drawer は safe area inset を考慮する。

## 4. Core Interaction Loop

first playable では、AI GM を使わない deterministic ADV loop を完成させる。

基本ループ:

1. `app/page.tsx` が scenario packs を読み込む。
2. `AdventurePlayer` が対象 scenario pack を選び、`createInitialState(pack)` でラン状態を開始する。
3. 現在 scene から player-facing presentation event を作る。
4. 背景、NPC、名前欄、本文ページを表示する。
5. プレイヤーがクリック/タップで本文ページを進める。
6. 本文を読み終えたら、`canUseRequirements` を通る action/check/scene transition を選択肢として表示する。
7. プレイヤーが選択肢を押す。
8. action の場合、`applyStateChanges` を適用し、log/evidence/status を更新する。
9. check の場合、`rollScenarioCheck` で出目を確定し、success/failure branch を `applyStateChanges` へ渡す。
10. 結果を1つの result event として表示し、dice/log/status の要約を残す。
11. next_scene_rules または明示 action により scene を進める。
12. Scene 3 の縦切り完了条件に達したら slice complete screen を表示する。

このループでは、プレイヤーに「成功/失敗を手動で選ばせる」debug 操作を出さない。成功/失敗の直接 branch 選択は `ScenarioExplorer` 側に残す。

## 5. Scenario/Runtime Separation

v0.2 は以下の責任分界を守る。

Scenario data:

- `scenarios/kimidake_ga_oboeteiru_jiko/*.yaml` が実行契約である。
- scene IDs、action IDs、flag IDs、counter IDs、trust IDs、ending IDs は保存/検証のために維持する。
- player-facing label は UI adapter で整形できるが、ID自体を表示文言のために変えない。
- 本文 draft はプレイヤー体験の参照であり、action/flag/ending 契約の唯一根拠にしない。

Runtime:

- 状態更新、requirements、ending resolution、dice result、carry-out rule は `lib/scenarios/*` が握る。
- プレイヤーUIは runtime state を直接都合よく書き換えない。
- `AdventurePlayer` は runtime API にイベントを渡し、返った state と presentation event を描画する。
- first slice のログ、証拠、汚染、記憶は runtime state から導出できる範囲で始める。不足データがある場合は implementation stage で最小型を追加する。

Presentation adapter:

- `SceneDefinition` と `ScenarioRuntimeState` から player-facing view model を作る。
- raw IDs をプレイヤーへ漏らさない。
- debug-only 情報は `ScenarioExplorer` に残す。
- 汚染演出や記憶揺らぎは、必須情報を読めなくしない範囲で view model に反映する。

## 6. State And Log Presentation

### 6.1 Choices

choice は事前定義された action/check/transition ID から表示する。AI や UI が未定義選択肢を作らない。

first slice の表示ルール:

- `requirements` を満たす選択肢を表示する。
- `once_per_run` 使用済みの選択肢は原則非表示にする。
- 必須進行に関わる選択肢は runtime rule で保証する。
- 危険選択肢は、赤い警告ラベルではなく文体、余白、微細な歪みで匂わせる。
- クリック済みの結果は log に残る。

### 6.2 Dice

dice は player-facing story event として表示する。

表示要素:

- 行動名
- 使用 stat/skill の表示名
- 出目
- 合計値
- target number
- 成功/失敗
- 得た情報または代償
- 状態変化の短い要約

UIでは「ダイスを振る」ボタンを1つだけ出す。`成功扱い`、`失敗扱い` の debug button は player UI に出さない。

### 6.3 Evidence

first slice では簡易 evidence list から始める。高機能な自由接続ボードは後回しにする。

分類:

- confirmed: 確定情報
- inference: 推測情報
- testimony: 証言
- contradiction: 矛盾
- unverified: 未検証
- polluted_memory: 汚染された記憶

既存 YAML に明示 clue schema がない場合、implementation stage では暫定 adapter を使い、重要 flag/item/check outcome から evidence entry を作る。将来は `scenarios/kimidake_ga_oboeteiru_jiko/clues.yaml` を追加して正式化する。

### 6.4 Contamination

`boundary_contamination` は、Kimidake では境界侵食/認識汚染の中核カウンターとして扱う。

presentation rule:

- 低: 背景とUIは安定。
- 中: 色味、ノイズ、影、選択肢文面がわずかに揺れる。
- 高: 一部ログや記憶欄に不穏な差分が混ざる。
- 危険: lost ending や境界崩壊条件へ近づく警告演出を出す。

禁止:

- 必須選択肢を読めなくする。
- 重要な状態変化を文字化けだけで伝える。
- プレイヤーが何を押せばよいか分からない状態を作る。

### 6.5 Memory

handbook では memory が重要軸である。Kimidake では「しきだけ/探索者だけが覚えている事故」という作品核にも合う。

first slice では、既存 runtime に memory counter がない場合でも、UI上に memory slot を用意する。

初期実装候補:

- `memory_stability` を runtime に追加する場合、初期値100、低下/回復は implementation-notes に理由を記録する。
- 追加しない場合、first slice では flags/log から「記憶は安定」「違和感を覚えている」などの段階表示を導出する。
- 汚染された記憶は evidence category の `polluted_memory` と連動できるようにする。

### 6.6 NPC Trust

水瀬灯の trust は、プレイヤー画面では raw number だけにしない。

表示例:

- まだ警戒している
- 少しだけ言葉を預けている
- 隣にいても逃げない
- 同じ光を見ようとしている

debug では数値を表示してよい。player UI では、trust の変化理由を log に短く残す。

### 6.7 Investigation Log

log はゲーム内で調査を立て直すための要約記録である。

記録するもの:

- 重要選択
- dice check
- 得た evidence
- 失敗時の代償
- trust/resource 変化
- scene transition
- ending/slice completion

保存方針:

- first slice では既存 `ScenarioRuntimeState.log` を拡張または adapter で整形する。
- 文章全文の保存はしない。
- 古いログは要約でよいが、dice と evidence の根拠は残す。

## 7. Deterministic Core Versus Future AI GM

AI GM は first slice では実装しない。まず deterministic ADV loop を完成させる。

Deterministic core が必ず握る:

- scenario pack loading
- scene/action/check/ending IDs
- requirement evaluation
- mandatory choice visibility
- dice roll execution
- success/failure determination
- state changes
- flags/counters/trust/inventory/log
- evidence entries reflected in state
- ending resolution order
- save/load
- UI enabled/disabled state

Future AI GM が扱ってよい:

- 任意選択肢プールからの表示候補選別
- free input の action category 分類
- check proposal
- deterministic result を受けた短い narration
- NPC response candidate
- GM口調や裁定コメントの演出

Future AI GM に禁止する:

- 真相、重要NPC、必須手がかり、ending 条件の変更
- 未定義 choice/item/clue/NPC の生成
- game state の直接書き換え
- 必須進行選択肢の隠蔽
- 失敗でシナリオを詰ませる裁定
- final choice gate の解除条件変更

## 8. Component And Module Proposal

最小実装では既存ファイルを壊さず、新しい player surface を追加する。

Player route:

- `app/page.tsx`
  - first playable では `loadScenarioPacks()` して `AdventurePlayer` を描画する。
  - 実装後、ScenarioExplorer は debug route へ移す。

Debug route:

- `app/debug/page.tsx`
  - `loadScenarioPacks()` して `ScenarioExplorer` を描画する。
  - player UI に出さない手動 branch、profile edit、save history、ending progress inspection を残す。

Player components:

- `components/adventure/AdventurePlayer.tsx`
  - player session の親コンポーネント。
- `components/adventure/AdventureStage.tsx`
  - background、NPC layer、contamination visual state。
- `components/adventure/AdventureTextBox.tsx`
  - nameplate、本文ページ、advance affordance。
- `components/adventure/ChoiceTray.tsx`
  - visible choices、dice choices、locked final choices。
- `components/adventure/StatusStrip.tsx`
  - contamination、memory、trust、evidence/log counts。
- `components/adventure/BottomNav.tsx`
  - mobile-first の `Evidence`、`Log`、`Status` drawer entry。
- `components/adventure/EvidenceDrawer.tsx`
  - evidence categories と detail。
- `components/adventure/InvestigationLogDrawer.tsx`
  - summary log と dice result。
- `components/adventure/StatusDrawer.tsx`
  - skills/resources/inventory/trust の詳細。
- `components/adventure/DesktopSidePanel.tsx`
  - desktop-expanded layout で evidence/log/status を半常駐表示する。
- `components/adventure/DiceResultPanel.tsx`
  - roll result の演出表示。

Runtime/view modules:

- `lib/adventure/session.ts`
  - `AdventureSessionState`、player page index、current event、overlay state。
- `lib/adventure/view-model.ts`
  - `ScenarioPack` と `ScenarioRuntimeState` から `AdventureViewModel` を作る。
- `lib/adventure/choices.ts`
  - player-facing choice filtering と display metadata。
- `lib/adventure/evidence.ts`
  - flags/items/check outcomes から evidence entries を導出する暫定 adapter。
- `lib/adventure/log.ts`
  - runtime log を player-facing investigation log entries に整形する。
- `lib/adventure/presentation.ts`
  - scene type、contamination、memory、NPC trust から background/text effects を決める。

Existing scenario modules to keep:

- `lib/scenarios/types.ts`
- `lib/scenarios/runtime.ts`
- `lib/scenarios/check-resolution.ts`
- `lib/scenarios/storage.ts`
- `lib/scenarios/loader.ts`
- `lib/scenarios/validation.ts`

Optional future data files:

- `scenarios/kimidake_ga_oboeteiru_jiko/clues.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/presentation.yaml`
- `scenarios/kimidake_ga_oboeteiru_jiko/choice_display.yaml`

These optional data files should not be added in the first implementation unless the adapter approach cannot express the vertical slice cleanly.

## 9. Migration Plan From ScenarioExplorer To AdventurePlayer

Phase 1: Keep ScenarioExplorer intact.

- Do not rewrite `components/ScenarioExplorer.tsx` during the first player UI implementation.
- Add `AdventurePlayer` and adapter modules alongside it.
- Verify both surfaces can load the same scenario pack.

Phase 2: Move player route.

- Change `app/page.tsx` to render `AdventurePlayer`.
- Add `app/debug/page.tsx` for `ScenarioExplorer`.
- Confirm debug route still supports manual action/check/ending inspection.

Phase 3: Share deterministic helpers.

- If `ScenarioExplorer` contains player-useful formatting maps, extract only the reusable display labels into `lib/adventure/labels.ts` or `lib/scenarios/labels.ts`.
- Do not move debug-only branch controls into player modules.

Phase 4: Add player-facing tests.

- Add focused tests for view model choice visibility, dice log formatting, evidence derivation, and contamination thresholds.
- Keep existing `tests/scenario-regression.test.ts` as scenario contract regression.

Phase 5: Expand scenario coverage.

- After scenes 1-3 are playable, extend to scenes 4-7.
- Recheck Scene 7 final-choice gate: `promise_return_together` / `choose_return_with_akari` / `choose_return_alone` / `choose_stay_with_akari` must remain unavailable until `regret_resolved` is set by `burn_keepsakes_as_farewell`.

## 10. Acceptance Criteria For First Playable Slice

The first playable slice is accepted when all criteria below are true.

Player experience:

- Opening `/` shows `きみだけが覚えている事故` as a paper-theater ADV, not the ScenarioExplorer management surface.
- The primary layout is mobile-first vertical ADV: compact status at top, stage in the middle, text/choices at bottom, and evidence/log/status navigation at the bottom edge.
- Desktop uses a desktop-expanded layout with a side panel or right drawer for evidence/log/status; it must not simply scale up the mobile portrait layout with large empty side gutters.
- Scene 1 starts with background, text box, nameplate, and click/tap advance.
- Player can proceed from scene 1 through scene 3 using only player-facing controls.
- Relevant choices appear only after text advance reaches the choice point.
- Dice/check actions roll automatically and display success/failure as story events.
- Evidence drawer shows at least one derived evidence entry when the player discovers a relevant clue or state.
- Investigation log records choices, checks, state changes, and scene transitions in player-readable language.
- Status strip shows boundary contamination, memory, Akari trust, and evidence/log counts.
- Akari trust changes are visible as relationship state, not only raw number.
- No enabled player-facing button is a placeholder or console-log-only action.

Scenario contract:

- Existing YAML IDs, flags, counters, ending IDs, and current scenario direction remain intact.
- Scene prose is not treated as frozen canon.
- ScenarioExplorer still exists as debug/validation surface.
- AI GM and free input are not implemented in this slice.

Technical:

- `npm run typecheck` passes after implementation.
- `npm run lint` passes after implementation.
- `npm run build` passes after implementation.
- `npm run test` passes after implementation.
- `npm run validate:scenarios` passes after implementation.
- Browser/UI audit confirms visible interactive controls have user-observable outcomes.
- Mobile viewport audit confirms the text box, choice tray, bottom nav, and bottom sheet are readable and tappable without overlap.
- Desktop viewport audit confirms side panel behavior works and the ADV text line length remains readable.

## 11. Verification Plan

For this spec-only Stage 13R:

- Run `git diff --check`.
- Do not run the full frontend suite because only docs are changed.

For the next implementation stage:

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run build`.
- Run `npm run test`.
- Run `npm run validate:scenarios`.
- Run a browser check for `/` and `/debug`.
- Run UI interaction audit.

UI interaction audit expectations:

- List every visible enabled control on `/`.
- For each control, record expected outcome and observed result.
- Required controls include text advance, each visible choice button, dice/check button, evidence drawer open/close, log drawer open/close, status drawer open/close, and any new game/resume control if visible.
- Verify no `href="#"`, `javascript:void(0)`, placeholder click handler, TODO handler, or console-log-only action is reachable.
- Verify keyboard operation for text advance and drawer close where implemented.
- Verify mobile vertical screenshots, especially around `390x844` and `430x932`, do not show overlapping text, buttons, drawers, bottom nav, safe-area padding, or status elements.
- Verify desktop screenshots, especially around `1280x720` and `1440x900`, do not show the mobile portrait layout merely enlarged into the center with empty side gutters.
- Verify contamination/memory visual effects do not hide mandatory choices or required text.

## 12. Safest Next Implementation Stage

Stage 14R should be:

```text
Stage 14R: Deterministic AdventurePlayer vertical-slice shell

Objective:
Implement the first deterministic player-facing ADV shell for scenes 1-3 of `kimidake_ga_oboeteiru_jiko`, using the existing scenario pack/runtime and the spec in `docs/web-adv-v0-2-player-experience-spec.md`.

Scope:
Add `components/adventure/*` and `lib/adventure/*` modules, change `/` to render `AdventurePlayer`, add `/debug` for `ScenarioExplorer`, and keep existing scenario YAML/body/runtime contracts intact. Implement the player UI as mobile-first vertical ADV, with bottom drawers on mobile and a desktop-expanded side panel on wide viewports.

Constraints:
No AI GM, no free input, no scenario prose rewrite, no broad YAML restructuring, no commit/push. Preserve unrelated local changes. ScenarioExplorer must remain usable as debug/validation UI.

Verification:
Run typecheck, lint, build, test, validate:scenarios, browser check for `/` and `/debug`, and a UI interaction audit for all visible enabled controls.

Done:
The player can open `/`, read/advance scenes 1-3 as a paper-theater ADV on a smartphone-sized vertical viewport, make choices, see dice/story results, view evidence/log/status/trust through bottom drawers, and use the same experience on desktop with a side panel while the debug route still works.
```

## 13. Stage17 Development Direction During Asset Production

Decision date: 2026-06-09 JST

Shiki decided that visual asset production will continue in parallel, but the
software development lane should not block on finished graphics. Until the
first production-ready background, character, prop, UI, and effect assets are
available, development should move into the deterministic post-clear
relationship/contact lane.

The next software direction is:

```text
Stage17: Contact And Relationship Record System
```

Japanese direction:

```text
素材がそろうまでの間は、連絡先を受け取った後の交友・縁の記録システムを進める。
ただし、最初からAI自由会話や本格メッセージアプリには進まない。
まずは、クリア後に灯との縁が残ったことを、到達記録・報酬・信頼状態から
deterministic に表示する。
```

### 13.1 Why This Lane

This lane can progress before final visual assets because it mostly uses
existing deterministic data:

- completed run history;
- ending metadata and rewards;
- Akari trust;
- current relationship/reward labels;
- existing post-ending progress surface;
- existing localStorage-backed completed history.

It also fits the original MVP handbook direction that each scenario should have
at least one NPC with affection/contact value, while keeping the current
Web ADV rule that the deterministic runtime owns game state.

### 13.2 First Safe Slice

The first Stage17 slice should be docs-first:

```text
Stage17A: Contact And Relationship System Spec
```

Objective:

- Define the minimum post-clear relationship/contact system for Akari.
- Decide what is unlocked after `return_with_akari`, `return_without_akari`,
  and `stay_with_akari`.
- Keep the first implementation as a relationship record / contact record,
  not an AI chat surface.

Recommended artifact:

```text
docs/stage17-contact-relationship-system-spec.md
```

### 13.3 First Implementation Candidate

After Stage17A is written and reviewed, Stage17B can implement a narrow UI
slice:

- add a post-ending relationship/contact card for Akari;
- derive its state from completed run history and ending rewards;
- show the latest reached ending, relationship trace, trust band, and preserved
  memory/reward label;
- expose it from the post-ending surface or progress/reward sheet;
- keep all controls user-observable and deterministic.

### 13.4 Boundaries

Stage17 must preserve:

- `/` as `AdventurePlayer`;
- `/debug` as `ScenarioExplorer`;
- `EvidenceEntry[]` as the AdventurePlayer evidence boundary;
- current scenario YAML/body;
- ending route gates and ending conditions;
- localStorage completed-run history as the current durable source.

Stage17 must not introduce yet:

- AI free chat with Akari;
- generated NPC replies;
- smartphone messenger simulation as the first slice;
- cloud save or external account persistence;
- broad `CompletedRunRecord` schema expansion;
- new route gates, ending conditions, or scenario prose changes;
- production asset import.

### 13.5 Copy Direction

The first player-facing copy should avoid treating Akari as a romance reward or
possession. Prefer language like:

- `灯との縁`;
- `残った記憶`;
- `関係のしるし`;
- `もう一度たどるための記録`;
- `連絡先の痕跡`.

Avoid copy that implies the player owns Akari, rescued her as a prize, or can
freely summon her outside deterministic story state.
