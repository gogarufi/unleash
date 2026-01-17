import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../../app.ts";
import { AddressesSchema } from "common";

describe("Server API", () => {
  describe("GET /api/environment", () => {
    it("should return current environment", async () => {
      const response = await request(app).get("/api/environment").expect(200);
      expect(response.body).toEqual({ name: process.env["ENVIRONMENT"] });
    });
  });

  describe("GET /api/address", () => {
    it("should trim query and return an error if the query key is shorter than 3 characters", async () => {
      await request(app)
        .get("/api/address")
        .query({ q: " Os " })
        .expect(400);
    });

    it("should return address items if the query key is at least 3 characters long", async () => {
      const response = await request(app)
        .get("/api/address")
        .query({ q: "Osl" })
        .expect(200);

      const result = AddressesSchema.safeParse(response.body);

      expect(result.success).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
    });

    it("should return only address items matching the query", async () => {
      const response = await request(app)
        .get("/api/address")
        .query({ q: "Tro 90 Rost" })
        .expect(200);

      const result = AddressesSchema.safeParse(response.body);

      expect(result.success).toBe(true);
      expect(result.data).length(2);

      expect(result.data?.[0]?.city).toMatch(/^tro/i);
      expect(result.data?.[0]?.street).toMatch(/^røst/i);
      expect(result.data?.[0]?.postNumber.toString()).toMatch(/^90/);
      expect(result.data?.[0]?.$tsid).toBeDefined();

      expect(result.data?.[1]?.city).toMatch(/^tro/i);
      expect(result.data?.[1]?.street).toMatch(/^røst/i);
      expect(result.data?.[1]?.postNumber.toString()).toMatch(/^90/);
      expect(result.data?.[0]?.$tsid).toBeDefined();

      expect(result.data?.[0]).not.toEqual(result.data?.[1]);
    });
  });
});
