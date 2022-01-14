import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Header.scss';
import { Link } from 'react-router-dom';
// import logofooter from "../../image/logo-footer.svg";
import { withRouter } from 'react-router';
import { logOut, toggleBox } from '../../redux/_actions/persist.action';
import { EthereumLogOut } from '../../redux/_actions/ethereum.action';
import { HOME_ROUTE } from '../../_constants';
// import Pdf from '../Header/unitron.pdf';
import { toast } from '../Toast/Toast';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class Header extends Component {
  state = {
    totalTrxValueInUsd: 0,
  };
  componentWillMount = () => {
    const { totals } = this.props;
    if (!totals) {
      toast.error('Something went wrong');
      this.logOutFunction();
      // window.location.reload();
    } else {
      this.setState({ totalTrxValueInUsd: totals.singletrx * totals.usd });
    }
  };

  logOutFunction = () => {
    let { EthereumLogOut, logOut, history } = this.props;

    EthereumLogOut();
    logOut();
    history.push(HOME_ROUTE);
    // window.location.reload();
  };

  render() {
    const { totals, totalParticipants, history, userDetails } = this.props;
    const { totalTrxValueInUsd } = this.state;
    //console.log(userDetails,'==================userDetails')
    // this.setState({totalTrxValueInUsd:totals.singletrx *  totals.usd})
    return (
      <div className="headerTop">
        <div className="headerLeft">
          {/* <Link
            to="#"
            className="mobile_navBtn"
            onClick={() => toggleBox(!isLeftbar)}
          >
            Mobile
          </Link> */}
          {/* <h3>Welcome</h3>
          <h4>{address}</h4> */}
          <ul className="header_crruntActivityRow">
            <li>
              <strong>{totalParticipants ? totalParticipants : 0}</strong>
              <span>All participants</span>
            </li>
            {/* <li>
              <strong>{registerationPerDay}</strong>
              <span>Joined in 24 hours</span>
            </li> */}
            {/* <li>
              <strong>{registerationPerDay}</strong>
              <span>Joined in 24 hours</span>
            </li> */}
            <li>
              <strong>{totals?.usd || 0}</strong>
              <span>Total deposit USDT</span>
            </li>
            <li>
              <strong>
                {totalTrxValueInUsd
                  ? parseFloat(totalTrxValueInUsd).toFixed(2)
                  : 0}
              </strong>
              <span>Total earned USD</span>
            </li>
            <li>
              <strong>
                {userDetails.id === '1'
                  ? '4'
                  : userDetails.currentActivatedLevel}
              </strong>
              <span>Current Level</span>
            </li>
            {userDetails.id !== '1' && (
              <li>
                <strong>{userDetails.referrerId}</strong>
                <span>Upline Id</span>
              </li>
            )}
          </ul>
        </div>
        <div className="headerRight">
          <Navbar expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                {/* <Link
                  to={`${HOME_ROUTE}auth/home`}
                  className={
                    `${HOME_ROUTE}auth/home` === history.location.pathname
                      ? 'active'
                      : ''
                  }
                >
                  Main
                </Link> */}
                {/* <Link
                to={`${HOME_ROUTE}auth/partners`}
                className={
                  `${HOME_ROUTE}auth/partners` === history.location.pathname
                    ? "active"
                    : ""
                }
              >
                Partners
              </Link> */}
                {/* <Link
                to={`${HOME_ROUTE}auth/stats`}
                className={
                  `${HOME_ROUTE}auth/stats` === history.location.pathname
                    ? "active"
                    : ""
                }
              >
                Stats
              </Link> */}
                {/* <Nav.Link href={Pdf} target="_blank" rel="noreferrer noopener">
                Information
              </Nav.Link> */}
                <Link to={HOME_ROUTE} onClick={() => this.logOutFunction()}>
                  Logout
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </div>
    );
  }
}
// logo_url
const mapStateToProps = (state) => {
  return {
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    registerationPerDay: state.persist.registerationPerDay,
    totals: state.persist.totals,
    totalParticipants: state.persist.totalParticipants,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(logOut()),
    toggleBox: () => dispatch(toggleBox()),
    EthereumLogOut: () => dispatch(EthereumLogOut()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
