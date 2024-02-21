//Kajal

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./package.css";
import { useHistory } from 'react-router-dom';

function PackageList() {
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    axios.get('http://localhost:7777/packages', {
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

  const handleEditClick = (plan) => {
    // Forward to the plan page with selected plan data as state
    history.push({
      pathname: '/addplan',
      state: { plan: plan }
    });
  };



  return (
    <div>
      <center>
        <hr />
        <table border="1" style={{ width: '800px', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Package</th>
              <th>Plan Title</th>
              <th>Description</th>
              <th>Price</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((packageData, index) => (
              packageData.plans.map((plan, planIndex) => (
                <tr key={`${index}-${planIndex}`}>
                  <td>{packageData.packagename}</td>
                  <td>{plan.title}</td>
                  <td>{plan.description}</td>
                  <td>{plan.price}</td>
                  <td>
                    <input type='button' value='Edit' className='btn btn-warning' onClick={() => handleEditClick(plan.id)} />
                  </td>
                  <td>
                    <input type='button' value='Delete' className='btn btn-danger' />
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default PackageList;
