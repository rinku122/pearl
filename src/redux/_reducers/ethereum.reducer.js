import { actionTypes } from '../_actions/ethereum.action';

const initialState = {
  chainId: 0,
  address: '',
  walletConnector: {},
  totalIncome: 0,
  totalIncome3x: 0,
  totalIncome4x: 0,
  tronAdress: '',
  referrals: [],
  amount: '0',
  ethU5Price: [
    {
      poolPrice: '250',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '500',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '1000',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '2000',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '4000',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '8000',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '16000',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
    {
      poolPrice: '32000',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
    },
  ],
  ethLevelPrice4x: [
    {
      poolPrice: '100',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '200',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '400',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '800',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '1600',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '3200',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '6400',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '12800',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '25600',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '51200',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userMatrix: {
        0: '0x0000000000000000000000000000000000000000',
        1: [],
        2: [],
        3: false,
        4: '0x0000000000000000000000000000000000000000',
      },
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
    {
      poolPrice: '102400',
      activeStatus: true,
      levelIncome: ['0', '0', '0', '0', '0'],
      poolLevel: ['0', '0', '0', '0', '0'],
      userMatrix: {
        0: '0x0000000000000000000000000000000000000000',
        1: [],
        2: [],
        3: false,
        4: '0x0000000000000000000000000000000000000000',
      },
      userIncome: 0,
      newUserPlace: [],
      poolTwoUsers: [],
      poolTwoArr: [{}, {}, {}, {}],
    },
  ],
  poolArr: [
    {
      pool: '1',
      cost: '250',
    },
    {
      pool: '2',
      cost: '500',
    },
    {
      pool: '3',
      cost: '1000',
    },
    {
      pool: '4',
      cost: '2000',
    },
    {
      pool: '5',
      cost: '4000',
    },
    {
      pool: '6',
      cost: '8000',
    },
    {
      pool: '7',
      cost: '16000',
    },
    {
      pool: '8',
      cost: '32000',
    },
  ],
};

const ethereum = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_TRON_ADDRESS:
      return {
        ...state,
        tronAdress: action.data,
      };
    case actionTypes.SAVE_WALLET_CONNECTOR:
      return {
        ...state,
        walletConnector: action.data.walletConnector,
        chainId: action.data.chainId,
        address: action.data.address,
      };
    case actionTypes.SAVE_WALLET_DISCONNECTOR:
      return {
        ...state,
        walletConnector: {},
        chainId: 0,
        address: '',
      };
    case actionTypes.SAVE_U5:
      return {
        ...state,
        ethU5Price: action.data,
      };
    case actionTypes.SAVE_LEVEL_4X:
      return {
        ...state,
        ethLevelPrice4x: action.data,
      };
    case actionTypes.SAVE_USER_LEVEL_3X:
      return {
        ...state,
        ethUserLevelPrice3x: [action.data],
      };
    case actionTypes.SAVE_USER_LEVEL_4X:
      return {
        ...state,
        ethUserLevelPrice4x: [action.data],
      };
    case actionTypes.SAVE_LEVEL_TOTAL_INCOME:
      return {
        ...state,
        totalIncome: action.data.totalIncome,
        totalIncome3x: action.data.totalIncome3x,
        totalIncome4x: action.data.totalIncome4x,
      };
    case actionTypes.SAVE_REFERRALS:
      return {
        ...state,
        referrals: action.data,
      };
    case actionTypes.SAVE_AMOUNT:
      return {
        ...state,
        amount: action.data,
      };
    case actionTypes.LOGOUT_ETHEREUM:
      return initialState;
    default:
      return state;
  }
};

export default ethereum;
