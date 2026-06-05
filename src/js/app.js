import { introAnimationRun } from "./intro/index.js";
import { initSectionModules } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { themeInit } from "./utils/utility-theme.js";
import { refreshAuth } from "./utils/utility-auth.js";

themeInit();

/** Registers sections, wires modules, applies auth chrome, and plays the load intro. */
async function bootstrapExtension() {
  registerSections();
  initSectionModules();
  await refreshAuth();
  await introAnimationRun();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void bootstrapExtension();
  });
} else {
  void bootstrapExtension();
}
