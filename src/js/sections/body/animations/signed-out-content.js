import { bodyAnimateForContent } from "./content.js";
import { BODY_CONTENT_SIGNED_OUT_SELECTOR } from "../constants.js";
import { BODY_SIGNED_OUT_ICON_POP_CLASS } from "../constants.js";
import { BODY_SIGNED_OUT_MESSAGE_TEXT } from "../constants.js";
import { BODY_SIGNED_OUT_TEXT_TYPE_CLASS } from "../constants.js";
import { BODY_VAR_SIGNED_OUT_ICON_POP_MS } from "../constants.js";
import { BODY_VAR_SIGNED_OUT_TEXT_TYPE_MS } from "../constants.js";

const SIGNED_OUT_CONTENT = {
  contentSelector: BODY_CONTENT_SIGNED_OUT_SELECTOR,
  defaultMessage: BODY_SIGNED_OUT_MESSAGE_TEXT,
  iconPopClass: BODY_SIGNED_OUT_ICON_POP_CLASS,
  textTypeClass: BODY_SIGNED_OUT_TEXT_TYPE_CLASS,
  iconPopMsVar: BODY_VAR_SIGNED_OUT_ICON_POP_MS,
  textTypeMsVar: BODY_VAR_SIGNED_OUT_TEXT_TYPE_MS,
  iconPopAnimation: "bodySignedOutIconPop",
  formatContinuationLine: (line) => line,
};

/**
 * Resets, statically reveals, or animates the signed-out body message.
 *
 * @param {object} [options]
 * @param {boolean} [options.reset] Clears animation state before bootstrap.
 * @param {boolean} [options.static] Skips animation and shows the final message.
 */
export async function bodyAnimateForSignedOutContent(options = {}) {
  await bodyAnimateForContent(SIGNED_OUT_CONTENT, options);
}
