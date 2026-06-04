import { accountHotpIs } from "../../accounts/account-index.js";
import { copyCode } from "./codes-copy.js";
import { handleDeleteClick } from "./codes-delete.js";
import { getAccountContactDisplay } from "./codes-edit.js";
import { startAccountEdit } from "./codes-edit.js";
import { pushCardRoot } from "./codes-state.js";
import { formatHotpCounterDisplay } from "./codes-timer.js";

export function bindCard(card, account) {
  const isHotp = accountHotpIs(account);
  const els = {
    name: card.querySelector(".account-name"),
    email: card.querySelector(".account-email"),
    code: card.querySelector(".otp-code"),
    timer: card.querySelector(".timer-wrapper"),
    pieFg: card.querySelector(".pie-fg"),
    counter: card.querySelector(".account-hotp-counter"),
  };

  if (isHotp) {
    card.classList.add("account-block--hotp");

    if (els.counter) {
      els.counter.textContent = formatHotpCounterDisplay(account);
      els.counter.classList.remove("hidden");
    }
  }

  if (els.name) {
    els.name.textContent = account.name || "Account";
  }

  if (els.email) {
    els.email.textContent = getAccountContactDisplay(account);
    els.email.classList.remove("hidden");
  }

  card.dataset.accountId = String(account.id);
  card.title = "Copy code";

  const onCardClick = () => {
    copyCode(card, els.code?.textContent ?? "");
  };

  const editBtn = card.querySelector(".edit-button");
  editBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    startAccountEdit(card, account, els, onCardClick);
  });

  const deleteBtn = card.querySelector(".delete-button");
  deleteBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    handleDeleteClick(account, card, deleteBtn);
  });

  card.addEventListener("click", onCardClick);

  const root = {
    account,
    els,
    card,
    lastPiePath: { value: "" },
  };

  pushCardRoot(root);

  return root;
}
