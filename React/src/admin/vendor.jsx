
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import img from "../resourses/profile.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../client/profile.css';
import '../admin/vendor.css';
import star from '../resourses/star.jpg'

function Vendor() {

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

    const history = useHistory();
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [editVendor, setEditVendor] = useState(false);
    const [plans, setPlans] = useState([]);

    const location = useLocation();
    const vendorId = location.state.vendorId;
    const [reviews, setReviews] = useState([]);

    const handleRowClick = (plan_id) => 
    history.push({
      pathname: `/admin/plan/${plan_id}`, // Target component's URL
      state: { plan_id: plan_id } // Data to send
    });

    useEffect(() => {

        const fetchData = async () => {
            try {
                const vendorConfig = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `http://localhost:7777/vendor/${vendorId}`,
                    headers: { 'x-auth-token': token }
                };

                const vendorResponse = await axios(vendorConfig);
                setVendor(vendorResponse.data);
            } catch (error) {
                console.error('Error fetching vendor data:', error);
            }
        };


        

        const fetchPlans = async () => {
            
            try {
                
                const plansConfig = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `http://localhost:7777/plans/vendor/${vendorId}`,
                    headers: { 'x-auth-token': token }
                };

                const plansResponse = await axios(plansConfig);
                setPlans(plansResponse.data); // Assuming there's a setPlans function
            } catch (error) {
                console.error('Error fetching plans data:', error);
            }
        };

        fetchData();
        fetchPlans();



    }, []);


    return <>
        <center>
            <div class="profile-container">
                <div class="profile-image-container">
                    <img src={img} alt="Profile" className="profile-image" />
                </div>
                <div class="profile-details">
                    <div><h3>{vendor.business_name}</h3></div>
                    <div><h3>Type: {vendor.service_type}</h3></div>
                    <br /><br />
                    <div class="details">
                        <div></div>
                        <p className="titles">Business Details</p>
                        <div></div>
                    </div>
                    <br />
                    <div><b>Description: </b>{vendor.description}</div>
                    <div><b>Phone:</b>{vendor.alternate_number}</div>
                    <div><b>Email: </b>{vendor.contact_email}</div>
                    <div><b>Address: </b>{vendor.business_address}</div>
                </div>
            </div>
            <br />

            <div className="details">
                <div></div>
                <p className="titles">Personal Details</p>
                <div></div>
            </div>
            <br />
            <div><b>Name : </b>{vendor.first_name}  {vendor.middle_name}  {vendor.last_name} </div>

            <div><b>Phone : </b>{vendor.phone_number}</div>
            <div><b>Email : </b>{vendor.email}</div>
            <div><b>Address : </b>{vendor.address}</div>
            <br />

            <div className="details">
                <div></div>
                <p className="titles">Plans</p>
                <div></div>
            </div>
            <br /><br />

            <div className="plans-container">
      {plans.map((plan, index) => (
        <div className="plan-item" key={index} onClick={() => handleRowClick(plans.plan_id)}>
          <div className="plan-image">
            <img src={img} alt={plan.title} />
          </div>
          <div className="plan-details">
            <h3>{plan.title}</h3>
            <div className="plan-rating">
              <div className="star">
                <img src={star} alt="star" />
              </div>
              <h3 className="planRating">{plan.rating}</h3>
            </div>
            <div className="plan-price">
              <h3>Rs. {plan.price}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>

            <br /><br />


            <div className="details">
                <div></div>
                <p className="titles">Reviews</p>
                <div></div>
            </div><br />
            <div className="reviews-container">
                {plans.map((plan, index) => (
                    <div className="reviews-item" key={index}>
                        <div className="reviews-image">
                            <img src={img} alt={plan.title} />
                        </div>
                        <div className="reviews-details">
                            <h3>{plan.title}</h3>
                            <div className="reviews-rating">
                                <div className="star">
                                    <img src={star} alt="Star" />
                                </div>
                                <h3 className="reviewsRating">{plan.rating}</h3>
                            </div>
                            <div className="plan-price">
                            </div>
                        </div>
                    </div>
                ))}
            </div>



        </center>


    </>
}

export default Vendor;