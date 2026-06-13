import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { CODES_VAR_SLIDE_MS } from "../../../../../const/const.codes.js";

/** Slides a newly inserted card in from the top. */
function codesAnimationAddSlide(card, durationMs) {
  const slideMs = durationMs ?? animCssMsGet(card, CODES_VAR_SLIDE_MS);

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(fallbackId);
      card.removeEventListener("animationend", onAnimationEnd);
      card.classList.remove(
        "is-manual-add-slide",
        "is-manual-add-slide-pending",
        "is-manual-add-slide-active",
      );
      resolve();
    };

    const fallbackId = window.setTimeout(finish, slideMs + 60);

    const onAnimationEnd = (event) => {
      if (
        event.target === card &&
        event.animationName === "account-block-slide-in-from-top"
      ) {
        finish();
      }
    };

    card.addEventListener("animationend", onAnimationEnd);
    card.classList.add("is-manual-add-slide", "is-manual-add-slide-pending");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.remove("is-manual-add-slide-pending");
        card.classList.add("is-manual-add-slide-active");
      });
    });
  });
}

export { codesAnimationAddSlide };
