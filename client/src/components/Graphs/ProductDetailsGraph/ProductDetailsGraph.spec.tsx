import { SearchResult } from "../../../types/Search";
import ProductDetailsGraph from "./ProductDetailsGraph";
import { fireEvent, render, screen } from "@testing-library/react";
import { GraphType } from "../../../types/Graph";
import "@testing-library/jest-dom";

describe(ProductDetailsGraph, () => {
  const mockResults: Array<SearchResult> = [
    {
      _id: "1",
      name: "item one",
      brand: "brand one",
      platform: "ebay",
      productUrl: "url",
      imageURL: "url",
      price: 16,
    },
    {
      _id: "2",
      name: "item two",
      brand: "brand two",
      platform: "ebay",
      productUrl: "url",
      imageURL: "url",
      price: 10,
    },
    {
      _id: "3",
      name: "item three",
      brand: "brand three",
      platform: "amazon",
      productUrl: "url",
      imageURL: "url",
      price: 25,
    },
  ];


  it("Should only show items of the same platform when first rendering the graph", () => {
    // const mockResult = mockResults[0]
    // render(<ProductDetailsGraph 
    //     currentProduct={mockResult}
    //     products={[]}
    //     graphType={GraphType.PriceHistory}
    // />)
    // expect(screen.getByText("Price History")).toBeInTheDocument()
  })
});
