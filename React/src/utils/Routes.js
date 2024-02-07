import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthRoute from './authRoute';

import Home from '../Homemain';
import Login from '../Login';
import Register from '../register';
import ChangePass from '../changePass';
import RegisterC from '../client/register';
import ProfileC from '../client/Profile';
import AddReview from '../client/addReview';
import HomeC from '../client/home';
import MyPlanC from '../client/myPlan';
import ShowPlanC from '../client/showPlan';
import RegisterV from '../vendor/register';
import AddPlan from '../vendor/addPlan';
import EditPlan from '../vendor/editPlan';
import HomeV from '../vendor/home';
import MyPlanV from '../vendor/myPlan';
import ShowReview from '../vendor/showReview';
import ProfileV from '../vendor/Profile';
import Client from '../admin/client';
import ClientList from '../admin/clientList';
import HomeA from '../admin/home';
import Package from '../admin/package';
import PackageList from '../admin/packageList';
import Plan from '../admin/plan';
import Vendor from '../admin/vendor';
import VendorList from '../admin/vendorList';

import NotFound from '../NotFound';

function Routes() {
  return (
    <Switch>
          <Route path="/home" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/client/register" exact component={RegisterC} />
          <Route path="/vendor/register" exact component={RegisterV} />
          <AuthRoute path="/changepassword" exact component={ChangePass} allowedRoles={['admin', 'vendor', 'client']}/>

          <AuthRoute path="/client/give-review" exact component={AddReview} allowedRoles={['client']}/>
          <AuthRoute path="/client/profile" exact component={ProfileC} allowedRoles={['client']}/>
          <AuthRoute path="/client/home" exact component={HomeC} allowedRoles={['client']}/>
          <AuthRoute path="/client/my-plan" exact component={MyPlanC} allowedRoles={['client']}/>
          <AuthRoute path="/client/show-plan" exact component={ShowPlanC} allowedRoles={['client']}/>
          
          <AuthRoute path="/vendor/add-plan" exact component={AddPlan} allowedRoles={['vendor']}/>
          <AuthRoute path="/vendor/edit-plan" exact component={EditPlan} allowedRoles={['vendor']}/>
          <AuthRoute path="/vendor/home" exact component={HomeV} allowedRoles={['vendor']}/>
          <AuthRoute path="/vendor/my-plans" exact component={MyPlanV} allowedRoles={['vendor']}/>
          <AuthRoute path="/vendor/show-review" exact component={ShowReview} allowedRoles={['vendor']}/>
          <AuthRoute path="/vendor/profile" exact component={ProfileV} allowedRoles={['vendor']}/>

          <AuthRoute path="/admin/client" exact component={Client} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/client-list" exact component={ClientList} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/home" exact component={HomeA} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/package" exact component={Package} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/packages" exact component={PackageList} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/plan" exact component={Plan} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/vendor" exact component={Vendor} allowedRoles={['admin']}/>
          <AuthRoute path="/admin/vendor-list" exact component={VendorList} allowedRoles={['admin']}/>

          <Route path="*" exact component={NotFound} />
        </Switch>
  );
}

export default Routes;
