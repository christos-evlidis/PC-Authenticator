import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { dataActionUpdate } from "../../../../accounts/accounts-index.js";
import { DATA_OTP_DIGITS } from "../../../../accounts/accounts-index.js";
import { dataCodeOptions } from "../../../../accounts/accounts-index.js";
import { dataCodeTypeHotp } from "../../../../accounts/accounts-index.js";

import { codesAnimationCopyStart } from "../animation/copy/start.js";
import { codesStateStore } from "../state/store.js";
import { codesTickerAccountCodeUpdate } from "../ticker/run.js";
import { codesUtilHotpCounterDisplay } from "../util/hotp.js";
import { codesUtilHotpCounterValue } from "../util/hotp.js";

/** Copies a valid OTP to the clipboard and plays copy feedback. */
async function codesActionsCopy(card, codeText) {
  const raw = String(codeText ?? "").replace(/\s+/g, "");
  const root = codesStateStore.cardRoots.find((item) => item.card === card);
  const expectedDigits = root
    ? dataCodeOptions(root.account).digits
    : DATA_OTP_DIGITS;
  const codePattern = new RegExp(`^\\d{${expectedDigits}}$`);

  if (!codePattern.test(raw)) {
    return;
  }

  try {
    await navigator.clipboard.writeText(raw);

    const onCheckmarkStart =
      root && dataCodeTypeHotp(root.account)
        ? () => {
            root.account.counter = codesUtilHotpCounterValue(root.account) + 1;
            codesTickerAccountCodeUpdate(root);

            if (root.els?.counter) {
              root.els.counter.textContent = codesUtilHotpCounterDisplay(root.account);
            }

            void (async () => {
              try {
                const authNumber = await authStorageGet();

                if (!authNumber || !dataCodeTypeHotp(root.account)) {
                  return;
                }

                const accounts = await dataActionUpdate(authNumber, root.account.id, {
                  counter: root.account.counter,
                });
                const updated = accounts.find(
                  (entry) => String(entry.id) === String(root.account.id),
                );

                if (updated) {
                  root.account.counter = updated.counter;
                  codesTickerAccountCodeUpdate(root);

                  if (root.els?.counter) {
                    root.els.counter.textContent = codesUtilHotpCounterDisplay(
                      root.account,
                    );
                  }
                }
              } catch (error) {
                console.warn("[codes] HOTP advance failed", error);
              }
            })();
          }
        : undefined;

    await codesAnimationCopyStart(card, { onCheckmarkStart });
  } catch {
    // Clipboard unavailable
  }
}

export { codesActionsCopy };
