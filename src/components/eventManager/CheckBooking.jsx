import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const CheckBooking = () => {
  const { user } = useAuth(); // Assuming user contains the event manager's ID
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/auth/event-manager/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Fetched data:', data);
          if (Array.isArray(data)) {
            setBookings(data);
          } else {
            console.error('Expected an array but got:', data);
            setBookings([]); // fallback to empty array
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);
  const handleAccept = (bookingId) => {
    // Logic to accept the booking
    console.log(`Accepted booking with ID: ${bookingId}`);
    // You can send a request to the backend to update the booking status
  };

  const handleReject = (bookingId) => {
    // Logic to reject the booking
    console.log(`Rejected booking with ID: ${bookingId}`);
    // You can send a request to the backend to update the booking status
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">{booking.eventType}</h2>
            <p><strong>Client Name:</strong> {booking.userId.name}</p>
            <p><strong>Email:</strong> {booking.userId.email}</p>
            <p><strong>Phone:</strong> {booking.phone}</p>
            <p><strong>Date From:</strong> {new Date(booking.dateFrom).toLocaleDateString()}</p>
            <p><strong>Date To:</strong> {new Date(booking.dateTo).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {booking.description}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleAccept(booking._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(booking._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckBooking;