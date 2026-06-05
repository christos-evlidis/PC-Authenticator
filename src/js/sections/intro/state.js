let signInIntroPending = false;

/** Marks the post-sign-in intro as waiting for the user menu to close. */
export function introSignInAnimationStage() {
  signInIntroPending = true;
}

/** Clears the pending post-sign-in intro without tearing down chrome. */
export function introSignInAnimationClearPending() {
  signInIntroPending = false;
}

/** Returns whether the post-sign-in intro should run on menu close. */
export function introSignInAnimationIsPending() {
  return signInIntroPending;
}
