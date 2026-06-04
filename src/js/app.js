/**
 * Extension popup entry — theme, auth, and section bootstrap.
 */
import { bodyAnimationPlay } from "./sections/body/body-index.js";
import { BODY_PHASE_FINISH } from "./sections/body/body-constants.js";
import { BODY_PHASE_CONTENT } from "./sections/body/body-constants.js";
import { BODY_PHASE_EXTENSION_FRAME } from "./sections/body/body-constants.js";
import { BODY_PHASE_HEADER } from "./sections/body/body-constants.js";
import { BODY_PHASE_LOGO } from "./sections/body/body-constants.js";
import { BODY_PHASE_START } from "./sections/body/body-constants.js";
import { headerAnimationPlay } from "./sections/header/header-index.js";
import { HEADER_PHASE_CONTENT } from "./sections/header/header-constants.js";
import { HEADER_PHASE_FINISH } from "./sections/header/header-constants.js";
import { HEADER_PHASE_FADE_IN } from "./sections/header/header-constants.js";
import { HEADER_PHASE_START } from "./sections/header/header-constants.js";
import { initSectionModules } from "./sections/section-index.js";
import { loadSections } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { themeInit } from "./utils/utility-theme.js";
import { checkAuth } from "./utils/utility-auth.js";
import { refreshAuth } from "./utils/utility-auth.js";

themeInit();

/** Runs splash shrink and header slot sequence before content intros. */
async function initFrameIntro() {
  headerAnimationPlay(HEADER_PHASE_START);
  bodyAnimationPlay(BODY_PHASE_START);
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

  await initFrameIntro();
  await headerAnimationPlay(HEADER_PHASE_CONTENT);

  if (!isLoggedIn) {
    await bodyAnimationPlay(BODY_PHASE_CONTENT);
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
