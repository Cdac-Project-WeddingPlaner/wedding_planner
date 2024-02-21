import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    userId: 2,
    oldPassword: '',
    newPassword: '',
  });

  const token = sessionStorage.getItem('token');
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:7777/auth/change-password', formData, {
        headers: {
          'x-auth-token': token,
        },
      })
      .then((response) => {
        console.log(response.data);
        toast.success('Password changed successfully');
        history.push('/login');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Invalid old password or user not found');
      });
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />

        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
