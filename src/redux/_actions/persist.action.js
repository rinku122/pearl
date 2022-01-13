/** seting action types */
import { EthereumService } from '../../Services/EthereumService';

export const actionTypes = {
  SAVE_LOGIN: 'SAVE_LOGIN',
  SAVE_USER_DETAIL: 'SAVE_USER_DETAIL',
  SAVE_STEP_RUNNING: 'SAVE_STEP_RUNNING',
  SAVE_ORDER_DETAIL: 'SAVE_ORDER_DETAIL',
  DONE_ALL_STEPS: 'DONE_ALL_STEPS',
  RESET_DONE: 'RESET_DONE',
  LOGOUT: 'LOGOUT',
  IS_LEFTBAR_CHANGE: 'IS_LEFTBAR_CHANGE',
  SAVE_REFERRAL_COUNT: 'SAVE_REFERRAL_COUNT',
  SAVE_EURO_PRICE: 'SAVE_EURO_PRICE',
  SAVE_REGISTRATION_PER_DAY: 'SAVE_REGISTRATION_PER_DAY',
  SAVE_TOTALS: 'SAVE_TOTALS',
  SAVE_TOTAL_PARTICIPANTS: 'SAVE_TOTAL_PARTICIPANTS',
  SAVE_USERS_DETAILS: 'SAVE_USER_DETAILS',
  SAVE_TREE_INFO: 'SAVE_TREE_INFO',
  SAVE_LAST_LOGIN_DETAILS: 'SAVE_LAST_LOGIN_DETAILS',
};

/*
 * Action creators for login
 */

export function saveLogin(data) {
  return {
    type: actionTypes.SAVE_LOGIN,
    data,
  };
}
export function saveLastLoginDetails(data) {
  return {
    type: actionTypes.SAVE_LAST_LOGIN_DETAILS,
    data,
  };
}
export function saveUserDetails(data) {
  return {
    type: actionTypes.SAVE_USERS_DETAILS,
    data,
  };
}
export function saveUserDetail(data) {
  return {
    type: actionTypes.SAVE_USER_DETAIL,
    data,
  };
}

export function saveUserSteps(data) {
  return {
    type: actionTypes.SAVE_STEP_RUNNING,
    data,
  };
}
export function saveOrderDetails(data) {
  return {
    type: actionTypes.SAVE_ORDER_DETAIL,
    data,
  };
}
export function done(data) {
  return {
    type: actionTypes.DONE_ALL_STEPS,
    data,
  };
}
export function resetDone(data) {
  return {
    type: actionTypes.RESET_DONE,
    data,
  };
}
export function logOut() {
  return {
    type: actionTypes.LOGOUT,
  };
}
export function saveToggleBox(data) {
  return {
    type: actionTypes.IS_LEFTBAR_CHANGE,
    data,
  };
}
export function saveUserReferralCount(data) {
  return {
    type: actionTypes.SAVE_REFERRAL_COUNT,
    data,
  };
}
export function saveEuroPrice(data) {
  console.log('data', data);
  return {
    type: actionTypes.SAVE_EURO_PRICE,
    data,
  };
}
export function saveRegistrationPerDay(data) {
  return {
    type: actionTypes.SAVE_REGISTRATION_PER_DAY,
    data,
  };
}
export function saveTotals(data) {
  return {
    type: actionTypes.SAVE_TOTALS,
    data,
  };
}
export function saveTotalParticipants(data) {
  return {
    type: actionTypes.SAVE_TOTAL_PARTICIPANTS,
    data,
  };
}
export function saveTreeInfo(data) {
  return {
    type: actionTypes.SAVE_TREE_INFO,
    data,
  };
}

export function toggleBox() {
  return (dispatch, getState) => {
    let state = getState();
    const { isLeftbar } = state.persist;
    dispatch(saveToggleBox(!isLeftbar));
  };
}

export const lastLoginDetails = async (dispatch, address) => {
  console.log('address', address);
  let res = await EthereumService.lastLogin(address);
  dispatch(saveLastLoginDetails(res.data.lastLoginDetails));
  return true;
};
