import {
  FETCH_USERS, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE, FETCH_USERS_RESET
} from '../actions/user';


const initialState = {
  userList: { users: [], error: null, loading: false },
};

export default function(state = initialState, action) {
  let error;

  const { type, payload } = action

  switch(type) {
    // Start fetching users and set loading = true
    case FETCH_USERS:
      return {
        ...state,
        userList: { users: [], error: null, loading: true }
      };

    // Return list of users and make loading = false
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        userList: { users: payload.users, error: null, loading: false }
      };

    // Return error and make loading = false
    case FETCH_USERS_FAILURE:
      // Second one is network or server down errors
      error = payload.data || { message: payload.message };

      return {
        ...state,
        userList: { users: [], error: error, loading: false }
      };

    // Reset userList to initial state
    case FETCH_USERS_RESET:
      return {
        ...state,
        userList: initialState.userList
      };

    default:
      return state;
  }
}
