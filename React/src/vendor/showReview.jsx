//Kajal

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Star from './star'; // Assuming Star component is defined elsewhere
import profile from '../resourses/profile.jpg';
import './review1.css';

const ShowReview = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    if (sessionToken) {
      axios.get('http://localhost:7777/review', {
        headers: {
          'x-auth-token': sessionToken
        }
      })
      .then(response => {
        // Ensure rating is a valid number, default to 0 if null or not a number
        const updatedReviews = response.data.map(review => ({
          ...review,
          rating: Number.isNaN(Number(review.rating)) ? 0 : Number(review.rating)
        }));
        setReviews(updatedReviews);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
    } else {
      console.error('Session token not found in sessionStorage.');
    }
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={index}>
              <td><img src={profile} alt="Profile" className="img-fluid" style={{ maxWidth: '50px' }} /></td>
              <td>{`Client ${review.client_id}`}</td>
              <td>
                <div className="stars">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} filled={index < review.rating} />
                  ))}
                </div>
              </td>
              <td>{review.review}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowReview;

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Star from './star'; // Assuming Star component is defined elsewhere
// import profile from '../resourses/profile.jpg';
// import './review1.css';

// const ShowReview = () => {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     const sessionToken = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

//     if (sessionToken) {
//       axios.get('http://localhost:7777/review', {
//         headers: {
//           'x-auth-token': sessionToken
//         }
//       })
//       .then(response => {
//         setReviews(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching reviews:', error);
//       });
//     } else {
//       console.error('Session token not found in sessionStorage.');
//     }
//   }, []); // Empty dependency array ensures the effect runs only once

//   return (
//     <div className="table-responsive">
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Profile</th>
//             <th>Name</th>
//             <th>Rating</th>
//             <th>Comment</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reviews.map((review, index) => (
//             <tr key={index}>
//               {/* Assuming profile image source is available */}
//               <td><img src={profile} alt="Profile" className="img-fluid" style={{ maxWidth: '50px' }} /></td>
//               <td>{`Client ${review.client_id}`}</td> {/* Assuming client_id corresponds to the client name */}
//               <td className="stars">
//                 {[...Array(5)].map((_, index) => (
//                   <Star key={index} filled={index < review.rating} />
//                 ))}
//               </td>
//               <td>{review.review}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ShowReview;
