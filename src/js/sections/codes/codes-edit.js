import { dataUpdate } from "../../accounts/account-index.js";
import { dataOtpIsHotp } from "../../accounts/account-index.js";
import { authNumberGet } from "../../accounts/account-index.js";
import { DEFAULT_CONTACT } from "./codes-state.js";
import { EMAIL_PLACEHOLDER } from "./codes-state.js";
import { findCardRoot } from "./codes-state.js";
import { setEditHeaderLock } from "./codes-state.js";
import { formatHotpCounterDisplay } from "./codes-timer.js";
import { parseHotpCounterInput } from "./codes-timer.js";
import { updateAccountCode } from "./codes-timer.js";

function isValidEmail(email) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

function normalizeContactLine(text) {
  const trimmed = text.trim();

  if (!trimmed || trimmed === EMAIL_PLACEHOLDER) {
    return "";
  }

  return trimmed;
}

export function getAccountContactDisplay(account) {
  if (account.email) {
    return account.email;
  }

  if (account.username) {
    return account.username;
  }

  return EMAIL_PLACEHOLDER;
}

function finishEditing(
  card,
  els,
  editBtn,
  deleteBtn,
  buttonContainer,
  onCardClick,
) {
  els.name.contentEditable = false;
  els.email.contentEditable = false;

  if (els.counter) {
    els.counter.contentEditable = false;
  }

  buttonContainer.remove();
  editBtn.classList.remove("hidden");
  deleteBtn.classList.remove("hidden");
  card.classList.remove("editing");
  card.addEventListener("click", onCardClick);
  setEditHeaderLock(false);
}

function applyAccountEditLocally(account, els, patch, root) {
  account.name = patch.name;

  if (patch.email !== undefined) {
    account.email = patch.email;
  }

  if (patch.username !== undefined) {
    account.username = patch.username;
  }

  if (patch.counter != null) {
    account.counter = patch.counter;
  }

  if (els.name) {
    els.name.textContent = account.name || "Account";
  }

  if (els.email) {
    els.email.textContent = getAccountContactDisplay(account);
  }

  if (els.counter) {
    els.counter.textContent = formatHotpCounterDisplay(account);
  }

  if (root) {
    updateAccountCode(root);
  }
}

async function persistAccountEditInBackground(accountNumber, accountId, patch) {
  await dataUpdate(accountNumber, accountId, patch);
}

async function saveAccountEdit(
  account,
  card,
  els,
  editBtn,
  deleteBtn,
  buttonContainer,
  onCardClick,
  snapshot,
) {
  const newName = els.name.textContent.trim();
  const contactLine = els.email.textContent.trim();
  let newEmail = "";
  let newUsername = "";

  if (account.email) {
    newEmail = normalizeContactLine(contactLine);
  } else {
    newUsername = normalizeContactLine(contactLine);
  }

  if (!newName) {
    window.alert("Account name cannot be empty");
    return;
  }

  const isHotp = dataOtpIsHotp(account);
  let newCounter = null;

  if (isHotp && els.counter) {
    newCounter = parseHotpCounterInput(els.counter.textContent);

    if (newCounter == null) {
      window.alert("Enter a valid counter (0 or greater).");
      return;
    }
  }

  const counterUnchanged = !isHotp || String(newCounter) === snapshot.counter;

  if (
    newName === snapshot.name &&
    contactLine === snapshot.contact &&
    counterUnchanged
  ) {
    finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick);
    return;
  }

  if (!newEmail && !newUsername) {
    if (account.email) {
      newEmail = DEFAULT_CONTACT;
    } else {
      newUsername = DEFAULT_CONTACT;
    }
  }

  if (account.email && newEmail && !isValidEmail(newEmail)) {
    window.alert("Please enter a valid email address");
    return;
  }

  const patch = { name: newName };

  if (account.email) {
    patch.email = newEmail;
  } else {
    patch.username = newUsername;
  }

  if (isHotp && !counterUnchanged) {
    patch.counter = newCounter;
  }

  const root = findCardRoot(card);
  const targetAccount = root?.account ?? account;
  applyAccountEditLocally(targetAccount, els, patch, root);
  finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick);

  const accountNumber = await authNumberGet();

  if (!accountNumber) {
    throw new Error("No account number in storage.");
  }

  await persistAccountEditInBackground(accountNumber, account.id, patch);
}

export function startAccountEdit(card, account, els, onCardClick) {
  const editBtn = card.querySelector(".edit-button");
  const deleteBtn = card.querySelector(".delete-button");
  const actions = card.querySelector(".account-block__actions");

  if (!editBtn || !deleteBtn || !actions) {
    return;
  }

  editBtn.classList.add("hidden");
  deleteBtn.classList.add("hidden");
  card.classList.add("editing");
  card.removeEventListener("click", onCardClick);

  const isHotp = dataOtpIsHotp(account);

  els.name.contentEditable = true;
  els.email.contentEditable = true;

  if (isHotp && els.counter) {
    els.counter.contentEditable = true;
    els.counter.focus();
  } else {
    els.email.focus();
  }

  setEditHeaderLock(true);

  const snapshot = {
    name: (account.name || "Account").trim(),
    contact: getAccountContactDisplay(account).trim(),
    counter: isHotp ? formatHotpCounterDisplay(account) : null,
  };

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "edit-buttons-container";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "save-edit-button";
  saveButton.title = "Save changes";
  saveButton.setAttribute("aria-label", "Save changes");
  saveButton.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "cancel-edit-button";
  cancelButton.title = "Cancel";
  cancelButton.setAttribute("aria-label", "Cancel edit");
  cancelButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';

  buttonContainer.appendChild(saveButton);
  buttonContainer.appendChild(cancelButton);
  actions.appendChild(buttonContainer);

  saveButton.addEventListener("click", (event) => {
    event.stopPropagation();
    void saveAccountEdit(
      account,
      card,
      els,
      editBtn,
      deleteBtn,
      buttonContainer,
      onCardClick,
      snapshot,
    );
  });

  cancelButton.addEventListener("click", (event) => {
    event.stopPropagation();
    els.name.textContent = snapshot.name;
    els.email.textContent = snapshot.contact;

    if (els.counter && snapshot.counter != null) {
      els.counter.textContent = snapshot.counter;
    }

    finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick);
  });
}
