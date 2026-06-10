import { dataCodeClock } from "../../../../accounts/accounts-index.js";
import { dataCodeGenerate } from "../../../../accounts/accounts-index.js";
import { dataCodeOptions } from "../../../../accounts/accounts-index.js";
import { dataCodeTypeHotp } from "../../../../accounts/accounts-index.js";

import { codesStateStore } from "../state/store.js";
import { codesUtilPiePathBuild } from "../util/pie.js";
import { codesUtilTimerPreferenceSave } from "../util/timer-preference.js";

import { CODES_HIDDEN_CLASS } from "../codes-const.js";

/** Clears the TOTP pie timer SVG path. */
function codesTickerPieClear(piePath, lastPathRef) {
  if (!piePath) {
    return;
  }

  lastPathRef.value = "";
  piePath.setAttribute("d", "");
  piePath.classList.add(CODES_HIDDEN_CLASS);
}

/** Updates the TOTP pie timer SVG for the current angle. */
function codesTickerPieUpdate(piePath, angle, lastPathRef) {
  if (!piePath) {
    return lastPathRef;
  }

  const path = codesUtilPiePathBuild(angle);

  if (path !== lastPathRef.value) {
    piePath.setAttribute("d", path);
    piePath.classList.toggle(CODES_HIDDEN_CLASS, !path);
    lastPathRef.value = path;
  }

  return lastPathRef;
}

/** Applies global timer invert preference to all card timers. */
function codesTickerInvertedSync() {
  for (const root of codesStateStore.cardRoots) {
    root.els.timer?.classList.toggle("inverted", codesStateStore.globalTimerInverted);
  }
}

/** Flips timer direction when the TOTP period rolls over. */
function codesTickerPeriodRollover(clock) {
  if (codesStateStore.globalLastTimerPeriod === null) {
    codesStateStore.globalLastTimerPeriod = clock.period;
    return;
  }

  if (clock.period === codesStateStore.globalLastTimerPeriod) {
    return;
  }

  for (const root of codesStateStore.cardRoots) {
    codesTickerPieClear(root.els.pieFg, root.lastPiePath);
  }

  codesStateStore.globalTimerInverted = !codesStateStore.globalTimerInverted;
  void codesUtilTimerPreferenceSave(codesStateStore.globalTimerInverted);
  codesTickerInvertedSync();
  codesStateStore.globalLastTimerPeriod = clock.period;
}

/** Regenerates and displays the OTP code for a card. */
function codesTickerAccountCodeUpdate(root) {
  const { account, els } = root;
  const otpOptions = dataCodeOptions(account);
  const otp = dataCodeGenerate(account.secret, otpOptions);
  const digits = otpOptions.digits;

  if (els.code) {
    els.code.textContent =
      otp && otp.length === digits ? otp : "-".repeat(digits);
  }
}

/** Updates timer pie visuals for a TOTP card. */
function codesTickerVisualsUpdate(root, clock) {
  const pieFg = root.els.pieFg;

  if (!pieFg) {
    return;
  }

  pieFg.classList.remove(CODES_HIDDEN_CLASS);
  codesTickerPieUpdate(pieFg, clock.angle, root.lastPiePath);
}

/** Runs one ticker tick for all TOTP cards. */
function codesTickerSecondRun() {
  let rolloverClock = null;

  for (const root of codesStateStore.cardRoots) {
    if (dataCodeTypeHotp(root.account)) {
      continue;
    }

    const clock = dataCodeClock(dataCodeOptions(root.account));

    if (!rolloverClock) {
      rolloverClock = clock;
    }

    codesTickerAccountCodeUpdate(root);
    codesTickerVisualsUpdate(root, clock);
  }

  if (rolloverClock) {
    codesTickerPeriodRollover(rolloverClock);
  }
}

/** Stops the interval ticker and clears card roots. */
function codesTickerStop() {
  if (codesStateStore.tickIntervalId != null) {
    clearInterval(codesStateStore.tickIntervalId);
    codesStateStore.tickIntervalId = null;
  }

  codesStateStore.cardRoots = [];
}

/** Returns whether any rendered account uses TOTP. */
function codesTickerHasTotp() {
  return codesStateStore.cardRoots.some((root) => !dataCodeTypeHotp(root.account));
}

/** Returns the first TOTP card root, if any. */
function codesTickerFirstTotpRoot() {
  return (
    codesStateStore.cardRoots.find((root) => !dataCodeTypeHotp(root.account)) ?? null
  );
}

/** Starts aligned second-bound ticker updates for TOTP cards. */
function codesTickerStart() {
  if (codesStateStore.tickIntervalId != null) {
    clearInterval(codesStateStore.tickIntervalId);
    codesStateStore.tickIntervalId = null;
  }

  if (!codesStateStore.cardRoots.length) {
    return;
  }

  for (const root of codesStateStore.cardRoots) {
    if (dataCodeTypeHotp(root.account)) {
      codesTickerAccountCodeUpdate(root);
    }
  }

  if (!codesTickerHasTotp()) {
    return;
  }

  codesStateStore.globalLastTimerPeriod = null;
  codesTickerInvertedSync();

  const firstTotp = codesTickerFirstTotpRoot();
  codesTickerPeriodRollover(
    dataCodeClock(firstTotp ? dataCodeOptions(firstTotp.account) : {}),
  );

  for (const root of codesStateStore.cardRoots) {
    if (dataCodeTypeHotp(root.account)) {
      continue;
    }

    const clock = dataCodeClock(dataCodeOptions(root.account));
    codesTickerAccountCodeUpdate(root);
    codesTickerVisualsUpdate(root, clock);
  }

  const msUntilNextSecond = 1000 - (Date.now() % 1000);

  window.setTimeout(() => {
    codesTickerSecondRun();
    codesStateStore.tickIntervalId = window.setInterval(codesTickerSecondRun, 1000);
  }, msUntilNextSecond);
}

/** Primes OTP display and timer visuals for one card. */
function codesTickerCardPrime(card) {
  const root = codesStateStore.cardRoots.find((item) => item.card === card);

  if (!root) {
    return;
  }

  if (dataCodeTypeHotp(root.account)) {
    codesTickerAccountCodeUpdate(root);
    return;
  }

  const clock = dataCodeClock(dataCodeOptions(root.account));
  codesTickerAccountCodeUpdate(root);
  codesTickerVisualsUpdate(root, clock);
}

export { codesTickerAccountCodeUpdate };
export { codesTickerCardPrime };
export { codesTickerStart };
export { codesTickerStop };
