import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      // Destructure token and user from response
      const { token, user } = response.data;
      // Save the full user data, now including _id
      console.log(user._id);
      login(user, token);
      // alert(user.userType);
      navigate(user.userType === "customer" ? "/customer-dashboard" : "/event-manager-dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };
  
  

  return (
    <div className="min-h-screen flex">
      {/* Left Side Image */}
      <motion.div
        className="hidden md:flex w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=934&q=80')",
        }}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Right Side Form */}
      <motion.div
        className="flex w-full md:w-1/2 justify-center items-center bg-white"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-md w-full p-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-center">
            Log in to continue and manage your events.
          </p>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field with Eye Icon */}
            <div className="relative">
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300 outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye Icon */}
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-500"
                onMouseEnter={() => setShowPassword(true)}  // Show password on hover
                onMouseLeave={() => setShowPassword(false)} // Hide password when mouse leaves
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Log In
            </button>
          </form>

          <div className="text-center text-gray-600">
            <p>
              Don't have an account?{" "}
              <span
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
