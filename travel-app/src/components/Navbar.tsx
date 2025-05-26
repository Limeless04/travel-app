import { NavLink } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import LogoutModal from "./modal/LogoutModal";
import { useState, useCallback} from "react";
import { useNavigate } from "react-router";

export function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuthStore();
   const [showLogoutModal, setShowLogoutModal] = useState(false);


   const handleLogoutClick = () => {
    setShowLogoutModal(true);
   }

  const handleConfirmLogout = useCallback(() => {
    logout();
    setShowLogoutModal(false);
    navigate("/")
  }, [])

  const handleCancelLogout = useCallback(() => {
    setShowLogoutModal(false);
  }, []);
  return (
    <>
      <header className="py-6 sm:py-8 text-center bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-center  justify-around px-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-700 mb-1 sm:mb-0">
              Travel Article Hub
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Your daily source of insightful articles for traveling
            </p>
          </div>
          <nav className="flex space-x-4 mt-4 sm:mt-0">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 font-medium transition ${
                  isActive ? "border-b-2 border-blue-600" : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              end
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 font-medium transition ${
                  isActive ? "border-b-2 border-blue-600" : ""
                }`
              }
            >
              About
            </NavLink>
            {
              !isAuthenticated && (
                <NavLink
              to="/auth/login"
              end
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 font-medium transition ${
                  isActive ? "border-b-2 border-blue-600" : ""
                }`
              }
            >
              Sign In
            </NavLink>
              )
            }
            

            {isAuthenticated && (
              
              <button
                onClick={handleLogoutClick}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Logout
              </button>
             
            )}
          </nav>
        </div>

           <LogoutModal
             isOpen={showLogoutModal}
             onClose={handleCancelLogout}
             onLogout={handleConfirmLogout}
           />
      </header>
    </>
  );
}
