import SearchBarResultCard from "./SearchBarResultCard";
import { render, screen } from "@testing-library/react";

describe(SearchBarResultCard, () => {
  it("Required SearchResult type fields should be visible", () => {
    render(
      <SearchBarResultCard
        result={{
          _id: "1",
          name: "Test Result Name",
          brand: "Test Result Brand",
          price: 2.65,
          platform: "Amazon",
          productUrl: "testlink",
          imageURL: "testurl",
        }}
        onClick={() => {}}
      />
    );

    expect(screen.getByText("Test Result Name")).toBeTruthy();
    expect(screen.getByText("Test Result Brand")).toBeTruthy();
    expect(screen.getByText("$2.65")).toBeTruthy();
  });
});
