import assert from "node:assert/strict";
import { test } from "node:test";
import {
  convertItalyToUTC,
  getAvailableItalyHours,
  isItalyDateTimeAvailable,
// @ts-ignore Node's strip-types runner requires the explicit TypeScript extension.
} from "./italy-time.ts";

test("preserves Italy winter and summer UTC conversion", () => {
  assert.equal(convertItalyToUTC("2024-01-15", "12:00"), "2024-01-15T11:00:00.000Z");
  assert.equal(convertItalyToUTC("2024-07-15", "12:00"), "2024-07-15T10:00:00.000Z");
});

test("excludes nonexistent and ambiguous Rome DST hours", () => {
  assert.equal(isItalyDateTimeAvailable("2024-03-31", "02:00"), false);
  assert.equal(isItalyDateTimeAvailable("2024-10-27", "02:00"), false);
  assert.deepEqual(getAvailableItalyHours("2024-01-15"), Array.from(
    { length: 24 },
    (_, hour) => `${hour.toString().padStart(2, "0")}:00`
  ));
});
