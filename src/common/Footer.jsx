import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const teamMembers = [
  {
    name: "Mitanshu Bansal",
    roll: "2310991398",
    email: "mitanshu1398.be23@chitkara.edu.in",
  },
  {
    name: "Jitesh Jain",
    roll: "2310990535",
    email: "jitesh0535.be23@chitakara.edu.in",
  },
  {
    name: "Ruman Singla",
    roll: "2310991196",
    email: "ruman1196.be23@chitkara.edu.in",
  },
];

const Foot = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-5">
      <div className="container mx-auto px-4 space-y-8">

        {/* Top Section: About (Left) & Social (Right) */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-8 md:space-y-0">
          
          {/* About Our Website (Left) */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-3">About Our Website</h2>
            <p className="text-gray-300 leading-relaxed">
              EventSphere is a modern platform designed to connect customers with event managers.
              We aim to streamline event planning, providing an easy and efficient way to
              browse, compare, and book the perfect services for any occasion.
            </p>
          </div>

          {/* Social Media (Right) */}
          <div className="md:w-1/2 flex flex-col md:items-end me-5">
            <h2 className="text-2xl font-bold mb-3">Follow Us</h2>
            <div className="flex space-x-4 text-gray-400">
              <a href="#facebook" className="hover:text-white transition" aria-label="Facebook">
                <FaFacebookF size={20} />
              </a>
              <a href="#twitter" className="hover:text-white transition" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#instagram" className="hover:text-white transition" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#linkedin" className="hover:text-white transition" aria-label="LinkedIn">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Our Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((dev, index) => (
              <motion.div
                key={dev.roll}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold text-white mb-1">{dev.name}</h3>
                <p className="text-gray-400 mb-2">Roll No. {dev.roll}</p>
                <a
                  href={`mailto:${dev.email}`}
                  className="text-blue-400 hover:underline break-all"
                >
                  {dev.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} EventSphere. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Foot;
