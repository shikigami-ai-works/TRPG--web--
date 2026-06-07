"use client";

import { useEffect, useMemo, useState } from "react";

import { formatEvidenceCategory } from "@/lib/adventure/evidence";
import { TARGET_SCENARIO_ID } from "@/lib/adventure/labels";
import { advanceAdventureScene, applyAdventureAction, rollAdventureCheck } from "@/lib/adventure/session";
import { buildAdventureViewModel } from "@/lib/adventure/view-model";
import { createInitialState } from "@/lib/scenarios/runtime";
import { toggleCarryOutItem } from "@/lib/scenarios/runtime";
import {
  appendCompletedRunOnce,
  clearActiveRun,
  hasMeaningfulProgress,
  loadActiveRun,
  restoreRuntimeState,
  saveActiveRun,
} from "@/lib/scenarios/storage";
import type { ScenarioPack, ScenarioRuntimeState } from "@/lib/scenarios/types";

interface AdventurePlayerProps {
  packs: ScenarioPack[];
}

type PanelId = "evidence" | "log" | "status";
type SaveStatus = "idle" | "restored" | "saved" | "unavailable";
type EndingRecordStatus = "pending" | "recorded" | "unavailable";

const PANEL_LABELS: Record<PanelId, string> = {
  evidence: "証拠",
  log: "ログ",
  status: "状態",
};

export default function AdventurePlayer({ packs }: AdventurePlayerProps) {
  const pack = useMemo(
    () => packs.find((candidate) => candidate.scenario.id === TARGET_SCENARIO_ID) ?? packs[0],
    [packs],
  );
  const initialState = useMemo(() => (pack ? createInitialState(pack) : createEmptyState()), [pack]);
  const [state, setState] = useState<ScenarioRuntimeState>(() => initialState);
  const [pageIndex, setPageIndex] = useState(0);
  const [activePanel, setActivePanel] = useState<PanelId>("evidence");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [storageReady, setStorageReady] = useState(false);
  const [lastEvent, setLastEvent] = useState("境界の向こう側で目を覚ました。");

  useEffect(() => {
    if (!pack) {
      setStorageReady(false);
      return;
    }
    setStorageReady(false);
    const freshState = createInitialState(pack);
    const savedRun = loadActiveRun(pack.scenario.id);
    setState(savedRun ? restoreRuntimeState(savedRun, freshState) : freshState);
    setPageIndex(0);
    setActivePanel("evidence");
    setDrawerOpen(false);
    setSaveStatus(savedRun ? "restored" : "idle");
    setStorageReady(true);
    setLastEvent("境界の向こう側で目を覚ました。");
  }, [pack]);

  const baseView = pack ? buildAdventureViewModel(pack, state, false) : undefined;
  const textComplete = baseView ? pageIndex >= baseView.textPages.length - 1 : false;
  const view = pack ? buildAdventureViewModel(pack, state, textComplete) : undefined;
  const currentText = view?.textPages[Math.min(pageIndex, view.textPages.length - 1)] ?? "";
  const canAdvanceText = view ? !view.ending && pageIndex < view.textPages.length - 1 : false;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!view) {
        return;
      }
      if (event.key === "Escape" && drawerOpen) {
        setDrawerOpen(false);
        return;
      }
      if ((event.key === "Enter" || event.key === " ") && canAdvanceText && !drawerOpen) {
        event.preventDefault();
        setPageIndex((current) => current + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canAdvanceText, drawerOpen, view]);

  useEffect(() => {
    if (!pack || !storageReady || !state.endingId || state.completedRunId) {
      return;
    }

    const completed = appendCompletedRunOnce(pack, state);
    setState(completed.state);
    setSaveStatus(completed.record ? "saved" : "unavailable");
  }, [pack, state, storageReady]);

  useEffect(() => {
    if (!pack || !storageReady || !hasMeaningfulProgress(state, initialState)) {
      return;
    }

    const saved = saveActiveRun(pack.scenario.id, state);
    setSaveStatus((current) => (current === "restored" ? "restored" : saved ? "saved" : "unavailable"));
  }, [initialState, pack, state, storageReady]);

  if (!pack || !view) {
    return (
      <main className="adv-shell">
        <section className="adv-empty">
          <h1>シナリオが見つからない</h1>
          <p>読み込めるシナリオパックがありません。</p>
        </section>
      </main>
    );
  }

  function handleAdvanceText() {
    if (canAdvanceText) {
      setPageIndex((current) => current + 1);
    }
  }

  function handleChoice(choiceId: string) {
    const choice = view?.visibleChoices.find((candidate) => candidate.id === choiceId);
    if (!choice || !pack || !view) {
      return;
    }

    const result =
      choice.kind === "action" && choice.action
        ? applyAdventureAction(pack, state, view.scene, choice.action)
        : choice.kind === "check" && choice.check
          ? rollAdventureCheck(pack, state, view.scene, choice.check)
          : undefined;

    if (!result) {
      return;
    }

    markRuntimeChangeStarted();
    setState(result.state);
    setLastEvent(result.event);
    if (result.ending) {
      setPageIndex(0);
      setDrawerOpen(false);
    }
  }

  function handleAdvanceScene() {
    if (!pack || !view) {
      return;
    }
    const result = advanceAdventureScene(pack, state);
    markRuntimeChangeStarted();
    setState(result.state);
    setLastEvent(result.event);
    setPageIndex(0);
    if (result.ending) {
      setDrawerOpen(false);
    }
  }

  function handlePanel(panel: PanelId) {
    setActivePanel(panel);
    setDrawerOpen(true);
  }

  function handleRestart() {
    if (!pack) {
      return;
    }
    clearActiveRun(pack.scenario.id);
    setState(createInitialState(pack));
    setPageIndex(0);
    setActivePanel("evidence");
    setDrawerOpen(false);
    setSaveStatus("idle");
    setLastEvent("境界の向こう側で目を覚ました。");
  }

  function handleToggleCarryOut(groupId: string, itemId: string) {
    if (state.endingId) {
      return;
    }
    markRuntimeChangeStarted();
    setState(toggleCarryOutItem(state, groupId, itemId));
  }

  function markRuntimeChangeStarted() {
    setSaveStatus((current) => (current === "restored" ? "idle" : current));
  }

  const hasRuntimeProgress = hasMeaningfulProgress(state, initialState);
  const endingRecordStatus = getEndingRecordStatus(state.completedRunId);

  return (
    <main className="adv-shell" data-ending-id={state.endingId ?? ""} data-save-status={saveStatus} data-scene-id={view.scene.id}>
      <div className="adv-layout">
        <section className="adv-main" aria-label="Adventure player">
          <StatusStrip view={view} />
          <SaveStatusNotice saveStatus={saveStatus} showRestart={hasRuntimeProgress && !view.ending} onRestart={handleRestart} />

          <AdventureStage view={view} />

          {view.ending ? (
            <EndingView onPanel={handlePanel} onRestart={handleRestart} recordStatus={endingRecordStatus} view={view} />
          ) : (
            <section className="adv-text-zone" aria-live="polite">
              <div className="adv-nameplate">{view.npcs[0] ?? "探索者"}</div>
              <p>{currentText}</p>
              <div className="adv-event-row">
                <span>{lastEvent}</span>
                {canAdvanceText ? (
                  <button className="adv-advance-button" onClick={handleAdvanceText} type="button">
                    読み進める
                  </button>
                ) : null}
              </div>
            </section>
          )}

          {!view.ending && textComplete ? (
            <section className="adv-choice-zone" aria-label="選択肢">
              {view.visibleChoices.map((choice) => (
                <button
                  className={choice.danger ? "adv-choice danger" : "adv-choice"}
                  data-choice-id={choice.id}
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  type="button"
                >
                  <span>{choice.label}</span>
                  <small>{choice.typeLabel} / {choice.detail}</small>
                </button>
              ))}
              {view.canAdvanceScene ? (
                <button className="adv-scene-button" data-control="advance-scene" onClick={handleAdvanceScene} type="button">
                  次の場面へ
                </button>
              ) : null}
            </section>
          ) : null}

          <BottomNav activePanel={activePanel} onPanel={handlePanel} />
        </section>

        <DesktopSidePanel activePanel={activePanel} onPanel={setActivePanel} onToggleCarryOut={handleToggleCarryOut} view={view} />
      </div>

      {drawerOpen ? (
        <MobileDrawer
          activePanel={activePanel}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onToggleCarryOut={handleToggleCarryOut}
          view={view}
        />
      ) : null}
    </main>
  );
}

function StatusStrip({ view }: { view: NonNullable<ReturnType<typeof buildAdventureViewModel>> }) {
  return (
    <header className="adv-status-strip">
      <div>
        <span>境界</span>
        <strong>{view.status.contaminationLabel}</strong>
      </div>
      <div>
        <span>記憶</span>
        <strong>{view.status.memoryLabel}</strong>
      </div>
      <div>
        <span>灯</span>
        <strong>{view.status.trustLabel}</strong>
      </div>
      <div>
        <span>証/ログ</span>
        <strong>{view.status.evidenceCount} / {view.status.logCount}</strong>
      </div>
    </header>
  );
}

function AdventureStage({ view }: { view: NonNullable<ReturnType<typeof buildAdventureViewModel>> }) {
  return (
    <section className="adv-stage" data-scene-type={view.scene.scene_type}>
      <div className="adv-stage-bg" />
      <div className="adv-contamination" data-level={view.status.contaminationLabel} />
      <div className="adv-character" aria-hidden="true">
        <div className="adv-character-head" />
        <div className="adv-character-body" />
      </div>
      <div className="adv-stage-caption">
        <span>{view.sceneTypeLabel}</span>
        <strong>{view.ending ? view.ending.title : view.scene.title}</strong>
        <small>
          {view.sceneIndex + 1} / {view.sceneCount}
        </small>
      </div>
    </section>
  );
}

function SaveStatusNotice({
  onRestart,
  saveStatus,
  showRestart,
}: {
  onRestart: () => void;
  saveStatus: SaveStatus;
  showRestart: boolean;
}) {
  if (saveStatus === "idle") {
    return null;
  }

  return (
    <section className="adv-save-notice" data-save-notice={saveStatus} aria-live="polite">
      <span>{formatSaveStatusLabel(saveStatus)}</span>
      {showRestart ? (
        <button onClick={onRestart} type="button">
          最初から
        </button>
      ) : null}
    </section>
  );
}

function EndingView({
  onPanel,
  onRestart,
  recordStatus,
  view,
}: {
  onPanel: (panel: PanelId) => void;
  onRestart: () => void;
  recordStatus: EndingRecordStatus;
  view: NonNullable<ReturnType<typeof buildAdventureViewModel>>;
}) {
  const ending = view.ending;
  if (!ending) {
    return null;
  }

  return (
    <section className="adv-ending-view" aria-label="結末">
      <p className="adv-ending-type">{view.endingTypeLabel}</p>
      <h1>{ending.title}</h1>
      <p>{ending.description}</p>
      {view.endingSummary ? (
        <div className="adv-ending-summary">
          <p>{view.endingSummary.outcomeLabel}</p>
          <p>{view.endingSummary.carryOutLabel}</p>
          <p>{view.endingSummary.inspectionLabel}</p>
        </div>
      ) : null}
      <p className="adv-ending-record" data-ending-record-status={recordStatus}>
        {formatEndingRecordStatusLabel(recordStatus)}
      </p>
      <div className="adv-ending-actions">
        <button className="adv-scene-button" onClick={onRestart} type="button">
          もう一度たどる
        </button>
        <button className="adv-scene-button secondary" onClick={() => onPanel("log")} type="button">
          記録を見る
        </button>
        <button className="adv-scene-button secondary" onClick={() => onPanel("evidence")} type="button">
          手がかりを見る
        </button>
        <button className="adv-scene-button secondary" onClick={() => onPanel("status")} type="button">
          状態を見る
        </button>
      </div>
    </section>
  );
}

function BottomNav({ activePanel, onPanel }: { activePanel: PanelId; onPanel: (panel: PanelId) => void }) {
  return (
    <nav className="adv-bottom-nav" aria-label="調査パネル">
      {(Object.keys(PANEL_LABELS) as PanelId[]).map((panel) => (
        <button
          aria-pressed={activePanel === panel}
          className={activePanel === panel ? "active" : ""}
          key={panel}
          onClick={() => onPanel(panel)}
          type="button"
        >
          {PANEL_LABELS[panel]}
        </button>
      ))}
    </nav>
  );
}

function DesktopSidePanel({
  activePanel,
  onPanel,
  onToggleCarryOut,
  view,
}: {
  activePanel: PanelId;
  onPanel: (panel: PanelId) => void;
  onToggleCarryOut: (groupId: string, itemId: string) => void;
  view: NonNullable<ReturnType<typeof buildAdventureViewModel>>;
}) {
  return (
    <aside className="adv-side-panel" aria-label="調査サイドパネル">
      <div className="adv-panel-tabs">
        {(Object.keys(PANEL_LABELS) as PanelId[]).map((panel) => (
          <button
            aria-pressed={activePanel === panel}
            className={activePanel === panel ? "active" : ""}
            key={panel}
            onClick={() => onPanel(panel)}
            type="button"
          >
            {PANEL_LABELS[panel]}
          </button>
        ))}
      </div>
      <PanelContent activePanel={activePanel} onToggleCarryOut={onToggleCarryOut} view={view} />
    </aside>
  );
}

function MobileDrawer({
  activePanel,
  onClose,
  onToggleCarryOut,
  open,
  view,
}: {
  activePanel: PanelId;
  onClose: () => void;
  onToggleCarryOut: (groupId: string, itemId: string) => void;
  open: boolean;
  view: NonNullable<ReturnType<typeof buildAdventureViewModel>>;
}) {
  return (
    <section className={open ? "adv-mobile-drawer open" : "adv-mobile-drawer"} aria-hidden={!open} aria-label={PANEL_LABELS[activePanel]}>
      <div className="adv-drawer-handle" />
      <div className="adv-drawer-header">
        <strong>{PANEL_LABELS[activePanel]}</strong>
        <button onClick={onClose} type="button">
          閉じる
        </button>
      </div>
      <PanelContent activePanel={activePanel} onToggleCarryOut={onToggleCarryOut} view={view} />
    </section>
  );
}

function PanelContent({
  activePanel,
  onToggleCarryOut,
  view,
}: {
  activePanel: PanelId;
  onToggleCarryOut: (groupId: string, itemId: string) => void;
  view: NonNullable<ReturnType<typeof buildAdventureViewModel>>;
}) {
  if (activePanel === "evidence") {
    return (
      <div className="adv-panel-list">
        {view.evidence.length === 0 ? <p className="adv-muted">まだ整理済みの証拠はない。</p> : null}
        {view.evidence.map((entry) => (
          <article className="adv-evidence" key={entry.id}>
            <div className="adv-evidence-meta">
              <span>{formatEvidenceCategory(entry.category)}</span>
              <small>出どころ: {entry.source}</small>
            </div>
            <strong>{entry.title}</strong>
            <p>{entry.description}</p>
          </article>
        ))}
      </div>
    );
  }

  if (activePanel === "log") {
    return view.log.length === 0 ? (
      <p className="adv-muted">ログはまだない。</p>
    ) : (
      <ol className="adv-log-list">
        {view.logEntries.map((entry) => (
          <li className={`adv-log-entry ${entry.kind}`} key={entry.id}>
            <span className="adv-log-kind">{entry.kindLabel}</span>
            <strong>{entry.text}</strong>
            {entry.detail ? <small>{entry.detail}</small> : null}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="adv-status-detail">
      <dl>
        <div>
          <dt>境界侵食</dt>
          <dd>
            <strong>{view.status.contaminationLabel}</strong>
            <small>侵食値 {view.status.contamination}</small>
          </dd>
        </div>
        <div>
          <dt>記憶</dt>
          <dd>
            <strong>{view.status.memoryLabel}</strong>
          </dd>
        </div>
        <div>
          <dt>灯の信頼</dt>
          <dd>
            <strong>{view.status.trustLabel}</strong>
            <small>信頼値 {view.status.trustValue}</small>
          </dd>
        </div>
        <div>
          <dt>目的</dt>
          <dd>
            <strong>{view.status.objectiveLabel}</strong>
          </dd>
        </div>
        <div>
          <dt>現在地</dt>
          <dd>
            <strong>{view.scene.title}</strong>
          </dd>
        </div>
      </dl>
      {view.carryOutGroups.length ? (
        <section className="adv-carry-out" aria-label="持ち帰り選択">
          <h3>持ち帰り選択</h3>
          {view.carryOutGroups.map((group) => (
            <div className="adv-carry-group" key={group.id}>
              <div className="adv-carry-heading">
                <strong>{group.label}</strong>
                <small>
                  {group.selectedCount}/{group.limit ?? "-"}
                </small>
              </div>
              {group.items.map((item) => (
                <label className="adv-carry-item" key={item.id}>
                  <input
                    checked={item.selected}
                    data-carry-group-id={group.id}
                    data-carry-item-id={item.id}
                    disabled={item.disabled}
                    onChange={() => onToggleCarryOut(group.id, item.id)}
                    type="checkbox"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
              {group.warning ? <p className="adv-warning">{group.warning}</p> : null}
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

function getEndingRecordStatus(completedRunId?: string): EndingRecordStatus {
  if (!completedRunId) {
    return "pending";
  }

  return completedRunId.endsWith(":unpersisted") ? "unavailable" : "recorded";
}

function formatSaveStatusLabel(saveStatus: SaveStatus): string {
  switch (saveStatus) {
    case "restored":
      return "つづきから再開しました";
    case "saved":
      return "保存済み";
    case "unavailable":
      return "この端末では保存できない";
    case "idle":
    default:
      return "";
  }
}

function formatEndingRecordStatusLabel(recordStatus: EndingRecordStatus): string {
  switch (recordStatus) {
    case "recorded":
      return "到達記録に保存しました";
    case "unavailable":
      return "この端末では到達記録を保存できない";
    case "pending":
    default:
      return "到達記録を追加中";
  }
}

function createEmptyState(): ScenarioRuntimeState {
  return {
    sceneId: "",
    flags: {},
    counters: {},
    trust: {},
    inventory: [],
    usedActionIds: [],
    carryOutSelections: {},
    carryOutLimits: {},
    log: [],
  };
}
