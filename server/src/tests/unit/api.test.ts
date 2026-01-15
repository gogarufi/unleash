import { describe, it, expect } from "vitest";
import { AddressSearchQuerySchema } from "../../routes/api.ts";

describe("Test api types", () => {
  describe("Test AddressSearchQuerySchema", () => {
    it("should trim the query", () => {
      const result = AddressSearchQuerySchema.parse({ q: " Osl " });
      expect(result.q).toEqual("Osl");
    });
    
    it("should error if the query is shorter than 3 characters", () => {
      const result = AddressSearchQuerySchema.safeParse({ q: " Os " });
      expect(result.success).toBeFalsy();
      expect(result.error?.message).toMatch(/Too small: expected string to have >=3 characters/);
    });
  });
});