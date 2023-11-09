import {ActionTypes} from '~constants';

const {SET_PROFILE_DATA, SET_ACTIVE_PROFIE_TYPE, CONTACTS_FETCH_SUCCESS} =
  ActionTypes;

const INITIAL_STATE = {
  profileData: null,
  activeProfileType: null,
  contactsList: [],
  update: true,
  active: true,
  blocked: null,
  blockedBy: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_PROFILE_DATA:
      return {
        ...state,
        profileData: action.profileData,
        update: action.update,
        active: action.active,
        blocked: action.blocked,
        blockedBy: action.blockedBy,
      };
    case SET_ACTIVE_PROFIE_TYPE:
      return {...state, activeProfileType: action.payload};
    case CONTACTS_FETCH_SUCCESS:
      return {...state, contactsList: action.payload};
    default:
      return state;
  }
};
