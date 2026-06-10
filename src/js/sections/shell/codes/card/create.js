import { codesCardBind } from "./bind.js";

/** Clones the card template and binds it to an account. */
function codesCardCreate(template, account) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".account-block");

  if (!card) {
    return null;
  }

  codesCardBind(card, account);
  return card;
}

export { codesCardCreate };
