import React, { Component } from 'react';
import './LeftSideBlock.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png';
import logob from '../../images/logo_black.png';
import copyIcon from '../../images/icon_copyAddress.svg';
import tronIcon from '../../images/tron-logo.svg';
import theuni from '../../images/the_uni.png';
import groupicon from '../../images/group_icon.png';
import { toggleBox } from '../../redux/_actions/persist.action';
import {
  HOME_ROUTE,
  REFERRAL_URL,
  ETHERSCAN_URL,
  CONTRACT_ADDRESS,
} from '../../_constants';
import { toast } from '../Toast/Toast';
import Header from '../Header/Header';

import {
  poolPrice,
  getEuroPrice,
  totalParticipants,
  getTotalDB,
  statsLevel,
  registeredPerDay,
  directReferralUsers,
} from '../../redux/_actions/ethereum.action';

class LeftSideBlock extends Component {
  state = { activeIndex: '', directCounts: 0 };

  componentDidMount = () => {
    const {
      // poolPrice,
      totalParticipants,
      getTotalDB,
      registeredPerDay,
    } = this.props;
    // poolPrice();
    totalParticipants();
    getTotalDB();
    this.callData();
    registeredPerDay();
  };

  callData = async () => {
    const { directReferralUsers } = this.props;
    directReferralUsers().then((response) => {
      this.setState({ directCounts:  response? response.data.refferalsCount: 0});
    });
  };

  componentWillReceiveProps = (nextProps) => {
    if (
      this.props.location.pathname === nextProps.location.pathname &&
      this.props.location.search === nextProps.location.search
    ) {
      // this means that no change in the path, so we don't need to refire the
      // action
      return;
    }
    // if not fire the action
    this.props.getEuroPrice();
    this.props.totalParticipants();
    this.props.getTotalDB();
    this.props.registeredPerDay();
  };

  //copy function
  copyToClipboard = (referralUrl) => {
    this.textArea.value = referralUrl;
    this.textArea.select();
    document.execCommand('copy');
    toast.success('Copied!');
  };

  referralRandomLink = (address, id) => {
    console.log('addres', typeof address, address, id);
    if (address !== undefined) {
      if (typeof address === 'object') {
        return `${address?.address.substr(
          address?.address.length - 5
        )}${id}`.toUpperCase();
      } else {
        return `${address.substr(address.length - 5)}${id}`.toUpperCase();
      }
    }
    return;
  };

  render() {
    let {
      isLeftbar,
      toggleBox,
      history: {
        location: { pathname },
      },
      userDetails,
      address,
      convertedAddress,
      totalIncome,
      totalIncome3x,
      totalIncome4x,
      euroPrice,
      usdValueOfTrx,
    } = this.props;

    console.log('Props', this.props);
    const { directCounts } = this.state;

    const referralUrl =
      REFERRAL_URL + this.referralRandomLink(address, userDetails.id);
    // const referralUrl = REFERRAL_URL + process.env.REACT_APP_CONTRACT_ADDRESS;
    const etherscanLink = ETHERSCAN_URL + '#/address/' + convertedAddress;
    const smartContractLink =
      ETHERSCAN_URL + '#/contract/' + process.env.REACT_APP_CONTRACT_ADDRESS;

    const euroPrice3x = (euroPrice * userDetails.userIncome).toFixed(2);
    const euroPrice4x = (euroPrice * userDetails.poolIncome).toFixed(2);

    totalIncome =
      parseFloat(userDetails.userIncome) + parseFloat(userDetails.poolIncome);
    const usdTotalIncome = (
      userDetails.totalIncome * usdValueOfTrx?.singletrx
    ).toFixed(2);
    totalIncome3x = userDetails.userIncome;
    totalIncome4x = userDetails.poolIncome;

    return (
      <div className={`leftBar ${isLeftbar ? 'isShow' : 'isHide'}`}>
        <div className="left_logoBlock">
          <div className="logoBlock">
            <Link to={`${HOME_ROUTE}auth/home`} title="Dashboard">
              <img src={logo} alt="logo" />
            </Link>
          </div>
        </div>
        <h2 className="navHeading">
          <Header />
        </h2>

        <div className="sidebarNav">
          <div className="sn_identity">
            <div className="sn_identity_top">
              <img src={tronIcon} className="tron" />
              <ul>
                <li>
                  <strong>
                    <i>ID </i> {userDetails.id}
                  </strong>
                </li>
                <li>
                  <strong>
                    <i>
                      <img src={groupicon} />
                    </i>{' '}
                    {directCounts}
                  </strong>
                </li>
                <li>
                  <strong>$ {(usdTotalIncome === '' || usdTotalIncome === 'NaN' ) ? '0' : usdTotalIncome}</strong>
                </li>
              </ul>
            </div>
            {/* <label>{totalIncome.toFixed(2)} TRX</label> */}
            <label>{userDetails.totalIncome} TRX</label>
          </div>
          <div className="sn_matTypeOut">
            <div className="sn_matType ex_bottom_margin">
              <h2>
                {' '}
                <img src={logo} className="desk" />{' '}
                <img src={logob} className="mob" alt="logo" />
              </h2>
              <ul>
                {/* <li><strong>{totalIncome4x}<span>TRX</span></strong></li> */}
                {/* <li><strong>{euroPrice4x}</strong> <span> USD</span> </li> */}
              </ul>
            </div>
          </div>

          <div className="">
            <textarea
              type="text"
              style={{
                position: 'absolute',
                top: '0',
                border: 'none',
                background: 'none',
                color: '#3ca4d5',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                resize: 'none',
              }}
              ref={(textarea) => (this.textArea = textarea)}
              defaultValue={referralUrl}
            />
          </div>

          <div className="sn_LinkBar">
            <label>Affiliate Link</label>
            <div className="linkBlock">
              <span>{referralUrl}</span>
              <Link to="#" onClick={() => this.copyToClipboard(referralUrl)}>
                <img src={copyIcon} alt="copy" />
              </Link>
            </div>
            {/*  <a href={etherscanLink} target="_blank" className="ethScanLink">To Tronscan</a>*/}
            <label>Tronscan link</label>
            <div className="linkBlock">
              <span>{etherscanLink}</span>
              <Link
                to="#"
                href="#"
                onClick={() => this.copyToClipboard(etherscanLink)}
              >
                <img src={copyIcon} alt="copy" />
              </Link>
            </div>
            <label>Smart Contract link</label>
            <div className="linkBlock">
              <span>{etherscanLink}</span>
              <Link
                to="#"
                href="#"
                onClick={() => this.copyToClipboard(smartContractLink)}
              >
                <img src={copyIcon} alt="copy" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    usdValueOfTrx: state.persist?.totals,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    totalIncome: state.ethereum.totalIncome,
    totalIncome3x: state.ethereum.totalIncome3x,
    totalIncome4x: state.ethereum.totalIncome4x,
    euroPrice: state.persist.euroPrice,
    convertedAddress: state.persist.convertedAddress
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleBox: () => dispatch(toggleBox()),
    poolPrice: () => dispatch(poolPrice()),
    getEuroPrice: () => dispatch(getEuroPrice()),
    totalParticipants: () => dispatch(totalParticipants()),
    registeredPerDay: () => dispatch(registeredPerDay()),
    statsLevel: () => dispatch(statsLevel()),
    getTotalDB: () => dispatch(getTotalDB()),
    directReferralUsers: () => dispatch(directReferralUsers()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LeftSideBlock)
);
