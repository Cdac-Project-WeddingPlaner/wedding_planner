// UserRegistrationPage.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const UserRegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });

  const [emailError, setEmailError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailBlur = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError('Invalid email format');
      return;
    }

    // Check if email is already registered using an API
    try {
      const response = await axios.post('http://localhost:7777/auth/check-email', { email: formData.email });
      if (response.data.exists) {
        setEmailError('Email is already registered');
      } else {
        setEmailError('');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailError('Error checking email');
    }
  };

  const handleRegister = (userType) => {
    // Validate data
    if (emailError || !formData.password || !formData.first_name || !formData.last_name || !formData.phone_number || !formData.address) {
      // If there are errors or missing fields, don't proceed with registration
      return;
    }

    // Navigate to the appropriate registration page
    const registrationPath = userType === 'vendor' ? '/vendor/register' : '/client/register';
    history.push(registrationPath, { userData: formData });
  };

return (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <h1 style={{ color: '#FF69B4' }}>User Registration</h1>
    <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ margin: '5px' }}>
        <label htmlFor="email" style={{ color: '#FF69B4', marginRight: '10px' }}>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleEmailBlur}
          required
          style={{ padding: '5px' }}
        />
        {emailError && <p style={{ color: 'red', marginLeft: '10px' }}>{emailError}</p>}
      </div>

      <div style={{ margin: '5px' }}>
        <label htmlFor="password" style={{ color: '#FF69B4', marginRight: '10px' }}>Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ margin: '5px' }}>
        <label htmlFor="first_name" style={{ color: '#FF69B4', marginRight: '10px' }}>First Name:</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ margin: '5px' }}>
        <label htmlFor="middle_name" style={{ color: '#FF69B4', marginRight: '10px' }}>Middle Name:</label>
        <input
          type="text"
          id="middle_name"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ margin: '5px' }}>
        <label htmlFor="last_name" style={{ color: '#FF69B4', marginRight: '10px' }}>Last Name:</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ margin: '5px' }}>
        <label htmlFor="phone_number" style={{ color: '#FF69B4', marginRight: '10px' }}>Phone Number:</label>
        <input
          type="tel"
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          required
          style={{ padding: '5px' }}
        />
      </div>

      <div style={{ margin: '5px' }}>
        <label htmlFor="address" style={{ color: '#FF69B4', marginRight: '10px' }}>Address:</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          style={{ padding: '5px' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

      <button
          type="button"
          onClick={() => handleRegister('client')}
          style={{ backgroundColor: '#FF69B4', color: '#fff', padding: '10px', margin: '10px', cursor: 'pointer' }}
        >
          Register as Client
        </button>
        
        <button
          type="button"
          onClick={() => handleRegister('vendor')}
          style={{ backgroundColor: '#FF69B4', color: '#fff', padding: '10px', margin: '10px', cursor: 'pointer' }}
        >
          Register as Vendor
        </button>


      </div>
    </form>
  </div>
);
      
};

export default UserRegistrationPage;
