import axios from 'axios';

import { schedulingConstants } from '../constants';

const ROOT_URL='http://careroutes-api-dev.us-east-2.elasticbeanstalk.com/api';

export const loadScheduling = (props) => {
  return dispatch => {
    dispatch({ type: schedulingConstants.SCHEDULING_FETCHING_LIST_EVENTS })
    const { startDate, endDate, eventType, regionId, driverId, vehicleId, clientId } = props;
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    const filters = `${startDate ? 'startDate=' + startDate + '&': ''}${endDate ? 'endDate=' + endDate + '&': ''}${eventType ? 'eventType=' + eventType + '&' : ''}${regionId ? 'regionId=' + regionId + '&' : ''}${driverId ? 'driverId=' + driverId + '&' : ''}${vehicleId ? 'vehicleId=' + vehicleId + '&' : ''}${clientId ? 'clientId=' + clientId : ''}`;
    return axios.get(`${ROOT_URL}/scheduling?${filters}`, params)
      .then(response => {
        if (response.data.length > 0) {
          dispatch(getListSchedulingSuccess(response.data))
        }
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching scheduling list events', error);
      });
  }
};

export const createSchedulingEvent = (event) => {
  return dispatch => {
    dispatch({ type: schedulingConstants.SCHEDULING_FETCHING_ADD })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.post(`${ROOT_URL}/scheduling`, event, params)
      .then(response => {
        dispatch(createSchedulingSuccess(response.data));
        dispatch(successSchedulingAdded(true));
        dispatch(successMessage('Scheduling successfuly added'));
        return response.data;
      })
      .catch(error => {
        dispatch(errorMessage('Something went wrong while fetching create scheduling event ' + error.message))
      });
  }
}

export const updateSchedulingEvent = (event) => {
  return dispatch => {
    dispatch({ type: schedulingConstants.SCHEDULING_FETCHING_UPDATE_ID })
    const data = Object.assign({}, event);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    return axios.put(`${ROOT_URL}/scheduling/${event.id}`, data, params)
      .then(response => {
        dispatch(updateSchedulingSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching update scheduling event', error);
      });
  }
}

export const deleteSchedulingEvent = (event) => {
  return dispatch => {
    dispatch({ type: schedulingConstants.SCHEDULING_FETCHING_DELETE_ID })
    const CancelEventInput = { mode: "all" }
    const data = Object.assign({}, CancelEventInput);
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      },
      data
    }
    return axios.delete(`${ROOT_URL}/scheduling/${event.id}`, params)
      .then(response => {
        dispatch(deleteSchedulingSuccess(response.data))
        return response.data;
      })
      .catch(error => {
        console.log('something went wrong while fetching deleting scheduling event', error);
      });
  }
}

export const getSchedulingById = (schedulingId) => {
  return dispatch => {
    dispatch({ type: schedulingConstants.SCHEDULING_GET_ID })
    let params = {
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem('token')}`
      }
    }
    axios.get(`${ROOT_URL}/scheduling/${schedulingId}`, params)
      .then(response => {
        dispatch(setSchedulingSuccess(response.data))
      })
      .catch(error => {
        console.log('something went wrong while fetching get scheduling event by id', error);
      });
  }
}

/*
-------------------------------------------------------------------------
                      Funtionaly Actions
-------------------------------------------------------------------------
*/

export const getListSchedulingSuccess = events => ({
  type: schedulingConstants.SCHEDULING_LIST_EVENTS,
  payload: { events }
});

export const updateSchedulingSuccess = event => ({
  type: schedulingConstants.SCHEDULING_UPDATE_ID,
  payload: { event }
});

export const createSchedulingSuccess = event => ({
  type: schedulingConstants.SCHEDULING_ADD,
  payload: { event }
});

export const successSchedulingAdded = (flag) => ({
  type: schedulingConstants.SCHEDULING_SUCCESS_ADDED,
  payload: { flag }
});

export const successMessage = (message) => ({
  type: schedulingConstants.SCHEDULING_SUCCESS_MESSAGE,
  payload: { message }
});

export const errorMessage = (message) => ({
  type: schedulingConstants.SCHEDULING_ERROR_MESSAGE,
  payload: { message }
})

export const deleteSchedulingSuccess = event => ({
  type: schedulingConstants.SCHEDULING_DELETE_ID,
  payload: { event }
});

export const getSchedulingSuccess = event => ({
  type: schedulingConstants.SCHEDULING_GET_ID,
  payload: { event }
});

export const setSchedulingSuccess = event => ({
  type: schedulingConstants.SCHEDULING_SET_SUCCESS,
  payload: { event }
});

export const setCurrentFieldToEditScheduling = fieldName => ({
  type: schedulingConstants.SCHEDULING_SET_FIELD_SUCCESS,
  payload: { fieldName }
});

export const resetSchedulingEvents = (flag) => ({
  type: schedulingConstants.SCHEDULING_RESET,
  payload: { flag }
});

export const resetEditStatus = () => ({
  type: schedulingConstants.RESET_EDIT_STATUS,
})
