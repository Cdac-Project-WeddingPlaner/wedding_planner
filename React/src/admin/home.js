//Kajal

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import "./home.css";

function Home() {
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    axios.get('http://localhost:7777/plans', {
      headers: {
        'x-auth-token': sessionToken
      }
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('Error fetching package and plans:', error);
    });
  }, []);

  const handleShowClick = () => {
    // Forward the page to the vendor page with vendorId as a URL parameter
    history.push(`/admin/plan`);
  };

  return (
    <div className='container'>
      <div className='table-responsive'>
        <table border="1" style={{ width: '800px', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>No</th>
              <th>Vendor</th>
              <th>Type</th>
              <th>Plan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.plan_id}</td>
                <td>{item.vendor_id}</td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>
                <input type='button' value={item.is_verified} className='btn btn-warning' onClick={() => handleShowClick} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
