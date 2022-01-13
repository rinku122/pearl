import { actionTypes } from '../_actions/persist.action';

const initialState = {
  userDetail: {},
  done: false,
  address: '',
  loggedIn: false,
  loginType: 'metamask', //metamask,trustwallet,other
  isLeftbar: false,
  euroPrice: 1,
  totals: {},
  registerationPerDay: 0,
  convertedAddress: '',
  totalParticipants: '1',
  reinvestLog: [],
  userIncomeLog: [],
  userDetails: {},
  treeInfo: {},
  lastLoginDetails: {},
};
// GET_KYC_DATA_SUMSUB
const persist = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_USER_DETAIL:
      return {
        ...state,
        userDetail: action.data,
      };
    case actionTypes.SAVE_TREE_INFO:
      return {
        ...state,
        treeInfo: action.data,
      };
    case actionTypes.SAVE_USERS_DETAILS:
      console.log('action.data', action.data);
      return {
        ...state,
        userDetails: action.data,
      };
    case actionTypes.SAVE_STEP_RUNNING:
      return {
        ...state,
        step: action.data,
      };
    case actionTypes.SAVE_ORDER_DETAIL:
      return {
        ...state,
        orderDetails: action.data,
      };
    case actionTypes.DONE_ALL_STEPS:
      return {
        ...state,
        done: true,
      };
    case actionTypes.RESET_DONE:
      return {
        ...state,
        done: false,
      };
    case actionTypes.SAVE_LOGIN:
      return {
        ...state,
        address: action.data.address,
        convertedAddress: action.data.convertedAddress,
        // loginType: action.data.loginType,
        loggedIn: true,
        isLeftbar: false,
      };
    case actionTypes.LOGOUT:
      return {
        userDetails: {},
        done: false,
        address: '',
        loggedIn: false,
        isLeftbar: false,
      };
    case actionTypes.IS_LEFTBAR_CHANGE:
      return {
        ...state,
        isLeftbar: action.data,
      };
    case actionTypes.SAVE_REFERRAL_COUNT:
      return {
        ...state,
        userReferralCount: action.data.userReferralCount,
      };
    case actionTypes.SAVE_EURO_PRICE:
      return {
        ...state,
        euroPrice: action.data,
      };
    case actionTypes.SAVE_REGISTRATION_PER_DAY:
      return {
        ...state,
        registerationPerDay: action.data,
      };
    case actionTypes.SAVE_TOTALS:
      return {
        ...state,
        totals: action.data,
      };
    case actionTypes.SAVE_TOTAL_PARTICIPANTS:
      return {
        ...state,
        totalParticipants: action.data,
      };
    case actionTypes.SAVE_REINVEST_LOG:
      return {
        ...state,
        reinvestLog: action.data,
      };
    case actionTypes.SAVE_USER_INCOME_LOG:
      return {
        ...state,
        userIncomeLog: action.data,
      };
    case actionTypes.SAVE_LAST_LOGIN_DETAILS:
      return {
        ...state,
        lastLoginDetails: action.data,
      };
    default:
      return state;
  }
};

export default persist;
