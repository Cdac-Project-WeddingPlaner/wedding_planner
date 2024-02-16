//Kajal

import React, { useState, useEffect } from 'react';

function PackageList() {
  const [weddingPlans, setWeddingPlans] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchWeddingPlans = async () => {
      try {
        const response = await fetch("http://localhost:7777/auth/weddingselections");
        const data = await response.json();
        setWeddingPlans(data || []);
      } catch (error) {
        console.error('Error fetching wedding plans:', error);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:7777/auth/vendors");
        const data = await response.json();
        setVendors(data || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchWeddingPlans();
    fetchVendors();
  }, []);

  return (
    <div>
      <center>
        <hr />
        <table border="1" style={{ width: '800px', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Package</th>
              <th>Name</th>
              <th>Service</th>
              <th>Price</th>
              <th colspan ='2'> Plans</th>
              
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <th>
                <input type='button' value='Edit' className='btn btn-warning'/>
                </th>
                <th>
                <input type='button' value='Delete' className='btn btn-danger'/>
                </th>
            </tr>
          </thead>
          <tbody>
            {weddingPlans.map((plan, index) => (
              <tr key={index}>
                <td>{vendors.find(vendor => vendor.id === plan.vendorId)?.name}</td>
                <td>{plan.type}</td>
                <td>{plan.plan}</td>
                <td>{plan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default PackageList;