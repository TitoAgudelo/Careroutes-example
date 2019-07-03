import axios from 'axios';

import { programsConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadPrograms = (props) => {
  return dispatch => {
    dispatch({ type: programsConstants.PROGRAMS_FETCHING_LIST_PROGRAMS })
    const { limit, offset, search, isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    return axios.get(`${ROOT_URL}/activity-programs?${filters}`, params)
      .then(response => {
        if (response.data.programs.length > 0) {
          dispatch(getListProgramsSuccess(response.data.programs))
        }
        return response.data;
      })
      .catch(error => {
        if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
        console.log('something went wrong while fetching activities programs list', error);
      });
  }
};

export const createProgram = (activity) => {
  return dispatch => {
    dispatch({ type: programsConstants.PROGRAMS_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/activity-programs`, activity, params)
      .then(response => {
        dispatch(createProgramSuccess(response.data));
        dispatch(successProgramAdded(true));
        dispatch(successMessage('Program successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create activity program ' + error.message))
      });
  }
}

export const updateProgram= (activity) => {
  return dispatch => {
    dispatch({ type: programsConstants.PROGRAMS_FETCHING_UPDATE_ID })
    const data = Object.assign({}, activity);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/activity-programs/${activity.id}`, data, params)
      .then(response => {
        dispatch(updateProgramSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update activity program ', error);
      });
  }
}

export const getProgramById = (activityId) => {
  return dispatch => {
    dispatch({ type: programsConstants.PROGRAMS_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/activity-programs/${activityId}`, params)
      .then(response => {
        dispatch(setProgramSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get activity program by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListProgramsSuccess = activities => ({
  type: programsConstants.PROGRAMS_LIST_PROGRAMS,
  payload: { activities }
});

export const updateProgramSuccess = activity => ({
  type: programsConstants.PROGRAMS_UPDATE_ID,
  payload: { activity }
});

export const createProgramSuccess = activity => ({
  type: programsConstants.PROGRAMS_ADD,
  payload: { activity }
});

export const successProgramAdded = (flag) => ({
  type: programsConstants.PROGRAMS_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: programsConstants.PROGRAMS_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: programsConstants.PROGRAMS_ERROR_MESSAGE,
  payload: { message }
})

export const deleteProgramSuccess = activity => ({
  type: programsConstants.PROGRAMS_DELETE_ID,
  payload: { activity }
});

export const getProgramSuccess = activity => ({
  type: programsConstants.PROGRAMS_GET_ID,
  payload: { activity }
});

export const setProgramSuccess = activity => ({
  type: programsConstants.PROGRAMS_SET_SUCCESS,
  payload: { activity }
});

export const setCurrentFieldToEditProgram = fieldName => ({
  type: programsConstants.PROGRAMS_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetPrograms = (flag) => ({
  type: programsConstants.PROGRAMS_RESET,
  payload: { flag }
});

