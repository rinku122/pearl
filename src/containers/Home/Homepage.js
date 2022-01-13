import React, { Component } from 'react';
import { Grid, Container, Header, Button } from 'semantic-ui-react';
// import { deleteCookie } from "../../_utils/index";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  purchasePool,
  convertFromSun,
  // poolPrice,
  userPlaceIncome,
} from '../../redux/_actions/ethereum.action';
import { toast } from '../../components/Toast/Toast';
import Tree from './innerTreeComponent';
import leader from '../../images/leader_icon.png';
import ReferralSummary from './ReferralSummary';
import MemberInfo from './MemberInfo';

export class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinPoolConfirmation: true,
      loginType: 'none',
      processing: false,
      showRefer: false,
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      allLevel: [],
      totalLevelBranch: [3, 9, 27, 81],
      totalLevelDiffrent: [],
    };
  }
  componentDidMount = async () => {
    const { loggedIn, getAmount, address } = this.props;
    if (loggedIn) {
      this.setState({ joinPoolConfirmation: true });
    }
  };

  // get pool Price Meghraj
  getLevelPrice = async () => {
    const { poolPrice } = this.props;
    // poolPrice();
    this.setState({ joinPoolConfirmation: true });
  };
  // End get pool Price

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

  // Buy new pool Meghraj
  purchasePoolCommon = async (pool) => {
    const { purchasePool, address } = this.props;
    const { joinPoolConfirmation } = this.state;
    const loggedUser = address;
    if (joinPoolConfirmation) {
      if (window.confirm(`Are you sure to purchase the plan?`)) {
        const installed = await this.isTronLinkInstalled();
        try {
          if (installed === 'tronWeb') {
            const { tronWeb } = window;
            let addressHex = tronWeb.defaultAddress.hex;
            let addressBase58 = tronWeb.defaultAddress.base58;
            if (
              loggedUser.toLowerCase() === addressHex.toLowerCase() ||
              loggedUser.toLowerCase() === addressBase58.toLowerCase()
            ) {
              this.setState({ joinPoolConfirmation: false });
              pool = pool.toString();
              const r = await purchasePool(pool);
              if (r) {
                this.setState({ processing: true });

                setTimeout(() => {
                  this.setState({ processing: false });
                  this.getLevelPrice();
                }, 15000);
              }
            } else {
              return toast.error(
                'Logged ID and Tron wallet ID does not match!'
              );
            }
          }
        } catch (error) {
          console.log(error);
          // toast.error(error.message);
        }
      }
    }
  };

  eligibleForBuy = () => {
    const { ethU5Price } = this.props;
    return (
      ethU5Price[0].newUserPlace.length >= 2 ||
      ethU5Price[0].levelIncome[0] >= 2
    );
  };
  toggleReference = (index) => {
    const { userDetails } = this.props;
    if (index === 0 && userDetails.id !== '1') {
      this.setState({ showRefer: !this.state.showRefer });
    }
  };
  componentWillMount = async () => {
    const { address, userPlaceIncome } = this.props;
    let level1 = await userPlaceIncome(address, 1);

    let level2 = await userPlaceIncome(address, 2);

    let level3 = await userPlaceIncome(address, 3);

    let level4 = await userPlaceIncome(address, 4);

    this.setState({ allLevel: [level1, level2, level3, level4] });
  };

  render() {
    const { allLevel } = this.state;

    return (
      <div className="contentArea">
        <div className="teamMainOut">
          <div className="teamMain">
            <div className="teamRight">
              <Container fluid>
                <div className="teamRight_block">
                  <Grid columns={6}>
                    <Grid.Row className="fastPlanRow fastPlanRow2">
                      <Header as="h3">TRX 100 </Header>
                      <div className="premiumBox">
                        <h4>
                          <img src={leader} width="43" />
                        </h4>
                        <div className="toplist">
                          <div className="toplistIn ">
                            <ul className="topbox">
                              <Tree
                                slot={1}
                                data={allLevel ? allLevel[0] : []}
                                klass={'levelOne'}
                              />
                            </ul>
                            <ul>
                              <Tree
                                slot={2}
                                data={allLevel ? allLevel[1] : []}
                                klass={''}
                              />
                            </ul>
                            <ul className="lastrow">
                              <Tree
                                data={allLevel ? allLevel[2] : []}
                                slot={3}
                                klass={''}
                              />
                            </ul>
                            <ul className="lastbox">
                              <Tree
                                data={allLevel ? allLevel[3] : []}
                                slot={4}
                                klass={''}
                              />
                            </ul>
                          </div>
                        </div>
                        <ul className="circlePlans">
                          <li className="">PARTNER AT LEVEL 1</li>
                          <li className="leveltwo">PARTNER AT LEVEL 2</li>
                          <li className="levelthree">PARTNER AT LEVEL 3</li>
                          <li className="levelfour">PARTNER AT LEVEL 4</li>
                        </ul>
                      </div>
                    </Grid.Row>
                  </Grid>
                </div>
                <Grid>
                  <Grid.Row>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <ReferralSummary />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={8} computer={8}>
                      <MemberInfo />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
              <div className="tf-tree example">
                <div className="infiniteTreeStyle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    ethU5Price: state.ethereum.ethU5Price,
    ethLevelPrice4x: state.ethereum.ethLevelPrice4x,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    convertFromSun: (value) => dispatch(convertFromSun(value)),
    purchasePool: (pool) => dispatch(purchasePool(pool)),
    // poolPrice: () => dispatch(poolPrice()),
    userPlaceIncome: (address, level) =>
      dispatch(userPlaceIncome(address, level)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Homepage)
);
