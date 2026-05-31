/**
 * Extension popup entry — theme, auth, and section bootstrap.
 */
import { bodyAnimationPlay } from "./sections/body/body-animation.js";
import { bodyIntroPrepare } from "./sections/body/body-animation.js";
import { bodyApply } from "./sections/body/body-index.js";
import { headerAnimationPlay } from "./sections/header/header-animation.js";
import { headerIntroPrepare } from "./sections/header/header-animation.js";
import { headerApply } from "./sections/header/header-index.js";
import { initSectionModules } from "./sections/section-index.js";
import { loadSections } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { initTheme } from "./theme/theme.js";

initTheme();

/** Reads storage, applies header/body views, and returns whether the user is signed in. */
async function checkAuth() {
  const { accountNumber } = await chrome.storage.local.get(["accountNumber"]);
  const isLoggedIn = Boolean(accountNumber);

  headerApply(isLoggedIn, accountNumber ?? null);
  bodyApply(isLoggedIn, accountNumber ?? null);

  return isLoggedIn;
}

/** Runs the header title/button intro animation. */
async function initHeaderIntro() {
  headerIntroPrepare();
  await headerAnimationPlay();
}

/** Runs the signed-out body icon/message intro animation. */
async function initBodyIntro() {
  bodyIntroPrepare();
  await bodyAnimationPlay();
}

/** Registers sections, applies auth, plays intros, and loads section modules. */
async function bootstrapExtension() {
  registerSections();
  initSectionModules();

  const isLoggedIn = await checkAuth();

  await initHeaderIntro();

  if (!isLoggedIn) {
    await initBodyIntro();
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
