// RegisterV.jsx
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const RegisterV = () => {
  const [userData, setUserData] = useState(null);
  const [vendorData, setVendorData] = useState({
    user_id: '', // Assuming you get this from the server after user registration
    service_type: '',
    business_name: '',
    contact_email: '',
    altarnet_number: '',
    business_address: '',
    description: '',
  });
  const [logoImage, setLogoImage] = useState(null);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Retrieve user data from location state
    if (location.state && location.state.userData) {
      setUserData(location.state.userData);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoImage(file);
  };

  const handleRegister = () => {
    // Combine user and vendor data into registrationData
    const registrationData = { ...userData, ...vendorData };

    // Create FormData object
    const formData = new FormData();

    // Append each field to the FormData object
    Object.keys(registrationData).forEach((key) => {
      formData.append(key, registrationData[key]);
    });

    // Append the logo image file to FormData
    if (logoImage) {
      formData.append('logo_image_url', logoImage, logoImage.name);
    }

    // Make axios request to register vendor with FormData
    axios.post('http://localhost:7777/auth/register/vendor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Add this if needed for cross-origin requests
    })
    .then((response) => {
      console.log(response.data);
      // Handle success if needed

      // Navigate to a success page or any other page
      history.push('/registration-success');
    })
    .catch((error) => {
      console.error(error);
      // Handle error if needed
    });
  };

  return (
    <div>
      <h1>Vendor Registration</h1>
      <form>
        {/* Input fields for vendor registration */}
        <label htmlFor="service_type">Service Type:</label>
        <select
          id="service_type"
          name="service_type"
          value={vendorData.service_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Service Type</option>
          <option value="Hall">Hall</option>
          <option value="Music">Music</option>
          <option value="Decoration">Decoration</option>
          <option value="Photography">Photography</option>
          <option value="Catering">Catering</option>
        </select>

        <label htmlFor="business_name">Business Name:</label>
        <input
          type="text"
          id="business_name"
          name="business_name"
          value={vendorData.business_name}
          onChange={handleChange}
          required
        />

        <label htmlFor="contact_email">Contact Email:</label>
        <input
          type="email"
          id="contact_email"
          name="contact_email"
          value={vendorData.contact_email}
          onChange={handleChange}
          required
        />

        <label htmlFor="altarnet_number">Altarnet Number:</label>
        <input
          type="text"
          id="altarnet_number"
          name="altarnet_number"
          value={vendorData.altarnet_number}
          onChange={handleChange}
          required
        />

        <label htmlFor="business_address">Business Address:</label>
        <input
          type="text"
          id="business_address"
          name="business_address"
          value={vendorData.business_address}
          onChange={handleChange}
          required
        />

        <label htmlFor="logo_image_url">Logo Image URL:</label>
        <input
          type="file"
          accept="image/*"
          id="logo_image_url"
          name="logo_image_url"
          onChange={handleFileChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={vendorData.description}
          onChange={handleChange}
          required
        />

        <button type="button" onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
};

export default RegisterV;
