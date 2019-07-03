import axios from 'axios';

import { facilitiesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadFacilities = (props) => {
  return dispatch => {
    dispatch({ type: facilitiesConstants.FACILITIES_FETCHING_LIST_FACILITIES })
    const { limit, offset, search, isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/facilities?${filters}`, params)
      .then(response => {
        dispatch(getListfacilitiesSuccess(response.data.facilities))
      })
      .catch(error => {
        history.push('/');
        console.log('something went wrong while fetching facilities list', error);
      });
  }
};

export const createFacility = (facility) => {
  return dispatch => {
    dispatch({ type: facilitiesConstants.FACILITIES_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/facilities`, facility, params)
      .then(response => {
        dispatch(createFacilitySuccess(response.data));
        dispatch(successFacilityAdded(true));
        dispatch(successMessage('Facility successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create facility ' + error.message))
      });
  }
}

export const updateFacility = (facility) => {
  return dispatch => {
    dispatch({ type: facilitiesConstants.FACILITIES_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/facilities/${facility.id}`, facility, params)
      .then(response => {
        dispatch(updateFacilitySuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update facility ', error.message);
      });
  }
}

export const getFacilityById = (facilityId) => {
  return dispatch => {
    dispatch({ type: facilitiesConstants.FACILITIES_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/facilities/${facilityId}`, params)
      .then(response => {
        let facility = response.data;
        dispatch(setFacilitySuccess(facility))
      })
      .catch(error => {
        console.log('something went wrong while fetching get facility by id ', error.message);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListfacilitiesSuccess = facilities => ({
  type: facilitiesConstants.FACILITIES_LIST_FACILITIES,
  payload: { facilities }
});

export const updateFacilitySuccess = facility => ({
  type: facilitiesConstants.FACILITIES_UPDATE_ID,
  payload: { facility }
});

export const createFacilitySuccess = facility => ({
  type: facilitiesConstants.FACILITIES_ADD,
  payload: { facility }
});

export const successFacilityAdded = (flag) => ({
  type: facilitiesConstants.FACILITIES_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: facilitiesConstants.FACILITIES_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: facilitiesConstants.FACILITIES_ERROR_MESSAGE,
  payload: { message }
})

export const deleteFacilitySuccess = facility => ({
  type: facilitiesConstants.FACILITIES_DELETE_ID,
  payload: { facility }
});

export const getFacilitySuccess = facility => ({
  type: facilitiesConstants.FACILITIES_GET_ID,
  payload: { facility }
});

export const setFacilitySuccess = facility => ({
  type: facilitiesConstants.FACILITIES_SET_SUCCESS,
  payload: { facility }
});

export const setCurrentFieldToEditFacility = fieldName => ({
  type: facilitiesConstants.FACILITIES_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetFacilities= (flag) => ({
  type: facilitiesConstants.FACILITIES_RESET,
  payload: { flag }
});

