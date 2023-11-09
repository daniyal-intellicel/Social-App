import Toast from 'react-native-root-toast';
import messaging from '@react-native-firebase/messaging';

export const handleError = (errorMsg = '', error = null, toastMsg = null) => {
  toastMsg &&
    Toast.show(toastMsg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  // eslint-disable-next-line no-console
  error ? console.log(errorMsg + ':', error) : console.log(errorMsg);
};

export const showToast = (
  mesage,
  duration,
  position = null,
  shadow = true,
  animation = true,
  hideOnPress = true,
  delay = 0,
) => {
  Toast.show(mesage, {
    duration: duration || Toast.durations.SHORT,
    position: position || Toast.positions.BOTTOM,
    shadow,
    animation,
    hideOnPress,
    delay,
  });
};

export const asciiArrayToString = (array) => {
  let result = '';
  for (let i = 0; i < array.length; ++i) {
    result += String.fromCharCode(array[i]);
  }

  return result;
};

export const stringToAsciiArray = (string) => {
  let result = [];
  for (var i = 0; i < string.length; i++) {
    result.push(string[i].charCodeAt(0));
  }

  return result;
};

export const timeoutPromise = function (promise, ms = 3000) {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const extractUsernameFromURL = (url) => {
  let s1 = url.split('?').filter((el) => el);
  let u1 = s1[0];

  let s2 = u1.split('/').filter((el) => el);
  let username = s2[s2.length - 1];

  return username;
};

export const requestNotificationPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    return enabled;
  } else {
    throw enabled;
  }
};

export const validateLinkedInUrl = (url) => {
  let regex =
    /(ftp|http|https):\/\/?((www|\w\w)\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  return regex.test(url);
};
