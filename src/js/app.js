import { bootstrap } from "./bootstrap.js";
import { loadAnimationRun } from "./sections/sequences/index.js";
import { initSectionModules } from "./sections/section-index.js";
import { registerSections } from "./sections/section-index.js";
import { themeSyncFromChromeStorage } from "./utils/utility-theme.js";

void startExtension();

/** Applies theme, bootstraps auth/data restore, then plays the load intro. */
async function startExtension() {
  await themeSyncFromChromeStorage();
  registerSections();
  initSectionModules();

  let isSignedIn = false;

  try {
    ({ isSignedIn } = await bootstrap());
  } catch {
    return;
  }

  await loadAnimationRun(isSignedIn);
}
