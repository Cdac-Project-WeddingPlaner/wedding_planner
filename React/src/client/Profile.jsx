import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import img from "../resourses/profile.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./profile.css";

function ClientProfileScreen() {
  const history = useHistory();

  const [user, setUser] = useState({
    user_id:"",
    client_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    phone_number: "",
    email: "",
  });

  const [weddingDetails, setWeddingDetails] = useState({
    selected_side: "",
    bride_name: "",
    groom_name: "",
    relation: "",
    wedding_date: "",
    guest_count: ""
  });

  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [editPersonalDetails, setEditPersonalDetails] = useState(false);
  const [editWeddingDetails, setEditWeddingDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var u1 = sessionStorage.getItem('user');
        const userJson = JSON.parse(u1);
        console.log(u1.user_id);
        const userResponse = await axios.get(`http://localhost:7777/client/${userJson.user_id}`, {
          headers: { 'x-auth-token': token }
        });
        setUser(userResponse.data);
        console.log(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      try {
        const weddingResponse = await axios.get(`http://localhost:7777/wedding/client/${user.client_id}`, {
          headers: { 'x-auth-token': token }
        });
        setWeddingDetails(weddingResponse.data[0]);
      } catch (error) {
        console.error('Error fetching wedding details:', error);
      }
    };

    fetchData();
  }, [token, user.user_id]); // Include token in the dependency array if it might change

  const onEdit = () => {
    setEditPersonalDetails(prevState => !prevState);
    setEditWeddingDetails(prevState => !prevState);
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "personal") {
      setUser(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else if (type === "wedding") {
      setWeddingDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const changePassword = async () => {
    history.push({
      pathname: '/changepassword', 
    });
  };

  const formatDateForDatabase = (isoDateString) => {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    try {
      const weddetail = {
        selected_side: weddingDetails.selected_side,
        bride_name: weddingDetails.bride_name,
        groom_name: weddingDetails.groom_name,
        relation: weddingDetails.relation,
        wedding_date: formatDateForDatabase(weddingDetails.wedding_date),
        guest_count: weddingDetails.guest_count
      };

      await axios.put(`http://localhost:7777/wedding/${user.client_id}`, weddetail, {
        headers: { 'x-auth-token': token }
      });

      const updatedUser = {
        email: user.email,
        password: user.password,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address
      };

      await axios.put(`http://localhost:7777/client/${user.client_id}`, updatedUser, {
        headers: { 'x-auth-token': token }
      });

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Error updating data. Please try again.');
    }
  };

  return (
    <>
      <center>
        <div className="profile-image-container">
          <img src={img} alt="Profile" className="profile-image" />
        </div>

        <div className="centered-container">
          <button className="editButton" ></button>
        </div>

        <br />

        <div className="details">
          <div></div>
          <p className="titles">Personal Details</p>
          <div></div>
        </div>
        <br />
        <table className="table-responsive">
          <tbody>
            <tr>
              <td>Name : </td>
              <td>
                <input
                  type="text"
                  name="first_name"
                  value={user.first_name}
                  disabled={!editPersonalDetails}
                  onChange={(e) => handleChange(e, "personal")}
                />
                <input
                  type="text"
                  name="middle_name"
                  value={user.middle_name}
                  disabled={!editPersonalDetails}
                  onChange={(e) => handleChange(e, "personal")}
                />
                <input
                  type="text"
                  name="last_name"
                  value={user.last_name}
                  disabled={!editPersonalDetails}
                  onChange={(e) => handleChange(e, "personal")}
                />
              </td>
            </tr>

            <tr>
              <td>Phone : </td>
              <td>
                <input
                  type="text"
                  name="phone_number"
                  value={user.phone_number}
                  disabled={!editPersonalDetails}
                  onChange={(e) => handleChange(e, "personal")}
                />
              </td>
            </tr>

            <tr>
              <td>Email : </td>
              <td>
                <input
                  type="text"
                  name="email"
                  value={user.email}
                  disabled={!editPersonalDetails}
                  onChange={(e) => handleChange(e, "personal")}
                />
              </td>
            </tr>

            <tr>
              <td>Address : </td>
              <td>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  disabled={!editPersonalDetails}
                  onChange={(e) => handleChange(e, "personal")}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <br /> <br />

        <div className="details">
          <div></div>
          <p className="titles">Wedding Details</p>
          <div></div>
        </div>

        <br />
        <table className="table-responsive">
          <tbody>
            <tr>
              <td>Side : </td>
              <td>
                <input
                  type="text"
                  name="selected_side"
                  value={weddingDetails.selected_side}
                  disabled={!editWeddingDetails}
                  onChange={(e) => handleChange(e, "wedding")}
                />
              </td>
            </tr>

            <tr>
              <td>Groom : </td>
              <td>
                <input
                  type="text"
                  name="groom_name"
                  value={weddingDetails.groom_name}
                  disabled={!editWeddingDetails}
                  onChange={(e) => handleChange(e, "wedding")}
                />
              </td>
            </tr>

            <tr>
              <td>Bride : </td>
              <td>
                <input
                  type="text"
                  name="bride_name"
                  value={weddingDetails.bride_name}
                  disabled={!editWeddingDetails}
                  onChange={(e) => handleChange(e, "wedding")}
                />
              </td>
            </tr>

            <tr>
              <td>Relation : </td>
              <td>
                <input
                  type="text"
                  name="relation"
                  value={weddingDetails.relation}
                  disabled={!editWeddingDetails}
                  onChange={(e) => handleChange(e, "wedding")}
                />
              </td>
            </tr>

            <tr>
              <td>Date : </td>
              <td>
                <input
                  type="date"
                  name="wedding_date"
                  value={weddingDetails.wedding_date ? new Date(weddingDetails.wedding_date).toISOString().split('T')[0] : ''}
                  disabled={!editWeddingDetails}
                  onChange={(e) => handleChange(e, "wedding")}
                />
              </td>
            </tr>


            <tr>
              <td>Guests : </td>
              <td>
                <input
                  type="text"
                  name="guest_count"
                  value={weddingDetails.guest_count}
                  disabled={!editWeddingDetails}
                  onChange={(e) => handleChange(e, "wedding")}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <button type="button" className="btn btn-primary-" onClick={onEdit} style={{ width: '100px', marginBottom: '20px' }}>Edit</button>
        <button type="button" className="btn btn-success" onClick={handleSave} style={{ width: '100px', marginBottom: '20px' }}>Save</button>
        <button type="button" className="btn btn-secondary-" onClick={changePassword} style={{ width: '150px', marginBottom: '20px' }}>Change Password</button>

        
      </center>
    </>
  );
}

export default ClientProfileScreen;
