import { describe, expect, it } from "vitest";

import {
  formatCompact,
  formatNumber,
  formatPercent,
  formatSigned,
  formatUsd,
  percentChange,
} from "@/utils/format-cost";
import { formatBytes } from "@/utils/format-bytes";

describe("money and numbers", () => {
  it("formats dollars with thousands separators and the chosen decimals", () => {
    expect(formatUsd(1234.5)).toBe("$1,234.50");
    expect(formatUsd(0.0004, 4)).toBe("$0.0004");
  });

  it("formats whole numbers and compact counts", () => {
    expect(formatNumber(12906.4)).toBe("12,906");
    expect(formatCompact(950)).toBe("950");
    expect(formatCompact(39_912)).toBe("39.9K");
    expect(formatCompact(2_605_203)).toBe("2.6M");
  });

  it("formats a fraction as a percentage", () => {
    expect(formatPercent(0.9125)).toBe("91.3%");
    expect(formatPercent(1, 0)).toBe("100%");
  });

  it("computes the change versus the previous period, or null when there is nothing to compare", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
    expect(percentChange(5, 0)).toBeNull();
    expect(percentChange(5, null)).toBeNull();
    expect(percentChange(5, undefined)).toBeNull();
  });

  it("signs a change", () => {
    expect(formatSigned(12)).toBe("+12%");
    expect(formatSigned(-3)).toBe("−3%");
    expect(formatSigned(0)).toBe("±0%");
    expect(formatSigned(1.5, "s")).toBe("+1.5s");
  });
});

describe("formatBytes", () => {
  it("picks the unit", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2.0 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
