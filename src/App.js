import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
  Linking,
  AppState,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {StripeProvider} from '@stripe/stripe-react-native';
import auth from '@react-native-firebase/auth';
import {Provider as ReduxProvider} from 'react-redux';
import {NativeBaseProvider} from 'native-base';
import {createStore, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import GPSState from 'react-native-gps-state';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import VersionCheck from 'react-native-version-check';
import appsFlyer from 'react-native-appsflyer';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import {AppearanceProvider} from 'react-native-appearance';

import {ThemeProvider} from '~styles/ThemeProvider';
import reducers from '~redux/reducers';
import {
  // updateLocation,
  fetchProfile,
  setGPSListener,
  setVersionChecked,
  fetchGeneralSettings,
  saveNotifyToken,
} from '~redux/actions';
import {ALERT_MESSAGES} from '~constants';
import AuthNavigator from './routes/AuthNavigator';
import AppRootNavigator from './routes/AppRootNavigator';
import {requestNotificationPermission} from '~utils/services/GeneralServices';
import Root from '~components/Root';

let STORE = createStore(reducers, {}, applyMiddleware(ReduxThunk));
let USER_DATA_SUBSCRIPTION = null;
let USER_ACTIVE_SUBSCRIPTION = null;
let firebaseSignedIn = false;
let fetchProfileCalled = false;
let fetchGeneralSettingsCalled = false;
let setGPSListenerCalled = false;
let LOCATION_ALERT = false;
let LOCATION_INTERVAL = null;
let NOTIFY_SUB = null;

const appsflyerOptions = {
  devKey: 'je9X2Bt76xwEsQSjUTwn4X',
  isDebug: true,
  onInstallConversionData: true,
};

if (Platform.OS === 'ios') {
  appsflyerOptions.appId = '1489813229';
  appsflyerOptions.timeToWaitForATTUserAuthorization = 10;
}

let onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
  (data) => {
    // eslint-disable-next-line no-console
    console.log('GCD');
    // eslint-disable-next-line no-console
    console.log(data);
  },
);

let onAppOpenAttributionCanceller = appsFlyer.onAppOpenAttribution((data) => {
  // eslint-disable-next-line no-console
  console.log('OAOA');
  // eslint-disable-next-line no-console
  console.log(data);
});

appsFlyer.initSdk(
  appsflyerOptions,
  (result) => {
    // console.log(result);
  },
  (error) => {
    console.error(error);
  },
);

export default class App extends Component {
  constructor(props) {
    super(props);

    // database().ref().keepSynced(true);

    this.unsubscribe = null;

    this.state = {
      checkedAuth: false,
      userDataFetched: false,
      appState: AppState.currentState,
    };
  }

  extras = async () => {
    database().ref('users').keepSynced();
  };

  componentDidMount() {
    setTimeout(() => SplashScreen.hide(), 500);
    if (Platform.OS === 'ios') {
      // appsFlyer.trackAppLaunch();
    }

    // AppState.addEventListener('change', this._handleAppStateChange);
    this.versionCheckAndInit();
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this._handleAppStateChange);
    this._appsFlyerUnmount();

    LOCATION_INTERVAL && clearInterval(LOCATION_INTERVAL);
    GPSState.removeListener();
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    USER_DATA_SUBSCRIPTION = null;
    USER_ACTIVE_SUBSCRIPTION = null;
    firebaseSignedIn = false;
    fetchGeneralSettingsCalled = false;
    fetchProfileCalled = false;
    setGPSListenerCalled = false;
    LOCATION_ALERT = false;
    LOCATION_INTERVAL = null;
    NOTIFY_SUB;
  }

  versionCheckAndInit = () => {
    VersionCheck.needUpdate({
      depth: 2,
    }).then((res) => {
      if (res && res.isNeeded) {
        Alert.alert(
          ALERT_MESSAGES.UPDATE_APP.title,
          ALERT_MESSAGES.UPDATE_APP.message,
          [
            {
              text: 'Update',
              onPress: () => {
                this.versionCheckAndInit();
                setTimeout(() => Linking.openURL(res.storeUrl), 350);
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        STORE.dispatch(setVersionChecked(res));

        if (Platform.OS === 'android') {
          setTimeout(this.requestLocationPermission, 350);
        } else {
          GPSState.addListener(this.gpsStatusHandler);
          GPSState.getStatus().then(this.gpsStatusHandler);
        }
      }
    });
  };

  _appsFlyerUnmount = () => {
    // Optionaly remove listeners for deep link data if you no longer need them
    if (onInstallConversionDataCanceller) {
      onInstallConversionDataCanceller();
      // console.log('unregister onInstallConversionDataCanceller');
      onInstallConversionDataCanceller = null;
    }

    if (onAppOpenAttributionCanceller) {
      onAppOpenAttributionCanceller();
      // console.log('unregister onAppOpenAttributionCanceller');
      onAppOpenAttributionCanceller = null;
    }
  };

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (Platform.OS === 'ios') {
        // appsFlyer.trackAppLaunch();
      }
    }

    this.setState({appState: nextAppState});
  };

  locationAlert = () => {
    GPSState.getStatus().then((status) => {
      if (!LOCATION_ALERT && status === 0) {
        // LOCATION_ALERT = true;
        clearInterval(LOCATION_INTERVAL);
        GPSState.requestAuthorization(GPSState.AUTHORIZED_ALWAYS);
      } else if (!LOCATION_ALERT && status === 2) {
        LOCATION_ALERT = true;
        Alert.alert(
          'Location Required',
          'Hey! we need your location to help you find people around you.',
          [
            {
              text: 'Go To Settings',
              onPress: () => {
                LOCATION_ALERT = false;
                Linking.openURL('app-settings://');
                // GPSState.openLocationSettings();
              },
            },
          ],
          {cancelable: false},
        );
      }
    });
  };

  gpsStatusHandler = (status) => {
    LOCATION_ALERT = false;

    // if (status === 2) {
    //   this.locationAlert();
    //   LOCATION_INTERVAL = setInterval(this.locationAlert, 5000);
    // } else if (status === 2 || status === 3 || status === 4) {
    //   LOCATION_INTERVAL && clearInterval(LOCATION_INTERVAL);
    //   this.firebaseAuth();
    // } else
    if (status === 0) {
      LOCATION_INTERVAL && clearInterval(LOCATION_INTERVAL);
      GPSState.requestAuthorization(GPSState.AUTHORIZED_ALWAYS);
      // navigator.geolocation.requestAuthorization();
    } else {
      LOCATION_INTERVAL && clearInterval(LOCATION_INTERVAL);
      this.firebaseAuth();
    }
  };

  firebaseAuth = () => {
    GPSState.removeListener();
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        firebaseSignedIn || this.essentials();
        firebaseSignedIn = true;
      } else {
        this.setState({checkedAuth: true, userDataFetched: false});
        setTimeout(() => SplashScreen.hide(), 1000);
      }
    });
  };

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'BeApp Access Location Permission',
          message: 'BeApp needs access to your location to run.',
          buttonPositive: 'OK',
        },
      );

      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({})
        .then((GPSStatus) => {
          if (
            granted === PermissionsAndroid.RESULTS.GRANTED &&
            (GPSStatus === 'already-enabled' || GPSStatus === 'enabled')
          ) {
            this.firebaseAuth();
          } else {
            this.requestLocationPermission();
          }
        })
        .catch(() => {
          this.requestLocationPermission();
        });
    } catch (err) {
      console.warn(err);
    }
  };

  essentials = () => {
    USER_DATA_SUBSCRIPTION = STORE.subscribe(this.checkUserDataSaved);
    !fetchGeneralSettingsCalled && STORE.dispatch(fetchGeneralSettings());
    !setGPSListenerCalled && STORE.dispatch(setGPSListener());
    !fetchProfileCalled && STORE.dispatch(fetchProfile());
  };

  checkUserDataSaved = () => {
    if (STORE.getState().app.generalSettings) {
      fetchGeneralSettingsCalled = true;
    }

    if (STORE.getState().app.location) {
      setGPSListenerCalled = true;
    }

    if (STORE.getState().app.ready) {
      fetchProfileCalled = true;
    }

    if (
      STORE.getState().app.location &&
      STORE.getState().app.generalSettings &&
      STORE.getState().app.ready
    ) {
      USER_DATA_SUBSCRIPTION();

      if (STORE.getState().profile.active) {
        USER_ACTIVE_SUBSCRIPTION = STORE.subscribe(this.checkUserActiveState);

        this.setState({checkedAuth: true, userDataFetched: true});

        this.notificationProcess();

        setTimeout(() => SplashScreen.hide(), 500);
      } else {
        auth().signOut();
      }
    }
  };

  notificationProcess = async () => {
    const notifyPermit = await requestNotificationPermission();

    if (notifyPermit) {
      const notifyToken = await messaging().getToken();

      // console.log('Token:', notifyToken);

      STORE.dispatch(saveNotifyToken(notifyToken));

      // messaging().onMessage(async (remoteMessage) => {
      //   console.log('Message handled in the foreground!', remoteMessage);
      // });

      // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      //   console.log('Message handled in the background!', remoteMessage);
      // });
    }
  };

  checkUserActiveState = () => {
    if (!STORE.getState().profile.active) {
      USER_ACTIVE_SUBSCRIPTION();
      auth().signOut();
      // eslint-disable-next-line no-alert
      alert('Your account has been disabled, contact info@beapp.co');
    }
  };

  render() {
    // const Wrapper = Platform.OS === 'ios' ? React.Fragment : RootSiblingParent;
    const Wrapper = RootSiblingParent;
    return this.state.checkedAuth ? (
      <NativeBaseProvider>
        <ReduxProvider store={STORE}>
          <StripeProvider
            publishableKey="pk_test_a5dAA49ReFytJUCsXOTqVULg00TpH0UOUT"
            urlScheme="beapp.co" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.beapp" // required for Apple Pay
          >
            <AppearanceProvider>
              <ThemeProvider>
                <Wrapper>
                  <SafeAreaProvider>
                    <Root>
                      <NavigationContainer>
                        {this.state.userDataFetched ? (
                          <AppRootNavigator />
                        ) : (
                          <AuthNavigator />
                        )}
                      </NavigationContainer>
                    </Root>
                  </SafeAreaProvider>
                </Wrapper>
              </ThemeProvider>
            </AppearanceProvider>
          </StripeProvider>
        </ReduxProvider>
      </NativeBaseProvider>
    ) : null;
  }
}
