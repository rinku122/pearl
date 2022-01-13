import React, { Component } from 'react';
import './User.scss';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Header, Image, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../_constants/index';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { toast } from '../../components/Toast/Toast';

import {
  getUserTronWeb,
  getUsers,
  getUserSocket,
  regUserTronWeb,
  getEuroPrice,
  getTotalDB,
  userIds,
  totalParticipants,
  addMissingTransaction,
  userIdsSocket,
  tronAdress,
  users,
  usersId,
  saveLogin1,
} from '../../redux/_actions/ethereum.action';
import { saveLogin, saveUserDetail,  lastLoginDetails } from '../../redux/_actions/persist.action';
import { DEFAULT_ADDRESS } from '../../_constants';

import logo from '../../images/logo.png';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: false,
      registration: false,
      errorCss: 'blockDiv',
      regUserCss: 'blockDiv',
      loggedUser: '',
      upline: '1',
      loginType: 'tronWeb',
    };
  }

  componentDidMount = () => {
    console.log('address', process.env.REACT_APP_CONTRACT_ADDRESS);
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
    getEuroPrice();
    getTotalDB();
    totalParticipants();
    this.getAddress();
    this.addListeners();
    this.isTronLinkInstalled();
  };
  isTronLinkInstalled = async () => {
    var myVar = setTimeout(async () => {
      const tronWeb = await window.tronWeb;
      console.log(tronWeb);
      if (tronWeb) {
        let address = tronWeb.defaultAddress.base58;

        if (address) {
          return;
        } else {
          toast.error('Please sign in Tronlink extension!');
        }
      } else {
        toast.error('Please install tronlink extension first');
      }
    }, 2000);
  };

  getAddress = async () => {
    var myVar = setInterval(async () => {
      try {
        const tronWeb = await window.tronWeb;
        if (tronWeb.defaultAddress.base58) {
          this.setState({ loggedUser: tronWeb.defaultAddress.base58 });
          window.clearInterval(myVar);
        }
        // resolve(tronWeb);
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  };

  addListeners = () => {
    let that = this;
    window.addEventListener('message', function (e) {
      if (e.data.message && e.data.message.action == 'tabReply') {
      }

      if (e.data.message && e.data.message.action == 'setAccount') {
        console.log('setAccount event', e.data.message);
        if (e.data.message.data.address) {
          //setting the address
          console.log('current address:', e.data.message.data.address);
          that.setState({ loggedUser: e.data.message.data.address });
        }
      }
      if (e.data.message && e.data.message.action == 'setNode') {
      }
    });
  };

  formSubmit = async (event) => {
    event.preventDefault();
    this.setState({ registration: true });
    const {
      getUserTronWeb,
      getUsers,
      history,
      lastLoginDetails,
      regUserTronWeb,
      userIds,
      userExists,
      usersIds,
    } = this.props;
    let { loggedUser, upline } = this.state;

    if (upline.trim().length === 0) {
      this.setState({ registration: false });
      return toast.error('Enter valid reference ID!');
    }

    if (loggedUser.length == 0) {
      this.setState({ registration: false });
      return toast.error('Enter valid wallet address!');
    }

    let userIdAddress;
    let userAddress;
    let responseTron;
    const idSizeArr = [34, 42];
    const loggedUserSizeArr = [34, 42];

    if (idSizeArr.indexOf(upline.length) > -1) {
      userIdAddress = upline;
    } else {
      userIdAddress = await userIds(upline);
    }
    if (loggedUserSizeArr.indexOf(loggedUser.length) > -1) {
      userAddress = loggedUser;
    } else {
      userAddress = await userIds(loggedUser);
    }
    console.log('hstesrstht kkkkkkkkkkkkkkkkk', userAddress, userIdAddress);

    if (
      userAddress == 410000000000000000000000000000000000000000 ||
      userIdAddress == 410000000000000000000000000000000000000000
    ) {
      let a = 410000000000000000000000000000000000000000;

      if (userIdAddress == a) {
        this.setState({ registration: false });
        return toast.error('Reference not found!');
      } else return toast.error('Wallet address not found!');
    }

    if (userAddress) {
      let userExist = await userExists(userAddress);
      if (!userExist) {
        responseTron = await regUserTronWeb(loggedUser, userIdAddress);
        if(responseTron===false){
           this.setState({ registration: false });
          }
        } else {
        this.props.saveLogin1(userAddress)
        toast.success('User already exists');
        // this.props.LoginTrue(loggedUser);
        // lastLoginDetails(loggedUser);
        
        // history.push(`${HOME_ROUTE}auth/home`);
      }
      console.log(responseTron);
    }
  };

  checkId(id) {
    if (id.length === 0 || (id.length > 0 && isNaN(id))) {
      return true;
    }
    if (parseInt(id) <= 0) {
      return true;
    }
    return false;
  }

  sendUserAddress = async (address) => {
    let checker = await this.props.users(address);

    return checker;
  };
  checkValidAddress = (address) => {
    const addressSizeArr = [34, 42];
    if (addressSizeArr.indexOf(address.length) > -1) {
      return true;
    } else {
      if (this.checkId(address)) {
        return false;
      }
    }
  };

  logIn = async () => {
    const { getUserSocket, history, userIdsSocket } = this.props;
    let { loggedUser } = this.state;
    const addressSizeArr = [0, 34, 42];
    let address = '';

    try {
      if (loggedUser === '') {
        return toast.error('Enter valid ID!');
      } else if (addressSizeArr.indexOf(loggedUser.length) > -1) {
        address = loggedUser;
      } else {
        if (this.checkId(loggedUser)) {
          return toast.error('Enter valid ID!');
        }
        address = await userIdsSocket(loggedUser);
        this.setState({ loggedUser: '' });
        if (address === '410000000000000000000000000000000000000000') {
          return toast.error('User not found!');
        }
      }
      const user = await getUserSocket(address, '1');
      console.log(user);
      if (user) {
        if (user.id !== '0') {
          setTimeout(() => {
            history.push(`${HOME_ROUTE}auth/home`);
          }, 1000);
        } else {
          toast.error('User not found!');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  automaticLogin = async () => {
    const { getUserSocket, history } = this.props;

    const installed = await this.isTronLinkInstalled();

    if (installed === 'tronWeb') {
      const { tronWeb } = window;
      let address = tronWeb.defaultAddress.base58;

      if (address === '') {
        return toast.error(
          'Address not found! Please wait sometime and try again!'
        );
      }

      const user = await getUserSocket(address, '1');
      if (user) {
        if (user.id !== '0') {
          setTimeout(() => {
            history.push(`${HOME_ROUTE}auth/home`);
          }, 1000);
        } else {
          toast.error('User not found!');
        }
      }
    }
  };

  referralRandomLink = (address, id) => {
    return `${id}`;
  };

  setUpline = () => {
    const upline = this.referralRandomLink(DEFAULT_ADDRESS, '1');
    this.setState({ upline });
  };

  settingUpline = (event) => {
    this.setState({ upline: event.target.value });
    if (event.charCode === 13) {
      this.formSubmit();
    }
  };

  loginKeyCode = (event) => {
    if (event.charCode === 13) {
      this.logIn();
    }
  };
  // componentWillUnmount = () => {
  //   this.props.LoginTrue(this.state.loggedUser);
  // };
  render() {
    const { registration } = this.state;
    return (
      <Container fluid className="loginContainer">
        <Container className="main_loginForm">
          <Row className="logoStyle">
            <img src={logo} alt="logo" />
          </Row>

          <div className="loginForm">
            <div className="loginformBox">
              <h2>Register</h2>
              <Form method="post" onSubmit={this.formSubmit}>
                <Form.Group>
                  <label>Reference </label>
                  <input
                    placeholder="Reference"
                    onChange={(event) => this.settingUpline(event)}
                    onKeyUp={(event) => this.settingUpline(event)}
                    value={this.state.upline !== '' ? this.state.upline : ''}
                  />
                  <p></p>
                </Form.Group>
                <Form.Group>
                  <label>My Address</label>
                  <input
                    placeholder="Account ID or My Wallet Address"
                    onChange={(event) =>
                      this.setState({ loggedUser: event.target.value })
                    }
                    value={this.state.loggedUser}
                  />
                  <p></p>
                </Form.Group>
                <Form.Group className="loginBtn">
                  <button type="submit" primary="true" disabled={registration}>
                    Registration
                  </button>
                </Form.Group>
                <div className={this.state.regUserCss}>
                  {this.state.message}
                </div>
              </Form>
              {/* <p><a href="/"> Login</a> with TRX100</p> */}
              <p>
                <Link to={`${HOME_ROUTE}`}>Login</Link> with TRX100
              </p>

              <p className="messageTransaction">
                Welcome to world of Decentralization.
              </p>
            </div>
          </div>
        </Container>
      </Container>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserTronWeb: (address) => dispatch(getUserTronWeb(address)),
    getUsers: (address) => dispatch(getUsers(address)),
    getUserSocket: (address, pool) => dispatch(getUserSocket(address, pool)),
    saveLogin1:(address)=>dispatch(saveLogin1(address)),
    regUserTronWeb: (address, upline) =>
      dispatch(regUserTronWeb(address, upline)),
    getEuroPrice: () => dispatch(getEuroPrice()),
    getTotalDB: () => dispatch(getTotalDB()),
    userIds: (id) => dispatch(userIds(id)),
    userIdsSocket: (id) => dispatch(userIdsSocket(id)),
    totalParticipants: () => dispatch(totalParticipants()),
    addMissingTransaction: (address) =>
      dispatch(addMissingTransaction(address)),
    userExists: (address) => dispatch(users(address)),
    usersIds: (address) => dispatch(usersId(address)),
    LoginTrue: (address) => dispatch(saveLogin(address)),
    lastLoginDetails: (address) => lastLoginDetails(dispatch, address),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Register)
);
