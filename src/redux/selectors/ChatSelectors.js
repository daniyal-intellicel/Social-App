import auth from '@react-native-firebase/auth';

import _ from 'lodash';

import {APP_PROFILE_TYPES, PROFILE_TYPE_SYMBOLS} from '~constants';

export const getChatItems = (data) => {
  return data
    ? _.orderBy(
        Object.keys(data).map((key) => ({key, ...data[key]})),
        ['key'],
        ['desc'],
      )
    : [];
};

export const getThreadId = ({
  senderUid,
  receiverUid,
  senderProfileType,
  receiverProfileType,
}) => {
  let threadId = '';

  if (senderProfileType === APP_PROFILE_TYPES.product) {
    threadId = receiverUid + PROFILE_TYPE_SYMBOLS.product + senderUid;
  } else if (receiverProfileType === APP_PROFILE_TYPES.product) {
    threadId = senderUid + PROFILE_TYPE_SYMBOLS.product + receiverUid;
  } else if (senderUid > receiverUid) {
    threadId = receiverUid + PROFILE_TYPE_SYMBOLS.user + senderUid;
  } else {
    threadId = senderUid + PROFILE_TYPE_SYMBOLS.user + receiverUid;
  }

  return threadId;
};

export const parseThreadId = (threadId) => {
  const {currentUser} = auth();

  const splitOn = threadId.includes(PROFILE_TYPE_SYMBOLS.product)
    ? PROFILE_TYPE_SYMBOLS.product
    : PROFILE_TYPE_SYMBOLS.user;

  let UIDs = threadId.split(splitOn);

  const receiverUid = UIDs.filter((id) => id !== currentUser.uid)[0];

  const receiverProfileType =
    threadId.includes(PROFILE_TYPE_SYMBOLS.product) &&
    UIDs[0] === currentUser.uid
      ? APP_PROFILE_TYPES.product
      : APP_PROFILE_TYPES.user;

  return {receiverUid, receiverProfileType};
};

export const getThreadItems = (threads) => {
  const threadItems = [];

  Object.keys(threads).forEach((threadId) => {
    if (threads[threadId].receiverData) {
      threadItems.push({threadId, ...threads[threadId]});
    }
  });

  return _.orderBy(threadItems, ['createdAt'], ['desc']);
};

export const parseBTChatMessage = (data) => {
  const splittedData = data.split('-');

  const senderUid = splittedData[0];
  const senderProfileType = splittedData[1];
  const messageId = splittedData[2];
  const message = splittedData[3];

  return {senderUid, messageId, message, senderProfileType};
};
