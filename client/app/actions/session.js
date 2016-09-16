import axios from 'axios';
import { browserHistory } from 'react-router'

// User login
export const AUTH_LOGIN = 'AUTH_LOGIN'
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS'
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE'
export const AUTH_LOGIN_RESET = 'AUTH_LOGIN_RESET'

// User register
export const AUTH_REGISTER = 'AUTH_REGISTER'
export const AUTH_REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS'
export const AUTH_REGISTER_FAILURE = 'AUTH_REGISTER_FAILURE'
export const AUTH_REGISTER_RESET = 'AUTH_REGISTER_RESET'

// User logout
export const AUTH_RESET = 'AUTH_RESET'

const ROOT_URL = '/api';
const actions = {
  loadSession: () => {
    return (dispatch) => {
      const token = localStorage.getItem('AuthToken')

      // We have no token and therefor can't load a session
      if (!token) {
        return
      }

      // Attach token to every request
      axios.defaults.transformRequest.push((data, headers) => {
        headers['Authorization'] = 'Bearer ' + token;
      })

      // Dispatch success
      dispatch({type: AUTH_LOGIN_SUCCESS, payload: JSON.parse(localStorage.getItem('User'))})
    }
  },

  login: (params) => {
    return (dispatch) => {
      dispatch({type: AUTH_LOGIN})

      const request = axios({
        method: 'post',
        data: params,
        url: `${ROOT_URL}/login`
      }).then((response) => {
        // Save token in local storage
        localStorage.setItem('AuthToken', response.data.token)
        localStorage.setItem('User', JSON.stringify(response.data.user))

        // Setup session
        dispatch(actions.loadSession())

        // Redirect to index
        browserHistory.push('/');
      }).catch((error) => {
        dispatch({type: AUTH_LOGIN_FAILURE, payload: error})
      })

    }
  },

  register: (params) => {
    return (dispatch, getState) => {
      const { session } = getState()
    }
  },

  logout: () => {
    return (dispatch, getState) => {
      const { session } = getState()
    }
  },

  reset: () => {
    return (dispatch) => {
      dispatch({
        type: AUTH_RESET
      })
    }
  }
}

export default actions
