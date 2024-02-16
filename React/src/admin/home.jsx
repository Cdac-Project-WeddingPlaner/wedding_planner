//Kajal
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [plans, setPlans] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    // Fetch vendors data
    axios.get('http://localhost:7777/vendors', {
      headers: {
        'x-auth-token': sessionToken // No need to wrap sessionToken in quotes
      }
    })
    .then(vendorsResponse => {
      setVendors(vendorsResponse.data);

      // Fetch plans data
      axios.get('http://localhost:7777/weddingPlanSelections_Plans', {
        headers: {
          'x-auth-token': sessionToken
        }
      })
      .then(plansResponse => {
        setPlans(plansResponse.data);
      })
      .catch(plansError => {
        console.error('Error fetching plans:', plansError);
      });
    })
    .catch(vendorsError => {
      console.error('Error fetching vendors:', vendorsError);
    });
  }, []); 
  
  return (

    <div class='container' > 
    <div class='table-responsive'>
       

    <table border="1" style={{ width: '800px', textAlign: 'center' }}>
              <thead>
              <th>No</th>
              <th>Vendor :</th>
              <th>Type :</th>
              <th>Plan : </th>
              <th>Status: </th>
              </thead>
  
          
              
              
        <tbody>

        {vendors.map((vendor, index) => (
        
  
            <tr key={index}>
              <td>{vendor.type}</td>
              <td>{vendor.plan}</td>
              
            </tr>
        ))}
        
        {plans.map((plan, index) => (

            <tr key ={index}>

              <td>{plan.plan}</td>
              <td>{plan.status}</td>
              </tr> 
              
          
     
        ))}
        </tbody>
        
  </table>
</div>
</div>
      
        
);
        }

export default Home;


// })}
// function Home(){

// const [plans, setplans] = useState([]);
// const [vendors, setvendors] = useState([]);



//   // Fetch Plans data from backend API using Axios
//   useEffect(() => {
//       const sessionToken = sessionStorage.getItem('token');
  
//       axios.get('http://localhost:7777/vendors', {
//         headers: {
//           'x-auth-token': `${sessionToken}` // Wrap 'x-auth-token' in quotes
//         }
//       })
//         .then(response => {
//           setplans(response.data)
           
//           response.data.array.forEach(vendors => {
//             axios.get('http://localhost:7777/weddingPlanSelections_Plans', {
//               headers: {
//                 'x-auth-token': `${sessionToken}` // Wrap 'x-auth-token' in quotes
//               }
           
            
//           });
//         })
//         .catch(error => {
//           console.error('Error fetching vendors:', error);
//           console.error('Error fetching plans:', error);
//         })
//     }, []);
    
    
    // const handleRowClick = (vendorId) => {
    //   history.push(`/weddingPlanSelections_Plans/${vendorId}`); // Redirect to plans details page
    // };
        

// return (
//   <div>
//     <div className="heading">
//       <h1>Vendor List</h1>
//     </div>
//     <div className="container">
//       <ul className="responsive-table">
//         {/* <li className="table-header">
//           <div className="col col-1">No</div>
//           <div className="col col-2">Vendor</div>
//           <div className="col col-3">Type</div>
//           <div className="col col-4">plan</div>
//           <div className="col col-5">Status</div>
//         </li>
//         {plans.map((plan,vendor, index) => (
//           <li className="table-row" key={index}>
//             <div className="col col-1">{vendor.vendor_id}</div>
//             <div className="col col-2">{`${vendor.first_name} ${vendor.last_name}`}</div>
//             <div className="col col-3">{vendor.is_verified}</div>
//             <div className="col col-4">{vendor.title}</div>
//             <div className="col col-5">{vendor.type}</div> {/* Placeholder for status */}
//           </li>
//         ))} */}
//       </ul>
//     </div>
//   </div>
// );}


