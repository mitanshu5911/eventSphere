import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Bell, Star, Settings, MessageSquare } from "lucide-react";

// Custom Components
const CustomCard = ({ children, className }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-white rounded-2xl p-6 shadow-lg border border-blue-200 transition-all hover:shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

const CustomButton = ({ children, className, ...rest }) => (
  <button
    className={`bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-3 rounded-xl text-sm shadow-md flex items-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

// Sidebar Component with Links
const Sidebar = () => (
  <div className="w-64 bg-gradient-to-b from-sky-400 to-blue-700 text-white h-screen p-6 rounded-r-3xl shadow-2xl">
    {/* <h2 className="text-3xl font-extrabold mb-10 tracking-wide">EventEase</h2> */}
    <ul className="space-y-5 text-base font-medium">
      <li>
        <Link to="/my-bookings" className="hover:translate-x-2 block transition-transform duration-300">📅 My Bookings</Link>
      </li>
      <li>
        <Link to="/search_event_manager" className="hover:translate-x-2 block transition-transform duration-300">🔍 Search Event Managers</Link>
      </li>
      <li>
        <Link to="/saved" className="hover:translate-x-2 block transition-transform duration-300">❤️ Saved</Link>
      </li>
      <li>
        <Link to="/messages" className="hover:translate-x-2 block transition-transform duration-300">
          <MessageSquare className="inline-block mr-2" /> Messages
        </Link>
      </li>
      <li>
        <Link to="/reviews" className="hover:translate-x-2 block transition-transform duration-300">
          <Star className="inline-block mr-2" /> Reviews
        </Link>
      </li>
      <li>
        <Link to="/settings" className="hover:translate-x-2 block transition-transform duration-300">
          <Settings className="inline-block mr-2" /> Settings
        </Link>
      </li>
    </ul>
  </div>
);

// EventCard Component
const EventCard = ({ title }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-blue-100 hover:border-sky-300"
  >
    <h3 className="text-2xl font-bold mb-2 text-blue-900">{title}</h3>
    <p className="text-gray-600">Event details will appear here...</p>
  </motion.div>
);

// Main Dashboard
const CustomerDashBoard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-10 bg-gradient-to-b from-white via-blue-50 to-blue-100 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900 drop-shadow-md">
            Welcome, {user?.name || "Guest"}!
          </h1>
          <Bell className="text-blue-600 w-7 h-7" />
        </div>

        {/* Upcoming Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          <EventCard title="Upcoming Booking 1" />
          <EventCard title="Upcoming Booking 2" />
          <EventCard title="Upcoming Booking 3" />
        </div>

        {/* Search Button & Stats Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Search Navigation */}
          <CustomCard className="flex-1 flex flex-col items-start justify-center gap-4 bg-blue-50">
            <h2 className="text-2xl font-semibold text-blue-800">
              Looking for Event Managers?
            </h2>
            <p className="text-gray-600 text-sm">
              Click below to explore and book from our trusted partners.
            </p>
            <CustomButton onClick={() => navigate("/search_event_manager")}>
              🔍 Search Event Managers
            </CustomButton>
          </CustomCard>

          {/* Stats & Insights */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">
              Stats & Insights
            </h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Upcoming Events", value: "3" },
                { label: "Total Spent", value: "₹25,000" },
                { label: "Average Rating", value: "4.5⭐" },
                { label: "Messages", value: "6" },
              ].map((item, index) => (
                <CustomCard key={index} className="text-center">
                  <h3 className="text-3xl font-extrabold text-blue-900">
                    {item.value}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                </CustomCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashBoard;
