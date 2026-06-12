import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuEventsBind } from "./user-menu.events.js";
import { userMenuRenderSignedIn } from "./user-menu.render.js";
import { userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuRenderSwitchTheme } from "./user-menu.render.js";
import { userMenuRenderSwitchAuth } from "./user-menu.render.js";

import { appShellThemeGet } from "../../../app/app.shell.js";
import { appShellAuthGet } from "../../../app/app.shell.js";

// Initializes the user menu module and its DOM elements.
function userMenuInit(isSignedIn, authNumber) {
  userMenuEventsBind();
  userMenuRenderSwitchTheme(appShellThemeGet());
  userMenuRenderSwitchAuth(appShellAuthGet());

  if (isSignedIn) {
    userMenuRenderSignedIn(authNumber);
  } else {
    userMenuRenderSignedOut();
  }
}

export { userMenuInit };
