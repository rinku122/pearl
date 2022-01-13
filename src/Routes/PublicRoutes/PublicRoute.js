import React, { Component } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import Login from "../../containers/User/Login";
import { HOME_ROUTE } from "../../_constants";
import Register from "../../containers/User/Register";

const My404Component = props => {
  return <div>Page Not Found</div>;
};

class PublicRoutes extends Component {
  state = {};
  render() {
    return (
      <div className="PublicArea__content">
         <Route path={HOME_ROUTE} component={Login} exact />
        <Route
          path={`${HOME_ROUTE}referral/:upline`}
          component={Login}
          exact
        />
        <Route
          path={`${HOME_ROUTE}r/:upline`}
          component={Login}
          exact
        />
        
        
        {/* <Route path="/transaction" component={Transaction} exact /> */}

        {/* <Route path={HOME_ROUTE} component={SignUp} exact /> */}
       
        <Route path={`${HOME_ROUTE}register`} component={Register} exact />
        {/* <Route path="/" render={() => { return (<Redirect to={HOME_ROUTE} />) }} /> */}

        {/* <Route component={My404Component} /> */}
      </div>
    );
  }
}

export default withRouter(PublicRoutes);
