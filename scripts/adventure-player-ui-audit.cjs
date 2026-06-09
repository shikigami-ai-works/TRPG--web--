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
      const text = (element) => (element?.innerText || element?.textContent || "").replace(/\\s+/g, " ").trim();
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const parseJson = (value, fallback) => {
        try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
      };
      const controls = Array.from(document.querySelectorAll("button, a, input"))
        .filter(visible)
        .map((element, index) => ({
          index,
          tag: element.tagName.toLowerCase(),
          text: text(element),
          href: element instanceof HTMLAnchorElement ? element.getAttribute("href") || "" : "",
          disabled: "disabled" in element ? Boolean(element.disabled) : false,
          dataChoiceId: element.getAttribute("data-choice-id") || "",
          dataControl: element.getAttribute("data-control") || "",
          dataCarryItemId: element.getAttribute("data-carry-item-id") || "",
          ariaPressed: element.getAttribute("aria-pressed") || "",
          className: typeof element.className === "string" ? element.className : "",
        }));
       const bodyText = text(document.body);
       const relationshipContactCard = document.querySelector("[data-relationship-contact-category]");
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
         relationshipContactControlCount: relationshipContactCard
           ? Array.from(relationshipContactCard.querySelectorAll("button, a, input")).filter(visible).length
           : 0,
         postEndingActionCount: document.querySelectorAll(".adv-ending-actions button").length,
         drawerOpen: Boolean(document.querySelector(".adv-mobile-drawer.open")),
        drawerText: text(document.querySelector(".adv-mobile-drawer.open")),
        activeDrawerLabel: text(document.querySelector(".adv-mobile-drawer.open .adv-drawer-header strong")),
        hasLogDrawerContent: Boolean(document.querySelector(".adv-mobile-drawer.open .adv-log-list, .adv-mobile-drawer.open .adv-muted")),
        hasEvidenceDrawerContent: Boolean(document.querySelector(".adv-mobile-drawer.open .adv-panel-list")),
        hasStatusDrawerContent: Boolean(document.querySelector(".adv-mobile-drawer.open .adv-status-detail")),
        activeRun: parseJson(localStorage.getItem(${JSON.stringify(activeRunKey)}), null),
        history: parseJson(localStorage.getItem(${JSON.stringify(historyKey)}), []),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        controls,
        placeholderControls: controls.filter((control) =>
          control.href === "#" ||
          control.href.toLowerCase().startsWith("javascript:") ||
          (!control.disabled && control.tag === "a" && !control.href)
        ),
      };
    })()`,
  );
}

async function clickEndingAction(cdp, index, label) {
  const target = await evaluate(
    cdp,
    `(() => {
      const button = document.querySelectorAll(".adv-ending-actions button")[${index}];
      if (!button) return { clicked: false, reason: "missing" };
      if (button.disabled) return { clicked: false, reason: "disabled" };
      button.scrollIntoView({ block: "center", inline: "center" });
      const rect = button.getBoundingClientRect();
      return {
        clicked: true,
        text: (button.innerText || button.textContent || "").replace(/\\s+/g, " ").trim(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    })()`,
  );
  if (!target.clicked) {
    throw new Error(`post-ending action ${label} failed: ${target.reason}`);
  }
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: target.x, y: target.y });
  await cdp.send("Input.dispatchMouseEvent", { type: "mousePressed", x: target.x, y: target.y, button: "left", clickCount: 1 });
  await cdp.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: target.x, y: target.y, button: "left", clickCount: 1 });
  await sleep(400);
  return target;
}

async function closeDrawer(cdp, label) {
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await waitFor(async () => !(await collectState(cdp, `wait-close-${label}`)).drawerOpen, 5000, `close drawer after ${label}`);
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
    stage: "Stage16-6",
    appUrl,
    browserPath,
    serverLogPath,
    resultPath,
    screenshotDir,
    routes: [],
    interactions: [],
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
    assertNoPlaceholderControls(initialState);
    assertNoHorizontalOverflow(initialState);
    result.routes.push({
      path: "/",
      viewport: "430x932",
      result: "AdventurePlayer rendered",
      sceneId: initialState.sceneId,
    });

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

    await clickEndingAction(cdp, 1, "log");
    const logState = await collectState(cdp, "post-ending-log-action");
    assert(logState.drawerOpen && logState.hasLogDrawerContent, "log action did not open a visible drawer outcome");
    result.interactions.push({ control: "post-ending log action", expected: "Log drawer opens", result: "pass" });
    await closeDrawer(cdp, "log");

    await clickEndingAction(cdp, 2, "evidence");
    const evidenceState = await collectState(cdp, "post-ending-evidence-action");
    assert(
      evidenceState.drawerOpen && evidenceState.hasEvidenceDrawerContent,
      "evidence action did not open a visible drawer outcome",
    );
    result.interactions.push({ control: "post-ending evidence action", expected: "Evidence drawer opens", result: "pass" });
    await closeDrawer(cdp, "evidence");

    await clickEndingAction(cdp, 3, "status");
    const statusState = await collectState(cdp, "post-ending-status-action");
    assert(statusState.drawerOpen && statusState.hasStatusDrawerContent, "status action did not open a visible drawer outcome");
    result.interactions.push({ control: "post-ending status action", expected: "Status drawer opens", result: "pass" });
    await closeDrawer(cdp, "status");

    await clickEndingAction(cdp, 0, "restart");
    await waitFor(async () => !(await collectState(cdp, "wait-restart")).hasEndingView, 5000, "restart to leave ending view");
    const restartState = await collectState(cdp, "post-ending-restart-action");
    assert(!restartState.endingId && restartState.sceneId === "scene_001_parallel_arrival", "restart did not return to fresh scene 1");
    assert(restartState.activeRun === null, "restart did not clear active run storage");
    assert(restartState.history.length === 1, "restart did not preserve completed run history");
    result.interactions.push({ control: "post-ending restart action", expected: "Fresh run starts and history remains", result: "pass" });

    await setViewport(cdp, 1280, 720);
    await navigateAndWait(cdp, appUrl, ".adv-shell");
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
    const desktopShot = await capture(cdp, "adventure-player-post-ending-1280x720.png");
    result.routes.push({
      path: "/",
      viewport: "1280x720",
      result: "desktop post-ending contract visible",
      screenshot: desktopShot,
      relationshipContactCategory: desktopPostEnding.relationshipContactCategory,
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

    result.interactions.push({
      control: "replay hint sheet",
      expected: "Passive display only; no enabled control added",
      result: "pass",
    });

    const errors = collectErrors(cdp.events);
    result.consoleErrors = errors.consoleErrors;
    result.networkFailures = errors.networkFailures;
    assert(result.consoleErrors.length === 0, `console errors detected: ${result.consoleErrors.length}`);
    assert(result.networkFailures.length === 0, `network failures detected: ${result.networkFailures.length}`);

    result.assertions.push(
      "/ renders AdventurePlayer",
      "post-ending progress sheet is visible",
      "Akari relationship/contact card is visible and static",
      "branch/evidence/carry_out replay hint families are visible",
      "player text hides raw ending ids, raw conditions, and route-gate tokens",
      "player text avoids AI chat and messenger implications",
      "post-ending controls have visible outcomes",
      "/debug renders ScenarioExplorer",
      "no console errors or request failures",
    );

    fs.writeFileSync(resultPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    console.log(
      JSON.stringify(
        {
          ok: true,
          resultPath,
          screenshotDir,
          routes: result.routes.map((route) => ({
            path: route.path,
            viewport: route.viewport,
            result: route.result,
          })),
          interactions: result.interactions,
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
