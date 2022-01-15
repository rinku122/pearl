import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../_constants';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  // poolPrice,
  userPlaceIncome,
} from '../../redux/_actions/ethereum.action';

function getObject(arr, place) {
  return arr.find((o) => Number(o.place) === place);
}

function getClass(currentLevelBuyed) {
  let klass = '';
  switch (currentLevelBuyed) {
    case '1':
      klass = 'selected_field1';
      break;
    case '2':
      klass = 'selected_field2';
      break;
    case '3':
      klass = 'selected_field3';
      break;
    case '4':
      klass = 'selected_field4';
      break;
    case '5':
      klass = 'selected_field5';
      break;
  }
  return klass;
}

export class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level5: [],
      allLevel: [],
    };
  }

  componentDidMount = async () => {
    const { address, userPlaceIncome } = this.props;

    let level5 = await userPlaceIncome(address, 5);

    this.setState({ allLevel: [level5] });
  };
  render() {
    const { slot, data, klass } = this.props;
    let innerHtml = [],
      obj;
    console.log(slot, data);
    for (let i = 0; i < 3 ** slot; i++) {
      const objValue = getObject(data ? data : [], i + 1);
      if (objValue) {
        obj = (
          <li>
            <Link
              to={`${HOME_ROUTE}auth/home`}
              className={`${klass} ${getClass(objValue.currentLevelBuyed)}`}
            >
              <span>{objValue.userId}</span>
            </Link>
          </li>
        );
      } else {
        obj = (
          <li>
            <Link to={`${HOME_ROUTE}auth/home`}>
              <span></span>
            </Link>
          </li>
        );
      }

      innerHtml.push(obj);
    }
    return innerHtml;
  }
}

const mapStateToProps = (state, ownProps) => {
  return { address: state.persist.address };
};

const mapDispatchToProps = (dispatch) => {
  return {
    userPlaceIncome: (address, level) =>
      dispatch(userPlaceIncome(address, level)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Tree));
