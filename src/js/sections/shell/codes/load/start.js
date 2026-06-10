import { codesAnimationIntroFinish } from "../animation/intro/finish.js";
import { codesAnimationIntroStart } from "../animation/intro/start.js";
import { codesCardRender } from "../card/render.js";
import { codesStateStore } from "../state/store.js";
import { codesUtilTimerPreferenceLoad } from "../util/timer-preference.js";

/** Loads accounts with optional card intro animation. */
async function codesLoadStart(accounts, options = {}) {
  const { playIntro = false } = options;

  try {
    await codesUtilTimerPreferenceLoad();

    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const cards = codesCardRender(safeAccounts, { playIntro });

    if (playIntro && cards.length) {
      await codesAnimationIntroStart(cards);
    }
  } finally {
    codesAnimationIntroFinish();
    codesStateStore.shouldPlayIntro = false;
  }
}

export { codesLoadStart };
