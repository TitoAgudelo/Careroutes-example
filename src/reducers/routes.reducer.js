import { routesConstants } from '../constants';

const INITIAL_STATE = () => ({
	routes: [],
  currentRoute: null,
  currentFieldName: '',
  successAdded: false,
  successMessage: '',
  errorMessage: '',
  errorListMessage: '',
  errorGenerateMessage: ''
});

const routesReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case routesConstants.ROUTES_LIST_ACTIVITIES:
      return { ...state, routes: [ ...action.payload.routes ], errorListMessage: '' };
    case routesConstants.ROUTES_ADD:
      return { ...state, routes: [ action.payload.route, ...state.routes ] };
    case routesConstants.ROUTES_SUCCESS_ADDED:
      return { ...state, successAdded: action.payload.flag }
    case routesConstants.ROUTES_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case routesConstants.ROUTES_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case routesConstants.ROUTE_UPDATE_DRIVER:
      return {
        ...state,
        currentRoute: Object.assign({}, state.currentRoute, { driverId: action.payload.route.driverId }),
      };
    case routesConstants.ROUTE_UPDATE_VEHICLE:
      return {
        ...state,
        currentRoute: Object.assign({}, state.currentRoute, { vehicleId: action.payload.route.vehicleId }),
      };
    // case activitiesConstants.ACTIVITIES_DELETE_ID:
    //   return { ...state, activities: [ ...state.activities.filter(activity => activity.id !== action.payload.activity.id) ] };
    case routesConstants.ROUTE_SET_SUCCESS:
      return { ...state, currentRoute: Object.assign({}, action.payload.route) };
    case routesConstants.ROUTE_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case routesConstants.ROUTE_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    case routesConstants.ROUTES_ERROR_LIST_MESSAGE:
      return { ...state, routes: [], errorListMessage: action.payload.message }
    case routesConstants.ROUTES_ERROR_GENERATE_MESSAGE:
      return { ...state, routes: [], errorGenerateMessage: action.payload.message }
    default:
      return state
	}
}

export default routesReducer;