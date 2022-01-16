import { startLoading, stopLoading } from './loading.action';
import { toast } from '../../components/Toast/Toast';
import {
  saveUserDetail,
  saveLogin,
  saveEuroPrice,
  saveRegistrationPerDay,
  saveTotals,
  saveTotalParticipants,
  saveUserDetails,
  lastLoginDetails,
  // saveUserIncomeLog,
  // saveReinvetLog
  saveTreeInfo,
} from './persist.action';
import { HOME_ROUTE } from '../../_constants/index';

// import { setCookie, getCookie } from "../../_utils/index";
// import { DEFAULT_ADDRESS } from '../../_constants';
import { EthereumService } from '../../Services/EthereumService';
import { UserService } from '../../Services/UserService';

/** seting action types */
export const actionTypes = {
  SAVE_WALLET_CONNECTOR: 'SAVE_WALLET_CONNECTOR',
  SAVE_WALLET_DISCONNECTOR: 'SAVE_WALLET_DISCONNECTOR',
  SAVE_U5: 'SAVE_U5',
  SAVE_LEVEL_4X: 'SAVE_LEVEL_4X',
  SAVE_USER_LEVEL_3X: 'SAVE_USER_LEVEL_3X',
  SAVE_USER_LEVEL_4X: 'SAVE_USER_LEVEL_4X',
  SAVE_LEVEL_TOTAL_INCOME: 'SAVE_LEVEL_TOTAL_INCOME',
  LOGOUT_ETHEREUM: 'LOGOUT_ETHEREUM',
  SAVE_TRON_ADDRESS: 'SAVE_TRON_ADDRESS',
  SAVE_REFERRALS: 'SAVE_REFERRALS',
  SAVE_AMOUNT: 'SAVE_AMOUNT',
};

/*
 * Action creators for login
 */
export function tronAdress(data) {
  return {
    type: actionTypes.SAVE_TRON_ADDRESS,
    data,
  };
}

export function saveWalletConnector(data) {
  return {
    type: actionTypes.SAVE_WALLET_CONNECTOR,
    data,
  };
}

export function clearWalletConnector() {
  return {
    type: actionTypes.SAVE_WALLET_DISCONNECTOR,
  };
}

export function saveAmount(data) {
  return {
    type: actionTypes.SAVE_AMOUNT,
    data,
  };
}

export function saveU5(data) {
  return {
    type: actionTypes.SAVE_U5,
    data,
  };
}
export function saveReferralDetails(data) {
  return {
    type: actionTypes.SAVE_REFERRALS,
    data,
  };
}

export function saveLevel4x(data) {
  return {
    type: actionTypes.SAVE_LEVEL_4X,
    data,
  };
}
export function saveUserLevel3x(data) {
  return {
    type: actionTypes.SAVE_USER_LEVEL_,
    data,
  };
}
export function saveUserLevel4x(data) {
  return {
    type: actionTypes.SAVE_USER_LEVEL_4X,
    data,
  };
}
export function saveTotalIncome(data) {
  return {
    type: actionTypes.SAVE_LEVEL_TOTAL_INCOME,
    data,
  };
}
export function logoutEthereum() {
  return {
    type: actionTypes.LOGOUT_ETHEREUM,
  };
}

//action functions with dispatch
//get getEuroPrice
export function getEuroPrice() {
  return async (dispatch, getState) => {
    const {
      persist: { address },
    } = getState();
    return await EthereumService.getEuroPrice()
      .then((res) => {
        console.log(res);
        const {
          data: { eur },
        } = res;
        dispatch(saveEuroPrice(eur));
      })
      .catch((error) => {
        if (error) {
          toast.error(error.message);
        }
      });
  };
}

export function saveLogin1(address) {
  return async (dispatch, getState) => {
    let convertedAddress = await EthereumService.convertAddressFromHex(address);
    dispatch(
      saveLogin({
        address: address,
        convertedAddress: convertedAddress,
        loginType: 'tronWeb',
      })
    );
    return true;
  };
}

//add transaction of user
export function addTransaction(data) {
  return (dispatch) => {
    return EthereumService.addTransaction(data);
    // return true;
  };
}
//Convert Wei to ether
export function convertFromSun(value) {
  return async (dispatch) => {
    try {
      const result = await EthereumService.convertFromSun(value);
      return result;
    } catch (error) {
      return toast.error(error.message);
    }
  };
}

//get user using tronWeb
export function getUserTronWeb(address) {
  return async (dispatch, getState) => {
    try {
      const res = await EthereumService.getUsers(address, 1);

      if (res.id !== '0') {
        let convertedAddress = await EthereumService.convertAddressFromHex(
          address
        );
        console.log(
          convertedAddress,
          '======getUserTronWeb================convertedAddress'
        );
        dispatch(
          saveLogin({
            address: address,
            convertedAddress: convertedAddress,
            loginType: 'tronWeb',
          })
        );
        // dispatch(saveUserDetails(res));
      }
      return res;
    } catch (error) {
      if (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
}

//get user using tronWeb socket
export function getUserSocket(address, pool) {
  return async (dispatch, getState) => {
    try {
      const res = await EthereumService.getUsersSocket(address, pool);

      if (res.id !== '0') {
        address = res.address; //converted address
        let convertedAddress = await EthereumService.convertAddressFromHex(
          address
        );
        console.log(
          convertedAddress,
          '======getUserSocket================convertedAddress'
        );
        dispatch(
          saveLogin({
            address: address,
            convertedAddress: convertedAddress,
            loginType: 'tronWeb',
            pool,
          })
        );
        //dispatch(saveUserDetail(res));
      }
      return res;
    } catch (error) {
      if (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
}
//get user more details from contract
export function getUsers(address) {
  return async (dispatch) => {
    try {
      const res = await EthereumService.getUsers(address, '1');
      return res;
    } catch (error) {
      if (error) {
        let message = '';
        if (error) {
          console.log(error);
          if (error.message) {
            message = error.message;
            toast.error(error.message);
          } else if (error.error) {
            message = error.error;
            toast.error(error.error);
          } else {
            message = error;
            toast.error(error);
          }
        }
      }
    }
  };
}

//register user with contract using tronWeb
export const regUserTronWeb = (address, upline) => async (dispatch) => {
  try {
    dispatch(startLoading());
    await EthereumService.registration(upline, address);
    setTimeout(async () => {
      const response = await UserService.checkUser(address);
      if (response && response.data && response.data.status === true) {
        console.log('response.data.status', response.data.status);
        toast.success('Register successfully.');
        let convertedAddress = await EthereumService.convertAddressFromHex(
          address
        );
        await dispatch(
          saveLogin({ address: address, convertedAddress: convertedAddress })
        );
        var users = await EthereumService.users(address);
        let userDetail = {
          id: users?.id?.toString(),
          referrer: users.referrer,
          totalIncome: users.totalIncome.toString(),
          currentActivatedLevel: users.currentActivatedLevel.toString(),
        };
        let res = await EthereumService.users(userDetail.referrer);
        userDetail.referrerId = res.id?.toString();
        //await dispatch(getUserTronWeb(address));
        await dispatch(saveUserDetails(userDetail));
        await lastLoginDetails(dispatch, address);
        dispatch(stopLoading());
      } else {
        dispatch(stopLoading());
        toast.error('Something went wrong, try again');
        return false;
      }
    }, 20000);
  } catch (error) {
    console.log(error, 'last');
    dispatch(stopLoading());
    let message = '';
    if (error) {
      if (error.error) {
        message = error.error;
        // console.log('message', message);
        // console.log('message', message);
        if (
          error.error === 'CONTRACT_VALALIDATE_ERROR' ||
          error.error === 'BANDWITH_ERROR'
        ) {
          message = 'Insufficient funds in the account!';
        }

        toast.error(message);
      } else if (error.message) {
        message = error.message;
        toast.error(error.message);
      } else {
        message = error;
        toast.error(error);
      }
    }
    return false;
  }
};

export function poolPrice() {
  return async (dispatch, getState) => {
    const filterpoolArr = (arr, pool) => {
      return arr.filter((d, index) => parseInt(pool) === index);
    };
    const filterpoolArr2 = (arr, pool) => {
      return arr.filter((d, index) => d.pool === pool);
    };

    const filterForGlobalPosition = (arr, pool, address) => {
      //For Global Position
      const globalData = arr[0].filter((d, index) => d.pool === pool);
      let globalPosition = 0;
      if (globalData.length > 0) {
        globalPosition = globalData[0].currentPosition;
      }

      //For My Position
      const positionData = arr[1].filter((d, index) => d.pool === pool);
      const myPosition =
        positionData.length > 0 ? positionData[0].myPosition : 0;

      return { globalPosition, myPosition };
    };

    const filterForReinvestCount = (arr, pool) => {
      const data = arr.filter((d, index) => d.pool === pool);
      const d = data.splice(0, 1);
      return d.length > 0 ? d[0] : {};
    };

    const {
      persist: { loginType, address, userDetails },
      ethereum: { poolArr },
    } = getState();
    dispatch(startLoading());

    let newUserPlacedLog = [],
      levelIncomeLog = [],
      poolPurchasedLog = [],
      globalPoolUpdatedLog = [],
      poolLevelUpdatedLog = [],
      reinvestCountLog = [];
    try {
      if (loginType === 'tronWeb') {
        //with socket backend new code
        newUserPlacedLog = await EthereumService.newUserPlaceLogSocketArr(
          address,
          poolArr
        );
        levelIncomeLog = await EthereumService.levelIncomeLogSocketArr(
          address,
          poolArr
        );
        poolPurchasedLog = await EthereumService.poolPurchasedLogSocketArr(
          address
        );
        globalPoolUpdatedLog =
          await EthereumService.globalPoolUpdatedLogSocketArr(address);
        poolLevelUpdatedLog = await EthereumService.poolUpdateLevelLogSocketArr(
          address,
          poolArr
        );
        reinvestCountLog = await EthereumService.reinvestCountLogSocketArr(
          address
        );
        const a = poolArr.map(async (d, index) => {
          let poolPrice = d.cost;

          let activeStatus = false;

          let activeStatusArr = filterpoolArr2(poolPurchasedLog, d.pool);
          if (activeStatusArr.length > 0) {
            activeStatus = true;
          }
          let poolCount = 0;
          let newUserPlace = filterpoolArr(newUserPlacedLog, index);
          if (newUserPlace.length > 0) {
            newUserPlace = newUserPlace[0];
          }
          let levelIncome = filterpoolArr(levelIncomeLog, index);
          if (levelIncome.length > 0) {
            levelIncome = levelIncome[0];
          }

          let poolLevel = filterpoolArr(poolLevelUpdatedLog, index);

          if (poolLevel.length > 0) {
            poolLevel = poolLevel[0];
            poolCount = poolLevel.reduce((a, b) => a + b, 0);
          }

          let { globalPosition, myPosition } = filterForGlobalPosition(
            globalPoolUpdatedLog,
            d.pool,
            address
          );
          let r = filterForReinvestCount(reinvestCountLog, d.pool);
          return {
            activeStatus,
            newUserPlace,
            poolPrice,
            levelIncome,
            poolLevel,
            poolCount,
            globalPosition,
            myPosition,
            reinvestCount: r.reinvestCount,
            reinvestStatus: r.status,
          };
        });
        const r = await Promise.all(a);
        // console.log(r, 'u5');
        dispatch(saveU5(r));
        dispatch(getUserTronWeb(address));
      }
    } catch (error) {
      dispatch(stopLoading());
    }
  };
}

export function statsLevel() {
  return async (dispatch, getState) => {
    const {
      persist: { loginType, address },
    } = getState();
    //  dispatch(startLoading());
    try {
      return await EthereumService.levelIncomeSocket(address);
    } catch (error) {
      dispatch(stopLoading());
    }
  };
}

export const getAddress = async () => {
  var myVar = setInterval(async () => {
    try {
      const tronWeb = await window.tronWeb;
      if (tronWeb.defaultAddress.base58) {
        this.setState({ loggedUser: tronWeb.defaultAddress.base58 });
        this.props.sendTronAddressToRegister(tronWeb.defaultAddress.base58);
        window.clearInterval(myVar);
      }
      // resolve(tronWeb);
    } catch (err) {
      console.log(err);
    }
  }, 1000);
};

// Direct Referral Users
export function directReferralUsers() {
  return async (dispatch, getState) => {
    const {
      persist: { address },
    } = getState();
    // dispatch(startLoading());
    try {
      return await EthereumService.directReferralUsers(address);
    } catch (error) {
      dispatch(stopLoading());
    }
  };
}

// Direct Referral Stats
export function directReferralStats() {
  return async (dispatch, getState) => {
    const {
      persist: { address },
    } = getState();

    // dispatch(startLoading());
    try {
      return await EthereumService.directReferralStatsSocket(address);
    } catch (error) {
      dispatch(stopLoading());
    }
  };
}

export function statsPool() {
  return async (dispatch, getState) => {
    const {
      persist: { loginType, address },
    } = getState();
    dispatch(startLoading());
    try {
      return await EthereumService.poolIncomeSocket(address);
    } catch (error) {
      dispatch(stopLoading());
    }
  };
}

// export function userLevelPrice(userAddress, pool, matrix, reinvest = '') {
//   return async (dispatch, getState) => {
//     const {
//       persist: { loginType },
//       ethereum: { poolArr },
//     } = getState();
//     dispatch(startLoading());
//     let reinvestlog = [];
//     let userIncomeLog = [];
//     let activeStatus, userMatrix;

//     if (loginType === 'tronWeb') {
//       //without socket backend
//       //listen socket:
//       let reinvestStatus = await EthereumService.reinvestLogSocket(
//         userAddress,
//         pool,
//         matrix
//       );
//       const newUserPlaceLog = await EthereumService.newUserPlaceLogSocket2(
//         userAddress,
//         pool,
//         matrix,
//         reinvest,
//         reinvestStatus
//       );
//       const userCounts = await EthereumService.userCounts(
//         userAddress,
//         pool,
//         matrix
//       );
//       const poolPrice = await EthereumService.poolPriceSocket(pool);

//       let user = await EthereumService.getUsersSocket(userAddress);

//       let currentId = user.id;
//       let referrerId = await EthereumService.getUsersSocket(user.referrer).then(
//         (data) => data.id
//       );

//       if (matrix === '1') {
//         //3x matrix
//         let poolOneUsers = [];

//         activeStatus = await EthereumService.usersActiveXXXLevelsSocket(
//           userAddress,
//           pool
//         );
//         // userMatrix = await EthereumService.usersXXXMatrixSocket(userAddress, pool);
//         // let userIncome = await EthereumService.getX3LevelIncome(userAddress, pool);
//         // userIncome = parseFloat(userIncome);
//         // console.log({ userIncome });
//         let userIncome = 0;
//         if (userAddress.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {
//           userIncome = poolPrice * userCounts;
//         } else {
//           userIncome = poolPrice * (userCounts - reinvestStatus);
//         }

//         //adding cycle income in 3x
//         if (reinvestStatus > 0) {
//           //default address
//           // if (userAddress.toLowerCase() === DEFAULT_ADDRESS.toLowerCase()) {
//           //   userIncome += (3 * poolPrice) * reinvestStatus.length;
//           // } else {
//           //   userIncome += (2 * poolPrice) * reinvestStatus.length;
//           // }
//           // userCounts += 3 * reinvestStatus;
//         }

//         if (newUserPlaceLog.length > 0) {
//           // userCounts += newUserPlaceLog.length;
//           poolOneUsers = await EthereumService.userLevel3xOneUsers(
//             newUserPlaceLog,
//             currentId,
//             pool
//           );
//         }

//         dispatch(
//           saveUserLevel3x({
//             currentId,
//             referrerId,
//             poolPrice,
//             activeStatus,
//             reinvestStatus,
//             userMatrix,
//             userIncome,
//             poolOneUsers,
//             userCounts,
//             user,
//           })
//         );
//         dispatch(stopLoading());
//       }
//       if (matrix === '2') {
//         //4x matrix
//         let poolOneUsers = [];
//         let poolTwoUsers = [];
//         let poolTwoArr = [{}, {}, {}, {}];
//         // let userCounts = 0;

//         activeStatus = await EthereumService.usersActiveXXXXLevelsSocket(
//           userAddress,
//           pool
//         );
//         // userMatrix = await EthereumService.usersXXXXMatrixSocket(userAddress, pool);

//         // if (userMatrix[0] !== "0x0000000000000000000000000000000000000000") {
//         //   referrerId = await EthereumService.getUsersSocket(userMatrix[0]).then(data => data.id);
//         // }
//         let userIncome = await EthereumService.getX4LevelIncome(
//           userAddress,
//           pool
//         );
//         userIncome = parseFloat(userIncome);

//         // userCounts += newUserPlaceLog.length;
//         //adding cycle income in 4x
//         if (reinvestStatus > 0) {
//           // userIncome += (3 * poolPrice) * reinvestStatus.length;
//           // userCounts += 6 * reinvestStatus;
//         }
//         if (newUserPlaceLog.length > 0) {
//           const r = await EthereumService.userLevel4xOneUsers(
//             newUserPlaceLog,
//             currentId,
//             pool,
//             userAddress
//           );
//           // console.log(r, '4x');
//           if (r) {
//             poolOneUsers = r.poolOneUsers;
//             poolTwoUsers = r.poolTwoUsers;
//             poolTwoArr = r.poolTwoArr;
//           }
//         }

//         dispatch(
//           saveUserLevel4x({
//             currentId,
//             referrerId,
//             poolPrice,
//             activeStatus,
//             reinvestStatus,
//             // userMatrix,
//             userIncome,
//             poolOneUsers,
//             poolTwoUsers,
//             poolTwoArr,
//             userCounts,
//             user,
//           })
//         );
//         dispatch(stopLoading());
//       }
//     }
//   };
// }

//join user to pool after login Meghraj
export function purchasePool(pool) {
  return async (dispatch, getState) => {
    const {
      persist: { loginType, address, totalParticipants, userDetails },
    } = getState();
    dispatch(startLoading());

    try {
      const res = await EthereumService.purchasePool(pool);
      const transactionHash = res;
      console.log(res, 'purchase pool');
      dispatch(stopLoading());
      toast.success(
        // "Buy Plan successfully. Transaction Hash:" + transactionHash
        'Buy Plan successfully.'
      );
      return true;
    } catch (error) {
      dispatch(stopLoading());
      if (error) {
        let message = '';
        if (error) {
          console.log(error);
          if (error.error) {
            message = error.error;
            if (error.error === 'CONTRACT_VALIDATE_ERROR') {
              message = 'Insufficient funds in the account!';
            }
            toast.error(message);
          } else if (error.message) {
            message = error.message;
            toast.error(error.message);
          } else {
            message = error;
            toast.error(error);
          }
        }
        toast.error(message);
      }
      return false;
    }
  };
}

//logout function for trust wallet
export function EthereumLogOut() {
  return (dispatch, getState) => {
    const {
      ethereum: { walletConnector },
    } = getState();
    dispatch(logoutEthereum());
    if (walletConnector.connected) {
      walletConnector.killSession({ message: 'Clear session' });
      dispatch(clearWalletConnector());
    }
  };
}
// call contract for component
export function callContract() {
  return (dispatch, getState) => {
    return EthereumService.callContract();
  };
}

export function loginUser(address) {
  return async (dispatch) => {
    dispatch(startLoading());
    // const { persist: { address } } = getState();
    try {
      const res = await EthereumService.loginUser(address);
      dispatch(stopLoading());
      return res.data;
    } catch (error) {
      dispatch(stopLoading());
      return { status: false };
    }
  };
}
// from database get total values
export function getTotalDB() {
  return async (dispatch, getState) => {
    const {
      persist: { address },
    } = getState();
    try {
      const res = await EthereumService.getTotalDB();
      dispatch(saveTotals(res.data));
    } catch (error) {
      console.log(error);
    }
  };
}
// from database get register user per day values
export function registeredPerDay() {
  return async (dispatch, getState) => {
    const {
      persist: { address },
    } = getState();
    try {
      const res = await EthereumService.registeredPerDay();
      // dispatch(saveRegistrationPerDay("0"));
      dispatch(saveRegistrationPerDay(res.data));
    } catch (error) {
      console.log(error);
    }
  };
}

//Get lastUserId from contract
export function totalParticipants() {
  return async (dispatch, getState) => {
    // let state = getState();
    try {
      const res = await EthereumService.totalParticipants();
      // let d = 0;
      // if (parseInt(res) > 0) {
      //   d = parseInt(res) - 1;
      // }
      dispatch(saveTotalParticipants(res.data));
    } catch (error) {
      if (error) {
        toast.error(error.message);
      }
    }
  };
}
//Get userIds from contract
export function userIds(id) {
  return (dispatch, getState) => {
    // let state = getState();
    return EthereumService.userIds(id)
      .then((address) => {
        return address;
      })
      .catch((error) => {
        if (error) {
          console.log('error', error);
          // toast.error('Invalid Input');
          // dispatch(stopLoading());
        }
      });
  };
}
//Get addMissingTransaction from contract
export function addMissingTransaction(address) {
  return (dispatch) => {
    // let { persist: address } = getState();
    return EthereumService.addMissingTransaction(address);
  };
}

//get transaction of specified user
export function getUserTransaction(address, pool = '', matrix = '') {
  return async (dispatch, getState) => {
    const {
      persist: { loginType },
    } = getState();
    try {
      if (loginType === 'tronWeb') {
        //with socket backend
        const r = await EthereumService.getUserTransactionNewSocket(
          address,
          pool,
          matrix
        );
        dispatch(stopLoading());
        return r;
      }
    } catch (error) {
      console.log(error);
      dispatch(stopLoading());
    }
  };
}
//Get userIds from contract
export function userIdsSocket(id) {
  // alert('socket');
  return async (dispatch) => {
    // let state = getState();
    return await EthereumService.userIdsSocket(id);
  };
}
export function users(address) {
  return async (dispatch) => {
    var users = await EthereumService.users(address);
    let userDetail = {
      id: users?.id?.toString(),
      referrer: users.referrer,
      totalIncome: users.totalIncome.toString(),
      currentActivatedLevel: users.currentActivatedLevel.toString(),
    };
    let res = await EthereumService.users(userDetail.referrer);
    userDetail.referrerId = res.id?.toString();
    //console.log(userDetail, '====================userDetail');
    dispatch(saveUserDetails(userDetail));
    if (users?.id?.toString() == 0) {
      return false;
    } else {
      return true;
    }
  };
}

export function usersId(address) {
  return async (dispatch) => {
    var users = await EthereumService.users(address);
    //console.log('users', users);
    let userDetail = {
      id: users?.id?.toString(),
      referrer: users.referrer,
      totalIncome: users.totalIncome.toString(),
    };

    console.log('user', users?.id?.toString());
    if (users?.id?.toString() == 0) {
      return false;
    } else {
      return true;
    }
  };
}

export function getAmount() {
  //  console.log('kldsjf', level, value);
  return async (dispatch, getState) => {
    // const toFixed = (num, fixed) => {
    //   var re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    //   return num.toString().match(re)[0];
    // };

    try {
      const {
        persist: { address, userDetails },
      } = getState();

      let r = await EthereumService.getAmount1(address);

      if (parseInt(userDetails.currentActivatedLevel) >= 2) {
        r = Number(r) / 1.1;
        dispatch(saveAmount(r.toFixed(2)));
      } else {
        dispatch(saveAmount(r));
      }
    } catch (error) {
      console.log(error, 'mmmmmmmmmmmmmmmmmmmmmm');
      return toast.error(error);
    }
  };
}
export function unLockLevel() {
  return async (dispatch, getState) => {
    try {
      const {
        persist: { address },
      } = getState();
      dispatch(startLoading());
      const r = await EthereumService.unLockLevel(address);
      if (r) {
        const res = await dispatch(users(address));
        if (res) {
          console.log('i raaaaaaaaaaaaannnnn>>>>>>>>>>>>>>>>>>>>>>> success');
          toast.success('Upgraded To Next Level');
          window.location.reload(1);
        } else {
          console.log('i raaaaaaaaaaaaannnnn>>>>>>>>>>>>>>>>>>>>>>> err1');
          dispatch(stopLoading());
          toast.error('SomeThing Went Wrong');
          // window.location.reload(1);
        }
      } else {
        dispatch(stopLoading());
        console.log('i raaaaaaaaaaaaannnnn>>>>>>>>>>>>>>>>>>>>>>> err2');
        toast.error('SomeThing Went Wrong');
        // window.location.reload(1);
      }
    } catch (error) {
      dispatch(stopLoading());
      toast.error(error);
      // console.log(error, 'mmmmmmmmmmmmmmmmmmmmmm');
    }
  };
}

export const userResponseAction = async (address) => {
  var data = await UserService.userResponse(address);
  console.log('data', data);
  return data;
};
export function userPlaceIncome(address, level) {
  return async (dispatch, getState) => {
    const {
      persist: { userDetails },
    } = getState();
    let response = await UserService.userPlaceIncome(address, level);
    //console.log(response.data.newUserPlace, '==========response');
    dispatch(stopLoading());
    return response.data.newUserPlace;
  };
}

export const getReferrals = async (dispatch, address) => {
  console.log('address', address);
  let res = await EthereumService.getReferrals(address);
  dispatch(saveReferralDetails(res.data.referrals));
  return true;
};
