import axios from 'axios';

// User list
export const FETCH_USERS = 'FETCH_USERS'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE'
export const FETCH_USERS_RESET = 'FETCH_USERS_RESET'

// User list
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE'
export const FETCH_USER_PROFILE_SUCCESS = 'FETCH_USER_PROFILE_SUCCESS'
export const FETCH_USER_PROFILE_FAILURE = 'FETCH_USER_PROFILE_FAILURE'
export const FETCH_USER_PROFILE_RESET = 'FETCH_USER_PROFILE_RESET'

// User list
export const ADD_USER_PROFILE = 'ADD_USER_PROFILE'
export const ADD_USER_PROFILE_SUCCESS = 'ADD_USER_PROFILE_SUCCESS'
export const ADD_USER_PROFILE_FAILURE = 'ADD_USER_PROFILE_FAILURE'
export const ADD_USER_PROFILE_RESET = 'ADD_USER_PROFILE_RESET'


const ROOT_URL = '/api';
const actions = {
  fetchUsers: (params) => {
    return (dispatch, getState) => {
      dispatch({type: FETCH_USERS})

      const request = axios({
        method: 'get',
        data: params,
        url: `${ROOT_URL}/user`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: FETCH_USERS_SUCCESS, payload: response.data})
      }).catch((error) => {
        dispatch({type: FETCH_USERS_FAILURE, payload: error})
      })

    }
  },

  resetUsers: () => {
    return (dispatch) => {
      dispatch({
        type: FETCH_USERS_RESET
      })
    }
  },

  fetchUserProfile: (userId) => {
    return (dispatch, getState) => {
      dispatch({type: FETCH_USER_PROFILE})

      const request = axios({
        method: 'get',
        url: `${ROOT_URL}/user/${userId}`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: FETCH_USER_PROFILE_SUCCESS, payload: response.data})
      }).catch((error) => {
        dispatch({type: FETCH_USER_PROFILE_FAILURE, payload: error})
      })

    }
  },

  resetUserProfile: () => {
    return (dispatch) => {
      dispatch({
        type: FETCH_USER_PROFILE_RESET
      })
    }
  },

  addUserSkill: (params) => {
    return (dispatch) => {
      dispatch({type: ADD_USER_PROFILE})

      // Login request
      const request = axios({
        method: 'post',
        data: params,
        url: `${ROOT_URL}/skill`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: ADD_USER_PROFILE_SUCCESS})
      }).catch((error) => {
        dispatch({type: ADD_USER_PROFILE_FAILURE, payload: error})
      })

    }
  },

  resetAddUserSkill: () => {
    return (dispatch) => {
      dispatch({
        type: ADD_USER_PROFILE_RESET
      })
    }
  },
}

export default actions
