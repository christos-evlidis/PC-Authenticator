import { appSessionRefresh } from "../../../../app/app.session.js";

import { appActionSignIn } from "../../../../app/app.actions.js";
import { appActionSignUp } from "../../../../app/app.actions.js";
import { appActionSignOut } from "../../../../app/app.actions.js";
import { appActionGetAuth } from "../../../../app/app.actions.js";

import { userMenuRenderSignedIn } from "../user-menu.render.js";
import { userMenuRenderSignedOut } from "../user-menu.render.js";

import { userMenuAnimationRun } from "../user-menu.animation.js";

import { userMenuStateGet } from "../user-menu.state.js";
import { userMenuStateSet } from "../user-menu.state.js";


// Initiates the sign-in process with the provided account number.
async function userMenuAuthSignIn(authInput) {
  if (userMenuStateGet().stateAnim) {
    return;
  }

  const requestResult = await appActionSignIn(authInput);

  try {
    userMenuStateSet({ stateAnim: true });

    await userMenuAnimationRun("signIn", requestResult, 
      async () => {
        // Triggered when the result mark starts drawing
        appSessionRefresh();
      },

      async () => {
        // Triggered right before the user menu fades back in
        const authKey = appActionGetAuth();

        if (requestResult) {
          userMenuRenderSignedIn(authKey);
        } else {
          userMenuRenderSignedOut(authKey);
        }
      }
    );
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Initiates the sign-up process to create a new account.
async function userMenuAuthSignUp() {
  if (userMenuStateGet().stateAnim) {
    return;
  }

  const requestResult = await appActionSignUp();

  try {
    userMenuStateSet({ stateAnim: true });

    await userMenuAnimationRun("signUp", requestResult,
      async () => {
        // Triggered when the result mark starts drawing
        appSessionRefresh();
      },

      async () => {
        // Triggered right before the user menu fades back in
        const authKey = appActionGetAuth();

        if (requestResult) {
          userMenuRenderSignedIn(authKey);
        } else {
          userMenuRenderSignedOut(authKey);
        }
      }
    );
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}

// Initiates the sign-out process, clearing all local data.
async function userMenuAuthSignOut() {
  if (userMenuStateGet().stateAnim) {
    return;
  }

  const authKey = appActionGetAuth();

  const requestResult = await appActionSignOut();

  try {
    userMenuStateSet({ stateAnim: true });

    await userMenuAnimationRun("signOut", requestResult,
      async () => {
        // Triggered when the result mark starts drawing
        appSessionRefresh();
      },

      async () => {
        // Triggered right before the user menu fades back in
        if (requestResult) {
          userMenuRenderSignedOut(authKey);
        } else {
          userMenuRenderSignedIn(authKey);
        }
      }
    );
  } finally {
    userMenuStateSet({ stateAnim: false });
  }
}


export { userMenuAuthSignIn };
export { userMenuAuthSignOut };
export { userMenuAuthSignUp };
