import { userMenuEventsBind } from "./user-menu.events.js";

import { userMenuRenderSignedIn } from "./user-menu.render.js";
import { userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuRenderSwitchTheme } from "./user-menu.render.js";
import { userMenuRenderSwitchAuth } from "./user-menu.render.js";

import { appAuthGet } from "../../../app/app.actions.js";
import { themeStateGet } from "../../../services/theme/state/get.js";


// Initializes the user menu module and its DOM elements.
function userMenuInit(authState, authKey) {
  userMenuEventsBind();
  userMenuRenderSwitchTheme(themeStateGet());
  userMenuRenderSwitchAuth(appAuthGet());
  if (authState) {
    userMenuRenderSignedIn(authKey);
  } else {
    userMenuRenderSignedOut(authKey);
  }
}


export { userMenuInit };
