import { dataUpdate } from "../../accounts/account-index.js";
import { dataHotpIs } from "../../accounts/account-index.js";
import { accountNumberGet } from "../../accounts/account-index.js";
import { dataOtpOptionsGet } from "../../accounts/account-index.js";
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

async function persistHotpAdvance(root) {
  const accountNumber = await accountNumberGet();

  if (!accountNumber || !dataHotpIs(root.account)) {
    return;
  }

  await dataUpdate(accountNumber, root.account.id, {
    counter: getHotpCounterValue(root.account),
  });
  updateAccountCode(root);

  if (root.els?.counter) {
    root.els.counter.textContent = formatHotpCounterDisplay(root.account);
  }
}

export async function showCopiedFeedback() {}

export async function copyCode(card, codeText) {
  const raw = String(codeText ?? "").replace(/\s+/g, "");
  const root = getCardRoots().find((item) => item.card === card);
  const expectedDigits = root
    ? dataOtpOptionsGet(root.account).digits
    : TOTP_DIGITS;
  const codePattern = new RegExp(`^\\d{${expectedDigits}}$`);

  if (!codePattern.test(raw)) {
    return;
  }

  await navigator.clipboard.writeText(raw);

  if (root && dataHotpIs(root.account)) {
    applyHotpAdvanceUI(root);
    void persistHotpAdvance(root);
  }
}
