import axios from 'axios';

import { activitiesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadActivities = (props) => {
  return dispatch => {
    dispatch({ type: activitiesConstants.ACTIVITIES_FETCHING_LIST_ACTIVITIES })
    const { limit, offset, search, isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    return axios.get(`${ROOT_URL}/activities?${filters}`, params)
      .then(response => {
        if (response.data.activities.length > 0) {
          dispatch(getListActivitiesSuccess(response.data.activities))
        }
        return response.data;
      })
      .catch(error => {
        if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
        console.log('something went wrong while fetching activities list', error);
      });
  }
};

export const createActivity = (activity) => {
  return dispatch => {
    dispatch({ type: activitiesConstants.ACTIVITIES_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/activities`, activity, params)
      .then(response => {
        dispatch(createActivitySuccess(response.data));
        dispatch(successActivityAdded(true));
        dispatch(successMessage('Activity successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create activity ' + error.message))
      });
  }
}

export const updateActivity = (activity) => {
  return dispatch => {
    dispatch({ type: activitiesConstants.ACTIVITIES_FETCHING_UPDATE_ID })
    const data = Object.assign({}, activity);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/activities/${activity.id}`, data, params)
      .then(response => {
        dispatch(updateActivitySuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update activity', error);
      });
  }
}

export const getActivityById = (activityId) => {
  return dispatch => {
    dispatch({ type: activitiesConstants.ACTIVITIES_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/activities/${activityId}`, params)
      .then(response => {
        dispatch(setActivitySuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get activity by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListActivitiesSuccess = activities => ({
  type: activitiesConstants.ACTIVITIES_LIST_ACTIVITIES,
  payload: { activities }
});

export const updateActivitySuccess = activity => ({
  type: activitiesConstants.ACTIVITIES_UPDATE_ID,
  payload: { activity }
});

export const createActivitySuccess = activity => ({
  type: activitiesConstants.ACTIVITIES_ADD,
  payload: { activity }
});

export const successActivityAdded = (flag) => ({
  type: activitiesConstants.ACTIVITIES_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: activitiesConstants.ACTIVITIES_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: activitiesConstants.ACTIVITIES_ERROR_MESSAGE,
  payload: { message }
})

export const deleteActivitySuccess = activity => ({
  type: activitiesConstants.ACTIVITIES_DELETE_ID,
  payload: { activity }
});

export const getActivitySuccess = activity => ({
  type: activitiesConstants.ACTIVITIES_GET_ID,
  payload: { activity }
});

export const setActivitySuccess = activity => ({
  type: activitiesConstants.ACTIVITIES_SET_SUCCESS,
  payload: { activity }
});

export const setCurrentFieldToEditActivity = fieldName => ({
  type: activitiesConstants.ACTIVITIES_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetActivities = (flag) => ({
  type: activitiesConstants.ACTIVITIES_RESET,
  payload: { flag }
});

