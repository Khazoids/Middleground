import { render, screen } from "@testing-library/react";
import WatchlistItemCard from "./WatchlistItemCard";
import { MemoryRouter } from "react-router-dom";

describe(WatchlistItemCard, () => {
  it("Required WatchlistItemProp fields are visible", () => {
    render(
      <WatchlistItemCard
        name="Test Name"
        price={2.25}
        vendor="Test Vendor"
        onDelete={() => {}}
        isNotified={false}
        priceChange={15}
        onNotifyChange={() => true}
        id="1"
      />,
      { wrapper: MemoryRouter }
    );
    expect(screen.getAllByText("Test Name")).toBeTruthy();
    expect(screen.getByText("Test Vendor")).toBeTruthy();
  });
});
