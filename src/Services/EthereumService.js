// import { ethers } from "ethers";
import { fetch } from './Fetch';

import {
  API_HOST,
  CONTRACT_ADDRESS,
  BLOCK_NUMBER,
  USDT_ADDRESS,
  // INFURA_URL
} from '../_constants';
// import { getCookie } from "../_utils";
import { socket } from '../App';
import abi from './../Assets/myContractABI.json';

import myContract from '../Assets/myContractABI.json';
import { toast } from '../components/Toast/Toast';
// const feePercentage = 1;
// const contractAddress = '0xF29519514cf5A7f9bd2eF36b95653e46067f7Eb0';

// const AbiCoder = ethers.utils.AbiCoder;
// const ADDRESS_PREFIX_REGEX = /^(41)/;
// const ADDRESS_PREFIX = "41";

const getIp = () => {
  return fetch('get', 'https://ipv4.jsonip.com');
};
let tronWeb;
// window.tronWeb.defaultAddress.base58

const callTronWeb = () => {
  return new Promise(async (resolve, reject) => {
    if (tronWeb) {
      resolve(tronWeb);
    } else {
      const tronWeb2 = await setTronWeb();
      if (tronWeb2) {
        resolve(tronWeb2);
      } else {
        reject(
          new Error('You have to install Tron link wallet or reload page2!')
        );
      }
    }
  });
};

const setTronWeb = () => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      try {
        tronWeb = await window.tronWeb;
        resolve(tronWeb);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }, 1000);
  });
};
const callContract = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (tronWeb) {
        const myNewContract = await tronWeb.contract(abi, CONTRACT_ADDRESS);
        resolve(myNewContract);
      } else {
        const tronWeb2 = await setTronWeb();
        if (tronWeb2) {
          const myNewContract = await tronWeb2.contract(abi, CONTRACT_ADDRESS);
          // if (tronWeb.fullNode.host.indexOf('shasta') > -1) {
          //   return reject(new Error("Switch to mainnet network in tronlink"));
          // }

          resolve(myNewContract);
        } else {
          alert('reload tronlink wallet extension in the browser');
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const callContractUSDT = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (tronWeb) {
        const myNewContract = await tronWeb.contract().at(USDT_ADDRESS);
        resolve(myNewContract);
      } else {
        const tronWeb2 = await setTronWeb();
        if (tronWeb2) {
          const myNewContract = await tronWeb2.contract().at(USDT_ADDRESS);
          // if (tronWeb.fullNode.host.indexOf('shasta') > -1) {
          //   return reject(new Error("Switch to mainnet network in tronlink"));
          // }

          resolve(myNewContract);
        } else {
          alert('reload tronlink wallet extension in the browser');
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getUsers = (address, pool) => {
  console.log('come Hedddre');
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      console.log('contract', contract);
      if (contract) {
        contract
          .users(address)
          .call({ _isConstant: true })
          .then(async (result) => {
            console.log('userResult', result);
            // convert hex response to string for tron
            const user = {
              id: result.id.toString(),
              referrerId: result.referrer.toString(),
            };
            console.log('user', user);
            resolve(user);
          })
          .catch(reject);
      } else {
        reject(new Error('Contract not found.'));
      }
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
};

const registration = (upline, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      const contractUSDT = await callContractUSDT();
      let userBalance = await contractUSDT.balanceOf(address).call();
      userBalance = userBalance.toString();
      console.log(userBalance, 'userBalanceUSDT');
      let registrationFees = (
        await contract.investmentArray(0).call({ _isConstant: true })
      ).toString();
      registrationFees = String(
        Number(registrationFees) + (Number(registrationFees) * 10) / 100
      );
      console.log(
        `registrationFees :${registrationFees}`,
        `userBalance:${userBalance}`
      );
      if (Number(registrationFees) > Number(userBalance)) {
        throw 'Insufficient USDT';
      }
      const feeLimit = 1000000000; //sun value

      let callValue = 0;
      const value =
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      contractUSDT
        .approve(CONTRACT_ADDRESS, value)
        .send({ feeLimit, callValue, shouldPollResponse: false })
        .then((result) => {
          console.log('result of approval ', result);
          if (result) {
            contract
              .registration(upline, registrationFees)
              .send({ feeLimit, callValue, shouldPollResponse: false })
              .then((regResult) => {
                console.log('result of registration', regResult);
                resolve(regResult);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

const poolPrice = (pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      contract
        .getPoolPrice(pool)
        .call({ _isConstant: true })
        .then(async (result) => {
          resolve(result.price);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

const getOwner = async () => {
  try {
    const contract = await callContract();
    let owner = await contract.owner().call({ _isConstant: true });
    owner = owner.toString();
    return owner;
  } catch (error) {
    console.log(error);
  }
};
const getInvestmentValues = async () => {
  try {
    const contract = await callContract();
    let array = await contract.investmentValues().call({ _isConstant: true });
    return array.length;
  } catch (error) {
    console.log(error);
  }
};

// Buy new pool service Meghraj
const purchasePool = (pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      const callValue = await poolPrice(pool);
      // value = calculateFee(value);
      const contract = await callContract({ _isConstant: true });

      const feeLimit = 1000000000; //sun value
      // console.log(value, type, feeLimit, callValue);
      contract
        .purchasePool(pool)
        .send({ feeLimit, callValue, shouldPollResponse: false })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
// End Buy new pool

// userIds price Manish
const userIds = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      contract
        .userIds(id)
        .call({ _isConstant: true })
        .then((result) => {
          resolve(result);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
const users = (address) => {
  console.log('address56', address);
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      contract
        .users(address)
        .call({ _isConstant: true })
        .then(async (result) => {
          // console.log(result, '=================result');
          const tronWeb = await callTronWeb();
          const result1 = await tronWeb.fromSun(result.totalIncome.toString());
          result.totalIncome = result1;
          resolve(result);
        })
        .catch((error) => {
          console.log(error, '===========error');
        });
    } catch (error) {
      reject(error);
    }
  });
};

const unLockLevel = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      const callValue = await getAmount(address);
      console.log('ooooooooooooooooooo');
      const contractUSDT = await callContractUSDT();
      let userBalance = await contractUSDT.balanceOf(address).call();
      userBalance = userBalance.toString();
      if (Number(callValue) > Number(userBalance)) {
        throw 'Insufficient USDT to buy level';
      }

      console.log(callValue, 'callValue');
      const feeLimit = 1000 * 10 ** 6; //sun value
      let CALLVALUE = 0;
      contract
        .purchaseLevel(callValue)
        .send({ feeLimit, CALLVALUE, shouldPollResponse: true })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          if (error.error === 'Cannot find result in solidity node') {
            return resolve(true);
          }
          resolve(false);
        });
    } catch (error) {
      reject(error);
    }
  });
};
const getAmount = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      contract
        .investmentAmount(address)
        .call({ _isConstant: true })
        .then(async (result) => {
          // console.log(result.amounts, '==============result.toString()');
          // const result1 = result.amounts.toString();
          // resolve(result1);
          console.log(result, '==============result.toString()');
          const result1 = result.toString();
          resolve(result1);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
const getAmount1 = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      contract
        .investmentAmount(address)
        .call({ _isConstant: true })
        .then(async (result) => {
          // const tronWeb = await callTronWeb();
          // const result1 = await tronWeb.fromSun(result.amounts.toString());
          // resolve(result1);
          const tronWeb = await callTronWeb();
          const result1 = await tronWeb.fromSun(result.toString());
          resolve(result1);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};
const idToAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await callContract();
      contract
        .userIds(address)
        .call({ _isConstant: true })
        .then(async (result) => {
          resolve(result);
        })
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
};

const convertFromSun = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tronWeb = await callTronWeb();
      const result = await tronWeb.fromSun(value);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
const convertToSun = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tronWeb = await callTronWeb();
      const result = await tronWeb.toSun(value);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const totalParticipants = () => {
  return fetch('get', `${API_HOST}Account/totalParticipants`, {});
};
const getTotalDB = () => {
  return fetch('get', `${API_HOST}Transaction/getTotal`, {});
};
const registeredPerDay = () => {
  return fetch('get', `${API_HOST}Transaction/registeredPerDay`, {});
};
const lastLogin = (address) => {
  return fetch('get', `${API_HOST}Account/lastLogin/${address}`, {});
};
const getEuroPrice = () => {
  return fetch('get', `${API_HOST}Transaction/getEURValue`, {});
};

const loginUser = (address) => {
  return fetch('get', `${API_HOST}Account/login/${address}`, {});
};
const getReferrals = (address) => {
  return fetch('get', `${API_HOST}Transaction/getReferrals/${address}`, {});
};
const directReferralUsers = (address) => {
  return fetch(
    'get',
    `${API_HOST}Transaction/directReferralUsers/${address}`,
    {}
  );
};
// socket event new user placed log Arr
const newUserPlaceLogSocketArr = (address, poolArr) => {
  return new Promise((resolve, reject) => {
    socket.emit(`newUserPlaceLogArr`, { address, poolArr });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('newUserPlaceLogArrRes', (res) => {
      resolve(res);
    });
  });
};

// //Direct Referral Users Log Arr
// const directReferralUsersLogSocketArr = (address, poolArr) => {
//   return new Promise((resolve, reject) => {
//     socket.emit(`directReferralUsers`, { address, poolArr });
//     socket.on('error', err => {
//       console.log(err, 'socket err');
//       reject(err);
//     });
//     socket.on("directReferralUsersRes", (res) => {
//       resolve(res);
//     });
//   });
// }

// socket event level income log Arr
const levelIncomeLogSocketArr = (address, poolArr) => {
  return new Promise((resolve, reject) => {
    socket.emit(`levelIncomeLogArr`, { address, poolArr });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('levelIncomeLogArrRes', (res) => {
      resolve(res);
    });
  });
};

// socket event level income log Arr
const poolPurchasedLogSocketArr = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit(`poolPurchasedLogArr`, { address });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('poolPurchasedLogArrRes', (res) => {
      resolve(res);
    });
  });
};

// socket event level income log Arr
const poolUpdateLevelLogSocketArr = (address, poolArr) => {
  return new Promise((resolve, reject) => {
    socket.emit(`poolUpdateLevelLogArr`, { address, poolArr });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('poolUpdateLevelLogArrRes', (res) => {
      resolve(res);
    });
  });
};

// Global Current Position log Arr
const globalPoolUpdatedLogSocketArr = (address, poolArr) => {
  return new Promise((resolve, reject) => {
    socket.emit(`globalPoolUpdatedLogArr`, { address, poolArr });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('globalPoolUpdatedLogArrRes', (res) => {
      resolve(res);
    });
  });
};

// Global Current Position log Arr
const reinvestCountLogSocketArr = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit(`reinvestCountLogArr`, { address });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('reinvestCountLogArrRes', (res) => {
      resolve(res);
    });
  });
};

// socket fucntions pool price
const poolPriceSocket = (pool) => {
  return new Promise((resolve, reject) => {
    socket.emit('poolPrice', { pool });
    socket.on('poolPriceRes', (res) => {
      resolve(res);
    });
  });
};
// socket function get users
const getUsersSocket = (address, pool) => {
  return new Promise((resolve, reject) => {
    socket.emit('users', { address, pool });
    socket.on('usersRes', (res) => {
      resolve(res);
    });
  });
};

// socket function for getUserTransactionNew to create array
const getUserTransactionNewSocket = (address, pool, matrix) => {
  return new Promise((resolve, reject) => {
    socket.emit('getUserTransactionNew', { address, pool, matrix });
    socket.on('getUserTransactionNewRes', (res) => {
      return resolve(res);
    });
  });
};
// socket function for userIds to create array
const userIdsSocket = (id) => {
  return new Promise((resolve, reject) => {
    socket.emit('userIds', { id });
    socket.on('userIdsRes', (res) => {
      return resolve(res);
    });
  });
};
// socket function for userIds to create array
const levelIncomeSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('levelIncome', { address });
    socket.on('levelIncomeRes', (res) => {
      return resolve(res);
    });
  });
};

// socket function for userIds to create array
const directReferralUsersSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('directReferralUsers', { address });
    socket.on('directReferralUsersRes', (res) => {
      return resolve(res);
    });
  });
};

// socket function for userIds to create array
const directReferralStatsSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('directReferralStats', { address });
    socket.on('directReferralStatsRes', (res) => {
      return resolve(res);
    });
  });
};

// socket function for userIds to create array
const spilledLevelIncomeSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('spilledLevelIncome', { address });
    socket.on('spilledLevelIncomeRes', (res) => {
      return resolve(res);
    });
  });
};

// socket function for userIds to create array
const poolIncomeSocket = (address) => {
  return new Promise((resolve, reject) => {
    socket.emit('poolIncome', { address });
    socket.on('poolIncomeRes', (res) => {
      return resolve(res);
    });
  });
};
const convertAddressToHex = (address) => {
  if (address.indexOf('41') === 0) {
    return address;
  }
  return tronWeb.address.toHex(address);
};
const convertAddressFromHex = (address) => {
  console.log(address);

  if (address.indexOf('41') > -1) {
    return tronWeb.address.fromHex(address);
  }
  return address;
};

// socket fucntions reinvest log Arr
const userCounts = (address, pool, matrix) => {
  return new Promise((resolve, reject) => {
    socket.emit('userCounts', { address, pool, matrix });
    socket.on('error', (err) => {
      console.log(err, 'socket err');
      reject(err);
    });
    socket.on('userCountsRes', (res) => {
      resolve(res);
    });
  });
};

const userExists = async (address) => {
  const contract = await callContract();
  console.log(contract);
  // return new Promise((resolve, reject) => {
  //   contract
  //     .isUserExists(address)
  //     .then((res) => {
  //       resolve(res);
  //     })
  //     .catch((err) => {
  //       reject(err);
  //     });
  // });
};

//exporting
export const EthereumService = {
  getIp,
  getTotalDB,
  idToAddress,
  userIds,
  registeredPerDay,
  getEuroPrice,
  getUsers,
  callContract,
  callContractUSDT,
  registration,
  callTronWeb,
  convertFromSun,
  purchasePool,
  loginUser,
  poolPrice,
  totalParticipants,
  poolPriceSocket,
  getUsersSocket,
  getUserTransactionNewSocket,
  userIdsSocket,
  newUserPlaceLogSocketArr,
  // directReferralUsersSocket,
  directReferralUsers,
  poolPurchasedLogSocketArr,
  poolUpdateLevelLogSocketArr,
  globalPoolUpdatedLogSocketArr,
  reinvestCountLogSocketArr,
  convertAddressFromHex,
  userCounts,
  levelIncomeSocket,
  poolIncomeSocket,
  spilledLevelIncomeSocket,
  levelIncomeLogSocketArr,
  convertAddressToHex,
  directReferralStatsSocket,
  users,
  userExists,
  unLockLevel,
  lastLogin,
  getReferrals,
  getAmount,
  getAmount1,
  getInvestmentValues,
  getOwner,
};
