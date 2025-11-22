import { describe, expect, it } from "vitest";

import {
  calculateSubtasksDone,
  format,
  prop,
  round,
  toNumber,
} from "./notionFormulas";

const testData = {
  "Subtasks Done": 5.7,
  "Total Tasks": 10,
  Progress: 57.333333,
};

describe("Notion formula utilities", () => {
  it("retrieves properties with prop()", () => {
    expect(prop(testData, "Subtasks Done")).toBe(5.7);
  });

  it("rounds numbers like Notion's round()", () => {
    expect(round(5.7)).toBe(6);
    expect(round(57.333333)).toBe(57);
  });

  it("formats values as strings", () => {
    const formatted = format(6);

    expect(formatted).toBe("6");
    expect(typeof formatted).toBe("string");
  });

  it("converts formatted values back to numbers", () => {
    const numeric = toNumber("6");

    expect(numeric).toBe(6);
    expect(typeof numeric).toBe("number");
  });

  it("combines helpers in calculateSubtasksDone()", () => {
    expect(calculateSubtasksDone({ "Subtasks Done": 5.7 })).toBe(6);
  });

  it("rounds percentage-based progress", () => {
    const done = 5;
    const total = 8;
    const percentage = (done / total) * 100; // 62.5

    expect(calculateSubtasksDone({ "Subtasks Done": percentage })).toBe(63);
  });

  it("supports alternative property names", () => {
    expect(calculateSubtasksDone({ Progress: 42.8 }, "Progress")).toBe(43);
  });
});
