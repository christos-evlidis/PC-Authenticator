/** Creates a list spacer element for add animation. */
function codesAnimationAddInstant() {
  const spacer = document.createElement("li");
  spacer.className = "account-block account-block--manual-add-spacer";
  spacer.setAttribute("aria-hidden", "true");
  return spacer;
}

export { codesAnimationAddInstant };
