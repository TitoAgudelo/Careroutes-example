import { vehicleCapacitiesConstants } from '../constants';

const INITIAL_STATE = () => ({
	capacities: [],
  currentCapacity: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const vehicleCapacitiesReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_LIST_VEHICLES:
      return { ...state, capacities: [ ...action.payload.capacities ] };
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_ADD:
      return { ...state, capacities: [ action.payload.capacity, ...state.capacities ] };
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_UPDATE_ID:
      return { ...state,
        capacities: [ Object.assign({}, action.payload.capacity),
          ...state.capacities.filter(capacity => capacity.id !== action.payload.capacity.id) ] };
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_DELETE_ID:
      return { ...state, capacities: [ ...state.capacities.filter(capacity => capacity.id !== action.payload.capacity.id) ] };
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SET_SUCCESS:
      return { ...state, currentCapacity: Object.assign({}, action.payload.capacity) };
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case vehicleCapacitiesConstants.VEHICLE_CAPACITIES_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default vehicleCapacitiesReducer;