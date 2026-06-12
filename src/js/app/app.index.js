import { appBootstrapStart } from "./app.bootstrap.js";

/**
 * Initializes and starts the application bootstrap process.
 */
function appStart() {
  return appBootstrapStart();
}

void appStart();
