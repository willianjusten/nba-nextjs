import { render, screen } from "@testing-library/react";
import { strings } from "@/app/lib/strings";
import AppFooter from ".";

describe("AppFooter", () => {
  it("credits ESPN as the data source", () => {
    render(<AppFooter />);

    expect(screen.getByRole("contentinfo").textContent).toBe(
      strings.shell.footer,
    );
  });
});
