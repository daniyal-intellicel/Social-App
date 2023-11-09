import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import BlePic from 'rn-ble-pic';
// import messaging from '@react-native-firebase/messaging';
import functions from '@react-native-firebase/functions';

import {
  ActionTypes,
  ERROR_MESSAGES,
  BLE_MTU_BYTE_SIZE,
  BLE_DATA_TRANSMIT_SERVICE,
  BLE_DATA_TRANSMIT_CHARACTERISTICS,
} from '~constants';
import {getThreadId, parseBTChatMessage} from '../selectors/ChatSelectors';
import {handleError, stringToAsciiArray} from '~utils/services/GeneralServices';

const {
  CHAT_LOAD_MESSAGES_ERROR,
  CHAT_LOAD_MESSAGES_SUCCESS,
  // CHAT_MESSAGE_ERROR,
  CHAT_MESSAGE_LOADING,
  CHAT_MESSAGE_SUCCESS,
  CHAT_MESSAGE_UPDATE,
  STOP_LOADING,
  BT_CHAT_MESSAGE_SUCCESS,
  // SET_THREADS,
} = ActionTypes;

const FIREBASE_REF_USERS = database().ref('users');
const FIREBASE_REF_THREADS = database().ref('messageThreads');

export const receiveMessageOverBT = (data) => {
  return (dispatch, getState) => {
    const currentUser = auth().currentUser;
    const {activeProfileType} = getState().profile;
    const {discoveredPeople} = getState().discover;

    const {senderUid, senderProfileType, message} = parseBTChatMessage(data);

    const threadId = getThreadId({
      receiverUid: currentUser.uid,
      receiverProfileType: activeProfileType,
      deviceId: discoveredPeople[senderUid].deviceId,
      senderUid,
      senderProfileType,
    });

    let chatMessage = {
      text: message,
      senderUid,
    };

    const receiverData = {
      ...discoveredPeople[senderUid][`${senderProfileType}Data`],
      deviceId: discoveredPeople[senderUid].deviceId,
      uid: senderUid,
      activeProfileType: senderProfileType,
    };

    dispatch({
      type: BT_CHAT_MESSAGE_SUCCESS,
      threadId,
      message: chatMessage,
      receiver: receiverData,
    });

    // FIREBASE_REF_THREADS.child(`${threadId}/${messageId}`).set(chatMessage);

    // FIREBASE_REF_USERS.child(
    //   `${currentUser.uid}/${activeProfileType}Data/threads/${threadId}`,
    // ).update({
    //   receivedMsgId: messageId,
    //   read: false,
    //   createdAt: messageId,
    // });

    // FIREBASE_REF_USERS.child(
    //   `${senderUid}/${senderProfileType}Data/threads/${threadId}`,
    // ).update({
    //   sentMsgId: messageId,
    //   createdAt: messageId,
    // });
  };
};

export const sendBTMessage = (message, senderProfileType, receiver) => {
  return (dispatch) => {
    let currentUser = auth().currentUser;
    const messageId = Date.now();

    const messageData = `${currentUser.uid}-${senderProfileType}-${messageId}-${message}`;

    BlePic.write(
      receiver.deviceId,
      BLE_DATA_TRANSMIT_SERVICE,
      BLE_DATA_TRANSMIT_CHARACTERISTICS.chat,
      stringToAsciiArray(messageData),
      BLE_MTU_BYTE_SIZE,
    )
      .then(() => {
        const threadId = getThreadId({
          senderUid: currentUser.uid,
          receiverUid: receiver.uid,
          senderProfileType,
          receiverProfileType: receiver.activeProfileType,
        });

        let chatMessage = {
          text: message,
          senderUid: currentUser.uid,
        };

        dispatch({
          type: BT_CHAT_MESSAGE_SUCCESS,
          threadId,
          message: chatMessage,
          receiver,
        });

        // dispatch(
        //   sendMessage(
        //     message,
        //     receiverUid,
        //     senderProfileType,
        //     receiverProfileType,
        //     messageId,
        //   ),
        // );
      })
      .catch((error) => {
        handleError(error, null, ERROR_MESSAGES.messageSend);
      });
  };
};

export const sendMessage = (
  message,
  receiverUid,
  senderProfileType,
  receiverProfileType,
  messageId = Date.now(),
) => {
  return (dispatch) => {
    dispatch(chatMessageLoading());

    let currentUser = auth().currentUser;

    const threadId = getThreadId({
      senderUid: currentUser.uid,
      receiverUid,
      senderProfileType,
      receiverProfileType,
    });

    let chatMessage = {
      text: message,
      senderUid: currentUser.uid,
    };

    FIREBASE_REF_THREADS.child(`${threadId}/${messageId}`)
      .set(chatMessage)
      .then(() => {
        const params = {...chatMessage, receiverUid};

        functions()
          .httpsCallable('sendNotification')(params)
          .then((response) => {
            // console.log('Function called', response);
          });
      });

    FIREBASE_REF_USERS.child(
      `${receiverUid}/${receiverProfileType}Data/threads/${threadId}`,
    ).update({
      receivedMsgId: messageId,
      read: false,
      createdAt: messageId,
    });

    FIREBASE_REF_USERS.child(
      `${currentUser.uid}/${senderProfileType}Data/threads/${threadId}`,
    ).update({
      sentMsgId: messageId,
      createdAt: messageId,
    });

    dispatch(chatMessageSuccess());
  };
};

export const updateMessage = (text) => {
  return (dispatch) => {
    dispatch(chatUpdateMessage(text));
  };
};

export const loadMessages = (senderProfileType, receiver, initLoad = false) => {
  let currentUser = auth().currentUser;
  const threadId = getThreadId({
    senderUid: currentUser.uid,
    receiverUid: receiver.uid,
    senderProfileType,
    receiverProfileType: receiver.activeProfileType,
  });

  return (dispatch) => {
    FIREBASE_REF_THREADS.child(threadId)
      // .limitToLast(FIREBASE_REF_MESSAGES_LIMIT)
      .on(
        'value',
        (snapshot) => {
          // dispatch({
          //   type: SET_THREADS,
          //   threads: {
          //     [threadId]: {
          //       receiverData: {
          //         ...receiver,
          //         uid: receiver.uid,
          //         activeProfileType: receiver.activeProfileType,
          //       },
          //     },
          //   },
          // });

          FIREBASE_REF_USERS.child(
            `${currentUser.uid}/${senderProfileType}Data/threads/${threadId}`,
          ).once('value', (dataSnapshot) => {
            dataSnapshot.exists() &&
              dataSnapshot.ref.update({
                read: true,
              });
          });

          dispatch(loadMessagesSuccess(snapshot.val(), threadId));

          initLoad && dispatch({type: STOP_LOADING});
        },
        (errorObject) => {
          dispatch(loadMessagesError(errorObject.message, threadId));
        },
      );
  };
};

const chatMessageLoading = () => ({
  type: CHAT_MESSAGE_LOADING,
});

const chatMessageSuccess = () => ({
  type: CHAT_MESSAGE_SUCCESS,
});

// const chatMessageError = error => ({
//   type: CHAT_MESSAGE_ERROR,
//   error,
// });

const chatUpdateMessage = (text) => ({
  type: CHAT_MESSAGE_UPDATE,
  text,
});

const loadMessagesSuccess = (messages, threadId) => ({
  type: CHAT_LOAD_MESSAGES_SUCCESS,
  messages,
  threadId,
});

const loadMessagesError = (error, threadId) => ({
  type: CHAT_LOAD_MESSAGES_ERROR,
  error,
  threadId,
});
