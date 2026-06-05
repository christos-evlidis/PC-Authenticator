import { bodyAnimateForContent } from "./content.js";
import { BODY_CONTENT_SIGNED_IN_SELECTOR } from "../constants.js";
import { BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT } from "../constants.js";
import { BODY_SIGNED_IN_ICON_POP_CLASS } from "../constants.js";
import { BODY_SIGNED_IN_TEXT_TYPE_CLASS } from "../constants.js";
import { BODY_VAR_SIGNED_IN_ICON_POP_MS } from "../constants.js";
import { BODY_VAR_SIGNED_IN_TEXT_TYPE_MS } from "../constants.js";

const SIGNED_IN_CONTENT = {
  contentSelector: BODY_CONTENT_SIGNED_IN_SELECTOR,
  defaultMessage: BODY_SIGNED_IN_EMPTY_MESSAGE_TEXT,
  iconPopClass: BODY_SIGNED_IN_ICON_POP_CLASS,
  textTypeClass: BODY_SIGNED_IN_TEXT_TYPE_CLASS,
  iconPopMsVar: BODY_VAR_SIGNED_IN_ICON_POP_MS,
  textTypeMsVar: BODY_VAR_SIGNED_IN_TEXT_TYPE_MS,
  iconPopAnimation: "bodySignedInIconPop",
  formatContinuationLine: (line) => line.replace(/\+/g, "<strong>+</strong>"),
};

/**
 * Resets, statically reveals, or animates the signed-in empty-codes body message.
 *
 * @param {object} [options]
 * @param {boolean} [options.reset] Clears animation state before bootstrap.
 * @param {boolean} [options.static] Skips animation and shows the final message.
 */
export async function bodyAnimateForSignedInContent(options = {}) {
  await bodyAnimateForContent(SIGNED_IN_CONTENT, options);
}
