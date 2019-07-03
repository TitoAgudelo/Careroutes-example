import axios from 'axios';

import { clientsConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadClients = (props) => {
  return dispatch => {
    dispatch({ type: clientsConstants.CLIENT_FETCHING_LIST_CLIENTS })
    const { limit, offset, search, providerId, isActive, regionId } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + '&': ''}${providerId ? 'providerId=' + providerId + '&': ''}${isActive ? 'isActive=' + isActive + (regionId ? '&' : ''): ''}${regionId ? 'regionId=' + regionId : ''}`;
    return axios.get(`${ROOT_URL}/clients?${filters}`, params)
      .then(response => {
        if (response.data.clients.length > 0) {
          dispatch(getListClientsSuccess(response.data.clients))
        }
        return response.data;
      })
      .catch(error => {
        if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        }
        console.log('something went wrong while fetching clients list', error);
      });
  }
};

export const createClient = (client) => {
  return dispatch => {
    dispatch({ type: clientsConstants.CLIENT_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/clients`, client, params)
      .then(response => {
        dispatch(createClientSuccess(response.data));
        dispatch(successClientAdded(true));
        dispatch(successMessage('Client successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create client ' + error.message))
      });
  }
}

export const updateClient = (client) => {
  return dispatch => {
    dispatch({ type: clientsConstants.CLIENT_FETCHING_UPDATE_ID })
    const data = Object.assign({}, client);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/client/${client.id}`, data, params)
      .then(response => {
        dispatch(updateClientSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update client', error);
      });
  }
}

export const getClientById = (clientId) => {
  return dispatch => {
    dispatch({ type: clientsConstants.CLIENT_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/clients/${clientId}`, params)
      .then(response => {
        dispatch(setClientSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get client by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListClientsSuccess = clients => ({
  type: clientsConstants.CLIENT_LIST_CLIENTS,
  payload: { clients }
});

export const updateClientSuccess = client => ({
  type: clientsConstants.CLIENT_UPDATE_ID,
  payload: { client }
});

export const createClientSuccess = client => ({
  type: clientsConstants.CLIENT_ADD,
  payload: { client }
});

export const successClientAdded = (flag) => ({
  type: clientsConstants.CLIENT_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: clientsConstants.CLIENT_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: clientsConstants.CLIENT_ERROR_MESSAGE,
  payload: { message }
})

export const deleteClientSuccess = client => ({
  type: clientsConstants.CLIENT_DELETE_ID,
  payload: { client }
});

export const getClientSuccess = client => ({
  type: clientsConstants.CLIENT_GET_ID,
  payload: { client }
});

export const setClientSuccess = client => ({
  type: clientsConstants.CLIENT_SET_SUCCESS,
  payload: { client }
});

export const setCurrentFieldToEditClient = fieldName => ({
  type: clientsConstants.CLIENT_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetClients = (flag) => ({
  type: clientsConstants.CLIENT_RESET,
  payload: { flag }
});

