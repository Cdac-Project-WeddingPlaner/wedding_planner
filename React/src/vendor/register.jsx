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
    })
    .then((response) => {
      console.log(response.data);
      // Handle success if needed

      // Navigate to a success page or any other page
      history.push('/login');
    })
    .catch((error) => {
      console.error(error);
      // Handle error if needed
    });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ color: '#FF69B4' }}>Vendor Registration</h1>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '5px' }}>
          <label htmlFor="service_type" style={{ color: '#FF69B4', marginRight: '10px' }}>Service Type:</label>
          <select
            id="service_type"
            name="service_type"
            value={vendorData.service_type}
            onChange={handleChange}
            required
            style={{ padding: '5px' }}
          >
            <option value="">Select Service Type</option>
            <option value="Hall">Hall</option>
            <option value="Music">Music</option>
            <option value="Decoration">Decoration</option>
            <option value="Photography">Photography</option>
            <option value="Catering">Catering</option>
          </select>
        </div>
  
        {['business_name', 'contact_email', 'altarnet_number', 'business_address', 'logo_image_url', 'description'].map((field, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '5px' }}>
            <label htmlFor={field} style={{ color: '#FF69B4', marginRight: '10px' }}>{field.replace('_', ' ').toUpperCase()}:</label>
            {field === 'logo_image_url' ? (
              <input
                type="file"
                accept="image/*"
                id={field}
                name={field}
                onChange={handleFileChange}
                required
                style={{ padding: '5px' }}
              />
            ) : (
              <input
                type={field.includes('email') ? 'email' : 'text'}
                id={field}
                name={field}
                value={vendorData[field]}
                onChange={handleChange}
                required={field !== 'altarnet_number'}
                style={{ padding: '5px' }}
              />
            )}
          </div>
        ))}
  
        <button
          type="button"
          onClick={handleRegister}
          style={{ backgroundColor: '#FF69B4', color: '#fff', padding: '10px', margin: '10px', cursor: 'pointer' }}
        >
          Register
        </button>
  
      </form>
    </div>
  );
  
};

export default RegisterV;
