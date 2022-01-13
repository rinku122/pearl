import React, { Component } from 'react';
import { List, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
//import leader from '../../images/leader_icon.png';
import { withRouter } from 'react-router';
import { unLockLevel, getAmount } from '../../redux/_actions/ethereum.action';
import Moment from 'react-moment';
import { toast } from "../../components/Toast/Toast";

export class MemberInfo extends Component {
  state = {
    inputField: 30,
    value: '1',
  };
  componentDidMount = async () => {
    const { loggedIn, getAmount, userDetails } = this.props;
    if (loggedIn) {
      this.setState({ joinPoolConfirmation: true });
      if( userDetails.currentActivatedLevel !== '4'){
      await getAmount();
      }
    }
  };
  isTronLinkInstalled = async () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { tronWeb } = window;
    const result = Boolean(tronWeb && tronWeb.defaultAddress.base58);
    if (result) {
      //tronWeb
      this.setState({ loginType: 'tronWeb' });
      return 'tronWeb';
    } else {
      alert('Install tronlink extension first or sign up in the extension!');
      return 'none';
    }
  };
  unLockLevel = async () => {
    const { unLockLevel, address } = this.props;
    const loggedUser = address;
    if (window.confirm(`Are you sure to purchase the plan?`)) {
      const installed = await this.isTronLinkInstalled();
      const { tronWeb } = window;
      let addressHex = tronWeb.defaultAddress.hex;
      let addressBase58 = tronWeb.defaultAddress.base58;
      if (installed === 'tronWeb') {
        if (
          loggedUser.toLowerCase() === addressHex.toLowerCase() ||
          loggedUser.toLowerCase() === addressBase58.toLowerCase()
        ) {
          unLockLevel();
        } else {
          return toast.error('Logged ID and tron wallet ID does not match!');
        }
      }
    }
  };
  render() {
    const { lastLoginDetails, amount,userDetails } = this.props;
    return (
      <div className="teamRight_block summaryTable">
        <Header as="h3">Member Dashboard </Header>
       { userDetails.currentActivatedLevel !== '4' && <div className="member_dashboard">
          <label style={{ color: 'white' }}>Value</label>
          <input type="number" value={amount} min={0} readOnly={true}></input>
        </div>}

        <List className="memberinfo">
        { userDetails.currentActivatedLevel !== '4' && <List.Item>
            <p></p>
            {/* <p className="profile">
              <img src={leader} /> <br />
              Current Level: 1
            </p>{' '} */}
            <p>
              {' '}
              <button
                onClick={(event) => {
                  event.preventDefault();
                  console.log('inputField', this.state.inputField);
                  this.unLockLevel();
                }}
              >
                Upgrade To Next Level
              </button>
            </p>
          </List.Item>}
          <List.Item>
            <p>Joined:</p>
            <p>
              <Moment format="YYYY-MM-DD HH:mm">
                {lastLoginDetails?.joined}
              </Moment>
            </p>
          </List.Item>
          <List.Item>
            <p>Last Login:</p>
            <p>
              <Moment format="YYYY-MM-DD HH:mm">
                {lastLoginDetails?.lastLogin}
              </Moment>
            </p>
          </List.Item>
        </List>
      </div>
    );
  }
}
const mapStatetoProps = (state) => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    lastLoginDetails: state.persist.lastLoginDetails,
    amount: state.ethereum.amount,
    loggedIn: state.persist.loggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    unLockLevel: (level, value) => dispatch(unLockLevel(level, value)),
    getAmount: () => dispatch(getAmount()),
  };
};

export default withRouter(
  connect(mapStatetoProps, mapDispatchToProps)(MemberInfo)
);
