"use client";

import { useEffect, useMemo, useState } from "react";

import { formatEvidenceCategory } from "@/lib/adventure/evidence";
import { TARGET_SCENARIO_ID } from "@/lib/adventure/labels";
import { advanceAdventureScene, applyAdventureAction, rollAdventureCheck } from "@/lib/adventure/session";
import { buildAdventureViewModel } from "@/lib/adventure/view-model";
import { createInitialState } from "@/lib/scenarios/runtime";
import type { ScenarioPack, ScenarioRuntimeState } from "@/lib/scenarios/types";

interface AdventurePlayerProps {
  packs: ScenarioPack[];
}

type PanelId = "evidence" | "log" | "status";

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
  const [state, setState] = useState<ScenarioRuntimeState>(() => (pack ? createInitialState(pack) : createEmptyState()));
  const [pageIndex, setPageIndex] = useState(0);
  const [activePanel, setActivePanel] = useState<PanelId>("evidence");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastEvent, setLastEvent] = useState("境界の向こう側で目を覚ました。");
  const [sliceComplete, setSliceComplete] = useState(false);

  useEffect(() => {
    if (!pack) {
      return;
    }
    setState(createInitialState(pack));
    setPageIndex(0);
    setDrawerOpen(false);
    setLastEvent("境界の向こう側で目を覚ました。");
    setSliceComplete(false);
  }, [pack]);

  const baseView = pack ? buildAdventureViewModel(pack, state, false) : undefined;
  const textComplete = baseView ? pageIndex >= baseView.textPages.length - 1 : false;
  const view = pack ? buildAdventureViewModel(pack, state, textComplete) : undefined;
  const currentText = view?.textPages[Math.min(pageIndex, view.textPages.length - 1)] ?? "";
  const canAdvanceText = view ? !sliceComplete && pageIndex < view.textPages.length - 1 : false;

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

    setState(result.state);
    setLastEvent(result.event);
  }

  function handleAdvanceScene() {
    if (!pack || !view) {
      return;
    }
    if (view.isSliceEndScene && !view.canCompleteSlice) {
      setLastEvent("灯が休める時間を作ってから進む。");
      return;
    }
    const result = advanceAdventureScene(pack, state);
    setState(result.state);
    setLastEvent(result.event);
    setPageIndex(0);
    if (result.sliceComplete) {
      setSliceComplete(true);
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
    setState(createInitialState(pack));
    setPageIndex(0);
    setActivePanel("evidence");
    setDrawerOpen(false);
    setLastEvent("境界の向こう側で目を覚ました。");
    setSliceComplete(false);
  }

  return (
    <main className="adv-shell" data-scene-id={view.scene.id}>
      <div className="adv-layout">
        <section className="adv-main" aria-label="Adventure player">
          <StatusStrip view={view} />

          <AdventureStage view={view} sliceComplete={sliceComplete} />

          <section className="adv-text-zone" aria-live="polite">
            <div className="adv-nameplate">{view.npcs[0] ?? "探索者"}</div>
            <p>{sliceComplete ? "灯はようやく息をついた。ここまでの調査記録を閉じる。" : currentText}</p>
            <div className="adv-event-row">
              <span>{lastEvent}</span>
              {canAdvanceText ? (
                <button className="adv-advance-button" onClick={handleAdvanceText} type="button">
                  読み進める
                </button>
              ) : null}
            </div>
          </section>

          {!sliceComplete && textComplete ? (
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
              {!view.isSliceEndScene || view.canCompleteSlice ? (
                <button className="adv-scene-button" data-control="advance-scene" onClick={handleAdvanceScene} type="button">
                  {view.isSliceEndScene ? "記録を閉じる" : "次の場面へ"}
                </button>
              ) : null}
            </section>
          ) : null}

          {sliceComplete ? (
            <section className="adv-choice-zone" aria-label="調査記録完了">
              <button className="adv-scene-button" onClick={handleRestart} type="button">
                最初から
              </button>
            </section>
          ) : null}

          <BottomNav activePanel={activePanel} onPanel={handlePanel} />
        </section>

        <DesktopSidePanel activePanel={activePanel} onPanel={setActivePanel} view={view} />
      </div>

      {drawerOpen ? <MobileDrawer activePanel={activePanel} open={drawerOpen} onClose={() => setDrawerOpen(false)} view={view} /> : null}
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

function AdventureStage({
  sliceComplete,
  view,
}: {
  sliceComplete: boolean;
  view: NonNullable<ReturnType<typeof buildAdventureViewModel>>;
}) {
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
        <strong>{sliceComplete ? "調査記録を閉じた" : view.scene.title}</strong>
        <small>
          {Math.min(view.sceneIndex + 1, 3)} / 3
        </small>
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
  view,
}: {
  activePanel: PanelId;
  onPanel: (panel: PanelId) => void;
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
      <PanelContent activePanel={activePanel} view={view} />
    </aside>
  );
}

function MobileDrawer({
  activePanel,
  onClose,
  open,
  view,
}: {
  activePanel: PanelId;
  onClose: () => void;
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
      <PanelContent activePanel={activePanel} view={view} />
    </section>
  );
}

function PanelContent({
  activePanel,
  view,
}: {
  activePanel: PanelId;
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
    </div>
  );
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
