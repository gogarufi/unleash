import fs from "node:fs/promises";
import path from "node:path";
import { type AddressJson, AddressesJsonSchema } from "common";
import ts from "trie-search";
import { z } from "zod";
import { env } from "./config.ts";

// Based on DEFAULT_INTERNATIONALIZE_EXPAND_REGEXES from src/TrieSearch.js
const INTERNATIONALIZE_EXPAND_REGEXES = [
  {
    regex: /[åäàáâãæ]/gi,
    alternate: "a",
  },
  {
    regex: /[èéêë]/gi,
    alternate: "e",
  },
  {
    regex: /[ìíîï]/gi,
    alternate: "i",
  },
  // Added ø to regex
  {
    regex: /[òóôõöø]/gi,
    alternate: "o",
  },
  {
    regex: /[ùúûü]/gi,
    alternate: "u",
  },
  {
    regex: /[æ]/gi,
    alternate: "ae",
  },
  // Added oe expansion
  {
    regex: /[ø]/gi,
    alternate: "oe",
  },
  // Added aa expansion
  {
    regex: /[å]/gi,
    alternate: "aa",
  },
];

export const addresses = new ts.default<AddressJson>(
  ["city", "street", "postNumber"],
  { expandRegexes: INTERNATIONALIZE_EXPAND_REGEXES },
);

export async function loadAddresses() {
  try {
    // NOTE: If the file were to be updated regularly we would need to consider an external storage,
    // e.g. a database or S3, combined with update notifications (SQS, triggers, etc.).
    const data = await fs.readFile(
      path.join(import.meta.dirname, "..", "resources", env.DATA_SOURCE),
      "utf8",
    );
    const json = JSON.parse(data) as unknown;
    const result = AddressesJsonSchema.safeParse(json);

    if (!result.success) {
      console.error("Error parsing addresses: ", z.prettifyError(result.error));
      return;
    }

    addresses.addAll(result.data);
  } catch (e) {
    console.error("Error reading addresses: ", e);
  }
}

// Here we search for each key in the query (separated by space/punctuation)
// Each search is done independently and the results are combined using a union (AND) reducer
// Applying limit to the final result - since limiting individual searches may result in an empty intersection
// This adds a performance cost which is negligible for an in-memory solution with limited data
// NOTE: I would return only the fields used by the client (keeping as is due to the TA requirement)
export function searchAddresses(query: string, limit = 20) {
  return addresses.search(query).slice(0, limit);
}
