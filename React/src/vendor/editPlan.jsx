//Srusthi

import React, {useState, useEffect} from "react";
import axios from "axios";

import "./editProfile.css";


function EditPlan()
{
    const [plans, setPlans] = useState({
        plan_id:"",
        titile: "",
        description: "",
        price: "",

    });

    const [vendor_images, setVendor_images] = useState({
        image_url: "",
    });

    const [reviews, setReviews] = useState({
        review: "",
    });

    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:7777/vendor/2',
                    headers: {'x-auth-token': token}
                };

                const response = await axios(config);
                setPlans(response.data);
            } catch (error){
                console.error('Error fetching plan data: ', error);
            }
        };

        fetchData();

        const fetchImages = async () => {
            try {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:7777/wedding/vendor/${plans.plan_id',
                    headers: {'x-auth-token': token}
                };

                const response = await axios(config);
                setVendor_images(response.data);
            } catch (error) {
                console.error('Error fetching images: ',error);
            }
        };

        fetchImages();

        const fetchReviews = async () => {
            try {
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:7777/wedding/vendor/${plans.plan_id',
                    headers: {'x-auth-token': token}
                };

                const response = await axios(config);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews: ',error);
            }
        };

        fetchReviews();

    },[token]);

    return (
        <center>
            <div className="details">
                <p className="titles">Edit Plan</p>
                
            </div>
            <br/>
            
        </center>
    )
}

export default EditPlan;