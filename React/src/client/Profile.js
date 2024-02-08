import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import img from "../resourses/profile.jpg";
import "./profile.css";

function ClientProfileScreen() {
  const [user, setUser] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: '/client/6',
          headers: {'x-auth-token': token}
        };

        const response = await axios(config);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get('http://localhost:7777/wedding/client/6');
        setWeddingDetails(response.data); 
      } catch (error) {
        console.error('Error fetching wedding details:', error);
      }
    };

    fetchWeddingDetails();
  }, [token]); // Ensure useEffect runs when token changes

  return (
    <>
      <center>
        <img src={img} alt="Profile" />

        <div className="centered-container">
          <button className="editButton">Edit</button>
        </div>

        <br />

        <div className="details">
          <div></div>
          <p className="titles">Personal Details</p>
          <button className="editButton">Edit</button>
        </div>
        <br />
        <table className="table-responsive">
          <tbody>
            <tr>
              <td>Name : </td>
              <td>
                <input type="text" name="Name" value={`${user.first_name} ${user.middle_name} ${user.last_name}`} />
              </td>
            </tr>

            <tr>
              <td>Phone : </td>
              <td>
                <input type="text" name="Phone" value={user.phone_number} />
              </td>
            </tr>

            <tr>
              <td>Email : </td>
              <td>
                <input type="text" name="Email" value={user.email} />
              </td>
            </tr>

            <tr>
              <td>Address</td>
              <td>
                <input type="text" name="Address" value={user.address} />
              </td>
            </tr>
          </tbody>
        </table>

        <br /> <br />

        <div className="details">
          <div></div>
          <p className="titles">Wedding Details</p>
          <button className="editButton">Edit</button>
        </div>

        <br />
        <table className="table-responsive">
          <tbody>
            <tr>
              <td>Side : </td>
              <td>
                <input type="text" name="Side" value={weddingDetails.selected_side} />
              </td>
            </tr>

            <tr>
              <td>Groom : </td>
              <td>
                <input type="text" name="Groom" value={weddingDetails.groom_name} />
              </td>
            </tr>

            <tr>
              <td>Bride : </td>
              <td>
                <input type="text" name="Bride" value={weddingDetails.bride_name} />
              </td>
            </tr>

            <tr>
              <td>Relation : </td>
              <td>
                <input type="text" name="Relation" value={weddingDetails.relation} />
              </td>
            </tr>

            <tr>
              <td>Date : </td>
              <td>
                <input type="text" name="Date" value={weddingDetails.wedding_date} />
              </td>
            </tr>

            <tr>
              <td>Guests : </td>
              <td>
                <input type="text" name="Guests" value={weddingDetails.guest_count} />
              </td>
            </tr>
          </tbody>
        </table>
        <br />

        <button type="button" className="btn btn-primary">
          Save
        </button>
      </center>
    </>
  );
}

export default ClientProfileScreen;
