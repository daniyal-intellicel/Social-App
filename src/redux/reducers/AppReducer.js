import {
  ActionTypes,
  ERROR_MESSAGES,
  LOADING_TYPES,
  PROMPT_CATEGORIES,
} from '~constants';

const {
  INIT_API_CALL,
  TERMINATE_API_CALL,
  UPDATE_LOCATION,
  UPDATE_RANGE,
  SET_APP_NET_STATE_BT,
  SET_INTERNET_PROMPT,
  SET_BT_PROMPT,
  DELETE_PROMPT,
  INIT_LOADING,
  STOP_LOADING,
  HALT_APP_INTERFACE,
  SET_APP_READY,
  SET_PROMPT,
  VERSION_CHECK_FAIL,
  VERSION_CHECK_SUCCESS,
  SET_GENERAL_SETTINGS,
} = ActionTypes;

const INITIAL_STATE = {
  ready: false,
  loading: false,
  loadingType: LOADING_TYPES.flow,
  loadingMessage: '',
  location: null,
  searchRadius: 1,
  isNetworkBT: false,
  prompt: null,
  haltAppInterface: false,
  versionChecked: false,
  generalSettings: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_APP_READY:
      return {...state, ready: action.payload};
    case INIT_LOADING:
      return {
        ...state,
        loading: true,
        loadingType: action.loadingType || LOADING_TYPES.flow,
        loadingMessage: action.loadingMessage || '',
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
        loadingMessage: '',
        loadingType: LOADING_TYPES.flow,
      };
    case INIT_API_CALL:
      return {
        ...state,
        loading: true,
        loadingType: action.loadingType || LOADING_TYPES.flow,
      };
    case TERMINATE_API_CALL: {
      return action.error
        ? {
            ...state,
            loading: false,
            loadingMessage: '',
            loadingType: LOADING_TYPES.flow,
          }
        : {
            ...state,
            loading: false,
            loadingMessage: '',
            loadingType: LOADING_TYPES.flow,
          };
    }

    case UPDATE_LOCATION:
      return {...state, location: action.payload};
    case UPDATE_RANGE:
      return {...state, searchRadius: action.payload};
    case SET_APP_NET_STATE_BT:
      return {...state, isNetworkBT: action.payload};
    case SET_INTERNET_PROMPT:
      return {
        ...state,
        prompt: {
          type: 'error',
          message: ERROR_MESSAGES.internet,
          category: PROMPT_CATEGORIES.snackbar,
        },
      };
    case SET_BT_PROMPT:
      return {
        ...state,
        prompt: {
          type: 'error',
          message: ERROR_MESSAGES.bluetooth,
          category: PROMPT_CATEGORIES.snackbar,
        },
      };
    case SET_PROMPT:
      return {
        ...state,
        prompt: {
          type: action.promptType,
          message: action.message,
          category: action.category,
        },
      };
    case DELETE_PROMPT:
      return {...state, prompt: null};
    case HALT_APP_INTERFACE:
      return {...state, haltAppInterface: action.payload};
    case VERSION_CHECK_SUCCESS:
      return {...state, versionChecked: true};
    case VERSION_CHECK_FAIL:
      return {...state, versionChecked: false};
    case SET_GENERAL_SETTINGS:
      return {...state, generalSettings: action.payload};
    default:
      return state;
  }
};
