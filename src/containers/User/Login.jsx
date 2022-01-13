import React, { Component } from 'react';
import './User.scss';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../_constants/index';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { toast } from '../../components/Toast/Toast';
import { history } from '../../redux/_store/history';

import {
  getUserTronWeb,
  getUsers,
  getUserSocket,
  regUserTronWeb,
  // getEuroPrice,
  getTotalDB,
  userIds,
  totalParticipants,
  addMissingTransaction,
  userIdsSocket,
  tronAdress,
  users,
  userResponseAction,
} from '../../redux/_actions/ethereum.action';
//import { DEFAULT_ADDRESS } from '../../_constants';
import { startLoading, stopLoading } from '../../redux/_actions/loading.action';
import {
  saveLogin,
  saveUserDetail,
  saveUserDetails,
  lastLoginDetails,
} from '../../redux/_actions/persist.action';
import {
  saveLogin1,
} from '../../redux/_actions/ethereum.action';
import logo from '../../images/logo.png';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      registration: true,
      errorCss: 'blockDiv',
      regUserCss: 'blockDiv',
      loggedUser: '',
      upline: '',
      loginType: 'tronWeb',
      userAddress: '',
      userLogin: {},
    };
  }
  // t

  componentDidMount = () => {
    const {
      match: { params },
      getEuroPrice,
      getTotalDB,
      totalParticipants,
    } = this.props;
    let { upline } = params;

    if (upline) {
      upline = upline.slice(5);
      this.setState({ upline });
    }
    // getEuroPrice();
    getTotalDB();
    totalParticipants();
    // this.addListeners();
    this.isTronLinkInstalled();
    // this.getAddress();
  };
  // addListeners = () => {
  //   let that = this;
  //   window.addEventListener('message', function (e) {
  //     if (e.data.message && e.data.message.action == 'tabReply') {
  //     }

  //     if (e.data.message && e.data.message.action == 'setAccount') {
  //       console.log('setAccount event', e.data.message);
  //       if (e.data.message.data.address) {
  //         //setting the address
  //         console.log('current address:', e.data.message.data.address);
  //         that.setState({ loggedUser: e.data.message.data.address });
  //       }
  //     }
  //     if (e.data.message && e.data.message.action == 'setNode') {
  //     }
  //   });
  // };

  isTronLinkInstalled = async () => {
    var myVar = setTimeout(async () => {
      const tronWeb = await window.tronWeb;
      console.log(tronWeb);
      if (tronWeb) {
        let address = tronWeb.defaultAddress.base58;

        if (address) {
          this.setState({ loginType: 'tronWeb' });
          this.setState({ loggedUser: tronWeb.defaultAddress.base58 });
          window.clearInterval(myVar);
        } else {
          toast.error('Please sign in Tronlink extension!');
        }
      } else {
        toast.error('Please install tronlink extension first');
      }
    }, 2000);
  };

  // formSubmit = async () => {
  //   const {
  //     getUserTronWeb,
  //     getUsers,
  //     history,
  //     regUserTronWeb,
  //     userIds,
  //   } = this.props;
  //   let { loggedUser, upline } = this.state;

  //   if (isNaN(upline)) {
  //     upline = upline.slice(5);
  //   }
  //   const addressSizeArr = [0, 34, 42];

  //   this.setState({ registration: false });

  //   if (upline.trim().length === 0) {
  //     this.setState({ registration: true });
  //     return toast.error('Enter valid reference ID!');
  //   }
  //   if (this.checkId(upline)) {
  //     this.setState({ registration: true });
  //     return toast.error('Enter valid reference ID!');
  //   }

  //   const installed = await this.isTronLinkInstalled();

  //   try {
  //     if (installed === 'tronWeb') {
  //       const { tronWeb } = window;
  //       let address = tronWeb.defaultAddress.base58;
  //       let addressHex = tronWeb.defaultAddress.hex;
  //       if (loggedUser === '') {
  //         this.setState({ loggedUser: address });
  //       } else if (addressSizeArr.indexOf(loggedUser.length) > -1) {
  //         address = loggedUser;
  //       } else {
  //         if (this.checkId(loggedUser)) {
  //           this.setState({ registration: true });

  //           return toast.error('Enter valid ID!');
  //         } else {
  //           address = await userIds(loggedUser);
  //           this.setState({ loggedUser: '' });
  //           if (address === '0x0000000000000000000000000000000000000000') {
  //             this.setState({ registration: true });

  //             return toast.error('User not registered!');
  //           }
  //         }
  //       }
  //       if (addressSizeArr.indexOf(upline.length) === -1) {
  //         upline = await userIds(upline);
  //         if (
  //           upline === '0x0000000000000000000000000000000000000000' ||
  //           !upline
  //         ) {
  //           this.setState({ registration: true });
  //           return toast.error('Reference not found!');
  //         }
  //       }
  //       if (
  //         upline.toLowerCase() === address.toLowerCase() ||
  //         upline.toLowerCase() === addressHex.toLowerCase()
  //       ) {
  //         this.setState({ registration: true });
  //         return toast.error('Reference must not equal to your address!');
  //       }

  //       const uplineUser = await getUsers(upline);

  //       if (uplineUser.id === '0') {
  //         this.setState({ registration: true });
  //         return toast.error('Reference not found!');
  //       }

  //       const user = await getUserTronWeb(address);
  //       console.log(user, 'sdfsdfds');
  //       if (user) {
  //         if (user.id !== '0') {
  //           toast.error('User already exists!');
  //           setTimeout(() => {
  //             history.push(`${HOME_ROUTE}auth/home`);
  //           }, 1000);
  //         } else {
  //           regUserTronWeb(address, upline)
  //             .then((user) => {
  //               this.setState({ registration: true });
  //               if (user) {
  //                 setTimeout(() => {
  //                   history.push(`${HOME_ROUTE}auth/home`);
  //                 }, 3000);
  //               }
  //             })
  //             .catch((error) => {
  //               toast.error(error.message);
  //               this.setState({ registration: true });
  //             });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     this.setState({ registration: true });
  //   }
  // };

  checkId(id) {
    if (id.length === 0 || (id.length > 0 && isNaN(id))) {
      return true;
    }
    if (parseInt(id) <= 0) {
      return true;
    }
    return false;
  }

  logIn = async () => {
    const { userIds } = this.props;
    let { loggedUser } = this.state;
    const addressSizeArr = [34, 42];
    let address = '';
    this.props.startLodingComponent();
    try {
      if (loggedUser === '') {
        this.props.stopLodingComponent();
        return toast.error('Enter valid ID!');
      } else if (addressSizeArr.indexOf(loggedUser.length) > -1) {
        let addressLength = loggedUser.length;
        address = loggedUser;
        if (addressLength === 34) {
          console.log('here we dispatch Address funtion when value is 34');
          let res = await this.sendUserAddress(loggedUser);
          console.log('res', res);

          this.setState({ userLogin: { ...res } });
          this.goToHome(res, loggedUser);
          this.props.stopLodingComponent();
        } else {
          console.log('here we dispatch Address funtion when value is 42');
          let AddressResult = this.sendUserAddress(loggedUser);
          AddressResult.then((res) => {
            console.log('res', res);
            this.setState({ userLogin: { ...res } });
            this.goToHome(res);
            this.props.stopLodingComponent();
          });
        }
      } else {
        console.log('here we dispatch userIDs funtion');
        let getAddressFromID = await userIds(loggedUser);
        if (getAddressFromID) {
         // console.log('===================================ifiiifiifififiififif==========');
          let res = await this.sendUserAddress(getAddressFromID);
          if (res) {
            this.setState({ userLogin: { ...res } });
            this.goToHome(res, getAddressFromID);
            return this.props.stopLodingComponent();
          }
          this.props.stopLodingComponent();
          return toast.error('User not found!');
        }else{
          this.props.stopLodingComponent();
          return toast.error('Invalid Input');
        }
      }
    } catch (error) {
      //  console.log(error,'============error');
       this.props.stopLodingComponent();
       return toast.error(error.message);
    }
  };

  sendUserAddress = async (address) => {
    let checker = await this.props.users(address);

    return checker;
  };
  // automaticLogin = async () => {
  //   const { getUserSocket, history } = this.props;

  //   const installed = await this.isTronLinkInstalled();

  //   if (installed === 'tronWeb') {
  //     const { tronWeb } = window;
  //     let address = tronWeb.defaultAddress.base58;

  //     if (address === '') {
  //       return toast.error(
  //         'Address not found! Please wait sometime and try again!'
  //       );
  //     }

  //     const user = await getUserSocket(address, '1');
  //     if (user) {
  //       if (user.id !== '0') {
  //         setTimeout(() => {
  //           history.push(`${HOME_ROUTE}auth/home`);
  //         }, 1000);
  //       } else {
  //         toast.error('User not found!');
  //       }
  //     }
  //   }
  // };
  // getAddress = async () => {
  //   var myVar = setInterval(async () => {
  //     try {
  //       const tronWeb = await window.tronWeb;
  //       if (tronWeb.defaultAddress.base58) {
  //         this.setState({ loggedUser: tronWeb.defaultAddress.base58 });
  //         window.clearInterval(myVar);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, 1000);
  // };

  // referralRandomLink = (address, id) => {
  //   return `${id}`;
  // };

  // setUpline = () => {
  //   const upline = this.referralRandomLink(DEFAULT_ADDRESS, '1');
  //   this.setState({ upline });
  // };

  settingUpline = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      this.logIn();
    }
  };

  componentDidUpdate = () => {
    this.state.loggedUser &&
      document.body.addEventListener('keydown', this.settingUpline);
  };

  goToHome = async (res, address) => {
    const { lastLoginDetails, saveUserDetail, loginTrue } = this.props;
    if (res) {
      await saveUserDetail(res);
      await loginTrue(address);
      await lastLoginDetails(address);
      history.push(`${HOME_ROUTE}auth/home`);
    } else toast.error('User not found!');
  };

  render() {
    console.log('fdhrte5r', this.state.loggedUser);
    const { registration } = this.state;
    return (
      <Container fluid className="loginContainer">
        <Container className="main_loginForm">
          <Row className="logoStyle">
            <img src={logo} alt="logo" />
          </Row>

          <div className="loginForm">
            <div className="loginformBox">
              <h2>Login</h2>
              <h5>with</h5>
              <Form>
                <Form.Group>
                  <input
                    placeholder="Account ID or My Wallet Address"
                    value={this.state.loggedUser}
                    onChange={(event) =>
                      this.setState({ loggedUser: event.target.value })
                    }
                    // onKeyPress={(e) => this.settingUpline(e)}
                  />
                </Form.Group>
                <Form.Group className="loginBtn">
                  <button type="button" onClick={() => this.logIn()}>
                    Login
                  </button>
                </Form.Group>
                {/* <div className={this.state.errorCss}>
                  {this.state.checkingUser}
                </div> */}
              </Form>
              <p>
                {' '}
                <Link to={`${HOME_ROUTE}register`}>Register</Link> with TRX100
              </p>
              {/* Link */}
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist?.address,
    loggedIn: state.persist?.loggedIn,
    loginType: state.persist?.loginType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserTronWeb: (address) => dispatch(getUserTronWeb(address)),
    getUsers: (address) => dispatch(getUsers(address)),
    getUserSocket: (address, pool) => dispatch(getUserSocket(address, pool)),
    regUserTronWeb: (address, upline) =>
      dispatch(regUserTronWeb(address, upline)),
    // getEuroPrice: () => dispatch(getEuroPrice()),
    getTotalDB: () => dispatch(getTotalDB()),
    userIds: (id) => dispatch(userIds(id)),
    userIdsSocket: (id) => dispatch(userIdsSocket(id)),
    totalParticipants: () => dispatch(totalParticipants()),
    addMissingTransaction: (address) =>
      dispatch(addMissingTransaction(address)),
    sendTronAddressToRegister: (adress) => dispatch(tronAdress(adress)),
    users: (address) => dispatch(users(address)),
    loginTrue: (address) => dispatch(saveLogin1(address)),
    startLodingComponent: () => dispatch(startLoading()),
    stopLodingComponent: () => dispatch(stopLoading()),
    saveUserDetail: (details) => dispatch(saveUserDetail(details)),
    userResponseAction: (address) => dispatch(userResponseAction(address)),
    saveUserDetails: (data) => dispatch(saveUserDetails(data)),
    lastLoginDetails: (address) => lastLoginDetails(dispatch, address),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
