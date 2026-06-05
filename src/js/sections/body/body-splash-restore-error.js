import { BODY_HIDDEN_CLASS } from "./body-constants.js";
import { BODY_SPLASH_RESTORE_ERROR_CLASS } from "./body-constants.js";
import { BODY_SPLASH_RESTORE_ERROR_SELECTOR } from "./body-constants.js";
import { BODY_SPLASH_RESTORE_RETRY_SELECTOR } from "./body-constants.js";
import { BODY_SPLASH_SELECTOR } from "./body-constants.js";

/** Shows the splash restore error state with a reload retry button. */
export function bodySplashRestoreErrorShow() {
  const splash = document.querySelector(BODY_SPLASH_SELECTOR);
  const error = document.querySelector(BODY_SPLASH_RESTORE_ERROR_SELECTOR);
  const retry = document.querySelector(BODY_SPLASH_RESTORE_RETRY_SELECTOR);

  splash?.classList.add(BODY_SPLASH_RESTORE_ERROR_CLASS);
  error?.classList.remove(BODY_HIDDEN_CLASS);

  if (retry && !retry.dataset.bound) {
    retry.dataset.bound = "true";
    retry.addEventListener("click", () => {
      location.reload();
    });
  }
}
