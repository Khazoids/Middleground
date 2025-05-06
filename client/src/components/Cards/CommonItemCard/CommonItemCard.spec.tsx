import { BrowserRouter, MemoryRouter } from "react-router-dom";
import CommonItemCard from "./CommonItemCard";
import { render, screen } from "@testing-library/react";

describe(CommonItemCard, () => {
  it("ItemType fields should be visible on the card", () => {
    render(
        <CommonItemCard
          item={{
            _id: "1",
            name: "Test Item Name",
            vendor: "Test Item Vendor",
            price: 1.99,
            imageURL: "url"
          }}
        />,
        { wrapper: BrowserRouter}
    );

    expect(screen.getByText("Test Item Name")).toBeTruthy();
    expect(screen.getByText("Test Item Vendor")).toBeTruthy();
    expect(screen.getByText("$1.99")).toBeTruthy();
  });
});
