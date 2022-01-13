import React, { Component } from "react";
import { Table, Popup } from "semantic-ui-react";
// import { deleteCookie } from "../../_utils/index";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import indicator from "../../images/indicator.png";

import { ETHERSCAN_URL, DEFAULT_ADDRESS } from "../../_constants";

import {
    directReferralStats,
} from "../../redux/_actions/ethereum.action";

import groupicon from "../../images/group_icon.png";

export class Transactionpage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        }
    }

    componentDidMount = async () => {
        this.callData();
    }

    callData = async () => {
        
        const { loggedIn, directReferralStats } = this.props;
        if (loggedIn) {
            directReferralStats().then(results => {
                console.log('------------DTSS--------------', results);
                this.setState({ results });
            });
        }
    }

    render() {
        let { results, results2 } = this.state;
              return (
                    <div className="contentArea">
                        <div className="subHeader">
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
                                        <h4 className="stats"> Directs </h4>
                                    </div>
                                    <div className="studentOut">

                                        {results.length > 0 ? (results.map((d, index) => (
                                            <div>
                                                <h1> Level: U{index + 1} <small>({d.length})</small></h1>

                                                <Table celled className="TransitionList" >
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell>Date</Table.HeaderCell>
                                                            <Table.HeaderCell>User</Table.HeaderCell>
                                                            <Table.HeaderCell>Level</Table.HeaderCell>
                                                            <Table.HeaderCell>Slot</Table.HeaderCell>
                                                            <Table.HeaderCell>Transaction Hash</Table.HeaderCell>
                                                            <Table.HeaderCell>Direct</Table.HeaderCell>

                                                        </Table.Row>
                                                    </Table.Header>

                                                    <Table.Body>
                                                        {d.length > 0 ? (d.map((data, index) => (
                                                            <Table.Row key={index}>
                                                                {/* <Table.Cell data-label="Transaction Upline" className="colAddress">{data.spilled && (<span className="spilledImg"><Popup inverted content={`${data.spilled_receiver.join(',')}`} trigger={<img src={indicator} alt="spilled" />} /></span>)}</Table.Cell> */}
                                                                <Table.Cell data-label="Date">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false }).format((data.timestamp))}</Table.Cell>
                                                                <Table.Cell data-label="User" className="colAddress" title={data['_from']}>{data.userId}<span style={{ color: 'red' }}>{data.spilled && <p>{`(${data.spilled_income / 1000000})`}</p>}</span>
                                                                </Table.Cell>
                                                                <Table.Cell data-label="Level" className="colAddress">U{data.level}</Table.Cell>
                                                                <Table.Cell data-label="Pool" className="colAddress">{data.pool}</Table.Cell>
                                                                <Table.Cell data-label="Transaction Hash" className="colAddress"><a href={`${ETHERSCAN_URL}#/transaction/${data.transactionHash}`} target="_blank" title={data.transactionHash}>{data.transactionHash.substring(0, 15) + "..."}</a> </Table.Cell>
                                                                <Table.Cell data-label="Direct" className="colAddress">{data.direct}&nbsp;<img src={groupicon} /></Table.Cell>
                                                            </Table.Row>
                                                        ))) : (
                                                                <Table.Row key={0} style={{ textAlign: 'center' }}>
                                                                    <Table.Cell colSpan="6" data-label="No record">No record Found</Table.Cell>
                                                                </Table.Row>
                                                            )}
                                                    </Table.Body>
                                                </Table>
                                            </div>
                                        ))) : (
                                                <div>No record </div>
                                            )}

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
        isLeftbar: state.persist.isLeftbar,
        address: state.persist.address,
        userDetails: state.persist.userDetails,
        loggedIn: state.persist.loggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        directReferralStats: () => dispatch(directReferralStats()),
    };
};

export default (withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Transactionpage)
));
