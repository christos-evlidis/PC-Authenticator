import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuEventsBind } from "./user-menu.events.js";
import { userMenuRenderSignedIn, userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuThemeApply } from "./user-menu.theme.js";

import { themeGet } from "../../../utils/utility-theme.js";

function userMenuInit(isSignedIn, authNumber) {
  userMenuDomGet();
  userMenuEventsBind();
  userMenuThemeApply(themeGet());

  if (isSignedIn === undefined) {
    return;
  }

  if (isSignedIn) {
    userMenuRenderSignedIn(authNumber);
    return;
  }

  userMenuRenderSignedOut();
}

export { userMenuInit };
