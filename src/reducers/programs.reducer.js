import { programsConstants } from '../constants';

const INITIAL_STATE = () => ({
	programs: [],
  currentProgram: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const programsReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case programsConstants.PROGRAMS_LIST_PROGRAMS:
      return { ...state, programs: [ ...action.payload.activities ] };
    case programsConstants.PROGRAMS_ADD:
      return { ...state, programs: [ action.payload.activity, ...state.activities ] };
    case programsConstants.PROGRAMS_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case programsConstants.PROGRAMS_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case programsConstants.PROGRAMS_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case programsConstants.PROGRAMS_UPDATE_ID:
      return { ...state,
        programs: [ Object.assign({}, action.payload.activity),
          ...state.activities.filter(activity => activity.id !== action.payload.activity.id) ] };
    case programsConstants.PROGRAMS_DELETE_ID:
      return { ...state, programs: [ ...state.programs.filter(activity => activity.id !== action.payload.activity.id) ] };
    case programsConstants.PROGRAMS_SET_SUCCESS:
      return { ...state, currentProgram: Object.assign({}, action.payload.activity) };
    case programsConstants.PROGRAMS_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case programsConstants.PROGRAMS_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default programsReducer;