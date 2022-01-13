import React, { Component } from 'react';
import './Home.scss';
import { connect } from 'react-redux';
import Homepage from './Homepage';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { deviceType: '' };
  }

  render() {
    return <Homepage />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLeftbar: state.persist.isLeftbar,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
