let signUpIntroPending = false;

/** Marks the post-sign-up intro as waiting for the user menu to close. */
function signUpAnimationPendingSet() {
  signUpIntroPending = true;
}

/** Clears the pending post-sign-up intro without tearing down chrome. */
function signUpAnimationPendingClear() {
  signUpIntroPending = false;
}

/** Returns whether the post-sign-up intro should run on menu close. */
function signUpAnimationPendingIs() {
  return signUpIntroPending;
}

export { signUpAnimationPendingSet };
export { signUpAnimationPendingClear };
export { signUpAnimationPendingIs };
