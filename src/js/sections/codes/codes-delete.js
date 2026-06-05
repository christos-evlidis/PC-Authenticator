import { dataDelete } from "../../accounts/account-index.js";
import { authNumberGet } from "../../accounts/account-index.js";
import { revealCodesEmptyStatic } from "./codes-empty.js";
import { setEmptyVisible } from "./codes-empty.js";
import { refreshCodesListScroll } from "./codes-scroll.js";
import { getElements } from "./codes-state.js";
import { refreshCardRootsFromList } from "./codes-state.js";
import { removeCardRoot } from "./codes-state.js";
import { setDeleteHeaderLock } from "./codes-state.js";
import { stopTicker } from "./codes-timer.js";

function dismissDeleteConfirmation() {
  document.querySelectorAll(".delete-confirmation").forEach((dialog) => {
    dialog.remove();
  });
  document
    .querySelectorAll(".account-block--delete-pending")
    .forEach((pendingCard) => {
      pendingCard.classList.remove("account-block--delete-pending");
    });
  setDeleteHeaderLock(false);
}

function showDeleteConfirmation(account, card, deleteBtn) {
  if (document.querySelector(".delete-confirmation")) {
    dismissDeleteConfirmation();
  }

  card.classList.add("account-block--delete-pending");

  const dialog = document.createElement("div");
  dialog.className = "delete-confirmation";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-label", "Confirm delete");
  dialog.innerHTML = `
            <span class="delete-confirmation-text">Are you sure?</span>
            <button type="button" class="delete-confirmation-button confirm">Yes</button>
            <button type="button" class="delete-confirmation-button cancel">No</button>
        `;

  const confirmBtn = dialog.querySelector(".confirm");
  const cancelBtn = dialog.querySelector(".cancel");

  const dismiss = () => {
    dismissDeleteConfirmation();
  };

  cancelBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    dismiss();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dismiss();
    }
  });

  confirmBtn?.addEventListener("click", async (event) => {
    event.stopPropagation();
    dismiss();
    await performDeleteAccount(account, card);
  });

  card.appendChild(dialog);
  setDeleteHeaderLock(true);
}

async function performDeleteAccount(account, card) {
  const accountNumber = await authNumberGet();

  if (!accountNumber) {
    return;
  }

  const deleteBtn = card.querySelector(".delete-button");
  if (deleteBtn) {
    deleteBtn.disabled = true;
  }

  const accounts = await dataDelete(accountNumber, account.id);
  const { empty, list } = getElements();

  card.classList.remove("account-block--delete-pending");
  removeCardRoot(card);
  card.remove();
  refreshCardRootsFromList(list);
  refreshCodesListScroll(list);

  const safeRemaining = (
    Array.isArray(accounts) ? accounts : []
  ).filter((item) => item?.secret);

  if (!safeRemaining.length) {
    stopTicker();
    setEmptyVisible(empty, list, true);
    revealCodesEmptyStatic();
  }
}

export function handleDeleteClick(account, card, deleteBtn) {
  showDeleteConfirmation(account, card, deleteBtn);
}
