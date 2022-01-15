import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import Home from '../../containers/Home/Home';
import Transaction from '../../containers/Transaction/Transaction';
import { HOME_ROUTE } from '../../_constants';
import Userlevel from '../../containers/Userlevel/Userlevel';
import Partners from '../../containers/Transaction/Partners';
import LeftSideBlock from '../../components/LeftSide/LeftSideBlock';
import Header from '../../components/Header/Header';
import LevelFive from './../../containers/Home/LevelFive';

class PrivateRoutes extends Component {
  state = {};
  render() {
    let { isLeftbar } = this.props;
    return (
      <div className="PrivateArea__content">
        <div className="mainBlock">
          <LeftSideBlock />
          <div className="rightSection">
            <Header />
            <Route
              path={`${HOME_ROUTE}auth/home`}
              component={Home}
              exact={true}
            />
            <Route
              path={`${HOME_ROUTE}auth/stats`}
              component={Transaction}
              exact={true}
            />
            <Route
              path={`${HOME_ROUTE}auth/partners`}
              component={Partners}
              exact={true}
            />
            <Route
              path={`${HOME_ROUTE}auth/level/`}
              component={LevelFive}
              exact={true}
            />
            <Route
              path={`${HOME_ROUTE}auth/userLevel/:address/:level/:matrix/:reinvest?`}
              component={Userlevel}
              exact={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(PrivateRoutes);
