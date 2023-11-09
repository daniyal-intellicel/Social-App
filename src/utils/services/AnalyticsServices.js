import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import _ from 'lodash';

import {APP_PROFILE_TYPES} from '~constants';

const databaseRef = database().ref();

export const analyticsUpdateOpened = async (type = APP_PROFILE_TYPES.user) => {
  const {currentUser} = auth();

  databaseRef
    .child(`analytics/${type}Analytics/${currentUser.uid}/opened`)
    .push(Date.now());
};

export const analyticsUpdateViewed = async (user) => {
  databaseRef
    .child(`analytics/${user.activeProfileType}Analytics/${user.uid}/viewed`)
    .push(Date.now());
};

export const analyticsUpdateSearched = async (
  prevPeopleList,
  newPeopleList,
  type = APP_PROFILE_TYPES.user,
) => {
  newPeopleList.forEach((item) => {
    !_.find(prevPeopleList, {uid: item.uid}) &&
      databaseRef
        .child(
          `analytics/${item.activeProfileType}Analytics/${item.uid}/searched`,
        )
        .push(Date.now());
  });
};
