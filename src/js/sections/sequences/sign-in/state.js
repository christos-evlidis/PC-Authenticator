let signInIntroPending = false;

/** Marks the post-sign-in intro as waiting for the user menu to close. */
function signInAnimationPendingSet() {
  signInIntroPending = true;
}

/** Clears the pending post-sign-in intro without tearing down chrome. */
function signInAnimationPendingClear() {
  signInIntroPending = false;
}

/** Returns whether the post-sign-in intro should run on menu close. */
function signInAnimationPendingIs() {
  return signInIntroPending;
}

export { signInAnimationPendingSet };
export { signInAnimationPendingClear };
export { signInAnimationPendingIs };
