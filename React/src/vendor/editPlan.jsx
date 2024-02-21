import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function EditPlan({ location }) {
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
                        <h2 className='heading'>Edit Plan</h2>
                    </div>
                    <br/>
                    <div>
                        <h4 className='que'>Please provide a title for your plan:</h4>
                        <br/>
                        <textarea type='text' placeholder='Title' name='title' className='plantitle' value={plan.title} onChange={handleChange}></textarea>
                        <br/>
                    </div>
                    <div>
                        <br/>
                        <h4 className='que'>Can you describe your plan in a few sentences?:</h4>
                        <br/>
                        <textarea type='text' placeholder='Description'  name='description' className='plandesc' value={plan.description} onChange={handleChange}></textarea>
                        <br/>
                    </div>
                    <div>
                        <br/>
                        <h4 className='que'>Specify your plan price here:</h4>
                        <br/>
                        <input type='number' placeholder='Price' className='planprice' name='price' value={plan.price} onChange={handleChange}></input>
                    </div>
                    <br/>
                    <br/>
                    <button className='submit'>Save</button>
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

export default EditPlan;
