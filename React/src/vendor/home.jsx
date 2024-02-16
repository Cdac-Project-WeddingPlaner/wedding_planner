//Kajal

import React, { useState, useEffect } from 'react';
import './Home.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import profile from '../resourses/profile.jpg';

function Home() {

    const [plans, setPlans] = useState([]);
    const history = useHistory();
  
  
      // Fetch Plans data from backend API using Axios
      useEffect(() => {
          const sessionToken = sessionStorage.getItem('token');
        
          axios.get('http://localhost:7777/plans', {
            headers: {
              'x-auth-token': `${sessionToken}` // Wrap 'x-auth-token' in quotes
            }
          })
            .then(response => {
              setPlans(response.data);
            })
            .catch(error => {
              console.error('Error fetching plans:', error);
            });
        }, []);
        
        
        const handleRowClick = (planId) => {
          history.push(`/plans/${planId}`); // Redirect to plans details page
        };



  
 

  return (
    
    <div class='container' > 
      <div class='table-responsive'>
        
          <h1>Wedding Plans</h1>
          <hr />

          {plans.map((plan, index) => (

        <table class='table table-bordered'>
         <tbody>
         <tr key={index}>
           <td>
             <table >
               <tr >
                 <td ><img src={profile} /></td>
               </tr>
             </table>
           </td>
           <td>
             <table >
               <tr> 
                 <td>plan :{plan.plan_id}</td>
                 
               </tr>
               <tr> 
                 <td>name : {plan.title}</td>
                 
               </tr>
               <tr> 
                 <td>Date :{plan.created_at}</td>
                 
               </tr>
             </table>
           </td>
           <td>
             <table>
               <tr> 
                 <td>Price :{plan.price}</td>
                 
               </tr>
               <tr> 
                 <td>email : </td>
                 
               </tr>
               <tr> 
                 <td>Time :{plan.created_at}</td>
                 
               </tr>
             </table>
           </td>
           <td rowSpan='3'><input type="button" value="Accept"  className='btn btn-success'/></td>

           <td rowSpan='3'><input type="button" value="Reject"  className='btn btn-danger'/></td>

         </tr>
         </tbody>
       </table>   
            


          ))}

      </div>
    </div>      
  )

};

export default Home;
