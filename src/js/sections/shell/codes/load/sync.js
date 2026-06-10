import { authStorageGet } from "../../../../accounts/accounts-index.js";
import { dataHandleSync } from "../../../../accounts/accounts-index.js";
import { dataRecordSanitizeList } from "../../../../accounts/accounts-index.js";
import { dataStorageReadyGet } from "../../../../accounts/accounts-index.js";

import { codesCardRender } from "../card/render.js";
import { codesTickerStop } from "../ticker/run.js";
import { codesUtilTimerPreferenceLoad } from "../util/timer-preference.js";

/** Syncs accounts from storage and renders the codes list. */
async function codesLoadRestore() {
  const authNumber = await authStorageGet();

  if (!authNumber) {
    codesCardRender([]);
    return [];
  }

  await codesUtilTimerPreferenceLoad();
  const accounts = await dataHandleSync(authNumber);
  codesCardRender(accounts);
  return accounts;
}

/** Renders accounts already present in local storage. */
async function codesLoadRenderFromStorage() {
  const accounts = dataRecordSanitizeList(await dataStorageReadyGet());
  codesCardRender(accounts);
  return accounts;
}

/** Stops the ticker and clears rendered account cards. */
function codesLoadClear() {
  codesTickerStop();
  codesCardRender([]);
}

export { codesLoadClear };
export { codesLoadRenderFromStorage };
export { codesLoadRestore };
