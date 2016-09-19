import axios from 'axios';

// User list
export const FETCH_USERS = 'FETCH_USERS'
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS'
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE'
export const FETCH_USERS_RESET = 'FETCH_USERS_RESET'

// User list with skill
export const FETCH_USERS_WITH_SKILL = 'FETCH_USERS_WITH_SKILL'
export const FETCH_USERS_WITH_SKILL_SUCCESS = 'FETCH_USERS_WITH_SKILL_SUCCESS'
export const FETCH_USERS_WITH_SKILL_FAILURE = 'FETCH_USERS_WITH_SKILL_FAILURE'
export const FETCH_USERS_WITH_SKILL_RESET = 'FETCH_USERS_WITH_SKILL_RESET'

// User profile
export const FETCH_USER_PROFILE = 'FETCH_USER_PROFILE'
export const FETCH_USER_PROFILE_SUCCESS = 'FETCH_USER_PROFILE_SUCCESS'
export const FETCH_USER_PROFILE_FAILURE = 'FETCH_USER_PROFILE_FAILURE'
export const FETCH_USER_PROFILE_RESET = 'FETCH_USER_PROFILE_RESET'

// User profile add skill
export const USER_PROFILE_ADD_SKILL = 'USER_PROFILE_ADD_SKILL'
export const USER_PROFILE_ADD_SKILL_SUCCESS = 'USER_PROFILE_ADD_SKILL_SUCCESS'
export const USER_PROFILE_ADD_SKILL_FAILURE = 'USER_PROFILE_ADD_SKILL_FAILURE'
export const USER_PROFILE_ADD_SKILL_RESET = 'USER_PROFILE_ADD_SKILL_RESET'

// User profile toggle skill
export const USER_PROFILE_TOGGLE_SKILL = 'USER_PROFILE_TOGGLE_SKILL'
export const USER_PROFILE_TOGGLE_SKILL_SUCCESS = 'USER_PROFILE_TOGGLE_SKILL_SUCCESS'
export const USER_PROFILE_TOGGLE_SKILL_FAILURE = 'USER_PROFILE_TOGGLE_SKILL_FAILURE'
export const USER_PROFILE_TOGGLE_SKILL_RESET = 'USER_PROFILE_TOGGLE_SKILL_RESET'

// User profile toggle skill visibility
export const USER_PROFILE_TOGGLE_VISIBILITY_SKILL = 'USER_PROFILE_TOGGLE_VISIBILITY_SKILL'
export const USER_PROFILE_TOGGLE_VISIBILITY_SKILL_SUCCESS = 'USER_PROFILE_TOGGLE_VISIBILITY_SKILL_SUCCESS'
export const USER_PROFILE_TOGGLE_VISIBILITY_SKILL_FAILURE = 'USER_PROFILE_TOGGLE_VISIBILITY_SKILL_FAILURE'
export const USER_PROFILE_TOGGLE_VISIBILITY_SKILL_RESET = 'USER_PROFILE_TOGGLE_VISIBILITY_SKILL_RESET'


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

  fetchUsersWithSkill: (skillId) => {
    return (dispatch, getState) => {
      dispatch({type: FETCH_USERS_WITH_SKILL})

      const request = axios({
        method: 'get',
        url: `${ROOT_URL}/skill/${skillId}`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: FETCH_USERS_WITH_SKILL_SUCCESS, payload: response.data})
      }).catch((error) => {
        dispatch({type: FETCH_USERS_WITH_SKILL_FAILURE, payload: error})
      })

    }
  },

  resetUsersWithSkill: () => {
    return (dispatch) => {
      dispatch({
        type: FETCH_USERS_WITH_SKILL_RESET
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
      dispatch({type: USER_PROFILE_ADD_SKILL})

      // Login request
      const request = axios({
        method: 'post',
        data: params,
        url: `${ROOT_URL}/skill`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: USER_PROFILE_ADD_SKILL_SUCCESS})
      }).catch((error) => {
        dispatch({type: USER_PROFILE_ADD_SKILL_FAILURE, payload: error})
      })

    }
  },

  resetAddUserSkill: () => {
    return (dispatch) => {
      dispatch({
        type: USER_PROFILE_ADD_SKILL_RESET
      })
    }
  },

  toggleUserSkill: (params) => {
    return (dispatch) => {
      dispatch({type: USER_PROFILE_TOGGLE_SKILL})

      // Login request
      const request = axios({
        method: 'post',
        data: params,
        url: `${ROOT_URL}/user/${params.user_id}/skill`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: USER_PROFILE_TOGGLE_SKILL_SUCCESS})
      }).catch((error) => {
        dispatch({type: USER_PROFILE_TOGGLE_SKILL_FAILURE, payload: error})
      })

    }
  },

  resetToggleUserSkill: () => {
    return (dispatch) => {
      dispatch({
        type: USER_PROFILE_TOGGLE_SKILL_RESET
      })
    }
  },

  toggleUserSkillVisibility: (params) => {
    return (dispatch) => {
      dispatch({type: USER_PROFILE_TOGGLE_VISIBILITY_SKILL})

      // Login request
      const request = axios({
        method: 'put',
        data: params,
        url: `${ROOT_URL}/user/${params.user_id}/skill`,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
      }).then((response) => {
        dispatch({type: USER_PROFILE_TOGGLE_VISIBILITY_SKILL_SUCCESS, payload: params})
      }).catch((error) => {
        dispatch({type: USER_PROFILE_TOGGLE_VISIBILITY_SKILL_FAILURE, payload: error})
      })

    }
  },

  resetToggleUserSkillVisibility: () => {
    return (dispatch) => {
      dispatch({
        type: USER_PROFILE_TOGGLE_VISIBILITY_SKILL_RESET
      })
    }
  },

  fetchSkillSuggestions: (query) => {
    return axios({
      method: 'get',
      url: `${ROOT_URL}/skill/suggestion/${query}`,
      headers: {'Authorization': 'Bearer ' + localStorage.getItem('AuthToken')}
    })
  },
}

export default actions
