import { MemoryRouter } from "react-router-dom";
import TopNavigationBar from "./TopNavigationBar";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as AuthContext from "../../AuthContext";

describe(TopNavigationBar, () => {
  it("Initial landing should show log in button", () => {
    render(<TopNavigationBar />, { wrapper: MemoryRouter });
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("Logged in users should not see a login button", () => {
    jest.spyOn(AuthContext, "useAuth").mockImplementation(() => ({
      isLoggedIn: true,
      login: () => {},
      logout: () => {},
    }));
    render(<TopNavigationBar />, { wrapper: MemoryRouter });

    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("Clicking on the profile icon should display a dropdown menu", async () => {
    jest.spyOn(AuthContext, "useAuth").mockImplementation(() => ({
      isLoggedIn: true,
      login: () => {},
      logout: () => {},
    }));
    render(<TopNavigationBar />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByTestId("profile"));

    expect(await screen.findByText("My Profile")).toBeInTheDocument();
  });

  it("Clicking on an item in the dropdown menu will retain the menu", async () => {
    jest.spyOn(AuthContext, "useAuth").mockImplementation(() => ({
        isLoggedIn: true,
        login: () => {},
        logout: () => {},
      }));
      render(<TopNavigationBar />, { wrapper: MemoryRouter });
  
      fireEvent.click(screen.getByTestId("profile"));

      await screen.findByText("My Profile");

      fireEvent.click(screen.getByText("My Profile"));

      expect(screen.getByText("My Profile")).toBeInTheDocument();
  })
});
