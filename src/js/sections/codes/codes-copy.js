import { dataUpdate } from "../../accounts/account-index.js";
import { dataOtpIsHotp } from "../../accounts/account-index.js";
import { accountNumberGet } from "../../accounts/account-index.js";
import { dataOtpGetOptions } from "../../accounts/account-index.js";
import { DATA_OTP_DIGITS } from "../../accounts/account-index.js";
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

  if (!accountNumber || !dataOtpIsHotp(root.account)) {
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
    ? dataOtpGetOptions(root.account).digits
    : DATA_OTP_DIGITS;
  const codePattern = new RegExp(`^\\d{${expectedDigits}}$`);

  if (!codePattern.test(raw)) {
    return;
  }

  await navigator.clipboard.writeText(raw);

  if (root && dataOtpIsHotp(root.account)) {
    applyHotpAdvanceUI(root);
    void persistHotpAdvance(root);
  }
}
