/**
 * @param {string} selector
 * @param {ParentNode} [root]
 * @returns {Element | null}
 */
export function $(selector, root = document) {
  return root.querySelector(selector);
}

/**
 * @param {string} selector
 * @param {ParentNode} [root]
 * @returns {Element[]}
 */
export function $$(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}
