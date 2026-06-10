import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { bodyAnimationReset } from "../../../body/body-index.js";
import { bodyAnimationStart } from "../../../body/body-index.js";

import { codesStateStore } from "../../state/store.js";
import { codesTickerStop } from "../../ticker/run.js";
import { codesElementsGet } from "../../util/elements.js";

import { CODES_HIDDEN_CLASS } from "../../codes-const.js";
import { CODES_VAR_SLIDE_MS } from "../../codes-const.js";

/** Runs full delete exit animation and updates signed-in chrome. */
async function codesAnimationDeleteStart(card, remainingAccounts) {
  const { list } = codesElementsGet();
  const direction = Math.random() < 0.5 ? "left" : "right";
  const slideMs = animCssMsGet(card, CODES_VAR_SLIDE_MS);

  card.classList.remove("account-block--delete-pending");

  let layer = card.querySelector(".account-block__exit-layer");

  if (!layer) {
    layer = document.createElement("div");
    layer.className = "account-block__exit-layer";

    while (card.firstChild) {
      layer.append(card.firstChild);
    }

    card.append(layer);
  }

  card.classList.add("account-block--exit-spacer");

  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        layer.classList.add(`account-block__exit-layer--dash-${direction}`);

        let settled = false;

        const done = () => {
          if (settled) {
            return;
          }

          settled = true;
          resolve();
        };

        const fallbackId = window.setTimeout(done, slideMs + 40);

        layer.addEventListener(
          "transitionend",
          (event) => {
            if (event.target !== layer || event.propertyName !== "transform") {
              return;
            }

            window.clearTimeout(fallbackId);
            done();
          },
          { once: true },
        );
      });
    });
  });

  layer.remove();

  await new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(fallbackId);
      card.removeEventListener("transitionend", onTransitionEnd);
      resolve();
    };

    const fallbackId = window.setTimeout(finish, slideMs + 60);

    const onTransitionEnd = (event) => {
      if (event.target !== card) {
        return;
      }

      const { propertyName } = event;

      if (propertyName !== "height" && propertyName !== "max-height") {
        return;
      }

      finish();
    };

    card.addEventListener("transitionend", onTransitionEnd);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.add("is-collapsing", "is-collapsed");
      });
    });
  });

  codesStateStore.cardRoots = codesStateStore.cardRoots.filter((root) => root.card !== card);
  card.remove();

  const safeRemaining = (Array.isArray(remainingAccounts) ? remainingAccounts : []).filter(
    (item) => item?.secret,
  );

  if (!safeRemaining.length) {
    codesTickerStop();
    list?.classList.add(CODES_HIDDEN_CLASS);
    await authChromeApply({ isSignedIn: true, hasAccounts: false });
    bodyAnimationReset();
    await bodyAnimationStart();
  } else {
    await authChromeApply({ isSignedIn: true, hasAccounts: true });
  }
}

export { codesAnimationDeleteStart };
