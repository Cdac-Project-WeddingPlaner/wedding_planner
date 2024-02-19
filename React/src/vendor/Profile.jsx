//Chirag

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import img from "../resourses/profile.jpg";
import "../client/profile.css";

function VendorProfileScreen() {
  const [vendor, setVendor] = useState({
    service_type: "",
    business_name: "",
    description: "",
    business_address: "",
    contact_email: "",
    alternate_number: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    email: "",
    phone_number: "",
  });


  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [editVendor, setEditVendor] = useState(false);



  const onEdit = () => {
    setEditVendor(!editVendor);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:7777/vendor/1',
          headers: { 'x-auth-token': token }
        };

        const response = await axios(config);
        setVendor(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);


  const handleSave = async () => {
    try {
      // Update vendor details
      const vendorDetails = {
        description: vendor.description,
        alternate_number: vendor.alternate_number,
        contact_email: vendor.contact_email,
        business_address: vendor.business_address,
        first_name: vendor.first_name,
        middle_name: vendor.address,
        last_name: vendor.address,
        phone_number: vendor.phone_number,
        email: vendor.email,
        address: vendor.address,

      };

      // Send PUT request to update vendor details
      await axios.put('http://localhost:7777/vendor/1', vendorDetails, {
        headers: { 'x-auth-token': token }
      });


      // Handle success
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      // Handle error
      alert('Error updating data. Please try again.');
    }
  };


  return (
    <>
      <center>
        <div className="profile-image-container">
          <img src={img} alt="Profile" className="profile-image" />
        </div>


        <br />

        <div><h3> {vendor.business_name}</h3></div>
        <div><h3>Type : {vendor.service_type}</h3></div>

        <div className="details">
          <div></div>
          <p className="titles">Bussiness Details</p>
          <div></div>
        </div>
        <br />
        <table className="table-responsive">
          <tbody>
            <tr>
              <td>Description : </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={vendor.description || ''} // Ensure the value is not undefined
                  onChange={handleChange}
                  style={{ height: '50px', width: '500px' }}
                />
              </td>

            </tr>

            <tr>
              <td>Phone : </td>
              <td>
                <input type="text" name="alternate_number" value={vendor.alternate_number} onChange={handleChange} />
              </td>
            </tr>
            <tr>
              <td>Email : </td>
              <td>
                <input type="text" name="contact_email" value={vendor.contact_email} onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Address</td>
              <td>
                <input type="text" name="business_address" value={vendor.business_address} style={{ height: '50px', width: '500px' }} onChange={handleChange} />


              </td>
            </tr>
          </tbody>
        </table>

        <br /> <br />

        <br />
        <div className="details">
          <div></div>
          <p className="titles">Personal Details</p>
          <div></div>
        </div>
        <br />
        <table className="table-responsive">
          <div></div>
          <tbody>
            <tr>
              <td>Name : </td>
              <td>
                <input
                  type="text"
                  name="first_name"
                  onChange={handleChange}
                  value={`${vendor.first_name}`}
                />
                <input
                  type="text"
                  name="middle_name"
                  onChange={handleChange}
                  value={`${vendor.middle_name}`}
                />
                <input
                  type="text"
                  name="last_name"
                  onChange={handleChange}
                  value={`${vendor.last_name}`}
                />
              </td>
            </tr>

            <tr>
              <td>Phone : </td>
              <td>
                <input type="text" name="phone_number" value={vendor.phone_number} onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Email : </td>
              <td>
                <input type="text" name="email" value={vendor.email} onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Address</td>
              <td>
                <input type="text" name="address" value={vendor.address} style={{ height: '50px', width: '500px' }} onChange={handleChange} />

              </td>
            </tr>
          </tbody>
        </table>

        <br />

        <button type="button" onClick={onEdit} className="btn btn-primary" style={{ width: '100px', marginBottom: '20px' }}>
          Edit
        </button>

        <button type="button" onClick={handleSave} className="btn btn-success" style={{ width: '100px', marginBottom: '20px' }}>
          Save
        </button>
      </center>
    </>
  );
}

export default VendorProfileScreen;