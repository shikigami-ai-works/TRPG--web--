"use client";

import { useEffect, useMemo, useState } from "react";

import {
  applyStateChanges,
  canUseRequirements,
  createInitialState,
  evaluateRequirement,
  evaluateShortcut,
  getCarryOutGroups,
  groupOwnedItems,
  resolveEnding,
  toggleCarryOutItem,
} from "@/lib/scenarios/runtime";
import {
  appendCompletedRun,
  clearActiveRun,
  getReachedEndings,
  hasMeaningfulProgress,
  loadActiveRun,
  loadRunHistory,
  restoreRuntimeState,
  saveActiveRun,
  type CompletedRunRecord,
  type SavedRunState,
} from "@/lib/scenarios/storage";
import type {
  CheckOutcome,
  EndingDefinition,
  ScenarioPack,
  ScenarioRuntimeState,
  SceneActionDefinition,
  SceneCheckDefinition,
} from "@/lib/scenarios/types";

interface ScenarioExplorerProps {
  packs: ScenarioPack[];
}

export default function ScenarioExplorer({ packs }: ScenarioExplorerProps) {
  const initialPack = packs[0];
  const [packId, setPackId] = useState(initialPack?.scenario.id ?? "");
  const pack = packs.find((candidate) => candidate.scenario.id === packId) ?? initialPack;
  const scenarioId = pack?.scenario.id ?? "";
  const [state, setState] = useState<ScenarioRuntimeState>(() =>
    initialPack
      ? createInitialState(initialPack)
      : {
          sceneId: "",
          flags: {},
          counters: {},
          trust: {},
          inventory: [],
          usedActionIds: [],
          carryOutSelections: {},
          carryOutLimits: {},
          log: [],
        },
  );
  const [savedRun, setSavedRun] = useState<SavedRunState | null>(null);
  const [history, setHistory] = useState<CompletedRunRecord[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    if (!scenarioId) {
      setSavedRun(null);
      setHistory([]);
      setStorageReady(false);
      return;
    }

    setSavedRun(loadActiveRun(scenarioId));
    setHistory(loadRunHistory(scenarioId));
    setStorageReady(true);
  }, [scenarioId]);

  useEffect(() => {
    if (!pack || !state.endingId || state.completedRunId) {
      return;
    }

    const ending = pack.endings.find((candidate) => candidate.id === state.endingId);
    if (!ending) {
      return;
    }

    const completed = appendCompletedRun(pack, state, ending);
    if (completed) {
      setHistory(loadRunHistory(pack.scenario.id));
    }
    setState({
      ...state,
      completedRunId: completed?.runId ?? `${pack.scenario.id}:${ending.id}:unpersisted`,
    });
  }, [pack, state]);

  useEffect(() => {
    if (!pack || !storageReady) {
      return;
    }

    const initialState = createInitialState(pack);
    if (!hasMeaningfulProgress(state, initialState)) {
      return;
    }

    const saved = saveActiveRun(pack.scenario.id, state);
    if (saved) {
      setSavedRun(saved);
    }
  }, [pack, state, storageReady]);

  function switchPack(nextPackId: string) {
    const nextPack = packs.find((candidate) => candidate.scenario.id === nextPackId);
    if (!nextPack) {
      return;
    }
    setStorageReady(false);
    setSavedRun(null);
    setHistory([]);
    setPackId(nextPackId);
    setState(createInitialState(nextPack));
  }

  function resumeSavedRun() {
    if (!pack || !savedRun || savedRun.scenarioId !== pack.scenario.id) {
      return;
    }
    setState(restoreRuntimeState(savedRun, createInitialState(pack)));
  }

  function startFreshRun() {
    if (!pack) {
      return;
    }
    clearActiveRun(pack.scenario.id);
    setSavedRun(null);
    setState(createInitialState(pack));
  }

  if (!pack) {
    return (
      <main className="shell">
        <section className="surface empty-state">
          <h1>シナリオが見つかりません</h1>
          <p>`scenarios/` にデータパックを追加すると、ここに表示されます。</p>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <aside className="scenario-list surface">
        <p className="eyebrow">Scenario Packs</p>
        <h1>TRPG Web MVP</h1>
        <div className="scenario-buttons">
          {packs.map((candidate) => (
            <button
              className={candidate.scenario.id === pack.scenario.id ? "scenario-button active" : "scenario-button"}
              key={candidate.scenario.id}
              onClick={() => switchPack(candidate.scenario.id)}
              type="button"
            >
              <span>{candidate.scenario.title}</span>
              <small>{candidate.scenario.ruleset_id}</small>
            </button>
          ))}
        </div>
      </aside>

      <ScenarioWorkspace
        history={history}
        onResumeSavedRun={resumeSavedRun}
        onStartFreshRun={startFreshRun}
        pack={pack}
        savedRun={savedRun}
        state={state}
        storageReady={storageReady}
        setState={setState}
      />
    </main>
  );
}

function ScenarioWorkspace({
  history,
  onResumeSavedRun,
  onStartFreshRun,
  pack,
  savedRun,
  state,
  storageReady,
  setState,
}: {
  history: CompletedRunRecord[];
  onResumeSavedRun: () => void;
  onStartFreshRun: () => void;
  pack: ScenarioPack;
  savedRun: SavedRunState | null;
  state: ScenarioRuntimeState;
  storageReady: boolean;
  setState: (state: ScenarioRuntimeState) => void;
}) {
  const scene = pack.scenes.find((candidate) => candidate.id === state.sceneId) ?? pack.scenes[0];
  const ending = state.endingId ? pack.endings.find((candidate) => candidate.id === state.endingId) : undefined;
  const sceneNpcs = (scene?.npc_ids ?? [])
    .map((npcId) => pack.npcs.find((npc) => npc.id === npcId))
    .filter(Boolean);

  const itemById = useMemo(() => new Map(pack.items.map((item) => [item.id, item])), [pack.items]);
  const npcById = useMemo(() => new Map(pack.npcs.map((npc) => [npc.id, npc])), [pack.npcs]);

  function resetRun() {
    onStartFreshRun();
  }

  function useAction(action: SceneActionDefinition) {
    if (action.once_per_run && state.usedActionIds.includes(action.id)) {
      return;
    }
    if (!canUseRequirements(action.requirements, state, pack)) {
      return;
    }

    let next = applyStateChanges(state, action.state_changes, pack);
    next = {
      ...next,
      lastChoiceId: action.id,
      usedActionIds: action.once_per_run ? [...next.usedActionIds, action.id] : next.usedActionIds,
      log: [`${scene.title}: ${action.label}`, ...next.log].slice(0, 12),
    };

    if (action.type === "ending_choice") {
      const resolved = resolveBySceneRules(pack, scene.id, next, action.id);
      if (resolved) {
        next = { ...next, endingId: resolved.id, log: [`エンディング判定: ${resolved.title}`, ...next.log].slice(0, 12) };
      }
    }

    setState(next);
  }

  function useCheck(check: SceneCheckDefinition, branch: "success" | "failure") {
    if (!canUseRequirements(check.requirements, state, pack)) {
      return;
    }
    const outcome = check[branch];
    const next = applyStateChanges(state, outcome, pack);
    const resultLabel = branch === "success" ? "成功" : "失敗";
    setState({
      ...next,
      log: [`${check.label}: ${resultLabel}${outcome?.reveal_text ? ` / ${outcome.reveal_text}` : ""}`, ...next.log].slice(0, 12),
    });
  }

  function advanceScene() {
    const current = pack.scenes.find((candidate) => candidate.id === state.sceneId);
    if (!current) {
      return;
    }

    const nonDefaultRules = (current.next_scene_rules ?? []).filter((rule) => rule.condition !== "default");
    for (const rule of nonDefaultRules) {
      if (!evaluateRequirement(rule.condition, state, pack)) {
        continue;
      }
      if (rule.next_scene_id) {
        setState({ ...state, sceneId: rule.next_scene_id, lastChoiceId: undefined });
        return;
      }
      if (rule.ending_id) {
        setState({ ...state, endingId: rule.ending_id });
        return;
      }
      if (rule.resolve_ending) {
        const resolved = resolveEnding(pack, state);
        if (resolved) {
          setState({ ...state, endingId: resolved.id });
          return;
        }
      }
    }

    const defaultRule = (current.next_scene_rules ?? []).find((rule) => rule.condition === "default");
    if (defaultRule?.next_scene_id) {
      setState({ ...state, sceneId: defaultRule.next_scene_id, lastChoiceId: undefined });
    } else if (defaultRule?.ending_id) {
      setState({ ...state, endingId: defaultRule.ending_id });
    }
  }

  function toggleCarry(groupId: string, itemId: string) {
    setState(toggleCarryOutItem(state, groupId, itemId));
  }

  return (
    <section className="workspace" data-ending-id={state.endingId ?? ""} data-scene-id={state.sceneId}>
      <header className="surface scenario-header">
        <div>
          <p className="eyebrow">{pack.directory}</p>
          <h2>{pack.scenario.title}</h2>
          <p>{pack.scenario.summary}</p>
        </div>
        <button className="secondary-button" data-control="reset-run" onClick={resetRun} type="button">
          リセット
        </button>
      </header>

      <div className="dashboard-grid">
        <section className="surface status-panel">
          <h3>状態</h3>
          <MetricList title="信頼度" values={formatTrust(state, npcById)} />
          <MetricList title="カウンター" values={formatCounters(state)} />
          <TagList title="所持品" values={state.inventory.map((itemId) => itemById.get(itemId)?.name ?? itemId)} />
          <TagList title="有効フラグ" values={Object.entries(state.flags).filter(([, value]) => value).map(([flag]) => flag)} />
        </section>

        <section className="surface scene-panel">
          {ending ? (
            <EndingView ending={ending} />
          ) : (
            <>
              <div className="scene-heading">
                <div>
                  <p className="eyebrow">{scene.scene_type}</p>
                  <h3>{scene.title}</h3>
                </div>
                <button className="primary-button" data-control="advance-scene" onClick={advanceScene} type="button">
                  進行
                </button>
              </div>
              <p className="scene-description">{scene.description}</p>
              <TagList title="登場NPC" values={sceneNpcs.map((npc) => npc?.name ?? "")} />
              <ActionList actions={scene.available_actions ?? []} pack={pack} state={state} onUseAction={useAction} />
              <CheckList checks={scene.checks ?? []} pack={pack} state={state} onUseCheck={useCheck} />
            </>
          )}
        </section>

        <SaveHistoryPanel
          history={history}
          onResumeSavedRun={onResumeSavedRun}
          onStartFreshRun={onStartFreshRun}
          savedRun={savedRun}
          storageReady={storageReady}
        />

        <section className="surface carry-panel">
          <h3>持ち帰り選択</h3>
          <CarryOutGroups pack={pack} state={state} onToggle={toggleCarry} />
        </section>

        <section className="surface log-panel">
          <h3>ログ</h3>
          <ol>
            {state.log.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}

function SaveHistoryPanel({
  history,
  onResumeSavedRun,
  onStartFreshRun,
  savedRun,
  storageReady,
}: {
  history: CompletedRunRecord[];
  onResumeSavedRun: () => void;
  onStartFreshRun: () => void;
  savedRun: SavedRunState | null;
  storageReady: boolean;
}) {
  const reachedEndings = getReachedEndings(history);
  const recentRuns = history.slice(0, 5);
  const saveStatus = storageReady ? (savedRun ? "保存済みランあり" : "保存済みランなし") : "確認中";

  return (
    <section className="surface save-panel" data-saved-run={savedRun ? "true" : "false"} data-storage-ready={storageReady ? "true" : "false"}>
      <div className="save-panel-header">
        <div>
          <h3>セーブ / 履歴</h3>
          <p className="muted">{saveStatus}</p>
        </div>
        <span className={savedRun ? "save-indicator saved" : "save-indicator"}>{savedRun ? "保存済み" : "未保存"}</span>
      </div>

      <div className="save-detail">
        <span>最終保存</span>
        <strong>{savedRun ? formatDateTime(savedRun.updatedAt) : "なし"}</strong>
      </div>

      <div className="save-actions">
        <button className="primary-button" data-control="resume-run" disabled={!savedRun} onClick={onResumeSavedRun} type="button">
          再開
        </button>
        <button className="secondary-button" data-control="start-fresh-run" onClick={onStartFreshRun} type="button">
          最初から
        </button>
      </div>

      <TagList
        title="到達済みエンディング"
        values={reachedEndings.map((ending) => `${ending.endingTitle} / ${ending.endingType}${ending.count > 1 ? ` x${ending.count}` : ""}`)}
      />

      <div className="metric-block">
        <h4>最近のラン履歴</h4>
        {recentRuns.length === 0 ? (
          <p className="muted">なし</p>
        ) : (
          <ol className="history-list">
            {recentRuns.map((run) => (
              <li key={run.runId}>
                <strong>{run.endingTitle}</strong>
                <small>
                  {run.endingType} / {formatDateTime(run.completedAt)}
                </small>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

function ActionList({
  actions,
  pack,
  state,
  onUseAction,
}: {
  actions: SceneActionDefinition[];
  pack: ScenarioPack;
  state: ScenarioRuntimeState;
  onUseAction: (action: SceneActionDefinition) => void;
}) {
  const playableActions = actions.filter((action) => action.type !== "check");

  return (
    <div className="action-group">
      <h4>選択肢</h4>
      <div className="button-grid">
        {playableActions.length === 0 ? <p className="muted">ここでは判定を使います。</p> : null}
        {playableActions.map((action) => {
          const used = action.once_per_run && state.usedActionIds.includes(action.id);
          const disabled = used || !canUseRequirements(action.requirements, state, pack);
          return (
            <button
              className={action.type === "ending_choice" ? "choice-button ending-choice" : "choice-button"}
              data-action-id={action.id}
              disabled={disabled}
              key={action.id}
              onClick={() => onUseAction(action)}
              type="button"
            >
              <span>{action.label}</span>
              <small>{used ? "使用済み" : action.type}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckList({
  checks,
  pack,
  state,
  onUseCheck,
}: {
  checks: SceneCheckDefinition[];
  pack: ScenarioPack;
  state: ScenarioRuntimeState;
  onUseCheck: (check: SceneCheckDefinition, branch: "success" | "failure") => void;
}) {
  if (checks.length === 0) {
    return null;
  }

  return (
    <div className="action-group">
      <h4>判定</h4>
      <div className="check-list">
        {checks.map((check) => {
          const disabled = !canUseRequirements(check.requirements, state, pack);
          return (
            <div className="check-row" key={check.id}>
              <div>
                <strong>{check.label}</strong>
                <small>
                  {check.skill_or_art} / 目標 {check.target_number}
                </small>
              </div>
              <div className="check-buttons">
                <button data-check-branch="success" data-check-id={check.id} disabled={disabled} onClick={() => onUseCheck(check, "success")} type="button">
                  成功
                </button>
                <button data-check-branch="failure" data-check-id={check.id} disabled={disabled} onClick={() => onUseCheck(check, "failure")} type="button">
                  失敗
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CarryOutGroups({
  pack,
  state,
  onToggle,
}: {
  pack: ScenarioPack;
  state: ScenarioRuntimeState;
  onToggle: (groupId: string, itemId: string) => void;
}) {
  const groups = getCarryOutGroups(pack);
  if (groups.length === 0) {
    return <p className="muted">持ち帰りグループなし</p>;
  }

  return (
    <div className="carry-groups">
      {groups.map((group) => {
        const owned = groupOwnedItems(pack, state, group.id);
        const selected = state.carryOutSelections[group.id] ?? [];
        const limit = state.carryOutLimits[group.id] ?? group.max_count_at_clear;
        return (
          <div className="carry-group" key={group.id}>
            <div className="carry-group-header">
              <strong>{group.id}</strong>
              <small>
                {selected.length}/{limit ?? "-"}
              </small>
            </div>
            {owned.length === 0 ? (
              <p className="muted">対象アイテム未入手</p>
            ) : (
              owned.map((itemId) => {
                const item = pack.items.find((candidate) => candidate.id === itemId);
                return (
                  <label className="carry-item" key={itemId}>
                    <input
                      checked={selected.includes(itemId)}
                      data-carry-group-id={group.id}
                      data-carry-item-id={itemId}
                      disabled={Boolean(state.endingId)}
                      onChange={() => onToggle(group.id, itemId)}
                      type="checkbox"
                    />
                    <span>{item?.name ?? itemId}</span>
                  </label>
                );
              })
            )}
            {limit !== undefined && selected.length > limit ? (
              <p className="warning">制限超過中。エンディング判定に影響します。</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function MetricList({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="metric-block">
      <h4>{title}</h4>
      {values.length === 0 ? <p className="muted">なし</p> : values.map((value) => <p key={value}>{value}</p>)}
    </div>
  );
}

function TagList({ title, values }: { title: string; values: string[] }) {
  const filtered = values.filter(Boolean);
  return (
    <div className="metric-block">
      <h4>{title}</h4>
      {filtered.length === 0 ? (
        <p className="muted">なし</p>
      ) : (
        <div className="tags">
          {filtered.map((value) => (
            <span key={value}>{value}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function EndingView({ ending }: { ending: EndingDefinition }) {
  return (
    <div className="ending-view">
      <p className="eyebrow">{ending.ending_type}</p>
      <h3>{ending.title}</h3>
      <p>{ending.description}</p>
      {ending.unlocks?.length ? (
        <div className="metric-block">
          <h4>解禁</h4>
          <div className="tags">
            {ending.unlocks.map((unlock) => (
              <span key={unlock}>{unlock}</span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function resolveBySceneRules(
  pack: ScenarioPack,
  sceneId: string,
  state: ScenarioRuntimeState,
  actionId: string,
): EndingDefinition | undefined {
  const scene = pack.scenes.find((candidate) => candidate.id === sceneId);
  const rule = (scene?.next_scene_rules ?? []).find(
    (candidate) => candidate.resolve_ending && typeof candidate.condition === "string" && evaluateShortcut(candidate.condition, { ...state, lastChoiceId: actionId }, pack, false),
  );
  return rule ? resolveEnding(pack, state) : undefined;
}

function formatTrust(state: ScenarioRuntimeState, npcById: Map<string, { name: string }>): string[] {
  return Object.entries(state.trust).map(([npcId, value]) => `${npcById.get(npcId)?.name ?? npcId}: ${value}`);
}

function formatCounters(state: ScenarioRuntimeState): string[] {
  return Object.entries(state.counters).map(([counter, value]) => `${counter}: ${value}`);
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
