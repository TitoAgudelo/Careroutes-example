import { driverConstants } from '../constants';

const INITIAL_STATE = () => ({
	drivers: [],
  currentDriver: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const driversReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case driverConstants.DRIVER_LIST_DRIVERS:
      return { ...state, drivers: [ ...action.payload.drivers ] };
    case driverConstants.DRIVER_ADD:
      return { ...state, drivers: [ action.payload.driver, ...state.drivers ] };
    case driverConstants.DRIVER_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case driverConstants.DRIVER_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case driverConstants.DRIVER_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case driverConstants.DRIVER_UPDATE_ID:
      return { ...state, currentDriver: action.payload.driver,
        drivers: [ Object.assign({}, action.payload.driver),
          ...state.drivers.filter(driver => driver.id !== action.payload.driver.id) ] };
    case driverConstants.DRIVER_DELETE_ID:
      return { ...state, drivers: [ ...state.drivers.filter(driver => driver.id !== action.payload.driver.id) ] };
    case driverConstants.DRIVER_SET_SUCCESS:
      return { ...state, currentDriver: Object.assign({}, action.payload.driver) };
    case driverConstants.DRIVER_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case driverConstants.DRIVER_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default driversReducer;