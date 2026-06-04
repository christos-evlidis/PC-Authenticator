import { themeRead } from "../../../utils/utility-theme.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuAccountApply } from "./account.js";
import { userMenuAuthTrackApply } from "./auth.js";
import { userMenuAuthViewApply } from "./auth.js";
import { userMenuThemeButtonsApply } from "./theme.js";
import { userMenuThemeTrackApply } from "./theme.js";
import { userMenuViewsApply } from "./views.js";

/** Syncs all user-menu DOM from the current in-memory state. */
export function userMenuDomApply() {
  const state = userMenuStateGet();
  const theme = themeRead();

  userMenuStateSet({ theme });
  userMenuViewsApply(state.isSignedIn);
  userMenuAccountApply(state.accountNumber);
  userMenuAuthViewApply(state.authView || USER_MENU_AUTH_VIEW_SIGN_IN);
  userMenuAuthTrackApply(state.authView || USER_MENU_AUTH_VIEW_SIGN_IN);
  userMenuThemeButtonsApply(theme);
  userMenuThemeTrackApply(theme);
}
