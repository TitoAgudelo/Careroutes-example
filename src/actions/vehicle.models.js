import axios from 'axios';

import { vehicleModelsConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadVehiclesModels = (props) => {
  return dispatch => {
    dispatch({ type: vehicleModelsConstants.VEHICLE_MODELS_FETCHING_LIST_MODELS })
    const { limit, offset, search, isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/vehicle-models?${filters}`, params)
      .then(response => {
        if (response.data.models.length > 0) {
          dispatch(getListVehiclesModelsSuccess(response.data.models))
        }
      })
      .catch(error => {
        history.push('/');
        console.log('something went wrong while fetching vehicles models list', error);
      });
  }
};

export const createVehicleModel = (model) => {
  return dispatch => {
    dispatch({ type: vehicleModelsConstants.VEHICLE_MODELS_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/vehicle-models`, model, params)
      .then(response => {
        dispatch(createVehicleModelSuccess(response.data));
        dispatch(successVehicleModelAdded(true));
        dispatch(successMessage('Vehicle model successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create vehicle model ' + error.message))
      });
  }
}

export const updateVehicleModel = (model) => {
  return dispatch => {
    dispatch({ type: vehicleModelsConstants.VEHICLE_MODELS_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/vehicle-models/${model.id}`, model, params)
      .then(response => {
        dispatch(updateVehicleModelSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update vehicle model ', error.message);
      });
  }
}

export const getVehicleModelId = (modelId) => {
  return dispatch => {
    dispatch({ type: vehicleModelsConstants.VEHICLE_MODELS_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/vehicle-models/${modelId}`, params)
      .then(response => {
        let vehicleModel = response.data;
        dispatch(setVehicleModelSuccess(vehicleModel))
      })
      .catch(error => {
        console.log('something went wrong while fetching get vehicle model by id ', error.message);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListVehiclesModelsSuccess = models => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_LIST_MODELS,
  payload: { models }
});

export const updateVehicleModelSuccess = model => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_UPDATE_ID,
  payload: { model }
});

export const createVehicleModelSuccess = model => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_ADD,
  payload: { model }
});

export const successVehicleModelAdded = (flag) => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_ERROR_MESSAGE,
  payload: { message }
})

export const deleteVehicleModelSuccess = model => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_DELETE_ID,
  payload: { model }
});

export const getVehicleModelSuccess = model => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_GET_ID,
  payload: { model }
});

export const setVehicleModelSuccess = model => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_SET_SUCCESS,
  payload: { model }
});

export const setCurrentFieldToEditVehicleModel = fieldName => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetVehiclesModels = (flag) => ({
  type: vehicleModelsConstants.VEHICLE_MODELS_RESET,
  payload: { flag }
});

