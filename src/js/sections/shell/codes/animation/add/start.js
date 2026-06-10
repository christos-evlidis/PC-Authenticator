import { CODES_DELETE_SLIDE_MS } from "../../codes-const.js";

const CODES_ADD_ENTER_TRANSITION_PROPERTIES = new Set([
  "height",
  "max-height",
  "min-height",
  "margin-bottom",
  "padding-top",
  "padding-bottom",
  "opacity",
  "transform",
]);

/** Expands a new card from the top and pushes existing cards down. */
function codesAnimationAddStart(card, durationMs = CODES_DELETE_SLIDE_MS) {
  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(fallbackId);
      card.removeEventListener("transitionend", onTransitionEnd);
      card.classList.remove("is-manual-add-enter", "is-manual-add-enter-active");
      resolve();
    };

    const fallbackId = window.setTimeout(finish, durationMs + 60);

    const onTransitionEnd = (event) => {
      if (event.target !== card) {
        return;
      }

      if (!CODES_ADD_ENTER_TRANSITION_PROPERTIES.has(event.propertyName)) {
        return;
      }

      finish();
    };

    card.addEventListener("transitionend", onTransitionEnd);
    card.classList.add("is-manual-add-enter");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.add("is-manual-add-enter-active");
      });
    });
  });
}

export { codesAnimationAddStart };
