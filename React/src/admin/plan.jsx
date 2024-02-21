//Srusthi

import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './plan.css';

function AdminPlan({ location }) {
    const initialPlan = location.state.plan;
    const [plan, setPlan] = useState(initialPlan);
    const history = useHistory();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan({
            ...plan,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:7777/plans/${plan.plan_id}`, plan, {
                headers: {
                    'x-auth-token': sessionStorage.getItem('token')
                }
            });
            console.log("Plan updated:", response.data);
            // Redirect or perform any other actions upon successful update
            history.push('/'); // Redirect to home page for example
        } catch (error) {
            console.error("Error updating plan:", error);
            // Handle error, e.g., display an error message to the user
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <center>
                <div className='bg-vendor'>
                    <div className='addplan'>
                        <div></div>
                        <h2 className='heading'>Show Plan Details</h2>
                    </div>
                    <br/>
                    <div>
                        <h4 className='que'>Title:</h4>
                        <br/>
                        <p className="plantitle">{plan.title}</p>
                        <br/>
                    </div>
                    <div>
                        <br/>
                        <h4 className='que'>Description:</h4>
                        <br/>
                        <p className="plandesc">{plan.description}</p>                        <br/>
                    </div>
                    <div>
                        <br/>
                        <h4 className='que'>Price:</h4>
                        <br/>
                        <p className="planprice">{plan.price}</p>                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                </div>
            </center>
        </form>
    );
}

export default AdminPlan;
