//Kajal

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    axios.get('http://localhost:7777/vendor', {
      headers: {
        'x-auth-token': sessionToken
      }
    })
    .then(vendorsResponse => {
      const vendors = vendorsResponse.data;

      axios.get('http://localhost:7777/plans', {
        headers: {
          'x-auth-token': sessionToken
        }
      })
      .then(plansResponse => {
        const plans = plansResponse.data;

        // Combine vendor and plan data
        const combinedData = vendors.map(vendor => {
          const matchingPlan = plans.find(plan => plan.vendor_id === vendor.vendor_id);
          return {
            vendor_name: vendor.business_name,
            type: vendor.service_type,
            plan: matchingPlan ? matchingPlan.title : '',
            status: matchingPlan ? matchingPlan.is_verified : 'Not Available'
          };
        });

        setData(combinedData);
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
      });
    })
    .catch(error => {
      console.error('Error fetching vendors:', error);
    });
  }, []);

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
                <td>{index + 1}</td>
                <td>{item.vendor_name}</td>
                <td>{item.type}</td>
                <td>{item.plan}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
