import axios from 'axios';

import { vehicleCapacitiesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadVehiclesCapacities = (props) => {
  return dispatch => {
    dispatch({ type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_FETCHING_LIST_VEHICLES })
    const { isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${isActive ? 'isActive=' + isActive: ''}`;
    axios.get(`${ROOT_URL}/vehicle-capacities?${filters}`, params)
      .then(response => {
        if (response.data.capacities.length > 0) {
          dispatch(getListVehiclesCapacitiesSuccess(response.data.capacities))
        }
      })
      .catch(error => {
        history.push('/');
        console.log('something went wrong while fetching vehicles capacities list', error);
      });
  }
};

export const createVehicleCapacity = (capacity) => {
  return dispatch => {
    dispatch({ type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/vehicle-capacities`, capacity, params)
      .then(response => {
        dispatch(createVehicleCapacitySuccess(response.data));
        dispatch(successVehicleCapacityAdded(true));
        dispatch(successMessage('Vehicle Capacity successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create vehicle capacity ' + error.message))
      });
  }
}

export const updateVehicleCapacity = (capacity) => {
  return dispatch => {
    dispatch({ type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/vehicle-capacities/${capacity.id}`, capacity, params)
      .then(response => {
        dispatch(updateVehicleCapacitySuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update vehicle capacity ', error.message);
      });
  }
}

export const getVehicleCapacityId = (capacityId) => {
  return dispatch => {
    dispatch({ type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/vehicle-capacities/${capacityId}`, params)
      .then(response => {
        let vehicleCapacity = response.data;
        dispatch(setVehicleCapacitySuccess(vehicleCapacity))
      })
      .catch(error => {
        console.log('something went wrong while fetching get vehicle capacity by id ', error.message);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListVehiclesCapacitiesSuccess = capacities => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_LIST_VEHICLES,
  payload: { capacities }
});

export const updateVehicleCapacitySuccess = capacity => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_UPDATE_ID,
  payload: { capacity }
});

export const createVehicleCapacitySuccess = capacity => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_ADD,
  payload: { capacity }
});

export const successVehicleCapacityAdded = (flag) => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_ERROR_MESSAGE,
  payload: { message }
})

export const deleteVehicleCapacitySuccess = capacity => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_DELETE_ID,
  payload: { capacity }
});

export const getVehicleCapacitySuccess = capacity => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_GET_ID,
  payload: { capacity }
});

export const setVehicleCapacitySuccess = capacity => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SET_SUCCESS,
  payload: { capacity }
});

export const setCurrentFieldToEditVehicleCapacity = fieldName => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetVehiclesCapacities = (flag) => ({
  type: vehicleCapacitiesConstants.VEHICLE_CAPACITIES_RESET,
  payload: { flag }
});

