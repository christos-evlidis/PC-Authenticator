import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { CODES_VAR_SLIDE_MS } from "../../../../../const/const.codes.js";

/** Expands the add spacer and pushes existing cards down. */
function _codesAnimationAddStart(spacer, durationMs) {
  const slideMs = durationMs ?? animCssMsGet(spacer, CODES_VAR_SLIDE_MS);

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(fallbackId);
      spacer.removeEventListener("transitionend", onTransitionEnd);
      resolve();
    };

    const fallbackId = window.setTimeout(finish, slideMs + 60);

    const onTransitionEnd = (event) => {
      if (event.target !== spacer) {
        return;
      }

      const { propertyName } = event;

      if (propertyName !== "height" && propertyName !== "max-height") {
        return;
      }

      finish();
    };

    spacer.addEventListener("transitionend", onTransitionEnd);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        spacer.classList.add("is-expanding");
      });
    });
  });
}

export { _codesAnimationAddStart as codesAnimationAddStart };
