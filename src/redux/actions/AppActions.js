import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import BlePic from 'rn-ble-pic';
import NetInfo from '@react-native-community/netinfo';
import GPSState from 'react-native-gps-state';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GeoHash from 'latlon-geohash';
import VersionCheck from 'react-native-version-check';
import Geolocation from '@react-native-community/geolocation';

import {
  ActionTypes,
  LOCATION_UPDATE_INTERVAL,
  BLE_DATA_TRANSMIT_SERVICE,
  LOADING_TYPES,
  // ERROR_MESSAGES,
  BLE_DATA_TRANSMIT_CHARACTERISTICS,
  ALERT_MESSAGES,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_LOCATION,
} from '~constants';
import {getDataForBTTransmission} from '~redux/selectors/AppSelectors';
import {handleError, asciiArrayToString} from '~utils/services/GeneralServices';
import {receiveMessageOverBT} from './ChatActions';
import {
  VERSION_CHECK_SUCCESS,
  VERSION_CHECK_FAIL,
} from '~constants/ActionTypes';

const {
  UPDATE_LOCATION,
  UPDATE_RANGE,
  SET_APP_NET_STATE_BT,
  DISCOVER_PEOPLE_SUCCESS,
  SET_INTERNET_PROMPT,
  SET_BT_PROMPT,
  DELETE_PROMPT,
  INIT_LOADING,
  STOP_LOADING,
  HALT_APP_INTERFACE,
  SET_GENERAL_SETTINGS,
} = ActionTypes;

// BlePic.init().catch(error => console.log(error));

let unsubInternetConnectivityListener = null;
let bluetoothConnectivityListener = null;
let bluetoothChatMessageReceiveListener = null;

const BlePicModule = NativeModules.BLEManager;
const blePicEmitter = BlePicModule
  ? new NativeEventEmitter(BlePicModule)
  : null;

const databaseRef = database().ref();
const geoFireRef = databaseRef.child('geoFire');
// const geoFire = new GeoFire(geoFireRef);

export const initLoading = (message = '', type = LOADING_TYPES.flow) => ({
  type: INIT_LOADING,
  loadingType: type,
  loadingMessage: message,
});

export const stopLoading = () => ({type: STOP_LOADING});

export const deletePrompt = () => {
  return {
    type: DELETE_PROMPT,
  };
};

export const saveNotifyToken = (token) => {
  return (dispatch) => {
    const {currentUser} = auth();

    databaseRef.child(`users/${currentUser.uid}`).update({notifyToken: token});
  };
};

export const setGPSListener = () => {
  return (dispatch, getState) => {
    GPSState.removeListener();

    GPSState.getStatus().then((status) => {
      if (
        status === GPSState.AUTHORIZED ||
        status === GPSState.AUTHORIZED_ALWAYS ||
        status === GPSState.AUTHORIZED_WHENINUSE
      ) {
        dispatch(updateLocation());
      } else if (status === GPSState.RESTRICTED || status === GPSState.DENIED) {
        _updateLocationData(DEFAULT_LOCATION, dispatch, getState);
      }
    });

    GPSState.addListener((status) => {
      switch (status) {
        case GPSState.NOT_DETERMINED:
          dispatch({type: HALT_APP_INTERFACE, payload: true});

          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({})
            .then((GPSStatus) => {
              if (GPSStatus === 'already-enabled' || GPSStatus === 'enabled') {
                dispatch({type: HALT_APP_INTERFACE, payload: false});
              }
            })
            .catch(() => {
              GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE);
            });
          break;

        case GPSState.RESTRICTED:
          _updateLocationData(DEFAULT_LOCATION, dispatch, getState);
          break;

        case GPSState.DENIED:
          _updateLocationData(DEFAULT_LOCATION, dispatch, getState);
          break;

        case GPSState.AUTHORIZED:
          dispatch({type: HALT_APP_INTERFACE, payload: false});
          dispatch(updateLocation());
          break;

        case GPSState.AUTHORIZED_ALWAYS:
          dispatch({type: HALT_APP_INTERFACE, payload: false});
          dispatch(updateLocation());
          break;

        case GPSState.AUTHORIZED_WHENINUSE:
          dispatch({type: HALT_APP_INTERFACE, payload: false});
          dispatch(updateLocation());
          break;
      }
    });
  };
};

export const updateLocation = () => {
  return (dispatch, getState) => {
    setTimeout(() => {
      if (!getState().app.location) {
        _updateLocationData(DEFAULT_LOCATION, dispatch, getState);

        handleError('Loc Error:', 'Location fetch taking too long');
      }
    }, 5000);

    Geolocation.getCurrentPosition(
      (result) => _updateLocationData(result.coords, dispatch, getState),
      (error) => {
        if (!getState().app.location) {
          _updateLocationData(DEFAULT_LOCATION, dispatch, getState);
        }

        handleError('Get Loc Error:', error);
      },
      {
        // enableHighAccuracy: true,
        timeout: LOCATION_UPDATE_INTERVAL,
      },
    );

    Geolocation.watchPosition(
      (result) => _updateLocationData(result.coords, dispatch, getState),
      (error) => {
        if (!getState().app.location) {
          _updateLocationData(DEFAULT_LOCATION, dispatch, getState);
        }

        handleError('Watch Loc Error:', error);
      },
      {
        timeout: LOCATION_UPDATE_INTERVAL,
        maximumAge: 0,
        distanceFilter: 0,
        // enableHighAccuracy: true,
      },
    );
  };
};

export const initByRange = (range) => {
  return (dispatch, getState) => {
    dispatch({
      type: DISCOVER_PEOPLE_SUCCESS,
      payload: null,
    });

    if (!unsubInternetConnectivityListener) {
      _addInternetConnectivityListener(dispatch, getState);
    }

    if (!bluetoothConnectivityListener) {
      _addBTConnectivityListener(dispatch, getState);
    }

    if (range) {
      NetInfo.fetch().then((state) => {
        !state.isConnected &&
          dispatch({
            type: SET_INTERNET_PROMPT,
          });
      });

      dispatch({type: SET_APP_NET_STATE_BT, payload: false});
    } else {
      if (BlePic.hasInitialized()) {
        BlePic.checkState();
      } else {
        BlePic.init().then(() => BlePic.checkState());
        // .catch(error => handleError('Ble Init Error:', error, ERROR_MESSAGES.generic));
      }
    }

    dispatch({
      type: UPDATE_RANGE,
      payload: range,
    });
  };
};

export const updateRange = (range) => {
  return (dispatch, getState) => {
    const {isNetworkBT} = getState().app;
    // const { currentUser } = auth();

    if (range && isNetworkBT) {
      dispatch({
        type: DELETE_PROMPT,
      });

      NetInfo.fetch().then((state) => {
        !state.isConnected &&
          dispatch({
            type: SET_INTERNET_PROMPT,
          });
      });

      dispatch({
        type: DISCOVER_PEOPLE_SUCCESS,
        payload: null,
      });

      dispatch({type: SET_APP_NET_STATE_BT, payload: false});

      dispatch({
        type: INIT_LOADING,
        loadingType: LOADING_TYPES.halt,
        loadingMessage: 'Switching to Internet',
      });

      _stopTransmitingDataOverBT(dispatch);
    } else if (!range && !isNetworkBT) {
      dispatch({
        type: DELETE_PROMPT,
      });

      dispatch({
        type: DISCOVER_PEOPLE_SUCCESS,
        payload: null,
      });

      dispatch({type: SET_APP_NET_STATE_BT, payload: true});

      // geoFireRef.child(currentUser.uid).remove();

      if (BlePic.hasInitialized()) {
        BlePic.checkState();
      } else {
        BlePic.init().then(() => BlePic.checkState());
        // .catch(error => handleError('Ble Init Error:', error, ERROR_MESSAGES.generic));
      }
    }

    dispatch({
      type: UPDATE_RANGE,
      payload: range,
    });
  };
};

export const setVersionChecked = (res) => {
  return res ? {type: VERSION_CHECK_SUCCESS} : {type: VERSION_CHECK_FAIL};
};

export const fetchGeneralSettings = () => {
  return (dispatch) => {
    databaseRef.child('generalSettings').on(
      'value',
      (snapshot) => _applyGeneralSettings(dispatch, snapshot.val()),
      () => _applyGeneralSettings(dispatch),
    );
    NetInfo.fetch().then((state) => {
      !state.isConnected && _applyGeneralSettings(dispatch);
    });
  };
};

//  <-------------> HELPER METHODS <------------->

const _applyGeneralSettings = (dispatch, defaultSettings = null) => {
  const {currentUser} = auth();
  const userLocationRef = geoFireRef.child(currentUser.uid);
  const settings = defaultSettings || DEFAULT_GENERAL_SETTINGS;

  //LOCATION SETTING
  userLocationRef.onDisconnect().cancel();
  settings.removeLocationOnExit && userLocationRef.onDisconnect().remove();

  dispatch({type: SET_GENERAL_SETTINGS, payload: settings});
};

const _updateLocationData = ({longitude, latitude}, dispatch, getState) => {
  try {
    const {currentUser} = auth();
    const {isNetworkBT, ready} = getState().app;
    const {active} = getState().profile;

    const avatar =
      !!getState().profile.profileData &&
      !!getState().profile.profileData.avatar;

    dispatch({
      type: UPDATE_LOCATION,
      payload: {longitude, latitude},
    });

    const geoHash = GeoHash.encode(latitude, longitude, 10);

    const geoObj = {
      timestamp: Date.now(),
      avatar,
      g: geoHash,
      l: [latitude, longitude],
    };

    ready &&
      active &&
      !isNetworkBT &&
      geoFireRef.update({[currentUser.uid]: geoObj});
  } catch (error) {
    // handleError(error, null, ERROR_MESSAGES.generic);
  }
};

const _startAdvertisingBLE = (dispatch, reduxState) => {
  const {profileData, activeProfileType} = reduxState().profile;
  const data = getDataForBTTransmission(profileData, activeProfileType);
  _removeBTChatMessageReceiveListener();
  _stopBTAdvertiser();

  BlePic.setPeripheralName('MyBT');

  BlePic.addService(BLE_DATA_TRANSMIT_SERVICE, true);

  Object.keys(data).forEach((characteristic) => {
    BlePic.addCharacteristicToService(
      BLE_DATA_TRANSMIT_SERVICE,
      characteristic,
      1,
      2,
      data[characteristic],
    );
  });

  BlePic.addCharacteristicToService(
    BLE_DATA_TRANSMIT_SERVICE,
    BLE_DATA_TRANSMIT_CHARACTERISTICS.chat,
    Platform.OS === 'ios' ? 2 : 16,
    8,
  );

  BlePic.startAdvertising().then(() => {
    console.log('Advertising started');

    _addBTChatMessageReceiveListener(dispatch);
  });
  // .catch(error => handleError(error, null, ERROR_MESSAGES.generic));
};

const _addBTChatMessageReceiveListener = (dispatch) => {
  console.log('chat listener added');
  bluetoothChatMessageReceiveListener =
    blePicEmitter &&
    blePicEmitter.addListener('BLEManagerDidRecieveData', ({device, data}) => {
      let str = data;
      if (typeof data !== 'string') {
        str = asciiArrayToString(data);
      }

      dispatch(receiveMessageOverBT(str));
    });
};

const _removeBTChatMessageReceiveListener = () => {
  if (bluetoothChatMessageReceiveListener) {
    bluetoothChatMessageReceiveListener.remove();
    bluetoothChatMessageReceiveListener = null;
  }
};

const _stopBTAdvertiser = () => {
  _removeBTChatMessageReceiveListener();
  BlePic.stopAdvertising();
};

const _stopTransmitingDataOverBT = (dispatch) => {
  _stopBTAdvertiser();
  setTimeout(() => dispatch({type: STOP_LOADING}), 2000);
};

const _addInternetConnectivityListener = (dispatch, reduxState) => {
  console.log('Internet listener added');
  unsubInternetConnectivityListener = NetInfo.addEventListener(
    ({isConnected}) => {
      const {isNetworkBT, versionChecked} = reduxState().app;

      if (isConnected) {
        if (!versionChecked) {
          dispatch({type: HALT_APP_INTERFACE, payload: true});
          checkVersionAndUpdate(dispatch);
        }

        !isNetworkBT &&
          dispatch({
            type: DELETE_PROMPT,
          });
      } else {
        !isNetworkBT &&
          dispatch({
            type: SET_INTERNET_PROMPT,
          });
      }
    },
  );
};

// const _removeInternetConnectivityListener = params => {
//   if (unsubInternetConnectivityListener) {
//     unsubInternetConnectivityListener();
//     unsubInternetConnectivityListener = null;
//   }
// };

const _addBTConnectivityListener = (dispatch, reduxState) => {
  console.log('BT listener added');
  bluetoothConnectivityListener =
    blePicEmitter &&
    blePicEmitter.addListener('BLEManagerDidUpdateState', ({state}) => {
      const {isNetworkBT} = reduxState().app;

      if (isNetworkBT) {
        if (state === 'on') {
          _startAdvertisingBLE(dispatch, reduxState);
          dispatch({
            type: DELETE_PROMPT,
          });
        } else {
          _stopTransmitingDataOverBT(dispatch);
          dispatch({
            type: SET_BT_PROMPT,
          });
        }
      }
    });
};

// const _removeBTConnectivityListener = () => {
//   if (bluetoothConnectivityListener) {
//     bluetoothConnectivityListener.remove();
//     bluetoothConnectivityListener = null;
//   }
// };

const checkVersionAndUpdate = (dispatch) => {
  VersionCheck.needUpdate({
    depth: 2,
  }).then(async (res) => {
    if (res && res.isNeeded) {
      Alert.alert(
        ALERT_MESSAGES.UPDATE_APP.title,
        ALERT_MESSAGES.UPDATE_APP.message,
        [
          {
            text: 'Update',
            onPress: () => {
              checkVersionAndUpdate(dispatch);
              setTimeout(() => Linking.openURL(res.storeUrl), 600);
            },
          },
        ],
        {cancelable: false},
      );
    } else if (res && !res.isNeeded) {
      dispatch({type: HALT_APP_INTERFACE, payload: false});
    }
  });
};
