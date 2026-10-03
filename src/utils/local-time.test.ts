import { describe, expect, it } from "vitest";

import { isValidTime, parseUtc } from "@/utils/local-time";

describe("parseUtc", () => {
  it("reads an API timestamp ending in Z as UTC", () => {
    expect(parseUtc("2026-09-30T15:36:01.743Z").toISOString()).toBe(
      "2026-09-30T15:36:01.743Z",
    );
  });

  it("treats a timestamp WITHOUT a zone as UTC, never as the browser's local time", () => {
    expect(parseUtc("2026-09-30T15:36:01").toISOString()).toBe(
      "2026-09-30T15:36:01.000Z",
    );
    expect(parseUtc("2026-09-30 15:36:01").toISOString()).toBe(
      "2026-09-30T15:36:01.000Z",
    );
  });

  it("respects an explicit offset", () => {
    expect(parseUtc("2026-09-30T15:36:01+05:30").toISOString()).toBe(
      "2026-09-30T10:06:01.000Z",
    );
  });

  it("passes a Date through unchanged", () => {
    const date = new Date("2026-01-01T00:00:00Z");

    expect(parseUtc(date)).toBe(date);
  });
});

describe("isValidTime", () => {
  it("tells real timestamps from garbage", () => {
    expect(isValidTime("2026-09-30T15:36:01Z")).toBe(true);
    expect(isValidTime("not a date")).toBe(false);
  });
});
