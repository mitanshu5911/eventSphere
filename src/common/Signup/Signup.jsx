import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        userType
      });
      
      // If the signup is successful
      alert(response.data.msg || "Signup successful!");
      navigate("/login"); // or wherever you want to redirect
    } catch (error) {
      if (error.response && error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome to Our Platform! 🎉
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create an account and get started
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-2 border rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (8-14 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 p-2 border rounded-md focus:ring focus:ring-blue-300"
              minLength="8"
              maxLength="14"
              required
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-800"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
            >
              {showPassword ? (
                <IoEyeOutline size={20} />
              ) : (
                <IoEyeOffOutline size={20} />
              )}
            </div>
          </div>

          {/* User Type */}
          <div>
            <label className="block text-gray-600 mb-1">User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="customer">Customer</option>
              <option value="event-manager">Event Manager</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
