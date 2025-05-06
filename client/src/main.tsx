import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./AuthContext";

// Page Components
import LandingPage from "./components/Pages/LandingPage";
import Login from "./components/Pages/auth/Login";
import Register from "./components/Pages/auth/Register";
import Dashboard from "./components/Pages/Dashboard";
import ProductDetails from "./components/Pages/ProductDetails";
import Profile from "./components/Pages/Profile";
import SearchResults from "./components/Pages/SearchResults";
import Settings from "./components/Pages/Settings";
import Subscription from "./components/Pages/Subscription";
import Watchlist from "./components/Pages/Watchlist";
import FAQ from "./components/Pages/Faqs";
import ForgotPassword from "./components/Pages/auth/ForgotPassword";
import TermsOfService from "./components/Pages/TermsOfService";
import PrivacyPolicy from "./components/Pages/PrivacyPolicy";
import Contact from "./components/Pages/Contact";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VerifyEmail from "./components/Pages/auth/VerifyEmail";
import ResetPassword from "./components/Pages/auth/ResetPassword";
import About from "./components/Pages/About";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/faqs",
        element: <FAQ />,
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/product",
        element: <ProductDetails />,
      },
      {
        path: "/tos",
        element: <TermsOfService />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "/auth",
        children: [
          {
            path: "login",
            element: (
              <Login
                onLoginSuccess={function (): void {
                  console.log("Not Implemented bruh");
                }}
              />
            ),
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "verify-email/:token",
            element: <VerifyEmail />,
          },
          {
            path: "reset-password/:token",
            element: <ResetPassword />,
          },
          {
            path: "forgotpassword",
            element: <ForgotPassword />,
          },
        ],
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "watchlist",
            element: <Watchlist />,
          },
          {
            path: "subscription",
            element: <Subscription />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
