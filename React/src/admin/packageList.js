//Kajal

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./package.css";
import { useHistory } from 'react-router-dom';

function PackageList() {
  const [data, setData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    axios.get('http://localhost:7777/packages', {
      headers: {
        'x-auth-token': sessionToken
      }
    })
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('Error fetching package and plans:', error);
    });
  }, []);

  const handleEditClick = (plan) => {
    history.push(`/admin/plan`
    );
  };

  const handleDeleteClick = (id) => {
    // Handle delete click
    console.log('Delete clicked for package with id:', id);
  };



 // return (
    // <div>
    //   <center>
    //     <hr />
    //     <table border="1" style={{ width: '800px', textAlign: 'center' }}>
    //       <thead>
    //         <tr>
    //           <th>Package</th>
    //           <th>Plan Title</th>
    //           <th>Description</th>
    //           <th>Price</th>
    //           <th colSpan="2">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {data.map((packageData, index) => (
    //           packageData.plans.map((plan, planIndex) => (
    //             <tr key={`${index}-${planIndex}`}>
    //               <td>{packageData.packagename}</td>
    //               <td>{plan.title}</td>
    //               <td>{plan.description}</td>
    //               <td>{plan.price}</td>
    //               <td>
    //                 <input type='button' value='Edit' className='btn btn-warning' onClick={() => handleEditClick(plan.id)} />
    //               </td>
    //               <td>
    //                 <input type='button' value='Delete' className='btn btn-danger' />
    //               </td>
    //             </tr>
    //           ))
    //         ))}
    //       </tbody>
    //     </table>
    //   </center>
    // </div>

    
 // );
//}


return (
  <div className="package-list">
    <center>
      <hr />
      <table border="1" style={{ width: '800px', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Plan Names</th>
            <th>Plan Descriptions</th>
            <th>Total Price</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((packageData, index) => (         

            <tr key={index}>
              {/* Package Name */}
              <td>{packageData.packagename}</td>

              {/* Plan Names */}
              <td>
                {packageData.plans.map((plan, planIndex) => (
                  <div key={`${index}-${planIndex}`}>{plan.title}</div>
                ))}
              </td>

              {/* Plan Descriptions */}
              <td>
                {packageData.plans.map((plan, planIndex) => (
                  <div key={`${index}-${planIndex}`}>{plan.description}</div>
                ))}
              </td>

              {/* Total Price */}
              <td>
              {packageData.plans.reduce((sum, plan) => sum + parseFloat(plan.price), 0)}
              </td>

              {/* Edit and Delete Buttons */}
              <td>
                <input
                  type='button'
                  value='Edit'
                  className='btn btn-warning'
                  onClick={() => handleEditClick(packageData.id)}
                />
              </td>
              <td>
                <input
                  type='button'
                  value='Delete'
                  className='btn btn-danger'
                  onClick={() => handleDeleteClick(packageData.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </center>
  </div>
);
}
         
          
        
      

export default PackageList;
