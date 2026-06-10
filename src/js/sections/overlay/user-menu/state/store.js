import { themeGet } from "../../../../utils/utility-theme.js";

import { THEME_LIGHT } from "../../../../utils/utility-theme.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";

const userMenuStateStore = {
  isOpen: false,
  isSignedIn: false,
  isSignInRunning: false,
  authNumber: null,
  authView: USER_MENU_AUTH_VIEW_SIGN_IN,
  theme: themeGet() || THEME_LIGHT,
};

export { userMenuStateStore };
