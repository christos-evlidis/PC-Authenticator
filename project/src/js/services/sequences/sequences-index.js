/** Reveals the app instantly on load. */
export async function loadAnimationStart(stateAuth, options = {}) {
  document.querySelector(".app-header")?.classList.remove("is-hidden");
  document.querySelector(".app-body")?.classList.remove("is-hidden");
}

export async function loadAnimationFinish() {}
export async function loadAnimationInstant() {}
export async function loadAnimationReset() {}
