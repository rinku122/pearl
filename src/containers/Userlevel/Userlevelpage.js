import React, { Component } from "react";
import { Grid, Container, Table } from "semantic-ui-react";
// import { deleteCookie } from "../../_utils/index";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { HOME_ROUTE, ETHERSCAN_URL } from "../../_constants";
import { Link } from "react-router-dom";
import arrowUpLevel from "../../images/arrow_up.svg";
import arrowUpHistory from "../../images/arrow_up_history.png";
import arrowDownHistory from "../../images/arrow_Down_history.png";
import groupLevel from "../../images/icon_group_level.svg";
// import Icongift from "../../images/icon_gift.svg";
import iconReopen from "../../images/icon-reopen.svg";
// import iconEthLevel from "../../images/icon_eth_level.png";
import iconTronLevel from "../../images/tron_icon.png";
import iconEuro from "../../images/icon_dollar.png";
// import icon_group_white from "../../images/icon_group_white.svg";
// import cricleIcon from "../../images/circle.png";
import icon_group_invited from "../../images/icon_group_invited.svg";
import {
  purchasePool, getUserTransaction,
  //userLevelPrice,
} from "../../redux/_actions/ethereum.action";

import { toast } from "../../components/Toast/Toast";
import SelectReinvest from "./SelectReinvest";

export class Userlevelpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      joinPoolConfirmation: true,
      results: [],
      reinvest: ''
    };
  }

  componentDidMount = async () => {
    const { loggedIn, match: { params } } = this.props;
    if (loggedIn) {
      if (params.reinvest !== undefined) {
        this.setState({ reinvest: params.reinvest });
      }
      this.getLevelPrice(params);

    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname === nextProps.location.pathname &&
      this.props.location.search === nextProps.location.search
    ) {
      // this means that no change in the path, so we don't need to refire the
      // action
      return;
    }
    const { match: { params } } = nextProps;
    if (this.props.loggedIn) {
      this.getLevelPrice(params);
    }
  }
  //to enable extension in tronweb
  isTronLinkInstalled = async () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { tronWeb } = window;
    const result = Boolean(tronWeb && tronWeb.defaultAddress.base58);
    if (result) {
      //tronWeb
      this.setState({ loginType: "tronWeb" });
      return "tronWeb";
    } else {
      alert("Install tronlink extension first!");
      return "none";
    }
  };

  // get level Price Meghraj
  getLevelPrice = (params) => {
    // const { userLevelPrice, getUserTransaction } = this.props;
    // if (params.matrix === "1") {
    //   userLevelPrice(params.address, params.level, params.matrix, params.reinvest);
    // }

    // if (params.matrix === "2") {
    //   userLevelPrice(params.address, params.level, params.matrix, params.reinvest);
    // }

    // this.setState({ joinPoolConfirmation: true });
    // // if (!params.reinvest) {
    // this.setState({ results: [] });

    // getUserTransaction(params.address, params.level, params.matrix).then(async results => {
    //   // console.log(res, 'transaction');
    //   if (results) {
    //     // const results = await this.sortData(results, 'timestamp');
    //     this.setState({ results });
    //   }
    // });
    // }

  }

  // change Reinvest value function
  changeReinvestValue = (value) => {
    const { history, match: { params } } = this.props;

    let url = `${HOME_ROUTE}auth/userLevel/${params.address}/${params.level}/${params.matrix}`;
    if (params.reinvest && params.reinvest !== value) {
      url = `${HOME_ROUTE}auth/userLevel/${params.address}/${params.level}/${params.matrix}/${value}`;
    } else {
      url += `/${value}`;
    }

    history.push(url);
  }


  // Buy new level in user level
  purchasePoolCommon = async (value, level, matrix) => {
    const { purchasePool, address } = this.props;
    const { joinPoolConfirmation } = this.state;
    const loggedUser = address;
    if (value && joinPoolConfirmation) {
      if (window.confirm(`Are you sure to purchase the plan?`)) {
        const installed = await this.isTronLinkInstalled();
        try {
          if (installed === "tronWeb") {
            const { tronWeb } = window;
            let addressHex = tronWeb.defaultAddress.hex;
            let addressBase58 = tronWeb.defaultAddress.base58;
            if (loggedUser.toLowerCase() === addressHex.toLowerCase() || loggedUser.toLowerCase() === addressBase58.toLowerCase()) {
              this.setState({ joinPoolConfirmation: false });
              await purchasePool(value, level, matrix);
              this.getLevelPrice();
            } else {
              return toast.error("Logged ID and Unitron wallet ID does not match!");
            }
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    }
  };

  render() {
    const { match: { params }, ethUserLevelPrice3x, ethUserLevelPrice4x, address, euroPrice } = this.props;
    let { results } = this.state;

    const numArr3x = [0, 1, 2];
    const numArr4x_level1 = [0, 1];
    const numArr4x_level2 = [0, 1, 2, 3];
    const resultArr3x = ethUserLevelPrice3x;
    const resultArr4x = ethUserLevelPrice4x;
    let { matrix, level } = params;
    level = parseInt(level);
    const previousLevel = (level === 1) ? 14 : level - 1;
    const nextLevel = (level === 14) ? 1 : level + 1;
    const userAddress = params.address;
    let showBuyButton = true;
    if (userAddress.toLowerCase() === address.toLowerCase()) {
      showBuyButton = true;
    }
    // console.log(resultArr3x, 'render');
    // console.log(resultArr4x, 'render');

    return (
      <div className="contentArea">
        <div className="teamMainOut">
          <div className="teamMain">
            <div className="teamRight">
              <Container fluid>

                {matrix === "1" && (
                  <Grid columns={1}>
                    <Grid.Row className="fastPlanUserLevel">
                      {resultArr3x.map((data, index) => (
                        <Grid.Column
                          key={index}
                        >
                          <div className="userLevelComplete_info">
                            <h2 className="userLevelType">
                              TRONX3
                            </h2>
                            <div className="LevelInfoBlock">
                              {data.user && data.user.referrer !== '410000000000000000000000000000000000000000' ?
                                (
                                  <Link to={`${HOME_ROUTE}auth/userLevel/${data.user.referrer}/${level}/1`}>
                                    <div className="leveLUpid">
                                      <span><img src={arrowUpLevel} alt="uparrow" /> ID {data.referrerId}</span> </div>
                                  </Link>
                                ) : (
                                  <div className="leveLUpid"><img src={arrowUpLevel} alt="uparrow" /> ID </div>
                                )}

                              <div className="levelMatrix">

                                <SelectReinvest
                                  reinvest={this.state.reinvest}
                                  reinvestCount={data.reinvestStatus}
                                  changeReinvestValue={this.changeReinvestValue.bind('value')}
                                />&nbsp; {/* Select reinvest component  */}

                                <Link to="#"> <div className="levelMatrix_History">
                                  {/* <a href="" className="btnUp"><img src={arrowUpHistory} alt="uparrow" /></a> */}
                                  <span className="historyTextStyle">History</span>
                                  {/* <a href="" className="btnDown"><img src={arrowDownHistory} alt="downarrow" /></a> */}
                                </div> </Link>

                                <div className="levelMatrix_reopens">
                                  <img src={iconReopen} alt="reopen" /> {data.reinvestStatus}
                                </div>
                                <div className="levelMatrix_id">
                                  <div className="levelMatrix_idWrap"><span className="levelMatrix_groupNumber">{level}</span>
                                  ID {data.currentId}

                                    {/* buy 3x button */}
                                    {(!data.activeStatus && showBuyButton) && <ul className="buyLevel">
                                      <li className=" ">{data.levelPrice}</li>
                                      <li><Link to="#"
                                        className="linkBuy"
                                        onClick={() =>
                                          this.purchasePoolCommon(data.levelPrice, level, "1")
                                        }
                                      >
                                        <span className="isHide">Buy</span>
                                      </Link>
                                      </li>
                                    </ul>
                                    }
                                  </div>
                                  <ul className="levelMatrix_moneyHaving">
                                    <li className="inCash"><img src={iconEuro} alt="dollar" /> {(euroPrice * data.userIncome).toFixed(2)}</li>
                                    <li className="inEth"><img src={iconTronLevel} alt="eth" /> {data.userIncome} TRX</li>
                                  </ul>
                                </div>
                                <div className="levelMatrix_reopensPartners">
                                  <img src={groupLevel} alt="group" /> {data.userCounts}
                                </div>
                                {/* <div className="levelMatrix_gifts">
                                  <img src={Icongift} alt="gift" /> 16
                                </div> */}
                              </div>

                              <div className="levelMatrix_groups">
                                {numArr3x && numArr3x.map((a) =>
                                  (<div key={a} className="levelMatrix_groups_Item">
                                    {
                                      data.levelOneUsers[a] !== undefined
                                        ? (
                                          <Link to={`${HOME_ROUTE}auth/userLevel/${data.levelOneUsers[a].address}/${level}/1`} title={data.levelOneUsers[a].id}>
                                            {/* {data.levelOneUsers.map((l, index2) => ( */}
                                            <div key={a}>{(data.levelOneUsers[a]) &&
                                              <>
                                                <div className={`item_count childrenActivate ${data.levelOneUsers[a].ahead ? "aheadId" : ""}`}>
                                                  {data.levelOneUsers[a].id}

                                                </div>
                                                <div className="itemText">
                                                  <img src={icon_group_invited} alt="group" />
                                                  {data.levelOneUsers[a].innerUserCounts}
                                                </div>
                                              </>
                                            }
                                            </div>
                                            {/*  ))} */}
                                          </Link>
                                        ) : (<>
                                          <div className="item_count"></div>
                                          <div className="itemText">
                                            <img src={icon_group_invited} alt="group" /> 0
                                          </div>
                                        </>
                                        )
                                    }
                                  </div>)
                                )}

                              </div>
                            </div>
                            <ul className="slideNavigation">
                              <li className="slidePrev">
                                <Link to={`${HOME_ROUTE}auth/userLevel/${userAddress}/${previousLevel}/1`}></Link>
                                <span className="groupCount">{previousLevel}</span></li>
                              <li className="slideNext"><span className="groupCount">{nextLevel}</span>
                                <Link to={`${HOME_ROUTE}auth/userLevel/${userAddress}/${nextLevel}/1`}></Link>
                              </li>
                            </ul>
                          </div>
                        </Grid.Column>
                      ))}
                    </Grid.Row>
                    <Grid.Column>
                      <Grid.Row>
                        <ul className="circlePlans">
                          <li className="partnersInvitedByYou">Partner Invited by you</li>
                          <li className="aheadOfInvesting">Partner who is ahead of his inviter</li>
                        </ul>
                      </Grid.Row>
                    </Grid.Column>
                  </Grid>)}

                {matrix === "2" && (<Grid columns={1}>
                  <Grid.Row className="fastPlanUserLevel">
                    {resultArr4x.map((data, index) => (
                      <Grid.Column
                        key={index}
                      >
                        <div className="userLevelComplete_info has4X_info">
                          <h2 className="userLevelType">
                            TRONX4
                          </h2>
                          <div className="LevelInfoBlock">
                            {data.user && data.user.referrer !== '410000000000000000000000000000000000000000' ?
                              (<Link to={`${HOME_ROUTE}auth/userLevel/${data.user.referrer}/${level}/2`}>
                                <div className="leveLUpid"><span><img src={arrowUpLevel} alt="uparrow" /> ID {data.referrerId} </span></div>
                              </Link>
                              ) : (
                                <div className="leveLUpid"><span><img src={arrowUpLevel} alt="uparrow" /> ID</span> </div>
                              )}
                            <div className="levelMatrix">
                              <SelectReinvest
                                reinvest={this.state.reinvest}
                                reinvestCount={data.reinvestStatus}
                                changeReinvestValue={this.changeReinvestValue.bind('value')}
                              />&nbsp; {/* Select reinvest component  */}

                              <Link to="#"> <div className="levelMatrix_History">
                                {/* <a href="" className="btnUp"><img src={arrowUpHistory} alt="uparrow" /></a> */}
                                <span className="historyTextStyle">History</span>
                                {/* <a href="" className="btnDown"><img src={arrowDownHistory} alt="downarrow" /></a> */}
                              </div> </Link>
                              <div className="levelMatrix_reopens">
                                <img src={iconReopen} alt="reopen" /> {data.reinvestStatus}
                              </div>
                              <div className="levelMatrix_id">
                                <div className="levelMatrix_idWrap"><span className="levelMatrix_groupNumber">{level}</span>
                                 ID {data.currentId}
                                  {/* buy 3x button */}
                                  {(!data.activeStatus && showBuyButton) && <ul className="buyLevel">
                                    <li className=" ">{data.levelPrice}</li>
                                    <li><Link to="#"
                                      className="linkBuy"
                                      onClick={() =>
                                        this.purchasePoolCommon(data.levelPrice, level, "1")
                                      }
                                    >
                                      <span className="isHide">Buy</span>
                                    </Link>
                                    </li>
                                  </ul>
                                  }
                                </div>
                                <ul className="levelMatrix_moneyHaving">
                                  <li className="inCash"><img src={iconEuro} alt="eur" /> {(euroPrice * data.userIncome).toFixed(2)}</li>
                                  <li className="inEth"><img src={iconTronLevel} alt="eth" /> {data.userIncome} TRX</li>
                                </ul>
                              </div>
                              <div className="levelMatrix_reopensPartners">
                                <img src={groupLevel} alt="group" /> {data.userCounts}
                              </div>
                              {/* <div className="levelMatrix_gifts">
                                <img src={Icongift} alt="gift" /> 16
                            </div> */}
                            </div>
                            <div className="levelMatrix_groupsHas4X">
                              <div className="levelMatrix_groups_Item has_twoGroup">
                                {numArr4x_level1.map((a) =>
                                  (<div key={a} className="childrenParentBinary">
                                    {
                                      data.levelOneUsers[a] !== undefined
                                        ? (
                                          <Link to={`${HOME_ROUTE}auth/userLevel/${data.levelOneUsers[a].address}/${level}/2`} title={data.levelOneUsers[a].id}>
                                            {/* {data.levelOneUsers.map((l, index2) => ( */}
                                            <div key={a}>{(data.levelOneUsers[a]) &&
                                              <>
                                                <div className={`item_count childrenActivate ${data.levelOneUsers[a].ahead ? "aheadId" : ""}`}>
                                                  {data.levelOneUsers[a].id}
                                                  {data.levelOneUsers[a].up && <img src={arrowUpHistory} className="arrowUp" />}
                                                  {data.levelOneUsers[a].down && <img src={arrowDownHistory} className="arrowDown" />}
                                                </div>
                                                <div className="itemText">
                                                  <img src={icon_group_invited} alt="group" />
                                                  {data.levelOneUsers[a].innerUserCounts}
                                                </div>
                                              </>
                                            }
                                            </div>
                                            {/* // ))} */}
                                          </Link>
                                        ) : (
                                          <>
                                            <div className="item_count">
                                            </div>
                                            <div className="itemText">
                                              <img src={icon_group_invited} alt="group" /> 0
                                              </div>
                                          </>
                                        )
                                    }
                                  </div>)
                                )}
                              </div>

                              <div className="levelMatrix_groupsHas4XNextLevel">
                                {numArr4x_level2.map((a) =>
                                  (<div key={a} className="childrenParentBinary2">
                                    {data.levelTwoArr[a].address
                                      ? (
                                        <Link to={`${HOME_ROUTE}auth/userLevel/${data.levelTwoArr[a].address}/${level}/2`} title={data.levelTwoArr[a].id}>
                                          <div className="levelMatrix_groups_Item">
                                            <div className={`item_count childrenActivate ${data.levelTwoArr[a].upOverflow ? "upOverflow" : ""} ${data.levelTwoArr[a].bottomOverflow ? "botOverflow" : ""} ${data.levelTwoArr[a].ahead ? "aheadId" : ""}`}>
                                              {data.levelTwoArr[a].id}
                                              {/* {l.up && <img src={arrowUpHistory} className="arrowUp" />}
                                                    {l.down && <img src={arrowDownHistory} className="arrowDown" />} */}
                                            </div>
                                            <div className="itemText">
                                              <img src={icon_group_invited} alt="group" />
                                              {data.levelTwoArr[a].innerUserCounts}
                                            </div>
                                          </div>
                                        </Link>
                                      ) : (
                                        <div className="levelMatrix_groups_Item">
                                          <div className="item_count">
                                          </div>
                                          <div className="itemText">
                                            <img src={icon_group_invited} alt="group" /> 0
                                            </div>
                                        </div>
                                      )
                                    }
                                  </div>)
                                )}
                              </div>
                            </div>
                          </div>
                          <ul className="slideNavigation">
                            <li className="slidePrev">
                              <Link to={`${HOME_ROUTE}auth/userLevel/${userAddress}/${previousLevel}/2`}></Link>
                              <span className="groupCount">{previousLevel}</span></li>
                            <li className="slideNext"><span className="groupCount">{nextLevel}</span>
                              <Link to={`${HOME_ROUTE}auth/userLevel/${userAddress}/${nextLevel}/2`}></Link>
                            </li>
                          </ul>
                        </div>
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                  <Grid.Column>
                    <Grid.Row>
                      <ul className="circlePlans">
                        <li className="partnersInvitedByYou">Partner Invited by you</li>
                        <li className="bottomOverflow">Bottom overflow</li>
                        <li className="overflowFromUp">Overflow from up</li>
                        <li className="aheadOfInvesting">Partner who is ahead of his inviter</li>
                      </ul>
                    </Grid.Row>
                  </Grid.Column>
                </Grid>
                )}

                <Grid.Column>
                  <Grid.Row>
                    <Table celled className="tableTransitionList">
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>({results.length})</Table.HeaderCell>
                          <Table.HeaderCell>Date</Table.HeaderCell>
                          <Table.HeaderCell>ID</Table.HeaderCell>
                          <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                          <Table.HeaderCell>TRX / USD</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        {results.length > 0 ? (results.map((data, index) => (
                          <Table.Row key={index}>
                            {/* <Table.Cell data-label="Message">{(index + 1)}</Table.Cell> */}
                            <Table.Cell data-label="Transaction " className="colAddress">
                              {(data.place === "3" && matrix === "1") || (data.place === "6" && matrix === "2") ? (
                                <div>
                                  <small>{data.reopenCount}</small>
                                  <img style={{ width: '25px' }} src={iconReopen} alt="reopen" />
                                </div>
                              ) : (
                                  <div className="transactionLevel">
                                    {!data.up && <div className={`item_count childrenActivate ${data.upOverflow ? "upOverflow" : ""} ${data.bottomOverflow ? "botOverflow" : ""} ${data.ahead ? "aheadId" : ""}`}></div>}
                                    {data.up && <img src={arrowUpHistory} className="arrowUp" />}
                                    {data.down && <img src={arrowDownHistory} className="arrowDown" />}
                                  </div>

                                )}</Table.Cell>
                            <Table.Cell data-label="Date">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false }).format((data.timestamp))}</Table.Cell>
                            <Table.Cell data-label="Transaction Upline" className="colAddress">{data.userId}</Table.Cell>
                            <Table.Cell data-label="Transaction Hash" className="colAddress"><a href={`${ETHERSCAN_URL}#/transaction/${data.transactionHash}`} target="_blank" title={data.transactionHash}>{data.transactionHash.substring(0, 15) + "..."}</a></Table.Cell>
                            {/* <Table.Cell data-label="Transaction Type" className="colAddress">{data.transactionType}</Table.Cell> */}
                            <Table.Cell data-label="TRX">
                              {(data.place === "3" && matrix === "1") || (data.place === "6" && matrix === "2") ? (
                                <div>
                                  Reopen
                                </div>
                              ) : <>
                                  {(data.amount) + ' / ' + (data.amount * euroPrice).toFixed(2)}
                                </>
                              }
                            </Table.Cell>
                            {/* <Table.Cell data-label="Message">{(data.message)}</Table.Cell> */}
                            {/* <Table.Cell data-label="Done By">{(data.loginType)}</Table.Cell> */}
                          </Table.Row>
                        ))) : (
                            <Table.Row key={0} style={{ textAlign: 'center' }}>
                              <Table.Cell colSpan="6" data-label="No recored">No record Found</Table.Cell>
                            </Table.Row>
                          )}
                      </Table.Body>
                    </Table>
                  </Grid.Row>
                </Grid.Column>
              </Container>

            </div>
          </div>
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    ethUserLevelPrice3x: state.ethereum.ethUserLevelPrice3x,
    ethUserLevelPrice4x: state.ethereum.ethUserLevelPrice4x,
    euroPrice: state.persist.euroPrice,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //userLevelPrice: (userAddress, level, matrix, reinvest) => dispatch(userLevelPrice(userAddress, level, matrix, reinvest)),
    purchasePool: (value, level, matrix) => dispatch(purchasePool(value, level, matrix)),
    getUserTransaction: (userAddress, level, matrix, reinvest) => dispatch(getUserTransaction(userAddress, level, matrix, reinvest)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Userlevelpage)
);
