import { bodyAnimationPlay } from "./sections/body/index.js";
import { BODY_PHASE_SIGNED_IN_CONTENT } from "./sections/body/constants.js";
import { BODY_PHASE_FINISH } from "./sections/body/constants.js";
import { BODY_PHASE_SIGNED_OUT_CONTENT } from "./sections/body/constants.js";
import { BODY_PHASE_EXTENSION_FRAME } from "./sections/body/constants.js";
import { BODY_PHASE_HEADER } from "./sections/body/constants.js";
import { BODY_PHASE_LOGO } from "./sections/body/constants.js";
import { BODY_PHASE_START } from "./sections/body/constants.js";
import { headerAnimationPlay } from "./sections/header/header-index.js";
import { HEADER_PHASE_CONTENT } from "./sections/header/header-constants.js";
import { HEADER_PHASE_FINISH } from "./sections/header/header-constants.js";
import { HEADER_PHASE_FADE_IN } from "./sections/header/header-constants.js";
import { HEADER_PHASE_START } from "./sections/header/header-constants.js";
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

/** Fades the splash logo and runs the frame/header intro sequence. */
async function initFrameIntro() {
  await bodyAnimationPlay(BODY_PHASE_LOGO);
  await bodyAnimationPlay(BODY_PHASE_EXTENSION_FRAME);
  await bodyAnimationPlay(BODY_PHASE_HEADER);
  await headerAnimationPlay(HEADER_PHASE_FADE_IN);
}

/** Registers sections, applies auth, plays intros, and loads section modules. */
async function bootstrapExtension() {
  registerSections();
  initSectionModules();

  const isLoggedIn = await checkAuth();
  await refreshAuth();

  headerAnimationPlay(HEADER_PHASE_START);
  bodyAnimationPlay(BODY_PHASE_START);

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

  await initFrameIntro();
  await headerAnimationPlay(HEADER_PHASE_CONTENT);

  if (!isLoggedIn) {
    await bodyAnimationPlay(BODY_PHASE_SIGNED_OUT_CONTENT);
  } else if (signedInEmpty) {
    const empty = document.querySelector(SELECTORS.empty);
    const list = document.querySelector(SELECTORS.list);

    setEmptyVisible(empty, list, true);
    await bodyAnimationPlay(BODY_PHASE_SIGNED_IN_CONTENT);
  }

  headerAnimationPlay(HEADER_PHASE_FINISH);
  bodyAnimationPlay(BODY_PHASE_FINISH);
  await loadSections();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void bootstrapExtension();
  });
} else {
  void bootstrapExtension();
}
