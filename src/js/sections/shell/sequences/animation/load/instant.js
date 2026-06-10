import { bodyAnimationInstant } from "../../../body/body-index.js";
import { headerAnimationInstant } from "../../../header/header-index.js";
import { searchAnimationInstant } from "../../../search/search-index.js";
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
