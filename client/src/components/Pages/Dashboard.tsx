import { Outlet, Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar Navigation*/}
      <div className="w-fit h-fit bg-white m-8 shadow-lg rounded-lg">
        <nav className="space-y-4 w-40 m-4">
          <Link
            to="/dashboard/profile"
            className={`block px-4 py-2 rounded-lg transition-colors text-black ${
              location.pathname === "/dashboard/profile"
                ? "bg-gray-100 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            My Profile
          </Link>
          <Link
            to="/dashboard/watchlist"
            className={`block px-4 py-2 rounded-lg transition-colors text-black ${
              location.pathname === "/dashboard/watchlist"
                ? "bg-gray-100 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            Watch List
          </Link>
          {/* <Link
            to="/dashboard/subscription"
            className={`block px-4 py-2 rounded-lg transition-colors text-black ${
              location.pathname === "/dashboard/subscription"
                ? "bg-gray-100 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            Subscription
          </Link> */}
          {/* <Link
            to="/dashboard/settings"
            className={`block px-4 py-2 rounded-lg transition-colors text-black ${
              location.pathname === "/dashboard/settings"
                ? "bg-gray-100 font-semibold"
                : "hover:bg-gray-50"
            }`}
          >
            Settings
          </Link> */}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 text-black overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
