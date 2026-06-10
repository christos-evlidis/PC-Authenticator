import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { dataActionRemove } from "../../../../accounts/accounts-index.js";

import { headerActionsIconsDisable } from "../../header/header-index.js";
import { headerActionsIconsEnable } from "../../header/header-index.js";

import { codesAnimationDeleteStart } from "../animation/delete/start.js";
import { codesStateStore } from "../state/store.js";

/** Confirms and removes an account from storage with exit animation. */
function codesActionsDelete(account, card, deleteBtn) {
  const dismiss = () => {
    document.querySelectorAll(".delete-confirmation").forEach((dialog) => {
      dialog.remove();
    });
    document.querySelectorAll(".account-block--delete-pending").forEach((pendingCard) => {
      pendingCard.classList.remove("account-block--delete-pending");
    });

    codesStateStore.headerLockedForDelete = false;

    if (codesStateStore.headerLockedForEdit || codesStateStore.headerLockedForDelete) {
      headerActionsIconsDisable();
    } else {
      headerActionsIconsEnable();
    }
  };

  if (document.querySelector(".delete-confirmation")) {
    dismiss();
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

  cancelBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    dismiss();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dismiss();
    }
  });

  confirmBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    dismiss();

    void (async () => {
      const authNumber = await authStorageGet();

      if (!authNumber) {
        return;
      }

      const button = card.querySelector(".delete-button");

      if (button) {
        button.disabled = true;
      }

      try {
        const accounts = await dataActionRemove(authNumber, account.id);
        await codesAnimationDeleteStart(card, accounts);
      } catch (error) {
        console.error("Failed to delete account:", error);

        if (button) {
          button.disabled = false;
        }
      }
    })();
  });

  const actions = card.querySelector(".account-block__actions");

  if (!actions) {
    dismiss();
    return;
  }

  actions.append(dialog);

  codesStateStore.headerLockedForDelete = true;

  if (codesStateStore.headerLockedForEdit || codesStateStore.headerLockedForDelete) {
    headerActionsIconsDisable();
  } else {
    headerActionsIconsEnable();
  }
}

export { codesActionsDelete };
