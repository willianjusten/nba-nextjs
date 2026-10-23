import { render, screen } from "@testing-library/react";
import { strings } from "@/app/lib/strings";
import AppFooter from ".";

describe("AppFooter", () => {
  it("credits the people who made the app", () => {
    render(<AppFooter />);

    expect(screen.getByRole("contentinfo").textContent).toBe(
      strings.shell.footer,
    );
  });
});
