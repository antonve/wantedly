import {
  AUTH_LOGIN, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGIN_RESET, AUTH_RESET
} from '../actions/session';

const initialState = {
  currentUser: null,
  failed: false,
  errors: [],
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        failed: false,
        errors: []
      }

      case AUTH_LOGIN_FAILURE:
        return {
          ...state,
          currentUser: null,
          failed: true,
          errors: ["Invalid Credentials"]
        }

      case AUTH_RESET:
        return {
          ...initialState
        }

    default:
      return state
  }
}
