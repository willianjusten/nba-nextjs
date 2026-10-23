import { render, screen } from "@testing-library/react";
import { strings } from "@/app/lib/strings";
import AppHeader from ".";

// The navigation is an async server component, covered by its own tests.
vi.mock("@/app/components/PrimaryNavigation", () => ({
  default: () => null,
  PrimaryNavigationFallback: () => null,
}));

describe("AppHeader", () => {
  it("links the NBA logo to the home page", () => {
    render(<AppHeader />);

    const logoLink = screen.getByRole("link", {
      name: strings.shell.logoLabel,
    });
    expect(logoLink.getAttribute("href")).toBe("/");
    expect(logoLink.querySelector("img")?.getAttribute("src")).toContain(
      "/i/teamlogos/leagues/500/nba.png",
    );
  });
});
