import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../body-constants.js";

/** Resolves the signed-out message text from stack data or the default copy. */
export function bodyMessageFullText(stack) {
  const stored = stack?.dataset?.fullText;

  return stored ? stored.replace(/\\n/g, "\n") : BODY_SIGNED_OUT_MESSAGE_TEXT;
}

/** Applies full message text to the spacer for layout measurement. */
export function bodyMessageSpacerApply(spacer, fullText) {
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    spacer.innerHTML = `${lines[0]}<br>${lines.slice(1).join("<br>")}`;
  } else {
    spacer.textContent = fullText.trim();
  }
}

/** Applies final message text to the display element. */
export function bodyMessageDisplayApply(display, fullText) {
  const lines = fullText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    display.innerHTML = `${lines[0]}<br>${lines.slice(1).join("<br>")}`;
  } else {
    display.textContent = fullText.trim();
  }
}
