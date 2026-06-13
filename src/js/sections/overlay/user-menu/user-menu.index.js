import { userMenuEventsBind } from "./user-menu.events.js";

import { userMenuRenderSignedIn } from "./user-menu.render.js";
import { userMenuRenderSignedOut } from "./user-menu.render.js";
import { userMenuRenderSwitchTheme } from "./user-menu.render.js";
import { userMenuRenderSwitchAuth } from "./user-menu.render.js";

import { appActionGetTheme } from "../../../app/app.actions.js";
import { appActionGetAuth } from "../../../app/app.actions.js";


// Initializes the user menu module and its DOM elements.
function userMenuInit(authState, authKey) {
  userMenuEventsBind();
  userMenuRenderSwitchTheme(appActionGetTheme());
  userMenuRenderSwitchAuth(appActionGetAuth());

  if (authState) {
    userMenuRenderSignedIn(authKey);
  } else {
    userMenuRenderSignedOut(authKey);
  }
}


export { userMenuInit };
