import { combineReducers } from 'redux';
import UserReducer from './user';
import SessionReducer from './session';

const rootReducer = combineReducers({
  user: UserReducer,
  session: SessionReducer
});

export default rootReducer;
