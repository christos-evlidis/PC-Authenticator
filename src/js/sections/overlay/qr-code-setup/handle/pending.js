import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { dataActionAddQr } from "../../../../accounts/accounts-index.js";
import { authChromeApply } from "../../../../utils/utility-auth.js";
import { qrSetupActionsPanelClose } from "../action/panel/close.js";
import { codesActionsAdd } from "../../../shell/codes/codes-index.js";
import { qrSetupAnimationResumeFinish } from "../animation/resume/finish.js";
import { qrSetupAnimationResumeStart } from "../animation/resume/start.js";
import { qrSetupStateGet } from "../state/get.js";
import { qrSetupStateSet } from "../state/set.js";
import { scanPendingClear } from "../../../../scan/scan-index.js";
import { scanPendingGet } from "../../../../scan/scan-index.js";

async function qrSetupHandlePending() {
  if (qrSetupStateGet().isBusy) {
    return;
  }

  const pending = await scanPendingGet();

  if (!pending) {
    return;
  }

  await scanPendingClear();
  qrSetupStateSet({ isAwaitingPageSelection: false });

  let addedAccount = null;

  await qrSetupAnimationResumeStart(async () => {
    if (pending.status === "ready" && pending.uri) {
      const authNumber = await authStorageGet();

      if (!authNumber) {
        throw new Error("Sign in to add accounts.");
      }

      addedAccount = await dataActionAddQr(authNumber, pending.uri);
      return true;
    }

    return false;
  });

  await qrSetupActionsPanelClose();
  qrSetupAnimationResumeFinish();

  const authNumber = await authStorageGet();

  if (authNumber && addedAccount) {
    await codesActionsAdd(addedAccount);
    await authChromeApply({
      authNumber,
      isSignedIn: true,
      hasAccounts: true,
    });
  }
}

export { qrSetupHandlePending };
