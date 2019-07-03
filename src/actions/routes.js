import axios from 'axios';

import { routesConstants } from '../constants';
import { history } from '../helpers';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadRoutes = (props) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTES_FETCHING_LIST_ROUTES })
    const { date, regionId, vehicleId, driverId } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${date ? 'date=' + date + '&': ''}${regionId ? 'regionId=' + regionId + '&': ''}${vehicleId ? 'vehicleId=' + vehicleId + (driverId ? '&' : ''): ''}${driverId ? 'driverId=' + driverId : ''}`;
    return axios.get(`${ROOT_URL}/routing/routes?${filters}`, params)
      .then(response => {
        if (response.data.length > 0) {
          dispatch(getRoutesListSuccess(response.data))
        }
        return response.data;
      })
      .catch(error => {
        if (error.response.status === 400) {
          dispatch(errorListMessage('Something went wrong while fetching routing routes: ' + error.response.data.message))
        }
      });
  }
};

export const checkRoutes = (props) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTES_CHECKING_LIST_ROUTES })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.post(`${ROOT_URL}/routing/planning/check`, props, params)
      .then(response => {
        if (response.data.length > 0) {
          dispatch(getRoutesCheckSuccess(response.data))
        }
        return response.data;
      })
      .catch(error => {
        if (error.response.status === 400) {
          dispatch(errorListMessage('Something went wrong while fetching routing routes: ' + error.response.data.message))
        }
      });
  }
};

export const generateRoute = (route) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTES_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/routing/planning/request`, route, params)
      .then(response => {
        dispatch(generateRouteSuccess(response.data));
        dispatch(successRouteAdded(true));
        dispatch(successMessage('Client successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching generate route ' + error.message))
        if (error.response.status === 400) {
          dispatch(errorGenerateMessage(error.response.data.message))
        }
      });
  }
}

export const getRouteById = (routeId) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTES_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/routing/routes/${routeId}`, params)
      .then(response => {
        dispatch(setRouteSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get client by id', error);
      });
  }
}

export const updateDriverDetail = (driverData) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTE_FETCHING_UPDATE_DRIVER })
    const data = Object.assign({}, driverData);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.post(`${ROOT_URL}/routing/routes/change-driver`, data, params)
      .then(response => {
        dispatch(updateRouteDriverSuccess(response.data || driverData))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update client', error);
      });
  }
}

export const updateVehicle = (vehicleData) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTE_FETCHING_UPDATE_VEHICLE })
    const data = Object.assign({}, vehicleData);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.post(`${ROOT_URL}/routing/routes/change-vehicle`, data, params)
      .then(response => {
        dispatch(updateRouteVehicleSuccess(response.data || vehicleData))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update client', error);
      });
  }
}

export const removeRider = (riderId, routeId) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTE_POSTING_REMOVE_RIDER })
    const data = { "rideId": riderId }
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.post(`${ROOT_URL}/routing/routes/remove-ride`, data, params)
      .then(response => {
        (getRouteById(routeId))(dispatch)
      })
      .catch(error => {
        console.log('something went wrong while removing ride', error);
      });
  }
}

export const moveWaypoint = (waypointId, newIndex, routeId) => {
  return dispatch => {
    dispatch({ type: routesConstants.ROUTE_POSTING_MOVE_POINT })
    const data = { "waypointId": waypointId, "newIndex": newIndex }
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.post(`${ROOT_URL}/routing/routes/move-waypoint`, data, params)
      .then(response => {
        (getRouteById(routeId))(dispatch)
      })
      .catch(error => {
        console.log('something went wrong while move a waypoint', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const errorGenerateMessage = message => ({
  type: routesConstants.ROUTES_ERROR_GENERATE_MESSAGE,
  payload: { message }
})

export const errorListMessage = message => ({
  type: routesConstants.ROUTES_ERROR_LIST_MESSAGE,
  payload: { message }
})

export const getRoutesListSuccess = routes => ({
  type: routesConstants.ROUTES_LIST_ACTIVITIES,
  payload: { routes }
});

export const generateRouteSuccess = route => ({
  type: routesConstants.ROUTES_ADD,
  payload: { route }
});

export const successRouteAdded = flag => ({
  type: routesConstants.ROUTES_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = message => ({
  type: routesConstants.ROUTES_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = message => ({
  type: routesConstants.ROUTES_ERROR_MESSAGE,
  payload: { message }
});

export const setRouteSuccess = route => ({
  type: routesConstants.ROUTE_SET_SUCCESS,
  payload: { route }
});

export const setCurrentFieldToEditRoute = fieldName => ({
  type: routesConstants.ROUTE_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetRoutes = (flag) => ({
  type: routesConstants.ROUTE_RESET,
  payload: { flag }
});

export const updateRouteDriverSuccess = route => ({
  type: routesConstants.ROUTE_UPDATE_DRIVER,
  payload: { route }
});

export const updateRouteVehicleSuccess = vehicle => ({
  type: routesConstants.ROUTE_UPDATE_VEHICLE,
  payload: { vehicle }
});

export const getRoutesCheckSuccess = routes => ({
  type: routesConstants.ROUTES_CHECK_LIST,
  payload: { routes }
});