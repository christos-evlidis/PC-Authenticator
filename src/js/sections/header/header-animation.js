import { delay } from "../../utils/utility-animation.js";
import { HEADER_BTN_POP_MS, HEADER_BTN_POP_STAGGER_MS, HEADER_ROOT_SELECTOR, HEADER_TITLE_SELECTOR, HEADER_TITLE_TEXT, HEADER_TITLE_TYPE_MS } from "./header-constants.js";
import { headerVisibleButtonsGet } from "./header-render.js";

/** Resets header chrome to the pre-intro hidden state. */
export function headerIntroPrepare() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const buttons = headerVisibleButtonsGet();

  header?.classList.remove("is-intro-complete");
  header?.classList.add("is-intro-pending");

  if (title) {
    const fullTitle =
      title.dataset.fullTitle?.trim() ||
      title.textContent.trim() ||
      HEADER_TITLE_TEXT;

    title.dataset.fullTitle = fullTitle;
    title.textContent = "";
    title.classList.remove("is-intro-typing");
  }

  buttons.forEach((button) => {
    button.classList.remove("is-pop-active", "is-pop-revealed");
    button.classList.add("is-pop-pending");
  });
}

/** Shows title and buttons immediately without animation. */
export function headerAnimationStatic() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const buttons = headerVisibleButtonsGet();

  header?.classList.remove("is-intro-pending");
  header?.classList.add("is-intro-complete");

  if (title) {
    const fullTitle =
      title.dataset.fullTitle?.trim() ||
      title.textContent.trim() ||
      HEADER_TITLE_TEXT;

    title.dataset.fullTitle = fullTitle;
    title.textContent = fullTitle;
    title.classList.remove("is-intro-typing");
  }

  buttons.forEach((button) => {
    button.classList.remove("is-pop-pending", "is-pop-active");
    button.classList.add("is-pop-revealed");
  });
}

/** Types the header title character by character over the given duration. */
async function headerTitleType(title, fullText, durationMs) {
  title.textContent = "";
  title.classList.add("is-intro-typing");

  const characters = [...fullText];
  const stepMs =
    characters.length > 0 ? durationMs / characters.length : durationMs;

  for (const character of characters) {
    title.textContent += character;

    if (stepMs > 0) {
      await delay(stepMs);
    }
  }

  title.classList.remove("is-intro-typing");
}

/** Pops each header button in sequence with staggered delays. */
async function headerButtonsPop(buttons) {
  for (let index = 0; index < buttons.length; index += 1) {
    if (index > 0) {
      await delay(HEADER_BTN_POP_STAGGER_MS);
    }

    const button = buttons[index];

    button.classList.remove("is-pop-pending");
    button.classList.add("is-pop-active");

    await delay(HEADER_BTN_POP_MS);

    button.classList.remove("is-pop-active");
    button.classList.add("is-pop-revealed");
  }
}

/** Types the title, then pops each visible header button in sequence. */
export async function headerAnimationPlay() {
  headerIntroPrepare();

  const header = document.querySelector(HEADER_ROOT_SELECTOR);
  const title = document.querySelector(HEADER_TITLE_SELECTOR);
  const buttons = headerVisibleButtonsGet();

  if (title) {
    const fullText =
      title.dataset.fullTitle?.trim() ||
      title.textContent.trim() ||
      HEADER_TITLE_TEXT;

    await headerTitleType(title, fullText, HEADER_TITLE_TYPE_MS);
  }

  await headerButtonsPop(buttons);

  header?.classList.remove("is-intro-pending");
  header?.classList.add("is-intro-complete");
}
