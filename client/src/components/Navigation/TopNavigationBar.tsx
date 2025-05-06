import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";
import { BellIcon, GearIcon, PersonIcon } from "@radix-ui/react-icons";
import logo from "../../assets/Logo_Black.png";

const TopNavigationBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  // Get names from localStorage on component mount
  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedLastName = localStorage.getItem("lastName");

    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/");
  };

  return (
    <div className="navbar bg-white fixed z-50 shadow-md">
      {/* Left section */}
      <div className="navbar-start">
        <Link to="/" className="text-xl text-black font-semibold">
          <img src={logo} alt="logo" className="h-16" />
        </Link>

        <div className="md:flex ml-8 gap-4">
          <Link to="/faqs" className="link link-hover text-black">
            FAQs
          </Link>
        </div>

        <div className="md:flex ml-8 gap-4">
          <Link to="/about" className="link link-hover text-black">
            About
          </Link>
        </div>
      </div>

      {/* Center welcome message */}
      {isLoggedIn && firstName && (
        <div className="hidden md:flex justify-center items-center text-black font-medium text-lg whitespace-nowrap">
          Welcome, {firstName} {lastName}
        </div>
      )}


      {/* Right section */}
      <div className="navbar-end gap-2">
        {isLoggedIn ? (
          <>
            <button className="btn btn-ghost" data-testid="notification-bell">
              <Link
                to="/dashboard/watchlist"
                className="link link-hover text-black"
              >
                <BellIcon className="h-6 w-6 text-black" />
              </Link>
            </button>

            {/* <button className="btn btn-ghost" data-testid="settings">
              <Link
                to="/dashboard/settings"
                className="link link-hover text-black"
              >
                <GearIcon className="h-6 w-6 text-black" />
              </Link>
            </button> */}

            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost text-black" data-testid="profile">
                <PersonIcon className="h-6 w-6 text-black" />
              </button>
              <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white rounded-box w-52">
                <li>
                  <Link className="text-black" to="/dashboard/profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="text-black" to="/dashboard/watchlist">
                    Watch List
                  </Link>
                </li>
                {/* <li>
                  <Link className="text-black" to="/dashboard/settings">
                    Settings
                  </Link>
                </li> */}
                <li>
                  <button className="text-black" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link to="/auth/login" className="btn btn-ghost text-black">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopNavigationBar;
