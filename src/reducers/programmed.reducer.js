import { programmedConstants } from '../constants';

const INITIAL_STATE = () => ({
	programmed: [],
  currentProgrammed: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const programmedReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case programmedConstants.PROGRAMMED_LIST_PROGRAMMED:
      return { ...state, programmed: [ ...action.payload.activities ] };
    case programmedConstants.PROGRAMMED_ADD:
      return { ...state, programmed: [ action.payload.activity, ...state.programmed ] };
    case programmedConstants.PROGRAMMED_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case programmedConstants.PROGRAMMED_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case programmedConstants.PROGRAMMED_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case programmedConstants.PROGRAMMED_UPDATE_ID:
      return { ...state,
        currentProgrammed: action.payload.activity,
        programmed: [ Object.assign({}, action.payload.activity),
          ...state.programmed.filter(activity => activity.id !== action.payload.activity.id) ] };
    case programmedConstants.PROGRAMMED_DELETE_ID:
      return { ...state, programmed: [ ...state.programs.filter(activity => activity.id !== action.payload.activity.id) ] };
    case programmedConstants.PROGRAMMED_SET_SUCCESS:
      return { ...state, currentProgrammed: Object.assign({}, action.payload.activity) };
    case programmedConstants.PROGRAMMED_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case programmedConstants.PROGRAMMED_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default programmedReducer;