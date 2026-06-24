import { appSessionRefresh } from "../../../../app/app.session.js";
import { appAuthGet, appSignIn, appSignOut, appSignUp } from "../../../../app/app.actions.js";

import { userMenuRenderSignedIn, userMenuRenderSignedOut } from "../user-menu.render.js";
import { userMenuStateGet, userMenuStateSet } from "../user-menu.state.js";

/** Starts the user-menu sign-in flow instantly. */
async function _userMenuAuthSignIn(input) {
  const request = await appSignIn(input);
  appSessionRefresh();
  if (request) {
    userMenuRenderSignedIn(appAuthGet());
  } else {
    userMenuRenderSignedOut(appAuthGet());
  }
}

/** Starts the user-menu sign-up flow instantly. */
async function _userMenuAuthSignUp() {
  const request = await appSignUp();
  appSessionRefresh();
  if (request) {
    userMenuRenderSignedIn(appAuthGet());
  } else {
    userMenuRenderSignedOut(appAuthGet());
  }
}

/** Starts the user-menu sign-out flow instantly. */
async function _userMenuAuthSignOut() {
  const authKey = appAuthGet();
  const request = await appSignOut();
  appSessionRefresh();
  if (request) {
    userMenuRenderSignedOut(authKey);
  } else {
    userMenuRenderSignedIn(authKey);
  }
}

export {
  _userMenuAuthSignIn as userMenuAuthSignIn,
  _userMenuAuthSignOut as userMenuAuthSignOut,
  _userMenuAuthSignUp as userMenuAuthSignUp,
};
