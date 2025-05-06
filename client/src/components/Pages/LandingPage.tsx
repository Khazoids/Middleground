import RecentSearchesList from "../Lists/RecentSearchesList/RecentSearchesList";
import { RecentSearch } from "../../types/Search";
import { getRecentSearches } from "../../services/RecentSearchesService";
import { useEffect, useState } from "react";
import Footer from "../Navigation/Footer/Footer";

import SearchBar from "../Searches/SearchBar/SearchBar";
import { FaSearchDollar, FaChartLine, FaBell } from "react-icons/fa";
import logo from "../../assets/Logo_Color.png"

const LandingPage = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  useEffect(() => {
    const searches = getRecentSearches();
    setRecentSearches(searches);
  }, []);

  return (
    <main className="h-full w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-gray-50 flex flex-col items-center">
        <div className="text-center flex flex-col">
          {/* Hero Section */}
          <h1 className="text-4xl font-bold pt-20 tracking-tight sm:text-5xl md:text-6xl text-black">
            All-in-one price research tool
          </h1>
          <div className="flex justify-center">
          <img src={logo} alt="logo" className="h-80" />
          </div>
          
          {/* Search Component */}
          <div>
            <SearchBar />
          </div>

          {/* Recent Searches Section - Always visible */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-left max-w-xl mx-auto text-black">
              My last searches
            </h2>
            <div className="mt-4 space-y-4 max-w-xl mx-auto">
              {recentSearches.length > 0 ? (
                <RecentSearchesList items={recentSearches} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Your recent searches will appear here
                </div>
              )}
            </div>
          </div>

          {/* Learn More Section */}
          <div className="mt-10">
            <button
              className="btn btn-ghost text-black"
              onClick={() => {
                const element = document.getElementById("features");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
              <span className="block mt-2">↓</span>
            </button>
          </div>
        </div>

        {/* Features Section - Pushed below viewport */}
        <div id="features" className="mt-screen pt-40 pb-20">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            Why MiddleGround?
          </h2>

          {/* Option 1: Enhanced Cards */}
          <div className="mt-8 grid gap-8 md:grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto">
            {/* Price Research Card */}
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body p-6">
                <div className="flex items-center mb-4">
                  <FaSearchDollar className="text-accent text-3xl mr-4" />
                  <h3 className="card-title text-black m-0">Price Research</h3>
                </div>
                <p className="text-base-content/80 text-black">
                  Compare prices across multiple platforms in one place. Find
                  the best deals without having to navigate different websites.
                </p>
                <div className="card-actions mt-4">
                  <div className="badge badge-outline badge-accent">Amazon</div>
                  <div className="badge badge-outline badge-accent">eBay</div>
                  <div className="badge badge-outline badge-accent">
                    One-click comparison
                  </div>
                </div>
              </div>
            </div>

            {/* Price History Card */}
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body p-6">
                <div className="flex items-center mb-4">
                  <FaChartLine className="text-accent text-3xl mr-4" />
                  <h3 className="card-title text-black m-0">Price Tracking</h3>
                </div>
                <p className="text-base-content/80 text-black">
                  View complete price history for products over time. Make
                  informed buying decisions by identifying pricing trends and
                  patterns.
                </p>
                <div className="card-actions mt-4">
                  <div className="badge badge-outline badge-accent">
                    Interactive charts
                  </div>
                  <div className="badge badge-outline badge-accent">
                    Historical data
                  </div>
                  <div className="badge badge-outline badge-accent">
                    Price trends
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist Card */}
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body p-6">
                <div className="flex items-center mb-4">
                  <FaBell className="text-accent text-3xl mr-4" />
                  <h3 className="card-title text-black m-0">Watchlist</h3>
                </div>
                <p className="text-base-content/80 text-black">
                  Add products to your watchlist and stay updated on price
                  changes. Never miss a deal on the items you're interested in.
                </p>
                <div className="card-actions mt-4">
                  <div className="badge badge-outline badge-accent">
                    Price alerts
                  </div>
                  <div className="badge badge-outline badge-accent">
                    Easy tracking
                  </div>
                  <div className="badge badge-outline badge-accent">
                    Customizable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default LandingPage;
