import { DELETE_SLIDE_MS } from "./codes-state.js";
import { bindCard } from "./codes-card-actions.js";

export function createManualAddSpacer() {
  const spacer = document.createElement("li");

  spacer.className = "account-block account-block--manual-add-spacer";
  spacer.setAttribute("aria-hidden", "true");
  return spacer;
}

export function expandManualAddSpacer(spacer, durationMs = DELETE_SLIDE_MS) {
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

export function createCardFromTemplate(template, account) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".account-block");

  if (!card) {
    return null;
  }

  bindCard(card, account);
  return card;
}
