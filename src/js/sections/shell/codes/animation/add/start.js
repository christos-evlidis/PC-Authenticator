import { CODES_DELETE_SLIDE_MS } from "../../codes-const.js";

/** Expands the add spacer before card insertion. */
function codesAnimationAddStart(spacer, durationMs = CODES_DELETE_SLIDE_MS) {
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

    const fallbackId = window.setTimeout(finish, durationMs + 60);

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

export { codesAnimationAddStart };
