import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const userInSession = sessionStorage.getItem('user');
  
  if (!userInSession) {
    return <Redirect to="/login" />;
  }

  const user = JSON.parse(userInSession);

  if (!allowedRoles.includes(user.user_type)) {
    return <Redirect to="/home" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default AuthRoute;
