import { restrictedConstants } from '../constants';

const INITIAL_STATE = () => ({
	areas: [],
  currentArea: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const restrictedReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case restrictedConstants.RESTRICTED_LIST_AREAS:
      return { ...state, areas: [ ...action.payload.areas ] };
    case restrictedConstants.RESTRICTED_ADD:
      return { ...state, areas: [ action.payload.area, ...state.areas ] };
    case restrictedConstants.RESTRICTED_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case restrictedConstants.RESTRICTED_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case restrictedConstants.RESTRICTED_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case restrictedConstants.RESTRICTED_UPDATE_ID:
      return { ...state,
        areas: [ Object.assign({}, action.payload.area),
          ...state.areas.filter(area => area.id !== action.payload.area.id) ] };
    case restrictedConstants.RESTRICTED_DELETE_ID:
      return { ...state, areas: [ ...state.areas.filter(area => area.id !== action.payload.area.id) ] };
    case restrictedConstants.RESTRICTED_SET_SUCCESS:
      return { ...state, currentArea: Object.assign({}, action.payload.area) };
    case restrictedConstants.RESTRICTED_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case restrictedConstants.RESTRICTED_RESET:
      const newState = new INITIAL_STATE();
      return  newState;
    default:
      return state
	}
}

export default restrictedReducer;