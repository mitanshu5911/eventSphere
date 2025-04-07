import React, { useContext, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaTachometerAlt, FaUserCircle, FaCog } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-4 w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          className="text-2xl font-bold tracking-wide"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/">EVENTSPHERE</Link>
        </motion.div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About Us" />
          <NavItem to="/contact" label="Contact Us" />
        </nav>

        {/* Authentication Buttons or Profile Menu */}
        <div className="flex items-center space-x-4">
          {!user ? (
            // Show Login & Signup if user is NOT logged in
            <>
              <Button to="/login" label="Login" styleType="light" />
              <Button to="/signup" label="Sign Up" styleType="dark" />
            </>
          ) : (
            // Show Sidebar Menu Icon when logged in
            <button onClick={() => setSidebarOpen(true)} className="text-2xl focus:outline-none">
              <FaBars />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Menu */}
      {user && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isSidebarOpen ? 0 : "100%" }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 w-72 h-full bg-white text-gray-800 shadow-lg p-6 z-50"
        >
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-2xl">
            <FaTimes />
          </button>
          <ul className="mt-10 space-y-4 text-lg">
            <SidebarItem to={user.userType === "customer" ? "/customer-dashboard" : "/event-manager-dashboard"} icon={<FaTachometerAlt />} label="Dashboard" />
            <SidebarItem to={user.userType === "customer" ? "/customer-profile" : "/event-manager-profile"} icon={<FaUserCircle />} label="Profile" />
            <SidebarItem to="/settings" icon={<FaCog />} label="Settings" />
            <SidebarItem to="/signup" icon={<FaUser />} label="Sign Up" />
            <li>
              <button
                onClick={() => {
                  logout();
                  setSidebarOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" />Logout
              </button>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

/* Navigation Item Component */
const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative transition ${
        isActive ? "text-blue-300 font-semibold border-b-2 border-blue-300" : "hover:text-blue-300"
      }`
    }
  >
    {label}
  </NavLink>
);

/* Sidebar Item Component */
const SidebarItem = ({ to, icon, label }) => (
  <li>
    <Link to={to} className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-200 rounded-md">
      {icon} <span>{label}</span>
    </Link>
  </li>
);

/* Button Component */
const Button = ({ to, label, styleType }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      className={`px-4 py-2 rounded-md shadow-md transition ${
        styleType === "light" ? "bg-white text-blue-700 hover:bg-gray-200" : "bg-blue-800 hover:bg-blue-600"
      }`}
      onClick={() => navigate(to)}
    >
      {label}
    </motion.button>
  );
};

export default Header;