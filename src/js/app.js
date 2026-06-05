import { bodyRevealMessage } from "./sections/body/index.js";
import { initSectionModules } from "./sections/section-index.js";
import { loadSections } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { themeInit } from "./utils/utility-theme.js";
import { checkAuth, refreshAuth } from "./utils/utility-auth.js";
import { authNumberGet } from "./accounts/accounts-index.js";
import { dataSync } from "./accounts/accounts-index.js";
import { hasPendingPostLoginReveal } from "./sections/codes/codes-reveal.js";
import { setEmptyVisible } from "./sections/codes/codes-empty.js";
import { SELECTORS } from "./sections/codes/codes-state.js";
import { loadTimerInvertedPreference } from "./sections/codes/codes-timer.js";

themeInit();

/** Registers sections, applies auth, and loads section modules. */
async function bootstrapExtension() {
  registerSections();
  initSectionModules();

  const isLoggedIn = await checkAuth();
  await refreshAuth();

  let signedInEmpty = false;

  if (isLoggedIn && !hasPendingPostLoginReveal()) {
    const authNumber = await authNumberGet();

    if (authNumber) {
      try {
        await loadTimerInvertedPreference();
        const accounts = await dataSync(authNumber);
        signedInEmpty =
          accounts.filter((account) => account?.secret).length === 0;
      } catch {
        return;
      }
    }
  }

  if (!isLoggedIn) {
    bodyRevealMessage({ signedIn: false });
  } else if (signedInEmpty) {
    const empty = document.querySelector(SELECTORS.empty);
    const list = document.querySelector(SELECTORS.list);

    setEmptyVisible(empty, list, true);
    bodyRevealMessage({ signedIn: true });
  }

  await loadSections();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void bootstrapExtension();
  });
} else {
  void bootstrapExtension();
}
