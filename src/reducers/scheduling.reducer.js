import { schedulingConstants } from '../constants';

const INITIAL_STATE = () => ({
	events: [],
  currentEvent: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: '',
  successEdited: false
});

const schedulingReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case schedulingConstants.SCHEDULING_LIST_EVENTS:
      return { ...state, events: [ ...action.payload.events ] };
    case schedulingConstants.SCHEDULING_ADD:
      return { ...state, events: [ action.payload.event, ...state.events ] };
    case schedulingConstants.SCHEDULING_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case schedulingConstants.SCHEDULING_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case schedulingConstants.SCHEDULING_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case schedulingConstants.SCHEDULING_UPDATE_ID:
      return { ...state, successEdited: true,
        events: [ Object.assign({}, action.payload.event), ...state.events.filter(event => event.id !== action.payload.event.id) ] };
    case schedulingConstants.SCHEDULING_DELETE_ID:
      return { ...state, events: [ ...state.events.filter(event => event.id !== action.payload.event.id) ], successEdited: true };
    case schedulingConstants.SCHEDULING_SET_SUCCESS:
      return { ...state, currentEvent: Object.assign({}, action.payload.event) };
    case schedulingConstants.SCHEDULING_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case schedulingConstants.SCHEDULING_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    case schedulingConstants.RESET_EDIT_STATUS:
        return { ...state, successEdited: false };
    default:
      return state
	}
}

export default schedulingReducer;