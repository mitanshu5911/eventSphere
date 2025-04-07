import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Card Component with Conditional Navigation
const Card = ({ title, image, description, link }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = () => {
    navigate(isAuthenticated ? link : "/login");
  };

  return (
    <motion.div 
      className="relative bg-white shadow-xl rounded-2xl p-4 w-80 border-2 border-transparent hover:border-blue-500 hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={handleNavigation}
    >
      <div className="overflow-hidden rounded-xl">
        <img src={image} alt={title} className="w-full h-44 object-cover rounded-xl" />
      </div>
      <h3 className="text-xl font-bold mt-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </motion.div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [feedbacks] = useState([
    { name: "John Doe", text: "Amazing platform! Found the best event manager here." },
    { name: "Jane Smith", text: "Smooth experience, highly recommended." },
  ]);

  return (
    <div className="bg-gradient-to-b from-blue-900 via-blue-600 to-black text-white min-h-screen">
      {/* Hero Section with Background Animation */}
      <motion.section className="text-center py-16"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold">EventSphere</h1>
        <p className="text-xl mt-2">Your gateway to seamless event planning</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => navigate(isAuthenticated ? "/event-managers" : "/login")} className="bg-blue-400 text-dark-blue px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition">
            Find an Event Manager
          </button>
          <button onClick={() => navigate(isAuthenticated ? "/register" : "/login")} className="bg-blue-800 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-900 transition">
            Register as an Event Manager
          </button>
        </div>
      </motion.section>

      {/* Destination Weddings */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-6">Destination Weddings in India</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <Card title="Goa Beach Wedding" image="https://www.seaqueenbeachresort.com/website/assets/images/wedding/section3-image.jpg" description="Experience a beach wedding in Goa!" link="/goa-wedding" />
          <Card title="Royal Rajasthan Wedding" image="https://static.toiimg.com/thumb/imgsize-23456,msid-97781675,width-600,resizemode-4/97781675.jpg" description="A royal affair in Rajasthan." link="/rajasthan-wedding" />
          <Card title="Kerala Backwater Wedding" image="https://www.diwas.in/wp-content/uploads/2017/11/kerala-houseboat-6.jpg" description="Tie the knot in serene Kerala." link="/kerala-wedding" />
        </div>
      </section>

      {/* Trending Events */}
      <motion.section className="py-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-6">Trending Events</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <Card title="Tech Expo 2025" image="https://www.iottechexpo.com/wp-content/uploads/2018/04/IoT-Tech-Expo-1.jpg" description="Explore the future of technology!" link="/tech-expo" />
          <Card title="Fashion Week Paris" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvIUHD-nHC3WrFob1oE2U3GAUOzDQ3Q_e7OA&s" description="Witness the latest fashion trends." link="/fashion-week" />
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Users Say</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {feedbacks.map((feedback, index) => (
            <motion.div key={index} className="bg-gray-800 text-white p-4 rounded-lg w-72" whileHover={{ scale: 1.05 }}>
              <p className="text-lg">"{feedback.text}"</p>
              <h4 className="mt-2 font-bold">- {feedback.name}</h4>
            </motion.div>
          ))}
        </div>
        <button onClick={() => navigate("/feedback")}
          className="mt-6 bg-blue-400 text-black px-6 py-3 rounded-full font-bold hover:bg-blue-500 transition">
          More Feedbacks
        </button>
      </section>

      
    </div>
  );
};

export default Index;
