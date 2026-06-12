import { bodyAnimationInstant } from "../../../../sections/shell/body/body-index.js";
import { headerAnimationInstant } from "../../../../sections/shell/header/header-index.js";
import { searchAnimationInstant } from "../../../../sections/shell/search/search-index.js";
import { loadAnimationFinish } from "./finish.js";

function loadAnimationInstant(isSignedIn) {
  loadAnimationFinish();
  headerAnimationInstant();
  bodyAnimationInstant();

  if (isSignedIn) {
    searchAnimationInstant();
  }
}

export { loadAnimationInstant };
