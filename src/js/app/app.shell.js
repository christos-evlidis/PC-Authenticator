import { bodyApplySignedIn, bodyApplySignedOut } from "../sections/shell/body/body-index.js";
import { headerApplySignedIn, headerApplySignedOut } from "../sections/shell/header/header-index.js";
import { searchApply } from "../sections/shell/search/search-index.js";
import { codesApply } from "../sections/shell/codes/codes-index.js";

function appShellRefresh(options = {}) {
  const stateAuth = Boolean(options.stateAuth);
  if (stateAuth) {
    headerApplySignedIn();
    bodyApplySignedIn({ stateCodes: options.stateCodes });
    searchApply(true);
    codesApply(true);
  } else {
    headerApplySignedOut();
    bodyApplySignedOut();
    searchApply(false);
    codesApply(false);
  }
}

export { appShellRefresh };
