import { refreshAuthState } from "./codes-auth-chrome.js";
import { setAuthState } from "./codes-auth-chrome.js";
import { animateManualAccountAdd } from "./codes-cards.js";
import { renderAccounts } from "./codes-cards.js";
import { bootstrapCodesOnce } from "./codes-init.js";
import { clear } from "./codes-init.js";
import { initCodes } from "./codes-init.js";
import { renderFromStorage } from "./codes-init.js";
import { restore } from "./codes-init.js";
import { applyPostLogoutChrome } from "./codes-reveal.js";
import { hasPendingPostLoginReveal } from "./codes-reveal.js";
import { playPostLoginReveal } from "./codes-reveal.js";
import { preparePostLoginReveal } from "./codes-reveal.js";
import { stagePostLoginReveal } from "./codes-reveal.js";
import { loadTimerInvertedPreference } from "./codes-timer.js";

loadTimerInvertedPreference();

export const codesSection = {
  init: initCodes,
  bootstrapOnce: bootstrapCodesOnce,
  restore,
  render: renderFromStorage,
  clear,
  renderAccounts,
  animateManualAccountAdd,
  setAuthState,
  refreshAuthState,
  stagePostLoginReveal,
  hasPendingPostLoginReveal,
  preparePostLoginReveal,
  playPostLoginReveal,
  applyPostLogoutChrome,
};

export { initCodes };
