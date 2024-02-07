// Landing.js

import React from 'react';
import { Link, Switch, Route, useHistory } from 'react-router-dom';
import Home from './Homemain';
import Profile from './Profile';
import logo from './resourses/logo.png';
import NotFound from './NotFound';
import Login from './Login'; 
import './Landing.css'; 

function Landing() {
  const history = useHistory();

  const handleLoginClick = () => {
    // Navigate to the login page when the "Log in" button is clicked
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
              <button onClick={handleLoginClick}>Log in</button>
              &nbsp;
              <button>Get App</button>
            </div>
          </div>
        </div>
      </header>

      <nav className="navigation">
        <div className="ex-margin">
          <Link to="/home">Home</Link> {" | "}
          <Link to="/profile">Profile</Link> {" | "}
        </div>
      </nav>

      <Switch>
        <Route path="/home" exact component={Home} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/login" exact component={Login} /> {/* Use the Login component for the /login route */}
        <Route path="*" exact component={NotFound} />
      </Switch>

      <footer className="footer">
        <div className="ex-margin">
          <h1>Footer</h1>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
