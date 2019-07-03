import axios from 'axios';

import { programmedConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadProgrammed = (props) => {
  return dispatch => {
    dispatch({ type: programmedConstants.PROGRAMMED_FETCHING_LIST_PROGRAMMED })
    const { programId } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.get(`${ROOT_URL}/activity-programs/${programId}/activities`, params)
      .then(response => {
        if (response.data.activities.length > 0) {
          dispatch(getListProgrammedSuccess(response.data.activities))
        }
        return response.data;
      })
      .catch(error => {
        if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
        console.log('something went wrong while fetching activities programmed list', error);
      });
  }
};

export const createProgrammed = (activity, programId) => {
  return dispatch => {
    dispatch({ type: programmedConstants.PROGRAMMED_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/activity-programs/${programId}/activities`, activity, params)
      .then(response => {
        dispatch(createProgrammedSuccess(response.data));
        dispatch(successProgrammedAdded(true));
        dispatch(successMessage('Programmed successfuly added'));
        return response.data;
      })
      .catch(error => {
        console.log(error);
        dispatch(errorMessage('Something went wrong while fetching create activity programmed ' + error.message))
      });
  }
}

export const updateProgrammed = (activity, programId) => {
  return dispatch => {
    dispatch({ type: programmedConstants.PROGRAMMED_FETCHING_UPDATE_ID })
    const data = Object.assign({}, activity);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/activity-programs/${programId}/activities/${activity.id}`, data, params)
      .then(response => {
        dispatch(updateProgrammedSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update activity programmed ', error);
      });
  }
}

export const getProgrammedById = (activityId, programId) => {
  return dispatch => {
    dispatch({ type: programmedConstants.PROGRAMMED_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/activity-programs/${programId}/activities/${activityId}`, params)
      .then(response => {
        dispatch(setProgrammedSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get activity programmed by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListProgrammedSuccess = activities => ({
  type: programmedConstants.PROGRAMMED_LIST_PROGRAMMED,
  payload: { activities }
});

export const updateProgrammedSuccess = activity => ({
  type: programmedConstants.PROGRAMMED_UPDATE_ID,
  payload: { activity }
});

export const createProgrammedSuccess = activity => ({
  type: programmedConstants.PROGRAMMED_ADD,
  payload: { activity }
});

export const successProgrammedAdded = (flag) => ({
  type: programmedConstants.PROGRAMMED_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: programmedConstants.PROGRAMMED_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: programmedConstants.PROGRAMMED_ERROR_MESSAGE,
  payload: { message }
})

export const deleteProgrammedSuccess = activity => ({
  type: programmedConstants.PROGRAMMED_DELETE_ID,
  payload: { activity }
});

export const getProgrammedSuccess = activity => ({
  type: programmedConstants.PROGRAMMED_GET_ID,
  payload: { activity }
});

export const setProgrammedSuccess = activity => ({
  type: programmedConstants.PROGRAMMED_SET_SUCCESS,
  payload: { activity }
});

export const setCurrentFieldToEditProgrammed = fieldName => ({
  type: programmedConstants.PROGRAMMED_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetProgrammed = (flag) => ({
  type: programmedConstants.PROGRAMMED_RESET,
  payload: { flag }
});

