import React, { Component } from "react";
import "./Transaction.scss";
import { connect } from "react-redux";

import Transactionpage from "./Transactionpage";

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = { deviceType: "" };
  }

  render() {
    return (
     <Transactionpage />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLeftbar: state.persist.isLeftbar
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
