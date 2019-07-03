import { clientPlacesConstants } from '../constants';

const INITIAL_STATE = () => ({
	places: [],
  currentPlace: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const clientPlacesReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case clientPlacesConstants.CLIENT_PLACES_LIST_PLACES:
      return { ...state, places: [ ...action.payload.places ] };
    case clientPlacesConstants.CLIENT_PLACES_ADD:
      return { ...state, places: [ action.payload.place, ...state.places ] };
    case clientPlacesConstants.CLIENT_PLACES_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case clientPlacesConstants.CLIENT_PLACES_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case clientPlacesConstants.CLIENT_PLACES_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case clientPlacesConstants.CLIENT_PLACES_UPDATE_ID:
      return { ...state,
        places: [ Object.assign({}, action.payload.place),
          ...state.places.filter(place => place.id !== action.payload.place.id) ] };
    case clientPlacesConstants.CLIENT_PLACES_DELETE_ID:
      return { ...state, places: [ ...state.places.filter(place => place.id !== action.payload.place.id) ] };
    case clientPlacesConstants.CLIENT_PLACES_SET_SUCCESS:
      return { ...state, currentPlace: Object.assign({}, action.payload.place) };
    case clientPlacesConstants.CLIENT_PLACES_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case clientPlacesConstants.CLIENT_PLACES_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default clientPlacesReducer;