import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import API from './API';
import {PROMPTS} from '../constants';

const storeSession = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    throw e;
  }
};

const getSession = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return JSON.parse(jsonValue);
  } catch (e) {
    throw e;
  }
};

const storeCompany = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem('company', jsonValue);
  } catch (e) {
    throw e;
  }
};

const getCompany = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('company');
    return JSON.parse(jsonValue);
  } catch (e) {
    throw e;
  }
};

const removeSession = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (e) {
    throw e;
  }
};

const removeCompany = async () => {
  try {
    await AsyncStorage.removeItem('company');
  } catch (e) {
    throw e;
  }
};

const validateEmail = (email) => {
  let pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  );

  return pattern.test(email);
};

const validatePassword = (password) => {
  let pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,32}$/);

  return pattern.test(password);
};

// const generateRequiredFieldErrors = (fields, data) => {
//   let errObj = {};

//   fields.forEach((field) => {
//     if (!data[field]) {
//       errObj = {...errObj, [field]: PROMPTS.errors.empty};
//     }
//   });

//   return errObj;
// };

const getImageFileObject = (image) => {
  let obj = {uri: image.path, type: image.mime};

  const ext = image.path.split('/');

  obj.name = ext[ext.length - 1];
  obj.donotConvertToJSON = true;
  return obj;
};

const showToast = (type, text1, text2, position = 'bottom') => {
  return Toast.show({
    type: `${type}`,
    position: position,
    text1: `${text1}`,
    text2: `${text2}`,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 30,
    bottomOffset: 40,
    onShow: () => {},
    onHide: () => {},
    onPress: () => {},
  });
};

export {
  API,
  storeSession,
  getSession,
  storeCompany,
  getCompany,
  removeSession,
  removeCompany,
  validateEmail,
  validatePassword,
  // generateRequiredFieldErrors,
  showToast,
  getImageFileObject,
};
