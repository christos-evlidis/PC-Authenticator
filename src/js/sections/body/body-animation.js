import { delay } from "../../utils/utility-animation.js";
import { BODY_ICON_POP_MS } from "./body-constants.js";
import { BODY_MESSAGE_TYPE_MS } from "./body-constants.js";
import { BODY_ROOT_SELECTOR } from "./body-constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "./body-constants.js";
import { bodyIntroElementsGet } from "./body-render.js";

/** Resets signed-out body chrome to the pre-intro hidden state. */
export function bodyIntroPrepare() {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const elements = bodyIntroElementsGet();

  root?.classList.remove("is-intro-complete");
  root?.classList.add("is-intro-pending");

  if (elements) {
    const stored = elements.stack.dataset?.fullText;
    const fullText = stored
      ? stored.replace(/\\n/g, "\n")
      : BODY_SIGNED_OUT_MESSAGE_TEXT;

    elements.stack.dataset.fullText = fullText;

    const spacerLines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (spacerLines.length > 1) {
      elements.spacer.innerHTML = `${spacerLines[0]}<br>${spacerLines.slice(1).join("<br>")}`;
    } else {
      elements.spacer.textContent = fullText.trim();
    }

    elements.display.textContent = "";
    elements.display.classList.remove("is-intro-typing");
  }

  elements?.icon?.classList.remove("is-pop-active", "is-pop-revealed");
  elements?.icon?.classList.add("is-pop-pending");
}

/** Shows icon and message immediately without animation. */
export function bodyAnimationStatic() {
  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const elements = bodyIntroElementsGet();

  root?.classList.remove("is-intro-pending");
  root?.classList.add("is-intro-complete");

  if (elements) {
    const stored = elements.stack.dataset?.fullText;
    const fullText = stored
      ? stored.replace(/\\n/g, "\n")
      : BODY_SIGNED_OUT_MESSAGE_TEXT;

    elements.stack.dataset.fullText = fullText;

    const messageLines = fullText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const messageHtml =
      messageLines.length > 1
        ? `${messageLines[0]}<br>${messageLines.slice(1).join("<br>")}`
        : null;

    if (messageHtml) {
      elements.spacer.innerHTML = messageHtml;
      elements.display.innerHTML = messageHtml;
    } else {
      elements.spacer.textContent = fullText.trim();
      elements.display.textContent = fullText.trim();
    }

    elements.display.classList.remove("is-intro-typing");
  }

  elements?.icon?.classList.remove("is-pop-pending", "is-pop-active");
  elements?.icon?.classList.add("is-pop-revealed");
}

/** Plays the signed-out lock icon pop animation. */
async function bodyIconPop(icon) {
  icon.classList.remove("is-pop-pending");
  icon.classList.add("is-pop-active");

  await delay(BODY_ICON_POP_MS);

  icon.classList.remove("is-pop-active");
  icon.classList.add("is-pop-revealed");
}

/** Types the signed-out message character by character, then applies line-break HTML. */
async function bodyMessageType(display, fullText, durationMs) {
  display.textContent = "";
  display.classList.add("is-intro-typing");

  const characters = [...fullText];
  const stepMs =
    characters.length > 0 ? durationMs / characters.length : durationMs;

  for (const character of characters) {
    display.textContent += character;

    if (stepMs > 0) {
      await delay(stepMs);
    }
  }

  display.classList.remove("is-intro-typing");

  const messageLines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (messageLines.length > 1) {
    display.innerHTML = `${messageLines[0]}<br>${messageLines.slice(1).join("<br>")}`;
  } else {
    display.textContent = fullText.trim();
  }
}

/** Pops the icon, then types the signed-out message. */
export async function bodyAnimationPlay() {
  bodyIntroPrepare();

  const root = document.querySelector(BODY_ROOT_SELECTOR);
  const elements = bodyIntroElementsGet();

  if (elements?.icon) {
    await bodyIconPop(elements.icon);
  }

  if (elements) {
    const stored = elements.stack.dataset?.fullText;
    const fullText = stored
      ? stored.replace(/\\n/g, "\n")
      : BODY_SIGNED_OUT_MESSAGE_TEXT;

    await bodyMessageType(elements.display, fullText, BODY_MESSAGE_TYPE_MS);
  }

  root?.classList.remove("is-intro-pending");
  root?.classList.add("is-intro-complete");
}
