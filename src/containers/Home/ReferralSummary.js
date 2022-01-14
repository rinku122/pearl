import React, { Component } from 'react';
import { Table, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getReferrals } from '../../redux/_actions/ethereum.action';
export class ReferralSummary extends Component {
  componentDidMount = async () => {
    const { loggedIn, getReferrals, address } = this.props;
    if (loggedIn) {
      getReferrals(address);
    }
  };

  render() {
    const { referrals } = this.props;

    return (
      <div className="teamRight_block summaryTable">
        <Header as="h3">Referral Summary </Header>
        <div className="table_div">
          <Table selectable inverted unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Level</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Funds</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  Total Partners
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  Potential Income
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">
                  Referrals
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Received</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Reward</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {referrals.length > 0 ? (
                referrals.map((data, index) => (
                  <Table.Row>
                    <Table.Cell textAlign="center">
                      Level {data.level}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {data.funds} USDT
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {data.totalPartners}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {data.potentialIncome} USDT
                    </Table.Cell>
                    <Table.Cell textAlign="center">{data.referrals}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {data.received} USDT
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      {data.reward} USDT
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
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    address: state.persist.address,
    userDetails: state.persist.userDetails,
    loggedIn: state.persist.loggedIn,
    loginType: state.persist.loginType,
    referrals: state.ethereum.referrals,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getReferrals: (address) => getReferrals(dispatch, address),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReferralSummary)
);
