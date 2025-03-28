
import React from "react";
import { Home, Library, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link
          to="/"
          className={`flex flex-col items-center ${
            isActive("/") ? "text-app-blue" : "text-gray-500"
          }`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/library"
          className={`flex flex-col items-center ${
            isActive("/library") ? "text-app-blue" : "text-gray-500"
          }`}
        >
          <Library size={24} />
          <span className="text-xs mt-1">Library</span>
        </Link>
        <Link
          to="/settings"
          className={`flex flex-col items-center ${
            isActive("/settings") ? "text-app-blue" : "text-gray-500"
          }`}
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
