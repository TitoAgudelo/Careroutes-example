import axios from 'axios';

import { spaceTypesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadSpaceTypes = (props) => {
  return dispatch => {
    dispatch({ type: spaceTypesConstants.SPACETYPES_FETCHING_LIST_SPACES })
    const { isActive, limit, offset } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/space-types?${filters}`, params)
      .then(response => {
        if (response.data.types.length > 0) {
          dispatch(getListSpacesSuccess(response.data.types))
        }
      })
      .catch(error => {
        history.push('/');
        console.log('something went wrong while fetching restricted spaces list', error);
      });
  }
};

export const createSpaceType = (space) => {
  return dispatch => {
    dispatch({ type: spaceTypesConstants.SPACETYPES_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/space-types`, space, params)
      .then(response => {
        dispatch(createSpaceSuccess(response.data));
        dispatch(successSpaceAdded(true));
        dispatch(successMessage('Space type successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create space type ' + error.message))
      });
  }
}

export const updateSpaceType = (space) => {
  return dispatch => {
    dispatch({ type: spaceTypesConstants.SPACETYPES_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/space-types/${space.id}`, space, params)
      .then(response => {
        dispatch(updateSpaceSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update space type ', error);
      });
  }
}

export const getSpaceTypeId = (spaceId) => {
  return dispatch => {
    dispatch({ type: spaceTypesConstants.SPACETYPES_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/space-types/${spaceId}`, params)
      .then(response => {
        let space = response.data;
        dispatch(setSpaceSuccess(space))
      })
      .catch(error => {
        console.log('something went wrong while fetching get space type by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListSpacesSuccess = spaces => ({
  type: spaceTypesConstants.SPACETYPES_LIST_SPACES,
  payload: { spaces }
});

export const updateSpaceSuccess = space => ({
  type: spaceTypesConstants.SPACETYPES_UPDATE_ID,
  payload: { space }
});

export const createSpaceSuccess = space => ({
  type: spaceTypesConstants.SPACETYPES_ADD,
  payload: { space }
});

export const successSpaceAdded = (flag) => ({
  type: spaceTypesConstants.SPACETYPES_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: spaceTypesConstants.SPACETYPES_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: spaceTypesConstants.SPACETYPES_ERROR_MESSAGE,
  payload: { message }
})

export const deleteSpaceSuccess = space => ({
  type: spaceTypesConstants.SPACETYPES_DELETE_ID,
  payload: { space }
});

export const getSpaceSuccess = space => ({
  type: spaceTypesConstants.SPACETYPES_GET_ID,
  payload: { space }
});

export const setSpaceSuccess = space => ({
  type: spaceTypesConstants.SPACETYPES_SET_SUCCESS,
  payload: { space }
});

export const setCurrentFieldToEditSpace = fieldName => ({
  type: spaceTypesConstants.SPACETYPES_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetSpaces = (flag) => ({
  type: spaceTypesConstants.SPACETYPES_RESET,
  payload: { flag }
});

