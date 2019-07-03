import { vehicleConstants } from '../constants';

const INITIAL_STATE = () => ({
	vehicles: [],
  currentVehicle: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const vehicleReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case vehicleConstants.VEHICLE_LIST_VEHICLES:
      return { ...state, vehicles: [ ...action.payload.vehicles ] };
    case vehicleConstants.VEHICLE_ADD:
      return { ...state, vehicles: [ action.payload.vehicle, ...state.vehicles ] };
    case vehicleConstants.VEHICLE_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case vehicleConstants.VEHICLE_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case vehicleConstants.VEHICLE_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case vehicleConstants.VEHICLE_UPDATE_ID:
      return { ...state, currentVehicle: action.payload.vehicle,
        vehicles: [ Object.assign({}, action.payload.vehicle),
          ...state.vehicles.filter(vehicle => vehicle.id !== action.payload.vehicle.id) ] };
    case vehicleConstants.VEHICLE_DELETE_ID:
      return { ...state, vehicles: [ ...state.vehicles.filter(vehicle => vehicle.id !== action.payload.vehicle.id) ] };
    case vehicleConstants.VEHICLE_SET_SUCCESS:
      return { ...state, currentVehicle: Object.assign({}, action.payload.vehicle) };
    case vehicleConstants.VEHICLE_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case vehicleConstants.VEHICLE_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default vehicleReducer;