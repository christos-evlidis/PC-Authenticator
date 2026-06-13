import { appSessionRefresh } from "../../../../app/app.session.js";
import { appAuthGet, appSignIn, appSignOut, appSignUp } from "../../../../app/app.actions.js";

import { userMenuAnimationRun } from "../user-menu.animation.js";
import { userMenuRenderSignedIn, userMenuRenderSignedOut } from "../user-menu.render.js";
import { userMenuStateGet, userMenuStateSet } from "../user-menu.state.js";

/** Starts the user-menu sign-in flow with the provided account number. */
async function userMenuAuthSignIn(input) {
  if (userMenuStateGet().stateAnim) { // Block a second sign-in while an auth animation is already running.
    return; // Exit without starting another sign-in flow.
  }
  const request = await appSignIn(input); // Verify the entered account number and persist it when valid.
  const authKey = appAuthGet(); // Read the current auth key from app state after the sign-in attempt.
  userMenuStateSet({ stateAnim: true }); // Mark the user menu as busy before the sign-in animation starts.
  await userMenuAnimationRun("signIn", request, // Run the full sign-in loading and result animation.
    async () => { // Runs when the animation reaches the shell switch point.
      appSessionRefresh(); // Refresh header, body, and related signed-in shell state.
    },
    async () => { // Runs after the animation finishes to restore the user-menu panel.
      if (request) { // Use the signed-in layout when sign-in succeeded.
        userMenuRenderSignedIn(authKey); // Show the signed-in account view and account number field.
      } else { // Use the signed-out layout when sign-in failed.
        userMenuRenderSignedOut(authKey); // Restore the sign-in and sign-up auth views.
      }
    }
  );
  userMenuStateSet({ stateAnim: false }); // Clear the busy flag once the sign-in flow is complete.
}

/** Starts the user-menu sign-up flow. */
async function userMenuAuthSignUp() {
  if (userMenuStateGet().stateAnim) { // Block a second sign-up while an auth animation is already running.
    return; // Exit without starting another sign-up flow.
  }
  const request = await appSignUp(); // Create a new account number and store it when successful.
  const authKey = appAuthGet(); // Read the current auth key from app state after the sign-up attempt.
  userMenuStateSet({ stateAnim: true }); // Mark the user menu as busy before the sign-up animation starts.
  await userMenuAnimationRun("signUp", request, // Run the full sign-up loading and result animation.
    async () => { // Runs when the animation reaches the shell switch point.
      appSessionRefresh(); // Refresh header, body, and related signed-in shell state.
    },
    async () => { // Runs after the animation finishes to restore the user-menu panel.
      if (request) { // Use the signed-in layout when sign-up succeeded.
        userMenuRenderSignedIn(authKey); // Show the signed-in account view and account number field.
      } else { // Use the signed-out layout when sign-up failed.
        userMenuRenderSignedOut(authKey); // Restore the sign-in and sign-up auth views.
      }
    }
  );
  userMenuStateSet({ stateAnim: false }); // Clear the busy flag once the sign-up flow is complete.
}

/** Starts the user-menu sign-out flow. */
async function userMenuAuthSignOut() {
  if (userMenuStateGet().stateAnim) { // Block a second sign-out while an auth animation is already running.
    return; // Exit without starting another sign-out flow.
  }
  const authKey = appAuthGet(); // Capture the current auth key before local auth data is cleared.
  const request = await appSignOut(); // Clear stored auth and account data from the app.
  userMenuStateSet({ stateAnim: true }); // Mark the user menu as busy before the sign-out animation starts.
  await userMenuAnimationRun("signOut", request, // Run the full sign-out loading and result animation.
    async () => { // Runs when the animation reaches the shell switch point.
      appSessionRefresh(); // Refresh header, body, and related signed-out shell state.
    },
    async () => { // Runs after the animation finishes to restore the user-menu panel.
      if (request) { // Use the signed-out layout when sign-out succeeded.
        userMenuRenderSignedOut(authKey); // Restore the sign-in and sign-up auth views.
      } else { // Keep the signed-in layout if sign-out failed unexpectedly.
        userMenuRenderSignedIn(authKey); // Leave the signed-in account view visible.
      }
    }
  );
  userMenuStateSet({ stateAnim: false }); // Clear the busy flag once the sign-out flow is complete.
}

export { userMenuAuthSignIn, userMenuAuthSignOut, userMenuAuthSignUp };
