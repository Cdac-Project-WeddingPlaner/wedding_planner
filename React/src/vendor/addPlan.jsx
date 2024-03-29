//Srusthi

import React, {useState} from 'react';
import axios from 'axios';
import './addPlan.css';


function AddPlan()
{
    //to store the data
    const [plans, setPlans] = useState({
        plan_id:'',
        vendor_id:'',
        title:'',
        description:'',
        price:'',
        created_at:''
    });

    const [vendor_images, setVendor_images] = useState(null);

    //to handle input change
    const handleChange = (e) => {
        setPlans({
            ...plans,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setVendor_images(e.target.files[0]);
    } 



    //submit data using axios
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append('plan_id', plans.plan_id);
            formData.append('vendor_id', plans.vendor_id);
            formData.append('title', plans.title);
            formData.append('description', plans.description);
            formData.append('price', plans.price);
            formData.append('created_at', plans.created_at);
            formData.append('image', vendor_images);
            const response =await axios.post("http://localhost:7777/vendor/add-plan", plans);
            console.log("Post created:", response.data);
        } catch (error){
            console.error("Error creating post:", error);
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
        <center>
            <div className='bg-vendor'>
                <div className='addplan'>
                    <div></div>
                    <br/>
                    <br/>
                    <h2 className='heading'>Add New Plan</h2>
                </div>
                <br/>
                <br/>
                <div>
                    <h4 className='que'>Please provide a title for your plan:</h4>
                    <br/>
                    <textarea type='text' placeholder='Title' name='title' className='plantitle' value={plans.title} onChange={handleChange}></textarea>
                    <br/>
                </div>
                <div>
                    <h4 className='que'>Can you describe your plan in a few sentences?:</h4>
                    <br/>
                    <textarea type='text' placeholder='Description'  name='description' className='plandesc' value={plans.description} onChange={handleChange}></textarea>
                    <br/>
                </div>
                <div>
                    <h4 className='que'>Specify your plan price here:</h4>
                    <br/>
                    <input type='number' placeholder='Price' className='planprice' name='price' value={plans.price} onChange={handleChange}></input>
                    <br/>
                </div>
                <br/>
                <br/>
                <button className='submit'>Submit</button>
                <br/>
                <br/>
            </div>
        </center>
        </form>
        </>
    )
}

export default AddPlan;