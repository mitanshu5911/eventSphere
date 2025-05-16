import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from 'framer-motion';

const SearchEventManager = () => {
  const { user } = useAuth();
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManager, setSelectedManager] = useState(null);
  const [bookingManager, setBookingManager] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    name: user?.name || "",
    phone: "",
    eventType: "",
    dateFrom: "",
    dateTo: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/event-managers")
      .then((res) => res.json())
      .then((data) => {
        setManagers(data);
        setFilteredManagers(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = managers.filter(
      (manager) =>
        manager.businessName.toLowerCase().includes(value) ||
        manager.headOfOrganization.toLowerCase().includes(value) ||
        manager.cities.some((city) => city.toLowerCase().includes(value))
    );

    setFilteredManagers(filtered);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitBooking = () => {
    const bookingData = {
      eventManagerId: bookingManager.userId,
      userId: user._id, // Assuming you have the user ID from the auth context
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      eventType: formData.eventType,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
      description: formData.description,
    };

    fetch("http://localhost:5000/api/auth/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit booking");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Booking submitted:", data);
        setBookingManager(null);
        // Optionally, reset form data or show a success message
        setFormData({
          email: user?.email || "",
          name: user?.name || "",
          phone: "",
          eventType: "",
          dateFrom: "",
          dateTo: "",
          description: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Search Event Managers</h1>

      <input
        type="text"
        placeholder="Search by company, organizer, or city..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-6 p-3 border border-gray-300 rounded"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredManagers.map((manager) => (
          <div
            key={manager._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-4 flex items-center">
              {manager.logo && (
                <img
                  src={manager.logo}
                  alt="Logo"
                  className="w-16 h-16 object-contain mr-4"
                />
              )}
              <div>
                <h2 className="text-lg font-semibold">
                  {manager.businessName}
                </h2>
                <p>{manager.experienceYears} years experience</p>
                <p><b>Services:</b> {manager.services.join(', ')}</p>
                                <p><b>Cities:</b> {manager.cities.join(', ')}</p>
              </div>
            </div>
            <div className="p-4 flex justify-between">
              <button
                onClick={() => setSelectedManager(manager)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                More Info
              </button>
              <button
                onClick={() => setBookingManager(manager)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Booking
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* More Info Modal */}
      {selectedManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AnimatePresence>
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {selectedManager.businessName}
              </h2>

              <button
                onClick={() => setSelectedManager(null)}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-600 text-3xl leading-none"
              >
                &times;
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-[15px]">
                <p><strong>Organizer:</strong> {selectedManager.headOfOrganization}</p>
                <p><strong>Email:</strong> {selectedManager.email}</p>
                <p><strong>Phone:</strong> {selectedManager.phone}</p>
                <p><strong>Website:</strong> {selectedManager.website || 'N/A'}</p>
                <p><strong>Experience:</strong> {selectedManager.experienceYears} years</p>
                <p><strong>Availability:</strong> {selectedManager.availability}</p>
                <p><strong>Services:</strong> {selectedManager.services.join(', ')}</p>
                <p><strong>Cities:</strong> {selectedManager.cities.join(', ')}</p>
              </div>

              <div className="mt-4 text-gray-700">
                <p className="font-semibold mb-1">Description:</p>
                <p className="text-sm text-gray-600">{selectedManager.description}</p>
              </div>

              {selectedManager.images && selectedManager.images.length > 0 && (
                <div className="mt-6">
                  <p className="font-semibold mb-2 text-gray-700">Gallery:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {selectedManager.images.map((imgUrl, index) => (
                      <img
                        key={index}
                        src={imgUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedManager(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Booking Modal */}
      {bookingManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">
              Book: {bookingManager.businessName}
            </h2>
            <button
              onClick={() => setBookingManager(null)}
              className="absolute top-2 right-4 text-gray-600 text-2xl"
            >
              &times;
            </button>

            <div className="grid grid-cols-1 gap-4">
              <input
                name="email"
                value={formData.email}
                readOnly
                className="border p-2 rounded"
              />
              <input
                name="name"
                value={formData.name}
                readOnly
                className="border p-2 rounded"
              />
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                name="eventType"
                placeholder="Type of Event"
                value={formData.eventType}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  name="dateFrom"
                  value={formData.dateFrom}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-1/2"
                />
                <input
                  type="date"
                  name="dateTo"
                  value={formData.dateTo}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-1/2"
                />
              </div>
              <textarea
                name="description"
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setBookingManager(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Send Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchEventManager;