import { themeRead } from "../../../utils/utility-theme.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../user-menu-constants.js";
import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuStateSet } from "../user-menu-state.js";
import { userMenuAccountApply } from "./user-menu-account.js";
import { userMenuAuthTrackApply } from "./user-menu-auth.js";
import { userMenuAuthViewApply } from "./user-menu-auth.js";
import { userMenuThemeButtonsApply } from "./user-menu-theme.js";
import { userMenuThemeTrackApply } from "./user-menu-theme.js";
import { userMenuViewsApply } from "./user-menu-views.js";

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
