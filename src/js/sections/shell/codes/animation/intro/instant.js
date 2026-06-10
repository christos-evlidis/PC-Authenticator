import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { CODES_VAR_SLIDE_MS } from "../../codes-const.js";

/** Plays slide-in animation for a single account card. */
function codesAnimationIntroInstant(card) {
  return new Promise((resolve) => {
    card.classList.remove("is-slide-pending");
    card.classList.add("is-slide-active");

    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      card.classList.remove(
        "is-slide-active",
        "is-slide-from-left",
        "is-slide-from-right",
        "is-manual-add-slide",
      );
      resolve();
    };

    const slideAnimationName = card.classList.contains("is-manual-add-slide")
      ? "account-block-slide-in-manual"
      : "account-block-slide-in";

    card.addEventListener(
      "animationend",
      (event) => {
        if (event.target === card && event.animationName === slideAnimationName) {
          finish();
        }
      },
      { once: true },
    );

    const slideMs = animCssMsGet(card, CODES_VAR_SLIDE_MS);

    window.setTimeout(finish, slideMs + 32);
  });
}

export { codesAnimationIntroInstant };
