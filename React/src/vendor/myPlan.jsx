//Srusthi

import React, {useState, useEffect} from 'react';
import axios from "axios";

function MyPlan()
{
    const [plans, setPlans] = useState([]);

    const [vendor_images, setVendor_images] = useState([]);

    const [token, setToken] = useState(sessionStorage.getItem('token'));

    useEffect(() => {
        axios.get('http://localhost:7777/wedding/vendor/${plans.vendor_id') 
        .then(response => {
            setPlans(response.data);
        })
        .catch(error => {
            console.error('Error fetching plans: ', error);
        });

        axios.get('http://localhost:7777/wedding/vendor/${plans.vendor_id') 
        .then(response => {
            setVendor_images(response.data);
        })
        .catch(error => {
            console.error('Error fetching images: ', error);
        });
    },[token]);

    return (
        <center>
            <div className='myPlan'>
                
                {plans.map((plan, index) => (
                    <div key={index} className='plan'>
                        <h2 className='title'>{plan.title}</h2>
                        <div className='pp'>
                            <img src={vendor_images.image_url} alt='Pic'/>
                            <div className='desc'>
                                <h4>Description</h4>
                                <p>{plan.description}</p>
                                <div className='done'>
                                    <p>Done: </p>
                                    <p>Price: {plan.price}</p>
                                </div>
                                <div className='btn'>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                    <button>Approved</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </center>
    );
};

export default MyPlan;