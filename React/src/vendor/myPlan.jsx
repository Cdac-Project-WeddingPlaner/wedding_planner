import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import picz from '../resourses/reviewPic1.png';

import './myPlan.css';

function MyPlan() {
    const [plans, setPlans] = useState([]);
    const [vendorImages, setVendorImages] = useState([]);
    const history = useHistory();

    // Fetch vendor data from backend API using Axios
    useEffect(() => {
        const sessionToken = sessionStorage.getItem('token');

        axios.get('http://localhost:7777/plans', {
            headers: {
                'x-auth-token': sessionToken // No need to wrap sessionToken in `${}`
            }
        })
        .then(response => {
            setPlans(response.data);
        })
        .catch(error => {
            console.error('Error fetching plans:', error);
        });
    }, []);

    const handleRowClick = (plan) => {
        history.push({
            pathname: '/vendor/edit-plan',
            state: { plan: plan }
        });
    };

    const handleDelete = (planId) => {
        axios.delete(`http://localhost:7777/plans/${planId}`, {
            headers: {
                'x-auth-token': sessionStorage.getItem('token')
            }
        })
        .then(response => {
            // Filter out the deleted plan from the plans array
            setPlans(plans.filter(plan => plan._id !== planId));
        })
        .catch(error => {
            console.error('Error deleting plan:', error);
        });
    };

    return (
        <center>
            <div className='bg-vendor-my-plans'>
                <div className='myPlan-sc'>
                    {plans.map((plan, index) => (
                        <div key={index} className='plan-sc' >
                            <div className='title-sc'>{plan.title}</div>
                            <div className='pp-sc'>
                                <img src={picz} alt='Pic'/>
                                <div className='desc-sc'>
                                    <p>{plan.description}</p>
                                    <div className='done-sc'>
                                        <div>Price: {plan.price}</div>
                                    </div>
                                    <div className='btn-sc'>
                                        <div key={index} onClick={() => handleRowClick(plan)}>
                                            <button>Edit</button>
                                        </div>
                                        <button onClick={() => handleDelete(plan._id)}>Delete</button>
                                        <p className='approve-sc'>Approved</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </center>
    );
};

export default MyPlan;
