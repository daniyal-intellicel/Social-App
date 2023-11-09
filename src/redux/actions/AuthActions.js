import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import {
  ActionTypes,
  SOCIAL_PROFILES_PRODUCT_INIT,
  SOCIAL_PROFILES_USER_INIT,
  APP_PROFILE_TYPES,
  ANALYTICS_DATA_INIT,
} from '~constants';
// import {handleError} from '~utils/services/GeneralServices';

const {INIT_API_CALL, TERMINATE_API_CALL} = ActionTypes;

const databaseRef = database().ref();

export const signInAnonymously = ({name}) => {
  return async (dispatch) => {
    dispatch({type: INIT_API_CALL});

    const userData = {
      active: true,
      activeProfileType: APP_PROFILE_TYPES.user,
      update: true,
      productData: {
        name: 'My Product',
        status: 'Online',
        socialProfiles: SOCIAL_PROFILES_PRODUCT_INIT,
      },
      userData: {
        name,
        status: 'Online',
        socialProfiles: SOCIAL_PROFILES_USER_INIT,
      },
    };

    try {
      const credential = await auth().signInAnonymously();
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const notifyToken = await messaging().getToken();
        userData.notifyToken = notifyToken;
      }

      if (credential) {
        databaseRef.child(`users/${credential.user.uid}`).set(userData);
        await AsyncStorage.setItem('profile', JSON.stringify(userData));

        databaseRef
          .child(`analytics/userAnalytics/${credential.user.uid}`)
          .set(ANALYTICS_DATA_INIT);
      }

      dispatch({type: TERMINATE_API_CALL});

      messaging().onTokenRefresh((token) => {
        databaseRef
          .child(`users/${credential.user.uid}`)
          .update({notifyToken: token});
      });
    } catch (error) {
      // handleError(error);

      dispatch({
        type: TERMINATE_API_CALL,
      });
    }
  };
};
