import axios from 'axios';

import { regionConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadRegions = (props) => {
  return dispatch => {
    dispatch({ type: regionConstants.REGION_FETCHING_LIST_REGIONS })
    const { isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/regions?${filters}`, params)
      .then(response => {
        if (response.data.regions.length > 0) {
          dispatch(getListRegionsSuccess(response.data.regions))
        }
      })
      .catch(error => {
        // if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        // }
        console.log('something went wrong while fetching regions list', error);
      });
  }
};

export const createRegion = (region) => {
  return dispatch => {
    dispatch({ type: regionConstants.REGION_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/regions`, region, params)
      .then(response => {
        dispatch(createRegionSuccess(response.data));
        dispatch(successRegionAdded(true));
        dispatch(successMessage('Region successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create region ' + error.message))
      });
  }
}

export const updateRegion = (region) => {
  return dispatch => {
    dispatch({ type: regionConstants.REGION_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/regions/${region.id}`, region, params)
      .then(response => {
        dispatch(updateRegionSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update region', error);
      });
  }
}

export const getRegionId = (regionId) => {
  return dispatch => {
    dispatch({ type: regionConstants.REGION_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/regions/${regionId}`, params)
      .then(response => {
        dispatch(setRegionSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get region by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListRegionsSuccess = regions => ({
  type: regionConstants.REGION_LIST_REGIONS,
  payload: { regions }
});

export const updateRegionSuccess = region => ({
  type: regionConstants.REGION_UPDATE_ID,
  payload: { region }
});

export const createRegionSuccess = region => ({
  type: regionConstants.REGION_ADD,
  payload: { region }
});

export const successRegionAdded = (flag) => ({
  type: regionConstants.REGION_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: regionConstants.REGION_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: regionConstants.REGION_ERROR_MESSAGE,
  payload: { message }
})

export const deleteRegionSuccess = region => ({
  type: regionConstants.REGION_DELETE_ID,
  payload: { region }
});

export const getRegionSuccess = region => ({
  type: regionConstants.REGION_GET_ID,
  payload: { region }
});

export const setRegionSuccess = region => ({
  type: regionConstants.REGION_SET_SUCCESS,
  payload: { region }
});

export const setCurrentFieldToEditRegion = fieldName => ({
  type: regionConstants.REGION_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetRegions = flag => ({
  type: regionConstants.REGION_RESET,
  payload: { flag }
});

