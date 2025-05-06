import { MemoryRouter } from "react-router-dom";
import SearchBar from "./SearchBar";
import LandingPage from "../../Pages/LandingPage";
import { fireEvent, render, screen } from "@testing-library/react";
import { SearchResult } from "../../../types/Search";
import "@testing-library/jest-dom";

describe(SearchBar, () => {
  const axios = require("axios");

  const mockReturn: Array<SearchResult> = [
    {
      _id: "1",
      name: "name",
      brand: "brand",
      platform: "platform",
      productUrl: "url",
      imageURL: "url",
      price: 10,
    },
  ];

  it("Test input changes", () => {
    render(<SearchBar placeholder="placeholder" />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("placeholder"), {
      target: { value: "New Text" },
    });

    expect(screen.getByDisplayValue("New Text")).toBeTruthy();
  });

  it("Search should commence after a certain amount of time", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: mockReturn,
    });
    render(<SearchBar placeholder="placeholder" />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByPlaceholderText("placeholder"), {
      target: { value: "New Text" },
    });

    expect(await screen.findByText("See More Results")).toBeInTheDocument();
  });

  it("Notify users if there are no results.", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: [],
    });
    render(<SearchBar placeholder="placeholder" />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByPlaceholderText("placeholder"), {
      target: { value: "New Text" },
    });

    expect(await screen.findByText("No results found")).toBeInTheDocument();
  });

  it("Clicking outside input cancels search", () => {
    render(<LandingPage />, { wrapper: MemoryRouter });
    fireEvent.click(
      screen.getByPlaceholderText("Search an item, or enter an item ID"),
      {
        target: { value: "Flower Seeds" },
      }
    );
    fireEvent.click(screen.getByText("All-in-one price research tool"));

    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
    expect(screen.queryByText("See More Results")).not.toBeInTheDocument();
  });

  it("Clicking outside input closes search results", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: mockReturn,
    });
    render(<SearchBar placeholder="placeholder" />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText("placeholder");
    fireEvent.change(input, {
      target: { value: "New Text" },
    });

    await screen.findByText("See More Results");

    fireEvent.focusOut(input);

    expect(screen.queryByText("See More Results.")).not.toBeInTheDocument();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("Text less than three letters does not commence search", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: mockReturn,
    });
    render(<SearchBar placeholder="placeholder" />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText("placeholder");
    fireEvent.change(input, {
      target: { value: "t" },
    });

    try {
      await screen.findByText("See More Results");
    } catch (e) {
      expect(screen.queryByText("See More Results")).not.toBeInTheDocument();
    }
    expect(screen.queryByText("See More Results")).not.toBeInTheDocument();
  });
});
