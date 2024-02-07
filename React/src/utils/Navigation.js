import React from 'react';
import { NavLink } from 'react-router-dom';

function Navigation({ user }) {
  let navLinks = [];

  if (!user) {
    // If user not in sessionStorage, show basic navigation
    navLinks = [
      <NavLink to="/home" key="home">Home</NavLink>,
      <NavLink to="/home" key="about">About us</NavLink>,
      <NavLink to="/home" key="reviews">Reviews</NavLink>,
    ];
  } else {
    // If user in sessionStorage, show navigation based on user type
    switch (user.user_type) {
      case 'admin':
        navLinks = [
          <NavLink to="/admin/home" activeClassName="active" key="home">Home</NavLink>,
          <NavLink to="/admin/client-list" activeClassName="active" key="client">Client</NavLink>,
          <NavLink to="/admin/vendor-list" activeClassName="active" key="vendor">Vendor</NavLink>,
          <NavLink to="/admin/packages" activeClassName="active" key="packages">Packages</NavLink>,
          <NavLink to="/admin/package" activeClassName="active" key="add-package">Add Package</NavLink>,
        ];
        break;
      case 'vendor':
        navLinks = [
          <NavLink to="/vendor/home" activeClassName="active" key="home">Home</NavLink>,
          <NavLink to="/vendor/profile" activeClassName="active" key="profile">Profile</NavLink>,
          <NavLink to="/vendor/my-plans" activeClassName="active" key="my-plans">My Plans</NavLink>,
          <NavLink to="/vendor/add-plan" activeClassName="active" key="add-plan">Add Plan</NavLink>,
          <NavLink to="/vendor/show-review" activeClassName="active" key="reviews">Reviews</NavLink>,
        ];
        break;
      case 'client':
        navLinks = [
          <NavLink to="/client/home" activeClassName="active" key="home">Home</NavLink>,
          <NavLink to="/client/profile" activeClassName="active" key="profile">Profile</NavLink>,
          <NavLink to="/client/my-plan" activeClassName="active" key="my-plans">My Plans</NavLink>,
          <NavLink to="/client/give-review" activeClassName="active" key="reviews">Reviews</NavLink>,
        ];
        break;
      default:
        navLinks = [
          <NavLink to="/home" activeClassName="active" key="home">Home</NavLink>,
          <NavLink to="/home" activeClassName="active" key="about">About us</NavLink>,
          <NavLink to="/home" activeClassName="active" key="reviews">Reviews</NavLink>,
        ];
        break;
    }
  }

  return (
    <nav className="navigation">
      <div className="ex-margin">
        {navLinks}
      </div>
    </nav>
  );
}

export default Navigation;
