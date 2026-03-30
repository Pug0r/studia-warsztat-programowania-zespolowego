// sum.spec.ts
import { multiply, sum } from "#utils/sum.js";
import { describe, expect, it } from "vitest";

describe("sum function", () => {
  it("should add two positive numbers correctly", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

describe("multiply function", () => {
  it("should multiply two positive numbers correctly", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it("should handle negative numbers", () => {
    expect(multiply(-2, 5)).toBe(-10);
  });
});