import { facilitiesConstants } from '../constants';

const INITIAL_STATE = () => ({
	facilities: [],
  currentFacility: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const facilitiesReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case facilitiesConstants.FACILITIES_LIST_FACILITIES:
      return { ...state, facilities: [ ...action.payload.facilities ] };
    case facilitiesConstants.FACILITIES_ADD:
      return { ...state, facilities: [ action.payload.facility, ...state.facilities ] };
    case facilitiesConstants.FACILITIES_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case facilitiesConstants.FACILITIES_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case facilitiesConstants.FACILITIES_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case facilitiesConstants.FACILITIES_UPDATE_ID:
      return { ...state,
        facilities: [ Object.assign({}, action.payload.facility),
          ...state.facilities.filter(facility => facility.id !== action.payload.facility.id) ] };
    case facilitiesConstants.FACILITIES_DELETE_ID:
      return { ...state, facilities: [ ...state.facilities.filter(facility => facility.id !== action.payload.facility.id) ] };
    case facilitiesConstants.FACILITIES_SET_SUCCESS:
      return { ...state, currentFacility: Object.assign({}, action.payload.facility) };
    case facilitiesConstants.FACILITIES_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case facilitiesConstants.FACILITIES_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default facilitiesReducer;