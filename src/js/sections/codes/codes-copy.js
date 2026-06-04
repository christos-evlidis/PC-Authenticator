import { accountUpdate } from "../../accounts/account-index.js";
import { accountHotpIs } from "../../accounts/account-index.js";
import { accountOtpOptionsGet } from "../../accounts/account-index.js";
import { TOTP_DIGITS } from "../../accounts/account-index.js";
import { getCardRoots } from "./codes-state.js";
import { formatHotpCounterDisplay } from "./codes-timer.js";
import { getHotpCounterValue } from "./codes-timer.js";
import { updateAccountCode } from "./codes-timer.js";

function applyHotpAdvanceUI(root) {
  root.account.counter = getHotpCounterValue(root.account) + 1;
  updateAccountCode(root);

  if (root.els?.counter) {
    root.els.counter.textContent = formatHotpCounterDisplay(root.account);
  }
}

function persistHotpAdvance(root) {
  chrome.storage.local.get(["accountNumber"], async ({ accountNumber }) => {
    if (!accountNumber || !accountHotpIs(root.account)) {
      return;
    }

    await accountUpdate(accountNumber, root.account.id, {
      counter: getHotpCounterValue(root.account),
    });
    updateAccountCode(root);

    if (root.els?.counter) {
      root.els.counter.textContent = formatHotpCounterDisplay(root.account);
    }
  });
}

export async function showCopiedFeedback() {}

export async function copyCode(card, codeText) {
  const raw = String(codeText ?? "").replace(/\s+/g, "");
  const root = getCardRoots().find((item) => item.card === card);
  const expectedDigits = root
    ? accountOtpOptionsGet(root.account).digits
    : TOTP_DIGITS;
  const codePattern = new RegExp(`^\\d{${expectedDigits}}$`);

  if (!codePattern.test(raw)) {
    return;
  }

  await navigator.clipboard.writeText(raw);

  if (root && accountHotpIs(root.account)) {
    applyHotpAdvanceUI(root);
    persistHotpAdvance(root);
  }
}
