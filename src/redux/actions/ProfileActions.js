import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import BlePic from 'rn-ble-pic';
import _ from 'lodash';

import {
  ActionTypes,
  APP_PROFILE_TYPES,
  PROFILE_TYPE_SYMBOLS,
  ERROR_MESSAGES,
  // PROMPT_CATEGORIES,
} from '~constants';
import {parseThreadId} from '../selectors/ChatSelectors';
import {handleError} from '~utils/services/GeneralServices';
import {analyticsUpdateOpened} from '~utils/services/AnalyticsServices';
import {getBlockedList} from '../selectors/ProfileSelectors';

const {
  SET_PROFILE_DATA,
  SET_ACTIVE_PROFIE_TYPE,
  SET_APP_READY,
  CONTACTS_FETCH_SUCCESS,
  SET_THREADS,
  SET_UNREAD_THREADS,
  // SET_PROMPT,
} = ActionTypes;

const databaseRef = database().ref();
let shouldCheckBTState = false;

export const updateName = (name) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    const {activeProfileType} = getState().profile;

    shouldCheckBTState = true;

    databaseRef
      .child(`users/${currentUser.uid}/${activeProfileType}Data`)
      .update({
        name,
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });
  };
};

export const updateStatus = (status) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    const {activeProfileType} = getState().profile;

    shouldCheckBTState = true;

    databaseRef
      .child(`users/${currentUser.uid}/${activeProfileType}Data`)
      .update({
        status,
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });
  };
};

export const updateSocialProfiles = (socialProfiles) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    const {activeProfileType} = getState().profile;

    shouldCheckBTState = true;

    databaseRef
      .child(`users/${currentUser.uid}/${activeProfileType}Data`)
      .update({
        socialProfiles,
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });
  };
};

export const updateAvatar = (imagePath, thumbPath) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    const {activeProfileType} = getState().profile;

    shouldCheckBTState = true;
    const uploadImage = async (name, path) => {
      const imageRef = storage().ref(
        `users/${currentUser.uid}/${activeProfileType}Data/${name}.jpg`,
      );
      await imageRef.putFile(path).catch((error) => {
        throw error;
      });
      const url = await imageRef.getDownloadURL().catch((error) => {
        throw error;
      });
      return url;
    };

    uploadImage('avatar', imagePath)
      .then((res) => {
        databaseRef
          .child(`users/${currentUser.uid}/${activeProfileType}Data`)
          .update({
            avatar: res,
          });
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });

    uploadImage('thumbnail', thumbPath)
      .then((res) => {
        databaseRef
          .child(`users/${currentUser.uid}/${activeProfileType}Data`)
          .update({
            thumbnail: res,
          })
          .then(() => {
            dispatch(fetchProfile());
          });
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });

    // storage()
    //   .ref(`users/${currentUser.uid}/${activeProfileType}Data/avatar.jpg`)
    //   .putFile(imagePath)
    //   .then((snapshot) => {
    //     databaseRef
    //       .child(`users/${currentUser.uid}/${activeProfileType}Data`)
    //       .update({
    //         avatar: snapshot.metadata.fullPath,
    //       })
    //       .then((res) => {
    //         console.log('res', res);
    //         dispatch(fetchProfile());
    //       });
    //   })
    //   .catch((error) => {
    //     handleError(error, null, ERROR_MESSAGES.updateProfile);
    //   });

    // storage()
    //   .ref(`users/${currentUser.uid}/${activeProfileType}Data/thumbnail.jpg`)
    //   .putFile(thumbPath)
    //   .then((snapshot) => {
    //     databaseRef
    //       .child(`users/${currentUser.uid}/${activeProfileType}Data`)
    //       .update({
    //         thumbnail: snapshot.metadata.fullPath,
    //       })
    //       .then((res) => {
    //         dispatch(fetchProfile());
    //       });
    //   })
    //   .catch((error) => {
    //     handleError(error, null, ERROR_MESSAGES.updateProfile);
    //   });
  };
};

export const addToContacts = (cuid) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    const {activeProfileType} = getState().profile;

    shouldCheckBTState = true;

    databaseRef
      .child(`users/${currentUser.uid}/${activeProfileType}Data/contacts`)
      .update({
        [cuid]: true,
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });
  };
};

export const deleteFromContacts = (cuid) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    const {activeProfileType} = getState().profile;

    shouldCheckBTState = true;

    databaseRef
      .child(
        `users/${currentUser.uid}/${activeProfileType}Data/contacts/${cuid}`,
      )
      .remove()
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });
  };
};

export const switchProfile = (profileType) => {
  return (dispatch, getState) => {
    const {currentUser} = auth();
    shouldCheckBTState = true;

    databaseRef
      .child(`users/${currentUser.uid}`)
      .update({activeProfileType: profileType})
      .then((value) => {
        dispatch({
          type: SET_ACTIVE_PROFIE_TYPE,
          payload: profileType,
        });
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.updateProfile);
      });
  };
};

export const fetchProfile = () => {
  // const value = AsyncStorage.removeItem("profile");
  // auth()
  // .signOut()
  // .then(() => console.log('User signed out!'));
  return (dispatch, getState) => {
    const {currentUser} = auth();

    try {
      NetInfo.fetch().then((state) => {
        databaseRef.child(`users/${currentUser.uid}`).keepSynced(true);

        databaseRef
          .child(`users/${currentUser.uid}`)
          .on('value', (snapshot) => {
            _handleProfileDataChange(dispatch, snapshot.val(), getState);
          });

        if (!state.isConnected) {
          _getProfileFromAsyncStorage().then((value) => {
            _handleProfileDataChange(dispatch, value, getState);
          });
        }
      });
    } catch (error) {
      handleError(error, null, ERROR_MESSAGES.updateProfile);
    }
  };
};

//  <-------------> HELPER METHODS <------------->

const _handleProfileDataChange = (dispatch, profileData, getState) => {
  const {ready, isNetworkBT} = getState().app;
  const {unreadThreads: prevUnreadThreads} = getState().chat;
  const {activeProfileType, update, active, blocked, blockedBy} = profileData;

  let data = profileData[`${activeProfileType}Data`];

  dispatch({
    type: SET_ACTIVE_PROFIE_TYPE,
    payload: profileData.activeProfileType,
  });
  dispatch({
    type: SET_PROFILE_DATA,
    profileData: data,
    update,
    active,
    blocked,
    blockedBy,
  });

  _setContactsList(dispatch, getState, data.contacts);
  _setMessageThreads(dispatch, data.threads, prevUnreadThreads);

  if (ready) {
    _saveProfileToAsyncStorage(profileData).catch((error) => {
      throw error;
    });

    isNetworkBT && shouldCheckBTState && BlePic.checkState();
    shouldCheckBTState = false;
  } else {
    dispatch({type: SET_APP_READY, payload: true});
    analyticsUpdateOpened(profileData.activeProfileType);
  }
};

const _setContactsList = async (dispatch, getState, contactsList) => {
  const {blocked, blockedBy} = getState().profile;

  let contactsUIDList = contactsList ? Object.keys(contactsList) : [];

  const blockedList = getBlockedList(blocked, blockedBy);
  contactsUIDList = _.filter(contactsUIDList, (cuid) => {
    let uid = cuid.slice(1);
    return !_.includes(blockedList, uid);
  });

  const contactsDataList = [];

  for (const cuid of contactsUIDList) {
    let profileType = cuid[0];
    let uid = cuid.slice(1);

    profileType =
      profileType === PROFILE_TYPE_SYMBOLS.product
        ? APP_PROFILE_TYPES.product
        : APP_PROFILE_TYPES.user;

    const contactProfileDataSS = await databaseRef
      .child(`users/${uid}/${profileType}Data`)
      .once('value');

    const contactProfileData = contactProfileDataSS.val();

    contactProfileData.activeProfileType = profileType;
    contactProfileData.uid = uid;

    contactsDataList.push(contactProfileData);
  }

  dispatch({
    type: CONTACTS_FETCH_SUCCESS,
    payload: contactsDataList,
  });
};

const _setMessageThreads = async (dispatch, threads, prevUnreadThreads) => {
  const threadIdList = threads ? Object.keys(threads) : [];

  let threadsData = {};

  for (const threadId of threadIdList) {
    const {receiverUid, receiverProfileType} = parseThreadId(threadId);

    const receiverDataSnapshot = await databaseRef
      .child(`users/${receiverUid}/${receiverProfileType}Data`)
      .once('value');

    threadsData[threadId] = {
      ...threads[threadId],
      receiverData: {
        ...receiverDataSnapshot.val(),
        uid: receiverUid,
        activeProfileType: receiverProfileType,
      },
    };
  }

  const currentUnreadThreads = _getUnreadThreads(threadsData);

  /**
  |--------------------------------------------------
  | New Messages Count
  |--------------------------------------------------
  */
  // let newMsgCount = 0;

  // for (let [threadId, value] of Object.entries(currentUnreadThreads)) {
  //   if (
  //     (prevUnreadThreads[threadId] &&
  //       prevUnreadThreads[threadId].receivedMsgId !== value.receivedMsgId) ||
  //     !prevUnreadThreads[threadId]
  //   ) {
  //     newMsgCount++;
  //   }
  // }

  // if (newMsgCount) {
  //   dispatch({
  //     type: SET_PROMPT,
  //     message: `${newMsgCount} new message${newMsgCount > 1 ? 's' : ''} received`,
  //     promptType: '',
  //     category: PROMPT_CATEGORIES.toast,
  //   });
  // }

  dispatch({type: SET_THREADS, threads: threadsData});

  dispatch({type: SET_UNREAD_THREADS, payload: currentUnreadThreads});
};

const _getUnreadThreads = (threads) => {
  let unreadThreads = {};

  for (let [threadId, value] of Object.entries(threads)) {
    if (value.receivedMsgId && !value.read) {
      unreadThreads[threadId] = {...value};
    }
  }

  return unreadThreads;
};

const _getProfileFromAsyncStorage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const value = await AsyncStorage.getItem('profile');
      if (value !== null) {
        resolve(JSON.parse(value));
      } else {
        handleError(
          ERROR_MESSAGES.updateProfile,
          null,
          ERROR_MESSAGES.updateProfile,
        );
      }
    } catch (error) {
      reject(error);
    }
  });
};

const _saveProfileToAsyncStorage = (profile) => {
  return new Promise(async (resolve, reject) => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
