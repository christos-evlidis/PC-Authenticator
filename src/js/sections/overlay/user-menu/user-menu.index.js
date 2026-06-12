import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuEventsBind } from "./user-menu.events.js";
import { userMenuRenderSignedIn, userMenuRenderSignedOut, userMenuRenderTheme } from "./user-menu.render.js";

import { themeGet } from "../../../theme/theme.js";

// Initializes the user menu module and its DOM elements.
function userMenuInit(isSignedIn, authNumber) {
  userMenuDomGet();
  userMenuEventsBind();
  userMenuRenderTheme(themeGet());

  if (isSignedIn === undefined) {
    return;
  }

  if (isSignedIn) {
    userMenuRenderSignedIn(authNumber);
  } else {
    userMenuRenderSignedOut();
  }
}

export { userMenuInit };
