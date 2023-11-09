import _ from 'lodash';

import {ActionTypes} from '~constants';

const {
  CHAT_LOAD_MESSAGES_ERROR,
  CHAT_LOAD_MESSAGES_SUCCESS,
  CHAT_MESSAGE_ERROR,
  CHAT_MESSAGE_LOADING,
  CHAT_MESSAGE_SUCCESS,
  CHAT_MESSAGE_UPDATE,
  SET_THREADS,
  SET_UNREAD_THREADS,
  BT_CHAT_MESSAGE_SUCCESS,
} = ActionTypes;

const INITIAL_STATE = {
  sending: false,
  sendingError: null,
  message: '',
  threads: {},
  btThreads: {},
  unreadThreads: {},
  loadMessagesError: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHAT_MESSAGE_LOADING:
      return {...state, sending: true, sendingError: null};
    case CHAT_MESSAGE_ERROR:
      return {...state, sending: false, sendingError: action.error};
    case CHAT_MESSAGE_SUCCESS:
      return {...state, sending: false, sendingError: null, message: ''};
    case CHAT_MESSAGE_UPDATE:
      return {
        ...state,
        sending: false,
        message: action.text,
        sendingError: null,
      };

    case BT_CHAT_MESSAGE_SUCCESS: {
      let threads = JSON.parse(JSON.stringify(state.btThreads));

      if (!threads[action.threadId]) {
        threads[action.threadId] = {
          messages: {},
          receiverData: {
            ...action.receiver,
          },
        };
      }

      threads[action.threadId].messages[Date.now().toString()] = action.message;

      return {...state, btThreads: {...threads}, loadMessagesError: null};
    }

    case CHAT_LOAD_MESSAGES_SUCCESS: {
      let threads = JSON.parse(JSON.stringify(state.threads));
      _.merge(threads, {[action.threadId]: {messages: action.messages}});

      return {...state, threads: {...threads}, loadMessagesError: null};
    }

    case CHAT_LOAD_MESSAGES_ERROR:
      return {
        ...state,
        threads: {...state.threads, [action.threadId]: null},
        loadMessagesError: action.error,
      };
    case SET_THREADS: {
      let threads = JSON.parse(JSON.stringify(state.threads));
      _.merge(threads, action.threads);

      return {...state, threads: {...threads}};
    }

    case SET_UNREAD_THREADS:
      return {...state, unreadThreads: action.payload};
    default:
      return state;
  }
};
