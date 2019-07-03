import { activitiesConstants } from '../constants';

const INITIAL_STATE = () => ({
	activities: [],
  currentActivity: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const activitiesReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case activitiesConstants.ACTIVITIES_LIST_ACTIVITIES:
      return { ...state, activities: [ ...action.payload.activities ] };
    case activitiesConstants.ACTIVITIES_ADD:
      return { ...state, activities: [ action.payload.activity, ...state.activities ] };
    case activitiesConstants.ACTIVITIES_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case activitiesConstants.ACTIVITIES_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case activitiesConstants.ACTIVITIES_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case activitiesConstants.ACTIVITIES_UPDATE_ID:
      return { ...state,
        activities: [ Object.assign({}, action.payload.activity),
          ...state.activities.filter(activity => activity.id !== action.payload.activity.id) ] };
    case activitiesConstants.ACTIVITIES_DELETE_ID:
      return { ...state, activities: [ ...state.activities.filter(activity => activity.id !== action.payload.activity.id) ] };
    case activitiesConstants.ACTIVITIES_SET_SUCCESS:
      return { ...state, currentActivity: Object.assign({}, action.payload.activity) };
    case activitiesConstants.ACTIVITIES_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case activitiesConstants.ACTIVITIES_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default activitiesReducer;