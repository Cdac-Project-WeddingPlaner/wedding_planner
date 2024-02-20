import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './clientList.css'; // Import the CSS file

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [weddingDates, setWeddingDates] = useState({});
  const history = useHistory();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token');

    // Fetch client data
    axios.get('http://localhost:7777/client', {
      headers: {
        'x-auth-token': sessionToken
      }
    })
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });

    // Fetch wedding dates for each client
    axios.get('http://localhost:7777/wedding', {
      headers: {
        'x-auth-token': sessionToken
      }
    })
      .then(response => {
        const weddingDatesMap = {};
        response.data.forEach(wedding => {
          weddingDatesMap[wedding.client_id] = new Date(new Date(wedding.wedding_date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        });
        setWeddingDates(weddingDatesMap);
      })
      .catch(error => {
        console.error('Error fetching wedding dates:', error);
      });
  }, []);

  const handleRowClick = (clientId) => 
      history.push({
        pathname: '/admin/client', // Target component's URL
        state: { clientId: clientId } // Data to send
      });

  return (
    <div>
      <div className="heading">
        <h1>Client List</h1>
      </div>
      <div className="container">
        <ul className="responsive-table">
          <li className="table-header">
            <div className="col col-1">Client No</div>
            <div className="col col-2">Full Name</div>
            <div className="col col-3">Wedding Date</div>
            <div className="col col-4">Status</div>
          </li>
          {clients.map((client, index) => (
            <div key={index} onClick={() => handleRowClick(client.client_id)}> 
            <li className="table-row" key={index}>
              <div className="col col-1">{client.client_id}</div>
              <div className="col col-2">{`${client.first_name} ${client.middle_name} ${client.last_name}`}</div>
              <div className="col col-3">{weddingDates[client.client_id] || "Loading..."}</div>
              <div className="col col-4">Status Placeholder</div> {/* Placeholder for status */}
            </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClientList;
