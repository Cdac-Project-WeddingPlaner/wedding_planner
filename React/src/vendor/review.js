import React from 'react';

const Review = ({ name, comment, rating }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>{comment}</p>
      <p>Rating: {rating}</p>
    </div>
  );
};

export default Review;
