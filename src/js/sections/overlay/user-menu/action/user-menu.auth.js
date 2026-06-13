import { appSessionRefresh } from "../../../../app/app.session.js";
import { appSignIn } from "../../../../app/app.actions.js";
import { appSignUp } from "../../../../app/app.actions.js";
import { appSignOut } from "../../../../app/app.actions.js";
import { appAuthGet } from "../../../../app/app.actions.js";

import { userMenuRenderSignedIn } from "../user-menu.render.js";
import { userMenuRenderSignedOut } from "../user-menu.render.js";

import { userMenuAnimationRun } from "../user-menu.animation.js";

import { userMenuStateGet } from "../user-menu.state.js";
import { userMenuStateSet } from "../user-menu.state.js";


// Initiates the sign-in process with the provided account number.
async function userMenuAuthSignIn(input) {
  if (userMenuStateGet().stateAnim) {
    return;
  }
  const request = await appSignIn(input);
  userMenuStateSet({ stateAnim: true });
  await userMenuAnimationRun("signIn", request, 
    async () => {
      appSessionRefresh();
    },
    async () => {
      const authKey = appAuthGet();
      if (request) {
        userMenuRenderSignedIn(authKey);
      } else {
        userMenuRenderSignedOut(authKey);
      }
    }
  );
  userMenuStateSet({ stateAnim: false });
}

// Initiates the sign-up process to create a new account.
async function userMenuAuthSignUp() {
  if (userMenuStateGet().stateAnim) {
    return;
  }
  const request = await appSignUp();
  userMenuStateSet({ stateAnim: true });
  await userMenuAnimationRun("signUp", request,
    async () => {
      appSessionRefresh();
    },
    async () => {
      const authKey = appAuthGet();
      if (request) {
        userMenuRenderSignedIn(authKey);
      } else {
        userMenuRenderSignedOut(authKey);
      }
    }
  );
  userMenuStateSet({ stateAnim: false });
}

// Initiates the sign-out process, clearing all local data.
async function userMenuAuthSignOut() {
  if (userMenuStateGet().stateAnim) {
    return;
  }
  const authKey = appAuthGet();
  const request = await appSignOut();
  userMenuStateSet({ stateAnim: true });
  await userMenuAnimationRun("signOut", request,
    async () => {
      appSessionRefresh();
    },
    async () => {
      if (request) {
        userMenuRenderSignedOut(authKey);
      } else {
        userMenuRenderSignedIn(authKey);
      }
    }
  );
  userMenuStateSet({ stateAnim: false });
}


export { userMenuAuthSignIn };
export { userMenuAuthSignOut };
export { userMenuAuthSignUp };
