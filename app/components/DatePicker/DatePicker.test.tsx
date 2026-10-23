import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { NbaDate } from "@/app/lib/domain/nba-date";
import { seasonCalendarQueryOptions } from "@/app/lib/queries/season-calendar";
import { makeQueryClient } from "@/app/lib/query/make-query-client";
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
  const queryClient = makeQueryClient();
  queryClient.setQueryData(seasonCalendarQueryOptions(2026).queryKey, [
    "2026-10-21" as NbaDate,
  ]);

  return render(
    <QueryClientProvider client={queryClient}>
      <DatePicker
        placement="rail"
        selectedDate={"2026-10-21" as NbaDate}
        today={"2026-10-23" as NbaDate}
        onSelect={vi.fn()}
      />
    </QueryClientProvider>,
  );
}

describe("DatePicker", () => {
  it("loads the popover code only once the calendar is first opened", async () => {
    renderDatePicker();

    expect(onPopoverModuleLoad).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: strings.calendar.pickDate }),
    );

    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(onPopoverModuleLoad).toHaveBeenCalledOnce();
  });

  it("focuses the selected day when the calendar opens", async () => {
    renderDatePicker();

    fireEvent.click(
      screen.getByRole("button", { name: strings.calendar.pickDate }),
    );

    await vi.waitFor(() =>
      expect(document.activeElement?.getAttribute("aria-label")).toBe(
        "Wednesday, October 21, Game day",
      ),
    );
  });
});
