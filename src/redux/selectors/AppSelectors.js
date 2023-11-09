import auth from '@react-native-firebase/auth';

import {Platform} from 'react-native';

import {
  BLE_DATA_TRANSMIT_CHARACTERISTICS as BTC,
  APP_PROFILE_TYPES,
} from '~constants';

export const getDataForBTTransmission = (
  profileData,
  activeProfileType = APP_PROFILE_TYPES.user,
) => {
  const {currentUser} = auth();

  const data = {};

  data[BTC.uid1] = currentUser.uid.substring(0, 14);
  data[BTC.uid2] = currentUser.uid.substring(14);
  data[BTC.os] = Platform.OS;
  data[BTC.name] = profileData.name;
  data[BTC.activeProfileType] = activeProfileType;

  Object.keys(profileData.socialProfiles).forEach((key) => {
    const {active, userId, verified} = profileData.socialProfiles[key];

    if (active && userId && BTC[key]) {
      data[BTC[key]] = `${verified ? 1 : 0}-${userId}`;
    }
  });

  return data;
};
