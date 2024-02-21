//Chirag
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import img from "../resourses/profile.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../client/profile.css';
import './client.css'
import '../admin/vendor.css';// import './clientList.css';

function Client() {
    const [user, setUser] = useState({
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
    const [plansData, setPlansData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`http://localhost:7777/client/6`, {
                    headers: { 'x-auth-token': token }
                });
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }

            try {
                const weddingResponse = await axios.get('http://localhost:7777/wedding/client/1', {
                    headers: { 'x-auth-token': token }
                });
                setWeddingDetails(weddingResponse.data[0]);
            } catch (error) {
                console.error('Error fetching wedding details:', error);
            }

        };

        const fetchPlans = async () => {
            try {
                const plansConfig = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:7777/wedsel/client/1',
                    headers: { 'x-auth-token': token }
                };

                const plansResponse = await axios(plansConfig);
                setPlansData(plansResponse.data);
            } catch (error) {
                console.error('Error fetching plans data:', error);
            }
        };

        fetchData();
        fetchPlans();
    }, [token]);



    return <>
        <center>
            <div class="profile-container">

                <div class="profile-details">

                    <div class="details">
                        <div></div>
                        <p className="titles">Personal Details</p>
                        <div></div>
                    </div>
                    <br />

                    <div><b>Name : </b>{user.first_name}  {user.middle_name}  {user.last_name} </div>

                    <div><b>Phone : </b>{user.phone_number}</div>
                    <div><b>Email : </b>{user.email}</div>
                    <div><b>Address : </b>{user.address}</div>

                </div>
            </div>
            <br />

            <div className="details">
                <div></div>
                <p className="titles">Wedding Details</p>
                <div></div>
            </div>
            <br />
            <div><b>Groom : </b>{weddingDetails.groom_name}</div>
            <div><b>Bride : </b>{weddingDetails.bride_name}</div>
            <div><b>Side : </b>{weddingDetails.selected_side}</div>
            <div><b>Relation : </b>{weddingDetails.relation}</div>
            <div><b>Date : </b>{weddingDetails.wedding_date}</div>
            <div><b>Guests : </b>{weddingDetails.guest_count}</div>

            <br />

            <div className="details">
                <div></div>
                <p className="titles">Summary</p>
                <div></div>
            </div>
            <br /><br />
            <div className="container">
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1">Plan</div>
                        <div className="col col-2">Price</div>
                        <div className="col col-3">Status</div>
                    </li>
                    {plansData.map((plans, index) => (
                        <li className="table-row" key={index}>
                            <div className="col col-1" > {plans.title}</div>
                            <div className="col col-2">{plans.price}</div>
                            <div className="col col-3">{plans.status}</div>
                        </li>

                    ))}
                </ul >


            </div >


            <br /><br />

        </center >
    </>
}

export default Client;