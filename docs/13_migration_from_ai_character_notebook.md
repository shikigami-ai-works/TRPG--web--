# 13 Migration from ai-character-notebook

## 経緯

2026-05-23 に、既存の `ai-character-notebook` リポジトリを **本 TRPG プロジェクトの基盤として流用する** ことを決定した。

- 流用元: https://github.com/shiki-ai-works/ai-character-notebook
- 元方針メモ: [ai-character-notebook/docs/０１３_開発方針変更_TRPG交友システムへの流用.md](https://github.com/shiki-ai-works/ai-character-notebook/blob/main/docs/%EF%BC%90%EF%BC%91%EF%BC%93_%E9%96%8B%E7%99%BA%E6%96%B9%E9%87%9D%E5%A4%89%E6%9B%B4_TRPG%E4%BA%A4%E5%8F%8B%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%B8%E3%81%AE%E6%B5%81%E7%94%A8.md)

## ai-character-notebook 側の現状（流用元）

スタック:
- Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS
- Supabase (Auth + DB) / OpenAI (Responses / Whisper / TTS)
- PWA（iPhone 幅最適化）

実装済み機能:
- メールリンクログイン
- キャラクター（プロフィール）CRUD + 複製 + 検索
- キャラ別チャット（system prompt 注入）、履歴保存・リセット・自動スクロール、最新返答の再生成
- 音声入力（Whisper）、音声読み上げ（OpenAI TTS、6 voice 選択、プレビューボタン）、自動読み上げトグル

## 流用方針

### そのまま使えるもの

| 領域 | ファイル |
|---|---|
| Supabase 認証 | `lib/supabase/*`, `app/(auth)/*`, `app/auth/callback/route.ts`, `lib/auth/session.ts` |
| キャラプロフィール CRUD | `lib/characters/*`, `app/(app)/characters/*`, `components/characters/*` |
| チャット UI | `components/chat/chat-client.tsx`, `app/api/chat/route.ts`, `lib/chat/*` |
| 音声機能 | `app/api/transcribe/route.ts`, `app/api/tts/route.ts`, `components/chat/voice-input-button.tsx`, `components/characters/voice-preview-select.tsx` |
| 共通 UI | `app/globals.css`（icon-button, field, panel, button-primary 等）|
| PWA | `public/manifest.json`, `components/pwa/service-worker-register.tsx` |

### スキーマ拡張（characters → npc）

既存 `characters` テーブルに以下のカラムを追加（or 新テーブル `npcs` に変える判断は要相談）:

```sql
alter table public.characters
  add column if not exists affection_enabled boolean not null default false,
  add column if not exists affection_value int not null default 0 check (affection_value between 0 and 100),
  add column if not exists status text not null default 'active' check (status in ('active', 'lost')),
  add column if not exists contact_unlocked boolean not null default false,
  add column if not exists personality_tags text[] not null default '{}',
  add column if not exists motivation text not null default '',
  add column if not exists gender text,
  add column if not exists age int;
```

NPC スキーマは `docs/04_npc_spec.md` および `docs/schemas/npc.schema.yaml` を準拠。

### 新規実装が必要なもの

| 機能 | 新規追加ファイル想定 |
|---|---|
| プレイヤーキャラクター | `lib/player-characters/*`, `app/(app)/player-characters/*` |
| シナリオエンジン | `lib/scenarios/*`, `app/(app)/scenarios/*`, `docs/schemas/scenario.schema.yaml` 準拠 |
| ダイス判定 | `lib/dice/*` |
| アクション選択型 NPC 応答 | `app/api/npc-action/route.ts`（`/api/chat` とは別、`available_actions` から選ばせる）|
| 連絡先・同伴 | `lib/contacts/*`, `app/(app)/contacts/*` |
| エンディングツリー | `lib/endings/*`, `app/(app)/endings/*` |
| 後日談 | `app/api/after-story/route.ts` |
| 成長・アイテム | `lib/growth/*`, `lib/items/*` |

### チャットの分岐

既存 `/api/chat`（自由生成・連絡先 NPC との雑談）は維持。  
シナリオ中の NPC 会話は `/api/npc-action` を新設し、`available_actions` JSON を入力に取り、`{ selected_action, dialogue, emotional_reason }` を返す構造化応答にする（NPC 仕様準拠）。

## 移行手順（推奨）

### Phase 0: 準備（このリポジトリ側）

1. このリポジトリの Next.js を 14 → 16 にアップグレード（または 14 のまま行く判断）
2. 依存追加: `@supabase/ssr`, `@supabase/supabase-js`, `openai`, `lucide-react`, `clsx`
3. `.env.local` テンプレートを ai-character-notebook の `.env.example` から取り込む

### Phase 1: 共通基盤の移植

1. `lib/supabase/*`, `lib/auth/session.ts` をコピー
2. `app/globals.css` の component class をコピー
3. `app/auth/callback/route.ts`, `app/(auth)/login/*` をコピー
4. `app/(app)/layout.tsx`, `components/layout/app-nav.tsx` をベースに採用

### Phase 2: NPC（旧 character）移植 + スキーマ拡張

1. `lib/characters/*` → `lib/npcs/*` にリネームしつつコピー
2. DB マイグレーション: 既存 `001_initial_schema.sql` + `002_add_tts_voice.sql` をベースに、上記カラム追加の SQL を `003_extend_for_trpg.sql` として作成
3. `components/characters/character-form.tsx` → `components/npcs/npc-form.tsx` にリネーム、性格タグ・好感度設定 UI を追加

### Phase 3: チャット + 音声を「連絡先 NPC との会話」モードとして移植

1. `components/chat/chat-client.tsx` をコピーし、URL を `/contacts/[npc_id]/chat` に
2. `app/api/chat/route.ts`, `app/api/transcribe/route.ts`, `app/api/tts/route.ts` をコピー
3. `components/chat/voice-input-button.tsx`, `components/characters/voice-preview-select.tsx` をコピー

### Phase 4: 新規実装

1. プレイヤーキャラクター（仕様準拠）
2. シナリオエンジン（最小 1 本のシナリオでループを完成）
3. ダイス・ロスト・成長
4. 構造化 NPC 応答エンドポイント
5. 連絡先解放・同伴・後日談・エンディングツリー

## 残課題・要決定事項

- NPC テーブルを `characters` 流用にするか新テーブル `npcs` を立てるか
- Next.js 14 のまま行くか 16 にあげるか（ai-character-notebook は 16、本 repo は 14）
- 既存仕様書とコードベースとの整合性チェック（スキーマ命名差異の解消）
- 連絡先と同伴 NPC の保存上限（仕様の未決定事項）

## 参考

- ai-character-notebook の音声機能技術メモ → `docs/チャット引き継ぎ.md`（同 repo 内）
- ai-character-notebook の現状サマリ → `docs/０１３_開発方針変更_TRPG交友システムへの流用.md`
