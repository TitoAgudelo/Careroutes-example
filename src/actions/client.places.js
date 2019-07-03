import axios from 'axios';

import { clientPlacesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadClientPlaces = (props) => {
  return dispatch => {
    dispatch({ type: clientPlacesConstants.CLIENT_PLACES_FETCHING_LIST_PLACES })
    const { limit, offset, search, isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + '&': ''}${isActive ? 'isActive=' + isActive : ''}`;
    return axios.get(`${ROOT_URL}/clients/${props.id}/places/?${filters}`, params)
      .then(response => {
        if (response.data.places.length > 0) {
          dispatch(getListClientPlacesSuccess(response.data.places))
        }
        return response.data;
      })
      .catch(error => {
        if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
        console.log('something went wrong while fetching client places list', error);
      });
  }
};

export const createClientPlace = (place, clientId) => {
  return dispatch => {
    dispatch({ type: clientPlacesConstants.CLIENT_PLACES_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/clients/${clientId}/places`, place, params)
      .then(response => {
        dispatch(createClientPlaceSuccess(response.data));
        dispatch(successClientPlaceAdded(true));
        dispatch(successMessage('Client place successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create client place ' + error.message))
      });
  }
}

export const updateClientPlace = (place, clientId) => {
  return dispatch => {
    dispatch({ type: clientPlacesConstants.CLIENT_PLACES_FETCHING_UPDATE_ID })
    const data = Object.assign({}, place);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/clients/${clientId}/places/${place.id}`, data, params)
      .then(response => {
        dispatch(updateClientPlaceSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update client place ', error);
      });
  }
}

export const getClientPlaceById = (placeId, clientId) => {
  return dispatch => {
    dispatch({ type: clientPlacesConstants.CLIENT_PLACES_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/clients/${clientId}/places/${placeId}`, params)
      .then(response => {
        dispatch(setClientPlaceSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get client place by id ', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListClientPlacesSuccess = places => ({
  type: clientPlacesConstants.CLIENT_PLACES_LIST_PLACES,
  payload: { places }
});

export const updateClientPlaceSuccess = place => ({
  type: clientPlacesConstants.CLIENT_PLACES_UPDATE_ID,
  payload: { place }
});

export const createClientPlaceSuccess = place => ({
  type: clientPlacesConstants.CLIENT_PLACES_ADD,
  payload: { place }
});

export const successClientPlaceAdded = (flag) => ({
  type: clientPlacesConstants.CLIENT_PLACES_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: clientPlacesConstants.CLIENT_PLACES_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: clientPlacesConstants.CLIENT_PLACES_ERROR_MESSAGE,
  payload: { message }
})

export const deleteClientPlaceSuccess = place => ({
  type: clientPlacesConstants.CLIENT_PLACES_DELETE_ID,
  payload: { place }
});

export const getClientPlaceSuccess = place => ({
  type: clientPlacesConstants.CLIENT_PLACES_GET_ID,
  payload: { place }
});

export const setClientPlaceSuccess = place => ({
  type: clientPlacesConstants.CLIENT_PLACES_SET_SUCCESS,
  payload: { place }
});

export const setCurrentFieldToEditClientPlace = fieldName => ({
  type: clientPlacesConstants.CLIENT_PLACES_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetClientPlaces = (flag) => ({
  type: clientPlacesConstants.CLIENT_PLACES_RESET,
  payload: { flag }
});

