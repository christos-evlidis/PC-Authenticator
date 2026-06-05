import { dataSanitizeList } from "./data-sanitize.js";

/** Merges two account lists by id; incoming updates win, new ids are prepended. */
export function dataMergeLists(base, incoming) {
  const merged = dataSanitizeList(base);
  const indexById = new Map();
  merged.forEach((account, index) => {
    indexById.set(String(account.id), index);
  });
  const toPrepend = [];
  for (const account of dataSanitizeList(incoming)) {
    const id = String(account.id);
    if (indexById.has(id)) {
      merged[indexById.get(id)] = account;
    } else {
      toPrepend.push(account);
    }
  }
  return [...toPrepend.reverse(), ...merged];
}
