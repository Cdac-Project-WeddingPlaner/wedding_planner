//Kajal
// addReview.js

import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddReview() {
  const [formData, setFormData] = useState({
    plan_id: '',
    client_id: '',
    review: '',
    rating: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const sessionToken = sessionStorage.getItem('token');

      const response = await axios.post('http://localhost:7777/reviews', formData, {
        headers: {
          'x-auth-token': sessionToken
        }
      });

      console.log(response.data); // Log the response data for debugging

      // Show success notification
      toast.success('Review added successfully');

      // Clear form fields after successful submission
      setFormData({
        plan_id: '',
        client_id: '',
        review: '',
        rating: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      // Show error notification
      toast.error('Failed to add review');
    }
  };

  return (
    <div>
      <h2>Add a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="plan_id">Plan ID:</label>
          <input type="text" id="plan_id" name="plan_id" value={formData.plan_id} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="client_id">Client ID:</label>
          <input type="text" id="client_id" name="client_id" value={formData.client_id} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="review">Review:</label>
          <textarea id="review" name="review" value={formData.review} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} />
        </div>
        <button type="submit">Submit Review</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddReview;
