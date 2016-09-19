import {
  FETCH_USERS, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE, FETCH_USERS_RESET,
  FETCH_USERS_WITH_SKILL, FETCH_USERS_WITH_SKILL_SUCCESS, FETCH_USERS_WITH_SKILL_FAILURE, FETCH_USERS_WITH_SKILL_RESET,
  FETCH_USER_PROFILE, FETCH_USER_PROFILE_SUCCESS, FETCH_USER_PROFILE_FAILURE, FETCH_USER_PROFILE_RESET,
  USER_PROFILE_ADD_SKILL, USER_PROFILE_ADD_SKILL_SUCCESS, USER_PROFILE_ADD_SKILL_FAILURE, USER_PROFILE_ADD_SKILL_RESET,
  USER_PROFILE_TOGGLE_SKILL, USER_PROFILE_TOGGLE_SKILL_SUCCESS, USER_PROFILE_TOGGLE_SKILL_FAILURE, USER_PROFILE_TOGGLE_SKILL_RESET,
  USER_PROFILE_TOGGLE_VISIBILITY_SKILL, USER_PROFILE_TOGGLE_VISIBILITY_SKILL_SUCCESS, USER_PROFILE_TOGGLE_VISIBILITY_SKILL_FAILURE, USER_PROFILE_TOGGLE_VISIBILITY_SKILL_RESET,
} from '../actions/user';


const initialState = {
  userList: { users: [], error: null, loading: false },
  userWithSkillList: { skillId: null, users: [], error: null, loading: false },
  userProfile: { user: null, skills: [], error: null, loading: false },
  addSkill: { success: false, error: null, loading: false },
  toggleSkill: { success: false, error: null, loading: false },
  toggleSkillVisibility: { skill: null, status: false, success: false, error: null, loading: false },
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

    // Start fetching users with skill and set loading = true
    case FETCH_USERS_WITH_SKILL:
      return {
        ...state,
        userWithSkillList: { skill: null, users: [], error: null, loading: true }
      };

    // Return list of users and make loading = false
    case FETCH_USERS_WITH_SKILL_SUCCESS:
      return {
        ...state,
        userWithSkillList: { skill: payload.skill, users: payload.users, error: null, loading: false }
      };

    // Return error and make loading = false
    case FETCH_USERS_WITH_SKILL_FAILURE:
      // Second one is network or server down errors
      error = payload.data || { message: payload.message };

      return {
        ...state,
        userWithSkillList: { skill: null, users: [], error: error, loading: false }
      };

    // Reset userWithSkillList to initial state
    case FETCH_USERS_WITH_SKILL_RESET:
      return {
        ...state,
        userWithSkillList: initialState.userWithSkillList
      };


    // Start fetching user profile and set loading = true
    case FETCH_USER_PROFILE:
      return {
        ...state,
        userProfile: { user: null, skills: [], error: null, loading: true }
      };

    // Return list of user profile and make loading = false
    case FETCH_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: { user: payload.user, skills: payload.skills, error: null, loading: false }
      };

    // Return error and make loading = false
    case FETCH_USER_PROFILE_FAILURE:
      // Second one is network or server down errors
      error = payload.data || { message: payload.message };

      return {
        ...state,
        userProfile: { user: null, skills: [], error: error, loading: false }
      };

    // Reset userProfile to initial state
    case FETCH_USER_PROFILE_RESET:
      return {
        ...state,
        userProfile: initialState.userProfile
      };

    // Post the new skill and set loading = true
    case USER_PROFILE_ADD_SKILL:
      return {
        ...state,
        addSkill: { success: false, error: null, loading: true }
      };

    // Return list of user profile and make loading = false
    case USER_PROFILE_ADD_SKILL_SUCCESS:
      return {
        ...state,
        addSkill: { success: true, error: null, loading: false }
      };

    // Return error and make loading = false
    case USER_PROFILE_ADD_SKILL_FAILURE:
      // Second one is network or server down errors
      error = payload.data || { message: payload.message };

      return {
        ...state,
        addSkill: { success: true, error: error, loading: false }
      };

    // Reset addSkill to initial state
    case USER_PROFILE_ADD_SKILL_RESET:
      return {
        ...state,
        addSkill: initialState.addSkill
      };

    // Post the new skill and set loading = true
    case USER_PROFILE_TOGGLE_SKILL:
      return {
        ...state,
        toggleSkill: { success: false, error: null, loading: true }
      };

    // Return list of user profile and make loading = false
    case USER_PROFILE_TOGGLE_SKILL_SUCCESS:
      return {
        ...state,
        toggleSkill: { success: true, error: null, loading: false }
      };

    // Return error and make loading = false
    case USER_PROFILE_TOGGLE_SKILL_FAILURE:
      // Second one is network or server down errors
      error = payload.data || { message: payload.message };

      return {
        ...state,
        toggleSkill: { success: true, error: error, loading: false }
      };

    // Reset toggleSkill to initial state
    case USER_PROFILE_TOGGLE_SKILL_RESET:
      return {
        ...state,
        toggleSkill: initialState.toggleSkill
      };

    // Post the new skill and set loading = true
    case USER_PROFILE_TOGGLE_VISIBILITY_SKILL:
      return {
        ...state,
        toggleSkillVisibility: { skillId: null, status: false, success: false, error: null, loading: true }
      };

    // Return list of user profile and make loading = false
    case USER_PROFILE_TOGGLE_VISIBILITY_SKILL_SUCCESS:
      return {
        ...state,
        toggleSkillVisibility: { skillId: payload.skill_id, status: payload.status, success: true, error: null, loading: false }
      };

    // Return error and make loading = false
    case USER_PROFILE_TOGGLE_VISIBILITY_SKILL_FAILURE:
      // Second one is network or server down errors
      error = payload.data || { message: payload.message };

      return {
        ...state,
        toggleSkillVisibility: { skillId: null, status: false, success: true, error: error, loading: false }
      };

    // Reset toggleSkill to initial state
    case USER_PROFILE_TOGGLE_VISIBILITY_SKILL_RESET:
      return {
        ...state,
        toggleSkillVisibility: initialState.toggleSkillVisibility
      };

    default:
      return state;
  }
}
