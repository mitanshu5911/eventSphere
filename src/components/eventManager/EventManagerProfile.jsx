import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const servicesList = [
  "Wedding Planning",
  "Corporate Events",
  "Birthday Parties",
  "Concerts & Festivals",
  "Exhibition & Trade Shows",
  "Private Parties",
  "Photography & Videography",
  "Catering & Decorations",
  "Custom Service",
];

const citiesList = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
  "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Nagpur", "Visakhapatnam",
  "Kanpur", "Indore", "Thane", "Bhopal", "Coimbatore", "Patna",
  "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Madurai", "Nashik",
  "Faridabad", "Meerut", "Vijayawada", "Noida", "Guwahati",
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar",
  "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Gwalior", "Jabalpur",
  "Jodhpur", "Raipur", "Kota", "Chandigarh", "Mysore", "Bareilly",
  "Tiruchirappalli", "Hubli-Dharwad", "Moradabad", "Guntur", "Aligarh",
  "Jalandhar", "Bhubaneswar", "Salem", "Warangal", "Bhiwandi", "Saharanpur",
  "Gorakhpur", "Bikaner", "Amravati", "Kolhapur", "Siliguri", "Jhansi",
  "Ulhasnagar", "Jammu", "Sangli", "Mangalore", "Erode", "Belgaum",
  "Ambattur", "Tirunelveli", "Malegaon", "Udaipur", "Davanagere", "Kozhikode",
  "Maheshtala", "Rajahmundry", "Bokaro", "South Dumdum", "Bellary",
  "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarpur", "Latur",
  "Dhule", "Rohtak", "Korba", "Bhilai", "Durgapur", "Asansol",
  "Nanded", "Rourkela", "Ajmer", "Akola", "Kollam", "Bardhaman", "Tirupati",
  "Kurnool", "Bhilwara", "Other",
];

const EventManagerProfile = () => {
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    businessName: "",
    headOfOrganization: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    services: [],
    priceRange: "",
    experienceYears: 0,
    cities: [],
    availability: "",
    otherCity: "",
    images: [],
    logo: "",
    userId: "",
  });

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const [imagesUploadProgress, setImagesUploadProgress] = useState(0);

  // Update userId from AuthContext when user is available
  useEffect(() => {
    console.log("User from AuthContext:", user);
    if (user._id) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "experienceYears") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCityChange = (selectedOption) => {
    const selectedCities = selectedOption.map((s) => s.value);
    setFormData((prev) => ({
      ...prev,
      cities: selectedCities,
      otherCity: selectedCities.includes("Other") ? prev.otherCity : "",
    }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const uploadToCloudinary = async (file, uploadPreset, onUploadProgress) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dww5caj7u/image/upload",
        data,
        { onUploadProgress }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      let errorMessage =
        "Image upload failed. Please check your network connection.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Image upload failed: ${error.response.data.error.message}`;
      }
      alert(errorMessage);
      throw error;
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingLogo(true);
      try {
        const logoUrl = await uploadToCloudinary(
          file,
          "eventsphere",
          (progressEvent) => {
            setLogoUploadProgress(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          }
        );
        setFormData((prev) => ({ ...prev, logo: logoUrl }));
      } catch (error) {
        setFormData((prev) => ({ ...prev, logo: "" }));
      } finally {
        setUploadingLogo(false);
        setLogoUploadProgress(0);
      }
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach((error) => {
            alert(`File "${file.name}" rejected: ${error.message}`);
          });
        });
        return;
      }
      setUploadingImages(true);
      const uploadPromises = acceptedFiles.map(async (file) => {
        try {
          return await uploadToCloudinary(
            file,
            "eventsphere",
            (progressEvent) => {
              setImagesUploadProgress((prevProgress) =>
                Math.round(
                  (prevProgress +
                    (progressEvent.loaded * 100) / progressEvent.total) /
                    acceptedFiles.length
                )
              );
            }
          );
        } catch (error) {
          return null;
        }
      });
      try {
        const imageUrls = await Promise.all(uploadPromises);
        const validImageUrls = imageUrls.filter((url) => url !== null);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...validImageUrls].slice(0, 10),
        }));
      } finally {
        setUploadingImages(false);
        setImagesUploadProgress(0);
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 10,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validations
    if (
      !formData.businessName ||
      !formData.headOfOrganization ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill all required fields.");
      return;
    }
    if (formData.services.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    if (formData.cities.length === 0) {
      alert("Please select at least one city.");
      return;
    }
    try {
      console.log("Sending profile data:", formData);
      const response = await axios.post(
        "http://localhost:5000/api/auth/event-managers-data",
        formData,
        { headers: { "x-auth-token": token } }
      );
      console.log("Profile saved successfully:", response.data);
      alert("Profile Created Successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(
        "Failed to save profile data. Please check your network or server."
      );
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex justify-center items-center p-10"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/1600x900/?party,event')",
        backgroundSize: "cover",
      }}
    >
      <motion.div
        className="bg-white shadow-2xl p-8 rounded-3xl w-full max-w-4xl transform transition-all duration-500 hover:shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide">
          Create Your Event Manager Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
          >
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
          >
            <input
              type="text"
              name="headOfOrganization"
              placeholder="Head of Organization"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
          >
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4 } }}
          >
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.6 } }}
          >
            <input
              type="text"
              name="website"
              placeholder="Website/Social Media"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7 } }}
          >
            <textarea
              name="description"
              placeholder="About the Organization"
              className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24"
              onChange={handleChange}
            />
          </motion.div>
          <label className="text-gray-600 col-span-2 font-semibold">
            Services Provided
          </label>
          <motion.div
            className="grid grid-cols-2 gap-2 col-span-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8 } }}
          >
            {servicesList.map((service) => (
              <label
                key={service}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.services.includes(service)}
                  onChange={() => handleServiceChange(service)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{service}</span>
              </label>
            ))}
          </motion.div>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 relative">
              <label className="text-gray-600 font-semibold block mb-2">
                Price Range
              </label>
              <input
                type="text"
                name="priceRange"
                placeholder="1000-100000"
                className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1 relative">
              <label className="text-gray-600 font-semibold block mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="experienceYears"
                placeholder="Years"
                className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-gray-600 font-semibold block mb-2">
                Cities Where You Operate
              </label>
              <Select
                options={citiesList.map((city) => ({
                  value: city,
                  label: city,
                }))}
                isMulti
                onChange={handleCityChange}
                className="w-full"
              />
              {formData.cities.includes("Other") && (
                <div className="relative mt-2">
                  <input
                    type="text"
                    name="otherCity"
                    placeholder="Please specify"
                    className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    onChange={handleChange}
                    value={formData.otherCity}
                  />
                </div>
              )}
            </div>
            <div className="md:col-span-1 relative">
              <label className="text-gray-600 font-semibold block mb-2">
                Availability Date
              </label>
              <input
                type="date"
                name="availability"
                className="peer input-field border rounded-lg w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={handleChange}
              />
            </div>
          </div>
          <label className="text-gray-600 col-span-2 font-semibold">
            Upload Company Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="input-field border rounded-lg col-span-2 py-2 px-3"
          />
          {uploadingLogo && (
            <div className="mt-2 col-span-2">
              Uploading Logo... {logoUploadProgress}%
            </div>
          )}
          <AnimatePresence>
            {formData.logo && (
              <motion.img
                key="logoPreview"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                src={formData.logo}
                alt="Logo Preview"
                className="h-20 rounded-lg shadow-md col-span-2 mt-2"
              />
            )}
          </AnimatePresence>
          <label className="text-gray-600 col-span-2 font-semibold">
            Upload Past Event Photos (Max 10)
          </label>
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-6 text-center cursor-pointer rounded-lg col-span-2 transition-colors hover:border-blue-500"
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt className="text-blue-500 text-4xl mx-auto mb-4 animate-bounce" />
            <p className="text-sm text-gray-600">
              Drag & drop images here, or click to select files
            </p>
          </div>
          {uploadingImages && (
            <div className="mt-2 col-span-2">
              Uploading Images... {imagesUploadProgress}%
            </div>
          )}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <AnimatePresence>
              {formData.images.map((image, index) => (
                <motion.div
                  key={image}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.3 },
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative rounded-md overflow-hidden shadow-md h-24"
                >
                  <img
                    src={image}
                    alt={`Event Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }))
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none"
                  >
                    X
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 col-span-2 shadow-md font-semibold hover:shadow-lg transform transition-transform duration-300 hover:scale-105"
            disabled={uploadingLogo || uploadingImages}
          >
            {uploadingLogo
              ? "Uploading Logo..."
              : uploadingImages
              ? "Uploading Images..."
              : "Save Profile"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EventManagerProfile;
