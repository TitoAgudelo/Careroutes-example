import axios from 'axios';

import { providerConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadProviders = (props) => {
  return dispatch => {
    dispatch({ type: providerConstants.PROVIDER_FETCHING_LIST_PROVIDERS })
    const { isActive, limit, offset, search } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${limit ? 'limit=' + limit + '&': ''}${offset ? 'offset=' + offset + '&': ''}${search ? 'search=' + search + (isActive ? '&' : ''): ''}${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/providers?${filters}`, params)
      .then(response => {
        if (response.data.providers.length > 0) {
          dispatch(getListProvidersSuccess(response.data.providers))
        }
      })
      .catch(error => {
        // if(error.response.status === 401) {
          localStorage.removeItem('token');
          history.push('/login');
        // }
        console.log('something went wrong while fetching providers list', error);
      });
  }
};

export const loadProvidersTypes = (props) => {
  return dispatch => {
    dispatch({ type: providerConstants.PROVIDER_FETCHING_GET_PROVIDER_TYPES })
    const { isActive } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${isActive ? 'isActive=' + isActive : ''}`;
    axios.get(`${ROOT_URL}/provider-types?${filters}`, params)
      .then(response => {
        if (response.data.types.length > 0) {
          dispatch(getListProvidersTypesSuccess(response.data.types))
        }
      })
      .catch(error => {
        localStorage.removeItem('token');
        history.push('/login');
        console.log('something went wrong while fetching providers types list', error);
      });
  }
};

export const createProvider = (provider) => {
  return dispatch => {
    dispatch({ type: providerConstants.PROVIDER_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/providers`, provider, params)
      .then(response => {
        dispatch(createProviderSuccess(response.data));
        dispatch(successProviderAdded(true));
        dispatch(successMessage('Provider successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create provider ' + error.message))
      });
  }
}

export const updateProvider = (provider) => {
  return dispatch => {
    dispatch({ type: providerConstants.PROVIDER_FETCHING_UPDATE_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.put(`${ROOT_URL}/providers/${provider.id}`, provider, params)
      .then(response => {
        dispatch(updateProviderSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update provider', error);
      });
  }
}

export const getProviderId = (providerId) => {
  return dispatch => {
    dispatch({ type: providerConstants.PROVIDER_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/providers/${providerId}`, params)
      .then(response => {
        let provider = response.data;
        dispatch(setProviderSuccess(provider))
      })
      .catch(error => {
        console.log('something went wrong while fetching get provider by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListProvidersTypesSuccess = types => ({
  type: providerConstants.PROVIDER_GET_PROVIDER_TYPES,
  payload: { types }
})

export const getListProvidersSuccess = providers => ({
  type: providerConstants.PROVIDER_LIST_PROVIDERS,
  payload: { providers }
});

export const updateProviderSuccess = provider => ({
  type: providerConstants.PROVIDER_UPDATE_ID,
  payload: { provider }
});

export const createProviderSuccess = provider => ({
  type: providerConstants.PROVIDER_ADD,
  payload: { provider }
});

export const successProviderAdded = (flag) => ({
  type: providerConstants.PROVIDER_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: providerConstants.PROVIDER_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: providerConstants.PROVIDER_ERROR_MESSAGE,
  payload: { message }
})

export const deleteProviderSuccess = provider => ({
  type: providerConstants.PROVIDER_DELETE_ID,
  payload: { provider }
});

export const getProviderSuccess = provider => ({
  type: providerConstants.PROVIDER_GET_ID,
  payload: { provider }
});

export const setProviderSuccess = provider => ({
  type: providerConstants.PROVIDER_SET_SUCCESS,
  payload: { provider }
});

export const setCurrentFieldToEditProvider = fieldName => ({
  type: providerConstants.PROVIDER_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetProviders = (flag) => ({
  type: providerConstants.PROVIDER_RESET,
  payload: { flag }
});

