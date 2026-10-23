import {
  currentNbaDate,
  formatNbaDate,
  formatShortNbaDate,
  nbaDateOf,
  parseNbaDate,
} from "./nba-date";

describe("nbaDateOf", () => {
  it("keeps a late Eastern tip-off on its Eastern date", () => {
    expect(nbaDateOf("2026-10-23T01:30:00Z")).toBe("2026-10-22");
  });

  it("uses the Eastern date during standard time", () => {
    expect(nbaDateOf("2026-12-26T04:30:00Z")).toBe("2026-12-25");
  });
});

describe("currentNbaDate", () => {
  it("is still the previous day just before midnight Eastern", () => {
    expect(currentNbaDate(new Date("2026-10-23T03:59:00Z"))).toBe("2026-10-22");
  });

  it("rolls over at midnight Eastern", () => {
    expect(currentNbaDate(new Date("2026-10-23T04:00:00Z"))).toBe("2026-10-23");
  });
});

describe("parseNbaDate", () => {
  it("accepts a valid calendar date", () => {
    expect(parseNbaDate("2026-10-22")).toBe("2026-10-22");
  });

  it.each(["2026-02-30", "20261022", "2026-10-22T00:00", "today"])(
    "rejects %s",
    (value) => {
      expect(parseNbaDate(value)).toBeNull();
    },
  );
});

describe("formatNbaDate", () => {
  it("formats the date without shifting it by timezone", () => {
    expect(formatNbaDate(parseNbaDate("2026-10-22")!)).toBe(
      "Thursday, October 22",
    );
  });
});

describe("formatShortNbaDate", () => {
  it("formats the date with abbreviated weekday and month", () => {
    expect(formatShortNbaDate(parseNbaDate("2026-10-23")!)).toBe("Fri, Oct 23");
  });
});
