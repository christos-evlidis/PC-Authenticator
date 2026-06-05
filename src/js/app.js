import { introLoadAnimationRun } from "./sections/intro/index.js";
import { initSectionModules } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { themeInit } from "./utils/utility-theme.js";
import { refreshAuth } from "./utils/utility-auth.js";

themeInit();
bootstrapExtension();

/** Registers sections, wires modules, applies auth chrome, and plays the load intro. */
async function bootstrapExtension() {
  registerSections();
  initSectionModules();
  await refreshAuth();
  await introLoadAnimationRun();
}

