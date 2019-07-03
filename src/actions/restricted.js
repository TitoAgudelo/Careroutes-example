import axios from 'axios';

import { restrictedConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadRestrictedAreas = (props) => {
  return dispatch => {
    dispatch({ type: restrictedConstants.RESTRICTED_FETCHING_LIST_AREAS })
    const { isActive, limit, offset, search, regionId } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${regionId ? 'regionId=' + regionId + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/restricted-areas?${filters}`, params)
      .then(response => {
        if (response.data.areas.length > 0) {
          dispatch(getListAreasSuccess(response.data.areas))
        }
      })
      .catch(error => {
        // if(error.response.status === 401) {
        history.push('/');
        // }
        console.log('something went wrong while fetching restricted areas list', error);
      });
  }
};

export const createRestrcitedArea = (area) => {
  return dispatch => {
    dispatch({ type: restrictedConstants.RESTRICTED_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/restricted-areas`, area, params)
      .then(response => {
        dispatch(createAreaSuccess(response.data));
        dispatch(successAreaAdded(true));
        dispatch(successMessage('Area successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create restrcited area ' + error.message))
      });
  }
}

export const updateRestrcitedArea = (area) => {
  return dispatch => {
    dispatch({ type: restrictedConstants.RESTRICTED_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/restricted-areas/${area.id}`, area, params)
      .then(response => {
        dispatch(updateAreaSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update restricted area', error);
      });
  }
}

export const getRestrictedAreaId = (areaId) => {
  return dispatch => {
    dispatch({ type: restrictedConstants.RESTRICTED_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/restricted-areas/${areaId}`, params)
      .then(response => {
        let area = response.data;
        dispatch(setAreaSuccess(area))
      })
      .catch(error => {
        console.log('something went wrong while fetching get restricted area by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListAreasSuccess = areas => ({
  type: restrictedConstants.RESTRICTED_LIST_AREAS,
  payload: { areas }
});

export const updateAreaSuccess = area => ({
  type: restrictedConstants.RESTRICTED_UPDATE_ID,
  payload: { area }
});

export const createAreaSuccess = area => ({
  type: restrictedConstants.RESTRICTED_ADD,
  payload: { area }
});

export const successAreaAdded = (flag) => ({
  type: restrictedConstants.RESTRICTED_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: restrictedConstants.RESTRICTED_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: restrictedConstants.RESTRICTED_ERROR_MESSAGE,
  payload: { message }
})

export const deleteAreaSuccess = area => ({
  type: restrictedConstants.RESTRICTED_DELETE_ID,
  payload: { area }
});

export const getAreaSuccess = area => ({
  type: restrictedConstants.RESTRICTED_GET_ID,
  payload: { area }
});

export const setAreaSuccess = area => ({
  type: restrictedConstants.RESTRICTED_SET_SUCCESS,
  payload: { area }
});

export const setCurrentFieldToEditArea = fieldName => ({
  type: restrictedConstants.RESTRICTED_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetAreas = (flag) => ({
  type: restrictedConstants.RESTRICTED_RESET,
  payload: { flag }
});

