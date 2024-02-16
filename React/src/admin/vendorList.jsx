//Tanmay

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './vendorList.css'; // Import the CSS file

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const history = useHistory();


    // Fetch vendor data from backend API using Axios
    useEffect(() => {
        const sessionToken = sessionStorage.getItem('token');
      
        axios.get('http://localhost:7777/vendor', {
          headers: {
            'x-auth-token': `${sessionToken}` // Wrap 'x-auth-token' in quotes
          }
        })
          .then(response => {
            setVendors(response.data);
          })
          .catch(error => {
            console.error('Error fetching vendors:', error);
          });
      }, []);
      
      
      const handleRowClick = (vendorId) => 
      history.push({
        pathname: '/admin/vendor', // Target component's URL
        state: { vendorId: vendorId } // Data to send
      });
    
      return (
        <div>
          <div className="heading">
            <h1>Vendor List</h1>
          </div>
          <div className="container">
            <ul className="responsive-table">
              <li className="table-header">
                <div className="col col-1">Vendor ID</div>
                <div className="col col-2">Vendor Name</div>
                <div className="col col-3">Service Type</div>
                <div className="col col-4">Description</div>
              </li>
              {vendors.map((vendor, index) => (
                <div key={index} onClick={() => handleRowClick(vendor.vendor_id)}> {/* Wrap each row with an anchor tag */}
                  <li className="table-row">
                    <div className="col col-1">{vendor.vendor_id}</div>
                    <div className="col col-2">{`${vendor.first_name} ${vendor.middle_name} ${vendor.last_name}`}</div>
                    <div className="col col-3">{vendor.service_type}</div>
                    <div className="col col-4">{vendor.description}</div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      );
    };
    
export default VendorList;
