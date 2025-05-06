import { fireEvent, render, screen } from "@testing-library/react";
import SearchResultCard from "./SearchResultCard";
import { MemoryRouter } from "react-router-dom";

describe(SearchResultCard, () => {
  it("Rqeuired SearchResultCard type fields should be visible", () => {
    render(
      <SearchResultCard
        result={{
          _id: "1",
          name: "Test Result Name",
          brand: "Test Result Brand",
          price: 2.65,
          platform: "Amazon",
          productUrl: "testlink",
          imageURL: "testurl",
        }}
      />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText("Test Result Name")).toBeTruthy();
    expect(screen.getByText("Test Result Brand")).toBeTruthy();
    expect(screen.getByText("$2.65")).toBeTruthy();
  });

  it("Rqeuired SearchResultCard type fields should be visible", () => {
    render(
      <SearchResultCard
        result={{
          _id: "1",
          name: "Test Result Name",
          brand: "Test Result Brand",
          price: 2.65,
          platform: "Amazon",
          productUrl: "testlink",
          imageURL: "testurl",
        }}
      />,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText("Test Result Name")).toBeTruthy();

    fireEvent.click(screen.getByText("Test Result Name"));
    expect(screen.getByText("Test Result Name")).toBeTruthy();
  });
});
