
//Srusthi
import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';


function MyPlan() {
    
    const [plans, setPlans] = useState([]);
    const [vendor_images, setVendor_images] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchPlans = async () => {
          try {
            const response = await fetch("http://localhost:7777/plans");
            const data = await response.json();
            setPlans(data || []);
          } catch (error) {
            console.error('Error fetching plans:', error);
          }
        };
        
        const fetchImages = async () => {
            try {
              const response = await fetch("http://localhost:7777/vendor_images");
              const data = await response.json();
              setPlans(data || []);
            } catch (error) {
              console.error('Error fetching plans:', error);
            }
          };
        
        fetchImages();
        fetchPlans();
      }, []);

      const handleRowClick = (vendor_id) => {
        history.push({
            pathname: '/vendor/my-plans',
            state:{vendor_id:vendor_id}
        });
    }


      return (
        <center>
            <div className='myPlan'>
                
                {plans.map((plan, index) => (
                    <div key={index} className='plan' onClick={()=> handleRowClick(plan.vendor_id)}>
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