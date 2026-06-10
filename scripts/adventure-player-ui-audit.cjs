const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");

const repoDir = process.cwd();
const runtimeDir = path.join(repoDir, ".runtime");
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const appPort = getPort("ADVENTURE_AUDIT_APP_PORT", 4300 + Math.floor(Math.random() * 500));
const browserPort = getPort("ADVENTURE_AUDIT_BROWSER_PORT", 11300 + Math.floor(Math.random() * 500));
const appUrl = `http://127.0.0.1:${appPort}`;
const browserOrigin = `http://127.0.0.1:${browserPort}`;
const outDir = path.join(runtimeDir, `adventure-player-ui-audit-${stamp}`);
const resultPath = path.join(outDir, "audit.json");
const reportPath = path.join(outDir, "audit.md");
const serverLogPath = path.join(outDir, "server.log");
const screenshotDir = path.join(outDir, "screens");
const browserProfileDir = path.join(outDir, "browser-profile");

const scenarioId = "kimidake_ga_oboeteiru_jiko";
const activeRunKey = `trpg-web:v1:active-run:${scenarioId}`;
const historyKey = "trpg-web:v1:run-history";
const completedAt = "2026-06-07T10:00:00.000Z";
const completedRunId = "stage16-6-audit-run";

const browserCandidates = [
  process.env.ADVENTURE_AUDIT_BROWSER,
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
].filter(Boolean);

const browserPath = browserCandidates.find((candidate) => fs.existsSync(candidate));

const completedRun = {
  version: 1,
  runId: completedRunId,
  scenarioId,
  scenarioTitle: "Audit scenario",
  endingId: "return_with_akari",
  endingTitle: "Audit ending",
  endingType: "true",
  completedAt,
  finalTrust: { minase_akari: 85 },
  finalCounters: { boundary_contamination: 1 },
  finalInventory: ["boundary_ember"],
  carryOutSelections: { four_room_artifact: ["boundary_ember"] },
  unlocks: ["npc_memory_fragment"],
  rewards: [{ id: "audit_memory_fragment", type: "memory_fragment" }],
};

const endedActiveRun = {
  version: 1,
  scenarioId,
  sceneId: "scene_007_return_fire",
  flags: {
    noticed_parallel_displacement: true,
    said_not_replacement: true,
    akari_regret_spoken: true,
    gift_respected_unopened: true,
    akari_rested_in_empty_house: true,
    dead_friend_home_respected: true,
    confirmed_empty_house_identity: true,
    regret_resolved: true,
    shared_guilt: true,
  },
  counters: { boundary_contamination: 1, four_room_artifacts_carried_out: 1 },
  trust: { minase_akari: 85 },
  inventory: ["boundary_ember"],
  usedActionIds: [
    "say_not_replacement",
    "let_akari_speak_regret",
    "respect_gift_unopened",
    "let_akari_rest_in_empty_house",
    "respect_dead_friend_home",
    "burn_keepsakes_as_farewell",
    "choose_return_with_akari",
  ],
  carryOutSelections: { four_room_artifact: ["boundary_ember"] },
  carryOutLimits: { four_room_artifact: 1 },
  lastChoiceId: "choose_return_with_akari",
  endingId: "return_with_akari",
  completedRunId,
  log: [],
  updatedAt: completedAt,
};

const forbiddenPlayerTextTokens = [
  "return_with_akari",
  "return_without_akari",
  "stay_with_akari",
  "boundary_collapse",
  "minase_akari",
  "boundary_ember",
  "empty_nameplate",
  "four_room_artifact",
  "four_room_artifacts_carried_out",
  "boundary_contamination",
  "regret_resolved",
  "shared_guilt",
  "gift_respected_unopened",
  "ritual_reproduced",
  "unlock_conditions",
  "ending_resolution_order",
  "resolve_ending",
  "visible_before_unlock",
  "route_hint",
  "trust >=",
  "counter:",
  "flag:",
  "reward_",
  "memory_fragment",
  "relationship_asset",
  "active_contact_record",
  "memory_contact_trace",
  "shared_boundary_record",
  "lost_relationship_trace",
  "sourceRunId",
  "sourceEndingId",
  "completedRunId",
  "攻略報酬",
  "入手したNPC",
  "所有",
  "いつでも話せる",
  "AI灯",
  "AIチャット",
  "AI会話",
  "チャット",
  "メッセンジャー",
  "メッセージ",
  "送信",
  "返信",
  "通知",
  "未読",
  "AI chat",
  "free chat",
  "messenger",
];

const forbiddenRelationshipCopyTokens = forbiddenPlayerTextTokens.filter(
  (token) =>
    ![
      "active_contact_record",
      "memory_contact_trace",
      "shared_boundary_record",
      "lost_relationship_trace",
      "sourceRunId",
      "sourceEndingId",
      "completedRunId",
    ].includes(token),
);

fs.mkdirSync(screenshotDir, { recursive: true });
fs.writeFileSync(serverLogPath, "");

function getPort(envName, fallback) {
  const value = Number(process.env[envName]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function appendServerLog(chunk) {
  fs.appendFileSync(serverLogPath, chunk.toString());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function httpOk(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(1500, () => {
      req.destroy(new Error(`Timed out fetching ${url}`));
    });
  });
}

async function waitFor(predicate, timeoutMs, label) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await predicate()) {
      return;
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

class CdpClient {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];

    ws.addEventListener("message", (event) => {
      const raw = typeof event.data === "string" ? event.data : event.data.toString();
      const message = JSON.parse(raw);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject, timer } = this.pending.get(message.id);
        clearTimeout(timer);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result ?? {});
        }
        return;
      }
      this.events.push(message);
    });
  }

  static connect(wsUrl) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      ws.addEventListener("open", () => resolve(new CdpClient(ws)));
      ws.addEventListener("error", reject);
    });
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP command timed out: ${method}`));
        }
      }, 15000);
      this.pending.set(id, { resolve, reject, timer });
    });
  }

  close() {
    this.ws.close();
  }
}

async function evaluate(cdp, expression, awaitPromise = true) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
    userGesture: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || JSON.stringify(result.exceptionDetails));
  }
  return result.result?.value;
}

async function setViewport(cdp, width, height) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 800,
  });
}

async function navigateAndWait(cdp, url, selector) {
  await cdp.send("Page.navigate", { url });
  await waitFor(
    async () =>
      Boolean(
        await evaluate(
          cdp,
          `document.readyState === "complete" && Boolean(document.querySelector(${JSON.stringify(selector)}))`,
          false,
        ),
      ),
    30000,
    `${url} ${selector}`,
  );
  await sleep(500);
}

async function reloadAndWait(cdp, selector) {
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(
    async () =>
      Boolean(
        await evaluate(
          cdp,
          `document.readyState === "complete" && Boolean(document.querySelector(${JSON.stringify(selector)}))`,
          false,
        ),
      ),
    30000,
    `reload ${selector}`,
  );
  await sleep(500);
}

async function capture(cdp, name) {
  const shot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
  });
  const filePath = path.join(screenshotDir, name);
  fs.writeFileSync(filePath, Buffer.from(shot.data, "base64"));
  return filePath;
}

async function seedPostEnding(cdp) {
  await evaluate(
    cdp,
    `(() => {
      localStorage.clear();
      localStorage.setItem(${JSON.stringify(activeRunKey)}, ${JSON.stringify(JSON.stringify(endedActiveRun))});
      localStorage.setItem(${JSON.stringify(historyKey)}, ${JSON.stringify(JSON.stringify([completedRun]))});
      return true;
    })()`,
  );
}

async function collectState(cdp, label) {
  return evaluate(
    cdp,
    `(() => {
      const controlSelector = "button, a, input, select, textarea, [role='button'], [tabindex]";
      const text = (element) => (element?.innerText || element?.textContent || "").replace(/\\s+/g, " ").trim();
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const disabled = (element) =>
        ("disabled" in element && Boolean(element.disabled)) || element.getAttribute("aria-disabled") === "true";
      const controlKey = (element, index) => {
        const tag = element.tagName.toLowerCase();
        const label = text(element) || element.getAttribute("aria-label") || element.getAttribute("title") || "";
        if (element.closest(".adv-ending-actions")) return "post-ending:" + label;
        if (element.classList.contains("adv-advance-button")) return "story:advance-text";
        if (element.getAttribute("data-control")) return "story:" + element.getAttribute("data-control");
        if (element.getAttribute("data-choice-id")) return "choice:" + element.getAttribute("data-choice-id");
        if (element.closest(".adv-bottom-nav")) return "bottom-nav:" + label;
        if (element.closest(".adv-panel-tabs")) return "desktop-panel:" + label;
        if (element.closest(".adv-drawer-header")) return "drawer:" + label;
        if (element.closest(".adv-save-notice")) return "save-notice:" + label;
        if (element.getAttribute("data-carry-item-id")) return "carry-out:" + element.getAttribute("data-carry-item-id");
        if (element.closest(".shell")) return "debug:" + label;
        return tag + ":" + label + ":" + index;
      };
      const parseJson = (value, fallback) => {
        try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
      };
      const controls = Array.from(document.querySelectorAll(controlSelector))
        .filter(visible)
        .map((element, index) => ({
          index,
          tag: element.tagName.toLowerCase(),
          key: controlKey(element, index),
          text: text(element),
          role: element.getAttribute("role") || "",
          tabIndex: element.getAttribute("tabindex") || "",
          ariaLabel: element.getAttribute("aria-label") || "",
          href: element instanceof HTMLAnchorElement ? element.getAttribute("href") || "" : "",
          disabled: disabled(element),
          dataChoiceId: element.getAttribute("data-choice-id") || "",
          dataControl: element.getAttribute("data-control") || "",
          dataCarryItemId: element.getAttribute("data-carry-item-id") || "",
          ariaPressed: element.getAttribute("aria-pressed") || "",
          className: typeof element.className === "string" ? element.className : "",
        }));
      const bodyText = text(document.body);
      const relationshipContactCard = document.querySelector("[data-relationship-contact-category]");
      const relationshipContactControls = relationshipContactCard
        ? Array.from(relationshipContactCard.querySelectorAll(controlSelector)).filter(visible)
        : [];
      return {
        label: ${JSON.stringify(label)},
        url: location.href,
        title: document.title,
        bodyText,
        hasAdventureShell: Boolean(document.querySelector(".adv-shell")),
        hasScenarioExplorerShell: Boolean(document.querySelector(".shell")),
        sceneId: document.querySelector("[data-scene-id]")?.getAttribute("data-scene-id") || "",
        endingId: document.querySelector(".adv-shell")?.getAttribute("data-ending-id") || "",
        saveStatus: document.querySelector(".adv-shell")?.getAttribute("data-save-status") || "",
        endingRecordStatus: document.querySelector("[data-ending-record-status]")?.getAttribute("data-ending-record-status") || "",
        hasEndingView: Boolean(document.querySelector(".adv-ending-view")),
        hasProgressSheet: Boolean(document.querySelector("[data-ending-progress-state]")),
        progressEntries: Array.from(document.querySelectorAll("[data-ending-progress-state]")).map((element) => ({
          endingId: element.getAttribute("data-ending-progress-id") || "",
          state: element.getAttribute("data-ending-progress-state") || "",
          current: element.getAttribute("data-current-ending") || "",
        })),
        replayHintFamilies: Array.from(document.querySelectorAll("[data-replay-hint-family]")).map((element) =>
          element.getAttribute("data-replay-hint-family") || ""
        ),
        relationshipContactVisible: Boolean(relationshipContactCard && visible(relationshipContactCard)),
        relationshipContactCategory: relationshipContactCard?.getAttribute("data-relationship-contact-category") || "",
        relationshipContactText: text(relationshipContactCard),
        relationshipContactControlCount: relationshipContactControls.filter((element) => !disabled(element)).length,
        relationshipContactFocusableCount: relationshipContactControls.length,
        postEndingActionCount: document.querySelectorAll(".adv-ending-actions button").length,
        drawerOpen: Boolean(document.querySelector(".adv-mobile-drawer.open")),
        drawerText: text(document.querySelector(".adv-mobile-drawer.open")),
        activeDrawerLabel: text(document.querySelector(".adv-mobile-drawer.open .adv-drawer-header strong")),
        activeBottomPanelLabel: text(document.querySelector(".adv-bottom-nav button.active")),
        activeDesktopPanelLabel: text(document.querySelector(".adv-panel-tabs button.active")),
        desktopPanelText: text(document.querySelector(".adv-side-panel")),
        hasLogDrawerContent: Boolean(document.querySelector(".adv-mobile-drawer.open .adv-log-list, .adv-mobile-drawer.open .adv-muted")),
        hasEvidenceDrawerContent: Boolean(document.querySelector(".adv-mobile-drawer.open .adv-panel-list")),
        hasStatusDrawerContent: Boolean(document.querySelector(".adv-mobile-drawer.open .adv-status-detail")),
        activeRun: parseJson(localStorage.getItem(${JSON.stringify(activeRunKey)}), null),
        history: parseJson(localStorage.getItem(${JSON.stringify(historyKey)}), []),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        controls,
        enabledControls: controls.filter((control) => !control.disabled),
        placeholderControls: controls.filter((control) =>
          control.href === "#" ||
          control.href.toLowerCase().startsWith("javascript:") ||
          (!control.disabled && control.tag === "a" && !control.href)
        ),
      };
    })()`,
  );
}

async function clickIndexedControl(cdp, selector, index, label) {
  const target = await evaluate(
    cdp,
    `(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const disabled = (element) =>
        ("disabled" in element && Boolean(element.disabled)) || element.getAttribute("aria-disabled") === "true";
      const element = Array.from(document.querySelectorAll(${JSON.stringify(selector)})).filter(visible)[${index}];
      if (!element) return { clicked: false, reason: "missing" };
      if (disabled(element)) return { clicked: false, reason: "disabled" };
      element.scrollIntoView({ block: "center", inline: "center" });
      const rect = element.getBoundingClientRect();
      return {
        clicked: true,
        text: (element.innerText || element.textContent || "").replace(/\\s+/g, " ").trim(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    })()`,
  );
  if (!target.clicked) {
    throw new Error(`${label} failed: ${target.reason}`);
  }
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: target.x, y: target.y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: target.x, y: target.y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: target.x, y: target.y, button: "left", clickCount: 1 });
  await sleep(400);
  return target;
}

async function clickControl(cdp, selector, label) {
  return clickIndexedControl(cdp, selector, 0, label);
}

async function clickControlByText(cdp, selector, expectedText, label) {
  const index = await evaluate(
    cdp,
    `(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      return Array.from(document.querySelectorAll(${JSON.stringify(selector)}))
        .filter(visible)
        .findIndex((element) => ((element.innerText || element.textContent || "").replace(/\\s+/g, " ").trim()) === ${JSON.stringify(
          expectedText,
        )});
    })()`,
  );
  if (index < 0) {
    throw new Error(`${label} failed: visible control ${expectedText} missing`);
  }
  return clickIndexedControl(cdp, selector, index, label);
}

async function clickEndingAction(cdp, index, label) {
  return clickIndexedControl(cdp, ".adv-ending-actions button", index, `post-ending action ${label}`);
}

async function closeDrawer(cdp, label) {
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await waitFor(async () => !(await collectState(cdp, `wait-close-${label}`)).drawerOpen, 5000, `close drawer after ${label}`);
}

async function closeDrawerWithButton(cdp, result, label) {
  await clickControl(cdp, ".adv-drawer-header button", `close drawer ${label}`);
  await waitFor(async () => !(await collectState(cdp, `wait-close-button-${label}`)).drawerOpen, 5000, `close drawer button after ${label}`);
  recordInteraction(result, "drawer:閉じる", "drawer close button", "Drawer closes", "pass");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNoHorizontalOverflow(state) {
  assert(
    state.scrollWidth <= state.clientWidth + 2,
    `${state.label} has horizontal overflow: ${state.scrollWidth} > ${state.clientWidth}`,
  );
}

function assertNoForbiddenPlayerText(state) {
  const leaked = forbiddenPlayerTextTokens.filter((token) => state.bodyText.includes(token));
  assert(leaked.length === 0, `${state.label} leaked raw player text tokens: ${leaked.join(", ")}`);
}

function assertNoForbiddenRelationshipCopy(state) {
  const leaked = forbiddenRelationshipCopyTokens.filter((token) => state.relationshipContactText.includes(token));
  assert(leaked.length === 0, `${state.label} relationship/contact copy leaked forbidden tokens: ${leaked.join(", ")}`);
}

function assertNoPlaceholderControls(state) {
  assert(state.placeholderControls.length === 0, `${state.label} has placeholder controls: ${JSON.stringify(state.placeholderControls)}`);
}

function assertRelationshipContactCard(state, expectedCategory) {
  assert(state.relationshipContactVisible, `${state.label} relationship/contact card is not visible`);
  assert(
    state.relationshipContactCategory === expectedCategory,
    `${state.label} relationship/contact category mismatch: ${state.relationshipContactCategory}`,
  );
  assert(
    state.relationshipContactText.includes("灯") &&
      state.relationshipContactText.includes("縁") &&
      state.relationshipContactText.includes("連絡先の痕跡"),
    `${state.label} relationship/contact card copy is missing expected safe labels: ${state.relationshipContactText}`,
  );
  assert(
    state.relationshipContactControlCount === 0,
    `${state.label} relationship/contact card added enabled controls: ${state.relationshipContactControlCount}`,
  );
  assert(
    state.relationshipContactFocusableCount === 0,
    `${state.label} relationship/contact card added focusable controls: ${state.relationshipContactFocusableCount}`,
  );
  assertNoForbiddenRelationshipCopy(state);
}

function recordControlSnapshot(result, state, scope) {
  result.controlSnapshots.push({
    label: state.label,
    scope,
    enabledControls: state.enabledControls.map((control) => ({
      key: control.key,
      text: control.text,
      tag: control.tag,
      role: control.role,
      ariaPressed: control.ariaPressed,
    })),
  });
}

function recordInteraction(result, key, control, expected, observed) {
  if (!result.verifiedControls.includes(key)) {
    result.verifiedControls.push(key);
  }
  result.interactions.push({ control, key, expected, observed, result: "pass" });
}

function assertControlCoverage(result) {
  const observed = new Map();
  for (const snapshot of result.controlSnapshots) {
    if (snapshot.scope !== "player") {
      continue;
    }
    for (const control of snapshot.enabledControls) {
      observed.set(control.key, control);
    }
  }

  const verified = new Set(result.verifiedControls);
  const missing = Array.from(observed.values()).filter((control) => !verified.has(control.key));
  assert(
    missing.length === 0,
    `visible enabled player controls lack observed outcomes: ${missing.map((control) => control.key).join(", ")}`,
  );
}

function findEnabledControl(state, predicate, label) {
  const control = state.enabledControls.find(predicate);
  assert(control, `${state.label} missing enabled control: ${label}`);
  return control;
}

function hasEnabledControl(state, key) {
  return state.enabledControls.some((control) => control.key === key);
}

function assertDrawerPanelState(state, panelLabel) {
  assert(state.drawerOpen && state.activeDrawerLabel === panelLabel, `${state.label} did not open ${panelLabel} drawer`);
  if (panelLabel === "ログ") {
    assert(state.hasLogDrawerContent, `${state.label} log drawer has no visible content`);
  }
  if (panelLabel === "証拠") {
    assert(state.hasEvidenceDrawerContent, `${state.label} evidence drawer has no visible content`);
  }
  if (panelLabel === "状態") {
    assert(state.hasStatusDrawerContent, `${state.label} status drawer has no visible content`);
  }
}

async function auditMobileBottomNav(cdp, result, panelLabel) {
  await clickControlByText(cdp, ".adv-bottom-nav button", panelLabel, `bottom nav ${panelLabel}`);
  await waitFor(
    async () => {
      const state = await collectState(cdp, `wait-bottom-nav-${panelLabel}`);
      return state.drawerOpen && state.activeDrawerLabel === panelLabel;
    },
    5000,
    `bottom nav ${panelLabel} drawer`,
  );
  const drawerState = await collectState(cdp, `bottom-nav-${panelLabel}`);
  assertDrawerPanelState(drawerState, panelLabel);
  assertNoForbiddenPlayerText(drawerState);
  assertNoPlaceholderControls(drawerState);
  recordControlSnapshot(result, drawerState, "player");
  recordInteraction(result, `bottom-nav:${panelLabel}`, `bottom nav ${panelLabel}`, `${panelLabel} drawer opens`, "pass");
  await closeDrawerWithButton(cdp, result, panelLabel);
}

async function auditDesktopPanelTab(cdp, result, panelLabel) {
  await clickControlByText(cdp, ".adv-panel-tabs button", panelLabel, `desktop panel ${panelLabel}`);
  await waitFor(
    async () => (await collectState(cdp, `wait-desktop-panel-${panelLabel}`)).activeDesktopPanelLabel === panelLabel,
    5000,
    `desktop panel ${panelLabel}`,
  );
  const panelState = await collectState(cdp, `desktop-panel-${panelLabel}`);
  assert(panelState.desktopPanelText.includes(panelLabel), `${panelState.label} desktop panel text missing ${panelLabel}`);
  assertNoForbiddenPlayerText(panelState);
  assertNoPlaceholderControls(panelState);
  recordControlSnapshot(result, panelState, "player");
  recordInteraction(result, `desktop-panel:${panelLabel}`, `desktop panel ${panelLabel}`, `${panelLabel} side panel becomes active`, "pass");
}

async function clearAdventureStorageAndReload(cdp) {
  await evaluate(cdp, `(() => { localStorage.clear(); return true; })()`);
  await reloadAndWait(cdp, ".adv-shell");
}

async function revealChoiceState(cdp, result, labelPrefix) {
  let state = await collectState(cdp, `${labelPrefix}-choice-reveal-start`);
  recordControlSnapshot(result, state, "player");
  assertNoForbiddenPlayerText(state);
  for (let step = 0; step < 4; step += 1) {
    if (state.enabledControls.some((control) => control.key.startsWith("choice:"))) {
      break;
    }
    if (!hasEnabledControl(state, "story:advance-text")) {
      break;
    }
    const beforeText = state.bodyText;
    await clickControl(cdp, ".adv-advance-button", `story advance text ${step + 1}`);
    await waitFor(
      async () => (await collectState(cdp, `wait-${labelPrefix}-advance-text-${step + 1}`)).bodyText !== beforeText,
      5000,
      `story text changes ${labelPrefix} ${step + 1}`,
    );
    recordInteraction(result, "story:advance-text", "読み進める", "Visible story text advances", "pass");
    state = await collectState(cdp, `${labelPrefix}-advance-loop-${step + 1}`);
    recordControlSnapshot(result, state, "player");
    assertNoForbiddenPlayerText(state);
  }

  findEnabledControl(state, (control) => control.key.startsWith("choice:"), "visible choice");
  return state;
}

async function auditFreshRunControls(cdp, result) {
  let state = await revealChoiceState(cdp, result, "fresh-run");
  const choices = state.enabledControls.filter((control) => control.key.startsWith("choice:"));

  for (const [index, choice] of choices.entries()) {
    if (index > 0) {
      await clearAdventureStorageAndReload(cdp);
      state = await revealChoiceState(cdp, result, `fresh-run-choice-${index + 1}`);
    }
    const liveChoice = findEnabledControl(state, (control) => control.key === choice.key, choice.key);
    await clickControl(cdp, `[data-choice-id="${liveChoice.dataChoiceId}"]`, `choice ${liveChoice.text}`);
    await waitFor(
      async () => !(await collectState(cdp, `wait-choice-outcome-${index + 1}`)).enabledControls.some((control) => control.key === liveChoice.key),
      5000,
      `choice outcome ${liveChoice.key}`,
    );
    recordInteraction(result, liveChoice.key, liveChoice.text, "Choice applies state and disappears from visible once-per-run choices", "pass");
    state = await collectState(cdp, `fresh-run-after-choice-${index + 1}`);
    recordControlSnapshot(result, state, "player");
    assertNoForbiddenPlayerText(state);
  }

  const sceneIdBeforeAdvance = state.sceneId;
  findEnabledControl(state, (control) => control.key === "story:advance-scene", "next scene control");
  await clickControl(cdp, "[data-control='advance-scene']", "advance scene");
  await waitFor(async () => (await collectState(cdp, "wait-advance-scene")).sceneId !== sceneIdBeforeAdvance, 5000, "scene changes");
  recordInteraction(result, "story:advance-scene", "次の場面へ", "Scene advances to the next scene", "pass");
  state = await collectState(cdp, "fresh-run-after-scene-advance");
  recordControlSnapshot(result, state, "player");
  assertNoForbiddenPlayerText(state);

  await waitFor(async () => hasEnabledControl(await collectState(cdp, "wait-save-restart"), "save-notice:最初から"), 5000, "save restart control");
  await clickControl(cdp, ".adv-save-notice button", "save notice restart");
  await waitFor(
    async () => {
      const restarted = await collectState(cdp, "wait-save-restart-outcome");
      return restarted.sceneId === "scene_001_parallel_arrival" && restarted.activeRun === null;
    },
    5000,
    "save notice restart returns to scene 1",
  );
  recordInteraction(result, "save-notice:最初から", "最初から", "Fresh run starts and active run storage clears", "pass");
  state = await collectState(cdp, "fresh-run-after-save-restart");
  recordControlSnapshot(result, state, "player");
  assertNoForbiddenPlayerText(state);
}

function collectErrors(events) {
  const consoleErrors = events
    .filter((event) => event.method === "Runtime.exceptionThrown" || event.method === "Runtime.consoleAPICalled")
    .filter((event) => event.method === "Runtime.exceptionThrown" || event.params?.type === "error")
    .map((event) => event.params)
    .slice(0, 20);
  const networkFailures = events
    .filter((event) => event.method === "Network.loadingFailed")
    .map((event) => event.params)
    .filter((params) => params?.errorText !== "net::ERR_ABORTED" && params?.canceled !== true)
    .slice(0, 20);
  return { consoleErrors, networkFailures };
}

function writeAuditArtifacts(result) {
  fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(reportPath, `${renderAuditReport(result)}\n`, "utf8");
}

function renderAuditReport(result) {
  const lines = [
    "# Stage17C UI Interaction And Copy Audit",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Result JSON: ${result.resultPath}`,
    `Screenshots: ${result.screenshotDir}`,
    "",
    "## Routes",
    ...result.routes.map((route) => `- ${route.path} @ ${route.viewport}: ${route.result}${route.screenshot ? ` (${route.screenshot})` : ""}`),
    "",
    "## Control Audit Matrix",
    ...result.interactions.map(
      (entry) => `- ${entry.key}: ${entry.expected} -> ${entry.observed ?? entry.result} (${entry.control})`,
    ),
    "",
    "## Enabled Control Snapshots",
    ...result.controlSnapshots.map((snapshot) => {
      const controls = snapshot.enabledControls.length
        ? snapshot.enabledControls.map((control) => `${control.key}${control.text ? ` [${control.text}]` : ""}`).join(", ")
        : "none";
      return `- ${snapshot.label} (${snapshot.scope}): ${controls}`;
    }),
    "",
    "## Copy Guards",
    ...result.copyAudit.map((entry) => `- ${entry.scope}: ${entry.result}`),
    "",
    "## Assertions",
    ...result.assertions.map((assertion) => `- ${assertion}`),
    "",
    "## Console And Network",
    `- Console errors: ${result.consoleErrors.length}`,
    `- Network failures: ${result.networkFailures.length}`,
  ];

  return lines.join("\n");
}

function killTree(process) {
  if (!process || process.killed) return;
  try {
    execFileSync("taskkill.exe", ["/PID", String(process.pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    try {
      process.kill("SIGTERM");
    } catch {
      // Ignore cleanup failures.
    }
  }
}

async function main() {
  if (!browserPath) {
    throw new Error("No Edge or Chrome executable found. Set ADVENTURE_AUDIT_BROWSER to a Chromium browser path.");
  }

  const result = {
    stage: "Stage17C",
    appUrl,
    browserPath,
    serverLogPath,
    resultPath,
    reportPath,
    screenshotDir,
    routes: [],
    interactions: [],
    controlSnapshots: [],
    verifiedControls: [],
    copyAudit: [],
    assertions: [],
    consoleErrors: [],
    networkFailures: [],
  };

  const server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "127.0.0.1", "--port", String(appPort)],
    {
      cwd: repoDir,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  server.stdout.on("data", appendServerLog);
  server.stderr.on("data", appendServerLog);

  const browser = spawn(
    browserPath,
    [
      "--headless=new",
      `--remote-debugging-port=${browserPort}`,
      `--user-data-dir=${browserProfileDir}`,
      "--disable-gpu",
      "--disable-extensions",
      "--disable-component-extensions-with-background-pages",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--remote-allow-origins=*",
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank",
    ],
    { stdio: "ignore", windowsHide: true },
  );

  let cdp;
  try {
    await waitFor(() => httpOk(appUrl), 30000, "Next.js dev server");
    await waitFor(() => httpOk(`${browserOrigin}/json/version`), 15000, "browser CDP");
    const tabs = await fetchJson(`${browserOrigin}/json`);
    const pageTarget = tabs.find((target) => target.type === "page") ?? tabs[0];
    cdp = await CdpClient.connect(pageTarget.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");
    await cdp.send("Log.enable");

    await setViewport(cdp, 430, 932);
    await navigateAndWait(cdp, appUrl, ".adv-shell");
    let initialState = await collectState(cdp, "adventure-player-initial");
    assert(initialState.hasAdventureShell, "/ did not render AdventurePlayer");
    assert(!initialState.hasScenarioExplorerShell, "/ rendered ScenarioExplorer shell");
    assertNoForbiddenPlayerText(initialState);
    assertNoPlaceholderControls(initialState);
    assertNoHorizontalOverflow(initialState);
    recordControlSnapshot(result, initialState, "player");
    result.routes.push({
      path: "/",
      viewport: "430x932",
      result: "AdventurePlayer rendered",
      sceneId: initialState.sceneId,
    });

    await auditMobileBottomNav(cdp, result, "ログ");
    await auditMobileBottomNav(cdp, result, "証拠");
    await auditMobileBottomNav(cdp, result, "状態");
    await auditFreshRunControls(cdp, result);

    await seedPostEnding(cdp);
    await reloadAndWait(cdp, '[data-ending-id="return_with_akari"]');
    let mobilePostEnding = await collectState(cdp, "post-ending-mobile");
    assert(mobilePostEnding.hasEndingView, "post-ending view is not visible on /");
    assert(mobilePostEnding.endingRecordStatus === "recorded", "completed run record status is not recorded");
    assert(mobilePostEnding.hasProgressSheet, "Stage16-5B progress sheet is not visible");
    assert(
      mobilePostEnding.progressEntries.some((entry) => entry.state === "reached" && entry.current === "true"),
      "current reached ending progress row is missing",
    );
    assert(
      mobilePostEnding.progressEntries.some((entry) => entry.state === "locked"),
      "locked ending progress rows are missing",
    );
    assert(
      ["branch", "evidence", "carry_out"].every((family) => mobilePostEnding.replayHintFamilies.includes(family)),
      `Stage16-5C replay hint families missing: ${mobilePostEnding.replayHintFamilies.join(", ")}`,
    );
    assertRelationshipContactCard(mobilePostEnding, "active_contact_record");
    assert(mobilePostEnding.postEndingActionCount >= 4, "post-ending action controls are missing");
    assertNoForbiddenPlayerText(mobilePostEnding);
    assertNoPlaceholderControls(mobilePostEnding);
    assertNoHorizontalOverflow(mobilePostEnding);
    recordControlSnapshot(result, mobilePostEnding, "player");
    result.copyAudit.push({
      scope: "post-ending mobile relationship/contact card",
      result: "safe copy, no raw IDs, no AI chat or messenger implication, static/read-only",
    });
    const mobileShot = await capture(cdp, "adventure-player-post-ending-430x932.png");
    result.routes.push({
      path: "/",
      viewport: "430x932",
      result: "post-ending progress sheet and replay hints visible",
      screenshot: mobileShot,
      replayHintFamilies: mobilePostEnding.replayHintFamilies,
      progressEntries: mobilePostEnding.progressEntries,
      relationshipContactCategory: mobilePostEnding.relationshipContactCategory,
    });

    await setViewport(cdp, 390, 844);
    const compactMobilePostEnding = await collectState(cdp, "post-ending-mobile-compact");
    assert(compactMobilePostEnding.hasEndingView, "compact mobile post-ending view is not visible");
    assert(compactMobilePostEnding.hasProgressSheet, "compact mobile progress sheet is not visible");
    assertRelationshipContactCard(compactMobilePostEnding, "active_contact_record");
    assertNoForbiddenPlayerText(compactMobilePostEnding);
    assertNoPlaceholderControls(compactMobilePostEnding);
    assertNoHorizontalOverflow(compactMobilePostEnding);
    recordControlSnapshot(result, compactMobilePostEnding, "player");
    const compactMobileShot = await capture(cdp, "adventure-player-post-ending-390x844.png");
    result.routes.push({
      path: "/",
      viewport: "390x844",
      result: "compact mobile post-ending contract visible",
      screenshot: compactMobileShot,
      relationshipContactCategory: compactMobilePostEnding.relationshipContactCategory,
    });

    await clickEndingAction(cdp, 1, "log");
    const logState = await collectState(cdp, "post-ending-log-action");
    assert(logState.drawerOpen && logState.hasLogDrawerContent, "log action did not open a visible drawer outcome");
    recordInteraction(result, "post-ending:記録を見る", "post-ending log action", "Log drawer opens", "pass");
    await closeDrawer(cdp, "log");

    await clickEndingAction(cdp, 2, "evidence");
    const evidenceState = await collectState(cdp, "post-ending-evidence-action");
    assert(
      evidenceState.drawerOpen && evidenceState.hasEvidenceDrawerContent,
      "evidence action did not open a visible drawer outcome",
    );
    recordInteraction(result, "post-ending:手がかりを見る", "post-ending evidence action", "Evidence drawer opens", "pass");
    await closeDrawer(cdp, "evidence");

    await clickEndingAction(cdp, 3, "status");
    const statusState = await collectState(cdp, "post-ending-status-action");
    assert(statusState.drawerOpen && statusState.hasStatusDrawerContent, "status action did not open a visible drawer outcome");
    recordInteraction(result, "post-ending:状態を見る", "post-ending status action", "Status drawer opens", "pass");
    await closeDrawer(cdp, "status");

    await clickEndingAction(cdp, 0, "restart");
    await waitFor(async () => !(await collectState(cdp, "wait-restart")).hasEndingView, 5000, "restart to leave ending view");
    const restartState = await collectState(cdp, "post-ending-restart-action");
    assert(!restartState.endingId && restartState.sceneId === "scene_001_parallel_arrival", "restart did not return to fresh scene 1");
    assert(restartState.activeRun === null, "restart did not clear active run storage");
    assert(restartState.history.length === 1, "restart did not preserve completed run history");
    recordInteraction(result, "post-ending:もう一度たどる", "post-ending restart action", "Fresh run starts and history remains", "pass");

    await setViewport(cdp, 1280, 720);
    await navigateAndWait(cdp, appUrl, ".adv-shell");
    const desktopInitial = await collectState(cdp, "adventure-player-desktop-initial");
    assertNoForbiddenPlayerText(desktopInitial);
    assertNoPlaceholderControls(desktopInitial);
    assertNoHorizontalOverflow(desktopInitial);
    recordControlSnapshot(result, desktopInitial, "player");
    await auditDesktopPanelTab(cdp, result, "ログ");
    await auditDesktopPanelTab(cdp, result, "証拠");
    await auditDesktopPanelTab(cdp, result, "状態");

    await seedPostEnding(cdp);
    await reloadAndWait(cdp, '[data-ending-id="return_with_akari"]');
    const desktopPostEnding = await collectState(cdp, "post-ending-desktop");
    assert(desktopPostEnding.hasAdventureShell && desktopPostEnding.hasEndingView, "desktop / post-ending view is not visible");
    assert(
      ["branch", "evidence", "carry_out"].every((family) => desktopPostEnding.replayHintFamilies.includes(family)),
      "desktop replay hint families are missing",
    );
    assertRelationshipContactCard(desktopPostEnding, "active_contact_record");
    assertNoForbiddenPlayerText(desktopPostEnding);
    assertNoPlaceholderControls(desktopPostEnding);
    assertNoHorizontalOverflow(desktopPostEnding);
    recordControlSnapshot(result, desktopPostEnding, "player");
    result.copyAudit.push({
      scope: "post-ending desktop relationship/contact card",
      result: "safe copy, no raw IDs, no AI chat or messenger implication, static/read-only",
    });
    const desktopShot = await capture(cdp, "adventure-player-post-ending-1280x720.png");
    result.routes.push({
      path: "/",
      viewport: "1280x720",
      result: "desktop post-ending contract visible",
      screenshot: desktopShot,
      relationshipContactCategory: desktopPostEnding.relationshipContactCategory,
    });

    await setViewport(cdp, 1440, 900);
    const wideDesktopPostEnding = await collectState(cdp, "post-ending-desktop-wide");
    assert(wideDesktopPostEnding.hasAdventureShell && wideDesktopPostEnding.hasEndingView, "wide desktop / post-ending view is not visible");
    assertRelationshipContactCard(wideDesktopPostEnding, "active_contact_record");
    assertNoForbiddenPlayerText(wideDesktopPostEnding);
    assertNoPlaceholderControls(wideDesktopPostEnding);
    assertNoHorizontalOverflow(wideDesktopPostEnding);
    recordControlSnapshot(result, wideDesktopPostEnding, "player");
    const wideDesktopShot = await capture(cdp, "adventure-player-post-ending-1440x900.png");
    result.routes.push({
      path: "/",
      viewport: "1440x900",
      result: "wide desktop post-ending contract visible",
      screenshot: wideDesktopShot,
      relationshipContactCategory: wideDesktopPostEnding.relationshipContactCategory,
    });

    await navigateAndWait(cdp, `${appUrl}/debug`, ".shell");
    const debugState = await collectState(cdp, "debug-route");
    assert(debugState.hasScenarioExplorerShell, "/debug did not render ScenarioExplorer");
    assert(!debugState.hasAdventureShell, "/debug rendered AdventurePlayer shell");
    assertNoPlaceholderControls(debugState);
    assertNoHorizontalOverflow(debugState);
    const debugShot = await capture(cdp, "debug-1280x720.png");
    result.routes.push({
      path: "/debug",
      viewport: "1280x720",
      result: "ScenarioExplorer rendered",
      screenshot: debugShot,
    });

    recordInteraction(result, "passive:replay-hint-sheet", "replay hint sheet", "Passive display only; no enabled control added", "pass");

    const errors = collectErrors(cdp.events);
    result.consoleErrors = errors.consoleErrors;
    result.networkFailures = errors.networkFailures;
    assert(result.consoleErrors.length === 0, `console errors detected: ${result.consoleErrors.length}`);
    assert(result.networkFailures.length === 0, `network failures detected: ${result.networkFailures.length}`);
    assertControlCoverage(result);

    result.assertions.push(
      "/ renders AdventurePlayer",
      "post-ending progress sheet is visible",
      "Akari relationship/contact card is visible and static",
      "relationship/contact card has no enabled or focusable controls",
      "branch/evidence/carry_out replay hint families are visible",
      "player text hides raw ending ids, raw conditions, and route-gate tokens",
      "player text avoids AI chat and messenger implications",
      "mobile bottom navigation, drawer close, story advance, choices, scene advance, save restart, desktop panel tabs, and post-ending controls have visible outcomes",
      "all visible enabled player controls in audited states have observed outcomes",
      "390x844, 430x932, 1280x720, and 1440x900 audited without horizontal overflow",
      "/debug renders ScenarioExplorer",
      "no console errors or request failures",
    );

    writeAuditArtifacts(result);
    console.log(
      JSON.stringify(
        {
          ok: true,
          resultPath,
          reportPath,
          screenshotDir,
          routes: result.routes.map((route) => ({
            path: route.path,
            viewport: route.viewport,
            result: route.result,
          })),
          interactions: result.interactions,
          controlSnapshotCount: result.controlSnapshots.length,
          consoleErrorCount: result.consoleErrors.length,
          networkFailureCount: result.networkFailures.length,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    fs.writeFileSync(resultPath, `${JSON.stringify({ ok: false, error: error.stack || String(error), serverLogPath }, null, 2)}\n`, "utf8");
    throw error;
  } finally {
    if (cdp) cdp.close();
    killTree(browser);
    killTree(server);
    try {
      fs.rmSync(browserProfileDir, { recursive: true, force: true });
    } catch {
      // Windows can keep a headless profile locked briefly after shutdown.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
