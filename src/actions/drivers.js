import axios from 'axios';

import { driverConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadUsers = (props) => {
  return dispatch => {
    dispatch({ type: driverConstants.DRIVER_FETCHING_LIST_DRIVERS })
    const { limit, offset, search, role, isActive, regionId } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + '&': ''}${role ? 'role=' + role + '&': ''}${isActive ? 'isActive=' + isActive + (regionId ? '&' : ''): ''}${regionId ? 'regionId=' + regionId : ''}`;
    return axios.get(`${ROOT_URL}/users?${filters}`, params)
      .then(response => {
        if (response.data.users.length > 0) {
          dispatch(getListDriversSuccess(response.data.users))
        }
        return response.data;
      })
      .catch(error => {
        if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
        console.log('something went wrong while fetching drivers list', error);
      });
  }
};

export const createDriver = (driver) => {
  return dispatch => {
    dispatch({ type: driverConstants.DRIVER_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/users`, driver, params)
      .then(response => {
        dispatch(createDriverSuccess(response.data));
        dispatch(successDriverAdded(true));
        dispatch(successMessage('Driver successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create driver ' + error.message))
      });
  }
}

export const updateDriver = (driver) => {
  return dispatch => {
    dispatch({ type: driverConstants.DRIVER_FETCHING_UPDATE_ID })
    const data = Object.assign({}, driver);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/users/${driver.id}`, data, params)
      .then(response => {
        dispatch(updateDriverSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update driver', error);
      });
  }
}

export const getDriverId = (driverId) => {
  return dispatch => {
    dispatch({ type: driverConstants.DRIVER_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/users/${driverId}`, params)
      .then(response => {
        dispatch(setDriverSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get driver by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListDriversSuccess = drivers => ({
  type: driverConstants.DRIVER_LIST_DRIVERS,
  payload: { drivers }
});

export const updateDriverSuccess = driver => ({
  type: driverConstants.DRIVER_UPDATE_ID,
  payload: { driver }
});

export const createDriverSuccess = driver => ({
  type: driverConstants.DRIVER_ADD,
  payload: { driver }
});

export const successDriverAdded = (flag) => ({
  type: driverConstants.DRIVER_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: driverConstants.DRIVER_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: driverConstants.DRIVER_ERROR_MESSAGE,
  payload: { message }
})

export const deleteDriverSuccess = driver => ({
  type: driverConstants.DRIVER_DELETE_ID,
  payload: { driver }
});

export const getDriverSuccess = driver => ({
  type: driverConstants.DRIVER_GET_ID,
  payload: { driver }
});

export const setDriverSuccess = driver => ({
  type: driverConstants.DRIVER_SET_SUCCESS,
  payload: { driver }
});

export const setCurrentFieldToEditDriver = fieldName => ({
  type: driverConstants.DRIVER_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetDrivers = (flag) => ({
  type: driverConstants.DRIVER_RESET,
  payload: { flag }
});

