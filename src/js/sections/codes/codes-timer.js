import {
  HOTP_DEFAULT_COUNTER,
  MIN_COUNTER,
  dataHotpIs,
  dataOtpClockGet,
  dataOtpNumberGet,
  dataOtpOptionsGet,
  dataTotpIs,
} from "../../accounts/account-index.js";
import {
  PIE_CENTER,
  PIE_ARC_RADIUS,
  TIMER_INVERTED_KEY,
  clearCardRoots,
  getCardRoots,
  getGlobalLastTimerPeriod,
  getGlobalTimerInverted,
  getTickIntervalId,
  setGlobalLastTimerPeriod,
  setGlobalTimerInverted,
  setTickIntervalId,
} from "./codes-state.js";

function buildPiePath(angle) {
  if (angle <= 0) {
    return "";
  }

  if (angle >= 360) {
    return `M${PIE_CENTER} ${PIE_CENTER} L${PIE_CENTER} ${PIE_CENTER - PIE_ARC_RADIUS} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 1 1 ${PIE_CENTER} ${PIE_CENTER + PIE_ARC_RADIUS} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 1 1 ${PIE_CENTER} ${PIE_CENTER - PIE_ARC_RADIUS} Z`;
  }

  const startAngle = -90;
  const endAngle = startAngle + angle;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const startX = PIE_CENTER + Math.cos(startRad) * PIE_ARC_RADIUS;
  const startY = PIE_CENTER + Math.sin(startRad) * PIE_ARC_RADIUS;
  const endX = PIE_CENTER + Math.cos(endRad) * PIE_ARC_RADIUS;
  const endY = PIE_CENTER + Math.sin(endRad) * PIE_ARC_RADIUS;

  if (angle < 180) {
    return `M${PIE_CENTER} ${PIE_CENTER} L${startX} ${startY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 0 1 ${endX} ${endY} Z`;
  }

  if (angle === 180) {
    return `M${PIE_CENTER} ${PIE_CENTER} L${startX} ${startY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 0 1 ${endX} ${endY} Z`;
  }

  const midAngle = startAngle + 180;
  const midRad = (midAngle * Math.PI) / 180;
  const midX = PIE_CENTER + Math.cos(midRad) * PIE_ARC_RADIUS;
  const midY = PIE_CENTER + Math.sin(midRad) * PIE_ARC_RADIUS;

  return `M${PIE_CENTER} ${PIE_CENTER} L${startX} ${startY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 1 1 ${midX} ${midY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 0 1 ${endX} ${endY} Z`;
}

function applyTimerInvertedClass(timerEl, inverted) {
  timerEl?.classList.toggle("inverted", Boolean(inverted));
}

export async function loadTimerInvertedPreference() {
  const stored = await chrome.storage.local.get([TIMER_INVERTED_KEY]);
  setGlobalTimerInverted(Boolean(stored[TIMER_INVERTED_KEY]));
}

export async function saveTimerInvertedPreference(inverted) {
  setGlobalTimerInverted(inverted);
  await chrome.storage.local.set({ [TIMER_INVERTED_KEY]: inverted });
}

export function clearTickers() {
  const tickIntervalId = getTickIntervalId();

  if (tickIntervalId != null) {
    clearInterval(tickIntervalId);
    setTickIntervalId(null);
  }
}

export function stopTicker() {
  clearTickers();
  clearCardRoots();
}

function hasTotpCards() {
  return getCardRoots().some((root) => dataTotpIs(root.account));
}

function getFirstTotpRoot() {
  return (
    getCardRoots().find((root) => dataTotpIs(root.account)) ?? null
  );
}

export function updateAccountCode(root) {
  const { account, els, card } = root;
  const otpOptions = dataOtpOptionsGet(account);
  const otp = dataOtpNumberGet(account.secret, otpOptions);

  if (els.code) {
    const digits = otpOptions.digits;
    els.code.textContent =
      otp && otp.length === digits ? otp : "-".repeat(digits);
    card.classList.toggle("account-block--invalid", !otp);
  }
}

function runSecondTick() {
  let rolloverClock = null;

  for (const root of getCardRoots()) {
    if (dataHotpIs(root.account)) {
      continue;
    }

    const clock = dataOtpClockGet(
      dataOtpOptionsGet(root.account),
    );

    if (!rolloverClock) {
      rolloverClock = clock;
    }

    updateCardSecondTick(root, clock);
    updateTimerVisuals(root, clock);
  }

  if (rolloverClock) {
    handlePeriodRollover(rolloverClock);
  }
}

export function startTicker() {
  clearTickers();

  if (!getCardRoots().length) {
    return;
  }

  for (const root of getCardRoots()) {
    if (dataHotpIs(root.account)) {
      updateAccountCode(root);
    }
  }

  if (!hasTotpCards()) {
    return;
  }

  setGlobalLastTimerPeriod(null);

  syncAllTimersInverted();

  const firstTotp = getFirstTotpRoot();

  handlePeriodRollover(
    dataOtpClockGet(
      firstTotp ? dataOtpOptionsGet(firstTotp.account) : {},
    ),
  );

  for (const root of getCardRoots()) {
    if (dataHotpIs(root.account)) {
      continue;
    }

    const clock = dataOtpClockGet(
      dataOtpOptionsGet(root.account),
    );

    updateCardSecondTick(root, clock);
    updateTimerVisuals(root, clock);
  }

  const msUntilNextSecond = 1000 - (Date.now() % 1000);

  window.setTimeout(() => {
    runSecondTick();
    setTickIntervalId(window.setInterval(runSecondTick, 1000));
  }, msUntilNextSecond);
}

function clearPieWedge(piePath, lastPathRef) {
  if (!piePath) return;

  lastPathRef.value = "";
  piePath.setAttribute("d", "");
  piePath.classList.remove("is-visible");
}

function updatePiePath(piePath, angle, lastPathRef) {
  if (!piePath) return lastPathRef;

  const path = buildPiePath(angle);

  if (path !== lastPathRef.value) {
    piePath.setAttribute("d", path);
    piePath.classList.toggle("is-visible", Boolean(path));
    lastPathRef.value = path;
  }

  return lastPathRef;
}

export function syncAllTimersInverted() {
  for (const root of getCardRoots()) {
    applyTimerInvertedClass(root.els.timer, getGlobalTimerInverted());
  }
}

function handlePeriodRollover(clock) {
  if (getGlobalLastTimerPeriod() === null) {
    setGlobalLastTimerPeriod(clock.period);
    return;
  }

  if (clock.period === getGlobalLastTimerPeriod()) {
    return;
  }

  for (const root of getCardRoots()) {
    clearPieWedge(root.els.pieFg, root.lastPiePath);
  }

  setGlobalTimerInverted(!getGlobalTimerInverted());
  saveTimerInvertedPreference(getGlobalTimerInverted());
  syncAllTimersInverted();
  setGlobalLastTimerPeriod(clock.period);
}

export function updateTimerVisuals(root, clock) {
  const pieFg = root.els.pieFg;

  if (!pieFg) {
    return;
  }

  pieFg.classList.add("is-visible");
  updatePiePath(pieFg, clock.angle, root.lastPiePath);
}

export function updateAllTimerVisuals(clock) {
  handlePeriodRollover(clock);

  for (const root of getCardRoots()) {
    updateTimerVisuals(root, clock);
  }
}

export function updateCardSecondTick(root, _clock) {
  updateAccountCode(root);
}

export function getHotpCounterValue(account) {
  return Number.isInteger(account?.counter)
    ? account.counter
    : HOTP_DEFAULT_COUNTER;
}

export function formatHotpCounterDisplay(account) {
  return String(getHotpCounterValue(account));
}

export function parseHotpCounterInput(text) {
  const trimmed = String(text ?? "").trim();

  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const counter = Number.parseInt(trimmed, 10);

  if (!Number.isInteger(counter) || counter < MIN_COUNTER) {
    return null;
  }

  return counter;
}

export function primeAccountCard(card) {
  const root = getCardRoots().find((item) => item.card === card);

  if (!root) {
    return;
  }

  if (dataHotpIs(root.account)) {
    updateAccountCode(root);
    return;
  }

  const clock = dataOtpClockGet(
    dataOtpOptionsGet(root.account),
  );

  updateCardSecondTick(root, clock);
  updateTimerVisuals(root, clock);
}
