import {combineReducers} from 'redux';

import AppReducer from './AppReducer';
import HotelReducer from './HotelReducer';
import ChatReducer from './ChatReducer';
import DiscoverReducer from './DiscoverReducer';
import ProfileReducer from './ProfileReducer';

export default combineReducers({
  app: AppReducer,
  chat: ChatReducer,
  discover: DiscoverReducer,
  hotel: HotelReducer,
  profile: ProfileReducer,
});
