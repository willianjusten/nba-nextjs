import { fireEvent, render, screen } from "@testing-library/react";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { strings } from "@/app/lib/strings";
import DatePicker from ".";

const { onPopoverModuleLoad } = vi.hoisted(() => ({
  onPopoverModuleLoad: vi.fn(),
}));

// The factory runs when the module is first imported, which tells when the popover code loads.
vi.mock("./CalendarPopover", async (importOriginal) => {
  onPopoverModuleLoad();
  return importOriginal();
});

function renderDatePicker() {
  return render(
    <DatePicker
      placement="rail"
      selectedDate={"2026-10-21" as NbaDate}
      today={"2026-10-23" as NbaDate}
      seasonCalendar={["2026-10-21" as NbaDate]}
      onSelect={vi.fn()}
    />,
  );
}

describe("DatePicker", () => {
  it("loads the popover code only once the calendar is first opened", async () => {
    renderDatePicker();

    expect(onPopoverModuleLoad).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: strings.calendar.pickDateLabel }),
    );

    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(onPopoverModuleLoad).toHaveBeenCalledOnce();
  });

  it("focuses the selected day when the calendar opens", async () => {
    renderDatePicker();

    fireEvent.click(
      screen.getByRole("button", { name: strings.calendar.pickDateLabel }),
    );

    await vi.waitFor(() =>
      expect(document.activeElement?.getAttribute("aria-label")).toBe(
        "Wednesday, October 21, Game day",
      ),
    );
  });
});
