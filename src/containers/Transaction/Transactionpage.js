import React, { Component } from 'react';
import { Table, Popup } from 'semantic-ui-react';
// import { deleteCookie } from "../../_utils/index";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import indicator from '../../images/indicator.png';
import {
  statsLevel,
  statsPool,
  convertFromSun,
} from '../../redux/_actions/ethereum.action';
import { ETHERSCAN_URL, DEFAULT_ADDRESS } from '../../_constants';

export class Transactionpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      results2: [],
    };
  }

  componentDidMount = async () => {
    this.callData();
  };

  callData = async () => {
    const { loggedIn, statsLevel, statsPool } = this.props;
    if (loggedIn) {
      statsLevel().then((results) => {
        this.setState({ results });
      });
      statsPool().then((results2) => {
        this.setState({ results2 });
      });
    }
  };

  render() {
    let { results, results2 } = this.state;
    return (
      <div className="contentArea">
        <div className="subHeader">
          {/* <ul className="menuList">
            <li><a href="#">Direct: {userReferralCount}  </a></li>
            <li><a href="#">Income: {totalIncome} ETH</a></li>
            <li><a href="#">Income After Topup: {incomeAfterTopUp} ETH </a></li>
          </ul> */}
          <div className="searchBlock">
            <input type="text" placeholder="Search" />
            <button className="btnSearch">
              <span>Search</span>
            </button>
          </div>
        </div>
        <div className="teamMain">
          <div className="teamRight">
            <div className="teamRight_block">
              <div className="teamHeader notTeam TransitionListHead">
                <h4 className="stats">
                  {' '}
                  Level Income <small>({results.length})</small>
                </h4>
              </div>
              <div className="studentOut">
                <Table celled className="TransitionList">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>User</Table.HeaderCell>
                      <Table.HeaderCell>Level</Table.HeaderCell>
                      <Table.HeaderCell>Slot</Table.HeaderCell>
                      <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                      <Table.HeaderCell>TRX</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {results.length > 0 ? (
                      results.map((data, index) => (
                        <Table.Row key={index}>
                          <Table.Cell
                            data-label="Transaction Upline"
                            className="colAddress"
                          >
                            &nbsp;
                            {data.spilled && (
                              <span className="spilledImg">
                                <Popup
                                  inverted
                                  content={`${data.spilled_receiver.join(',')}`}
                                  trigger={
                                    <img src={indicator} alt="spilled" />
                                  }
                                />
                              </span>
                            )}
                          </Table.Cell>
                          <Table.Cell data-label="Date">
                            {new Intl.DateTimeFormat('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: false,
                            }).format(data.timestamp)}
                          </Table.Cell>
                          <Table.Cell
                            data-label="User"
                            className="colAddress"
                            title={data['_from']}
                          >
                            {data.userId}
                          </Table.Cell>
                          <Table.Cell data-label="Level" className="colAddress">
                            U{data.level}
                          </Table.Cell>
                          <Table.Cell data-label="Pool" className="colAddress">
                            {data.pool}
                          </Table.Cell>
                          <Table.Cell
                            data-label="Transaction Hash"
                            className="colAddress"
                          >
                            <a
                              href={`${ETHERSCAN_URL}#/transaction/${data.transactionHash}`}
                              target="_blank"
                              title={data.transactionHash}
                            >
                              {data.transactionHash.substring(0, 15) + '...'}
                            </a>{' '}
                          </Table.Cell>
                          <Table.Cell data-label="TRX" className="colAddress">
                            {data.income / 1000000}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row key={0} style={{ textAlign: 'center' }}>
                        <Table.Cell colSpan="6" data-label="No recored">
                          No record Found
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div className="teamMain">
          <div className="teamRight">
            <div className="teamRight_block">
              <div className="teamHeader notTeam TransitionListHead">
                <h4 className="stats">
                  {' '}
                  Pool Income <small>({results2.length})</small>
                </h4>
              </div>
              <div className="studentOut">
                <Table celled className="tableTransitionList">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell></Table.HeaderCell>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>User</Table.HeaderCell>
                      <Table.HeaderCell>Level</Table.HeaderCell>
                      <Table.HeaderCell>Slot</Table.HeaderCell>
                      <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                      <Table.HeaderCell>TRX</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {results2.length > 0 ? (
                      results2.map((data, index) => (
                        <Table.Row key={index}>
                          <Table.Cell
                            data-label="Transaction Upline"
                            className="colAddress"
                          >
                            &nbsp;
                            {data.income / 1000000 === 0 && (
                              <span className="spilledImg">
                                <Popup
                                  inverted
                                  content={`${DEFAULT_ADDRESS}`}
                                  trigger={
                                    <img src={indicator} alt="spilled" />
                                  }
                                />
                              </span>
                            )}
                          </Table.Cell>
                          <Table.Cell data-label="Date">
                            {new Intl.DateTimeFormat('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: false,
                            }).format(data.timestamp)}
                          </Table.Cell>
                          <Table.Cell data-label="User" className="colAddress">
                            {data.userId}{' '}
                          </Table.Cell>
                          <Table.Cell data-label="Level" className="colAddress">
                            P{data.level}
                          </Table.Cell>
                          <Table.Cell data-label="Slot" className="colAddress">
                            {data.pool}
                          </Table.Cell>
                          <Table.Cell
                            data-label="Transaction Hash"
                            className="colAddress"
                          >
                            <a
                              href={`${ETHERSCAN_URL}#/transaction/${data.transactionHash}`}
                              target="_blank"
                              title={data.transactionHash}
                            >
                              {data.transactionHash.substring(0, 15) + '...'}
                            </a>
                          </Table.Cell>
                          <Table.Cell data-label="TRX">
                            {data.income / 1000000}
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <Table.Row key={0} style={{ textAlign: 'center' }}>
                        <Table.Cell colSpan="6" data-label="No recored">
                          No record Found
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    statsLevel: () => dispatch(statsLevel()),
    statsPool: () => dispatch(statsPool()),
    convertFromSun: (value) => dispatch(convertFromSun(value)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Transactionpage)
);
