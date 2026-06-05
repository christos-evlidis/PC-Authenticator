let bootstrapRestoreSucceeded = false;

/** Marks that startup cloud restore completed successfully. */
export function bootstrapRestoreMarkSucceeded() {
  bootstrapRestoreSucceeded = true;
}

/** Returns whether startup cloud restore already ran successfully. */
export function bootstrapRestoreWasSucceeded() {
  return bootstrapRestoreSucceeded;
}

/** Clears the startup restore flag (tests / reload paths). */
export function bootstrapRestoreReset() {
  bootstrapRestoreSucceeded = false;
}
