import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const EventManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) {
      console.log("User is still loading...");
      return;
    }
    if (user===null){
      navigate("/");
      return;
    }if( user.userType !== "event-manager") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="flex h-screen items-center justify-center text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <Sidebar />
      <motion.div 
        className="flex-1 p-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name || "Event Manager"}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Bookings" value="120" />
          <Card title="Earnings" value="$12,450" />
          <Card title="Ratings" value="4.8 ⭐" />
        </div>
        <EarningsChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Notifications />
          <RecentMessages />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UpcomingEvents />
          <LatestReviews />
        </div>
      </motion.div>
    </div>
  );
};

export default EventManagerDashboard;

const Sidebar = () => (
  <motion.div className="w-64 bg-blue-900 text-white p-6 space-y-4 min-h-screen">
    <h2 className="text-xl font-bold">Dashboard</h2>
    <ul>
      <li className="hover:bg-blue-700 p-2 rounded">
        <Link to="/checkbookings">Bookings</Link>
      </li>
      <li className="hover:bg-blue-700 p-2 rounded">
        <Link to="/earnings">Earnings</Link>
      </li>
      <li className="hover:bg-blue-700 p-2 rounded">
        <Link to="/profile">Profile</Link>
      </li>
    </ul>
  </motion.div>
);

const Card = ({ title, value }) => (
  <motion.div className="bg-white shadow-lg rounded-xl p-6 text-center">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </motion.div>
);

const EarningsChart = () => {
  const data = [
    { month: "Jan", earnings: 5000 },
    { month: "Feb", earnings: 7500 },
    { month: "Mar", earnings: 6200 },
    { month: "Apr", earnings: 8900 },
  ];
  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-2">Earnings Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="earnings" stroke="#007bff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const Notifications = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h3 className="text-xl font-semibold">🔔 Notifications</h3>
    <ul className="text-gray-600 mt-2">
      <li>✔️ Booking #345 confirmed</li>
      <li>⚠️ Payment pending for Booking #122</li>
    </ul>
  </div>
);

const RecentMessages = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h3 className="text-xl font-semibold">💬 Recent Messages</h3>
    <ul className="text-gray-600 mt-2">
      <li>"Can I reschedule my event?" - John</li>
      <li>"Thanks for the great service!" - Sarah</li>
    </ul>
  </div>
);

const UpcomingEvents = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h3 className="text-xl font-semibold">📆 Upcoming Events</h3>
    <ul className="text-gray-600 mt-2">
      <li>🎸 Music Concert - June 10</li>
      <li>🍽️ Gala Dinner - June 15</li>
    </ul>
  </div>
);

const LatestReviews = () => (
  <div className="bg-white shadow-lg rounded-xl p-6">
    <h3 className="text-xl font-semibold">📝 Latest Customer Reviews</h3>
    <ul className="text-gray-600 mt-2">
      <li>⭐⭐⭐⭐⭐ "Fantastic event!" - Emily</li>
      <li>⭐⭐⭐⭐ "Great experience!" - Mark</li>
    </ul>
  </div>
);