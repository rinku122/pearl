import React from 'react';
import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../_constants';

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

function Tree(props) {
  const { slot, data, klass, click } = props;
  let innerHtml = [],
    obj;
  console.log(data);
  for (let i = 0; i < 3 ** slot; i++) {
    const objValue = getObject(data ? data : [], i + 1);
    if (objValue) {
      obj = (
        <li>
          <Link
            to={
              click
                ? `${HOME_ROUTE}auth/level/?address=${objValue.userAddress}&id=${objValue.userId}`
                : '#!'
            }
            className={`${klass} ${getClass(objValue.currentLevelBuyed)}`}
          >
            <span>{objValue.userId}</span>
          </Link>
        </li>
      );
    } else {
      obj = (
        <li>
          <Link to={click ? `${HOME_ROUTE}auth/home` : '#!'}>
            <span></span>
          </Link>
        </li>
      );
    }
    innerHtml.push(obj);
  }
  return innerHtml;
}

export default Tree;
