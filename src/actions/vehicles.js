import axios from 'axios';

import { vehicleConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadVehicles = (props) => {
  return dispatch => {
    dispatch({ type: vehicleConstants.VEHICLE_FETCHING_LIST_VEHICLES })
    const { limit, offset, search, regionId, isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${regionId ? 'regionId=' + regionId + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/vehicles?${filters}`, params)
      .then(response => {
        if (response.data.vehicles.length > 0) {
          dispatch(getListVehiclesSuccess(response.data.vehicles))
        }
      })
      .catch(error => {
        history.push('/');
        console.log('something went wrong while fetching vehicles list', error);
      });
  }
};

export const createVehicle = (vehicle) => {
  return dispatch => {
    dispatch({ type: vehicleConstants.VEHICLE_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/vehicles`, vehicle, params)
      .then(response => {
        dispatch(createVehicleSuccess(response.data));
        dispatch(successVehicleAdded(true));
        dispatch(successMessage('Vehicle successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create vehicle ' + error.message))
      });
  }
}

export const updateVehicle = (vehicle) => {
  return dispatch => {
    dispatch({ type: vehicleConstants.VEHICLE_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/vehicles/${vehicle.id}`, vehicle, params)
      .then(response => {
        dispatch(updateVehicleSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update vehicle ', error.message);
      });
  }
}

export const getVehicleId = (vehicleId) => {
  return dispatch => {
    dispatch({ type: vehicleConstants.VEHICLE_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/vehicles/${vehicleId}`, params)
      .then(response => {
        let vehicle = response.data;
        dispatch(setVehicleSuccess(vehicle))
      })
      .catch(error => {
        console.log('something went wrong while fetching get vehicle by id ', error.message);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListVehiclesSuccess = vehicles => ({
  type: vehicleConstants.VEHICLE_LIST_VEHICLES,
  payload: { vehicles }
});

export const updateVehicleSuccess = vehicle => ({
  type: vehicleConstants.VEHICLE_UPDATE_ID,
  payload: { vehicle }
});

export const createVehicleSuccess = vehicle => ({
  type: vehicleConstants.VEHICLE_ADD,
  payload: { vehicle }
});

export const successVehicleAdded = (flag) => ({
  type: vehicleConstants.VEHICLE_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: vehicleConstants.VEHICLE_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: vehicleConstants.VEHICLE_ERROR_MESSAGE,
  payload: { message }
})

export const deleteVehicleSuccess = vehicle => ({
  type: vehicleConstants.VEHICLE_DELETE_ID,
  payload: { vehicle }
});

export const getVehicleSuccess = vehicle => ({
  type: vehicleConstants.VEHICLE_GET_ID,
  payload: { vehicle }
});

export const setVehicleSuccess = vehicle => ({
  type: vehicleConstants.VEHICLE_SET_SUCCESS,
  payload: { vehicle }
});

export const setCurrentFieldToEditVehicle = fieldName => ({
  type: vehicleConstants.VEHICLE_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetVehicles = (flag) => ({
  type: vehicleConstants.VEHICLE_RESET,
  payload: { flag }
});

