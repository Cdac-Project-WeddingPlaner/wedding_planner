import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

const RegisterC = () => {
  const [userData, setUserData] = useState(null);
  const [clientData, setClientData] = useState({
    user_id: '',
    avatar_image_url: null,
    client_id: '', // Added client_id
  });
  var client_id;

  const [avatarImage, setAvatarImage] = useState(null);
  const [weddingData, setWeddingData] = useState({
    selected_side: 'bride', // Default to 'bride'
    bride_name: '',
    groom_name: '',
    relation: '',
    wedding_date: '',
    guest_count: '',
  });

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Retrieve user data from location state
    if (location.state && location.state.userData) {
      setUserData(location.state.userData);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarImage(file);
  };

  const handleWeddingChange = (e) => {
    setWeddingData({ ...weddingData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    // Combine user and client data into registrationData
    const registrationData = { ...userData, ...clientData };

    // Create FormData object
    const formData = new FormData();

    // Append each field to the FormData object
    Object.keys(registrationData).forEach((key) => {
      formData.append(key, registrationData[key]);
    });

    // Append the avatar image file to FormData
    if (avatarImage) {
      formData.append('avatar_image_url', avatarImage, avatarImage.name);
    }

    // Make axios request to register client with FormData
    axios.post('http://localhost:7777/auth/register/client', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log(response.data.client_id);
        // Set the client_id in clientData after successful registration
        setClientData({ ...clientData, client_id: response.data.client_id });
        client_id = response.data.client_id;
        // Call function to create wedding after successful registration
        console.log(clientData)
        handleCreateWedding();
      })
      .catch((error) => {
        console.error(error);
        // Handle error if needed
      });
  };

  const handleCreateWedding = () => {
    // Validate wedding data before submission

    // Create axios request to create a wedding
    console.log(client_id)
    axios.post('http://localhost:7777/wedding', {
      client_id: client_id,
      ...weddingData,
    },)
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
      <h1 style={{ color: '#FF69B4' }}>Client Registration</h1>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <label htmlFor="avatar_image_url">Avatar Image URL:</label>
        <input
          type="file"
          accept="image/*"
          id="avatar_image_url"
          name="avatar_image_url"
          onChange={handleFileChange}
          required
        />

        <label htmlFor="selected_side">Select Side:</label>
        <select
          id="selected_side"
          name="selected_side"
          value={weddingData.selected_side}
          onChange={handleWeddingChange}
          required
        >
          <option value="bride">Bride</option>
          <option value="groom">Groom</option>
        </select>

        <label htmlFor="bride_name">Name:</label>
        <input
          type="text"
          id="bride_name"
          name="bride_name"
          value={weddingData.bride_name}
          onChange={handleWeddingChange}
          required
        />

        <label htmlFor="relation">Relation:</label>
        <input
          type="text"
          id="relation"
          name="relation"
          value={weddingData.relation}
          onChange={handleWeddingChange}
          required
        />

        <label htmlFor="wedding_date">Wedding Date:</label>
        <input
          type="date"
          id="wedding_date"
          name="wedding_date"
          value={weddingData.wedding_date}
          onChange={handleWeddingChange}
          required
        />

        <label htmlFor="guest_count">Guest Count:</label>
        <input
          type="number"
          id="guest_count"
          name="guest_count"
          value={weddingData.guest_count}
          onChange={handleWeddingChange}
          required
        />

        <button
          type="button"
          onClick={handleRegister}
          style={{ backgroundColor: '#FF69B4', color: '#fff', padding: '10px', margin: '10px', cursor: 'pointer' }}
        >
          Register and Create Wedding
        </button>
      </form>
    </div>
  );
};

export default RegisterC;
