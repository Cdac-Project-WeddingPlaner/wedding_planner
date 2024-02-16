// Akash

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Routes from './utils/Routes';
import Navigation from './utils/Navigation';

import logo from './resourses/logo.png';

import './utils/Landing.css';

function Landing() {
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInSession = sessionStorage.getItem('user');
    if (userInSession) {
      setUser(JSON.parse(userInSession));
    }

    // Add event listener for route changes
    const unlisten = history.listen(() => {
      // Refresh the page on route change
      window.location.reload();
    });

    // Cleanup the event listener when the component unmounts
    return () => unlisten();
  }, [history]);

  const handleLoginClick = () => {
    const userInSession = sessionStorage.getItem('user');

    if (userInSession) {
      sessionStorage.removeItem('user');
      setUser(null);
      history.push('/login');
    } else {
      history.push('/login');
    }
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    history.push('/login');
  };

  return (
    <div className="landing-container">
      <header className="header">
        <div className="ex-margin">
          <div className="header-content">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="title-container">
              <h1 className="title">Tie The Knot</h1>
            </div>
            <div className="get-app-button">
              <button onClick={user ? handleLogoutClick : handleLoginClick}>
                {user ? 'Logout' : 'Log in'}
              </button>
              &nbsp;
              <button>Get App</button>
              {user && (
                <div className="user-info">
                  <p>{user.user_type} : {`${user.first_name} ${user.last_name}`}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Navigation user={user} />

      <div>
        <Routes />
      </div>

      <footer className="footer">
        <div className="ex-margin">
          <h1>Footer</h1>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
