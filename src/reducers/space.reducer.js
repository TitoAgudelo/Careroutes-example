import { spaceTypesConstants } from '../constants';

const INITIAL_STATE = () => ({
	spaces: [],
  currentSpace: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const spaceReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case spaceTypesConstants.SPACETYPES_LIST_SPACES:
      return { ...state, spaces: [ ...action.payload.spaces ] };
    case spaceTypesConstants.SPACETYPES_ADD:
      return { ...state, spaces: [ action.payload.space, ...state.spaces ] };
    case spaceTypesConstants.SPACETYPES_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case spaceTypesConstants.SPACETYPES_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case spaceTypesConstants.SPACETYPES_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case spaceTypesConstants.SPACETYPES_UPDATE_ID:
      return { ...state,
        spaces: [ Object.assign({}, action.payload.space),
          ...state.spaces.filter(space => space.id !== action.payload.space.id) ] };
    case spaceTypesConstants.SPACETYPES_DELETE_ID:
      return { ...state, spaces: [ ...state.spaces.filter(space => space.id !== action.payload.space.id) ] };
    case spaceTypesConstants.SPACETYPES_SET_SUCCESS:
      return { ...state, currentSpace: Object.assign({}, action.payload.space) };
    case spaceTypesConstants.SPACETYPES_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case spaceTypesConstants.SPACETYPES_RESET:
      const newState = new INITIAL_STATE();
      return  newState;
    default:
      return state
	}
}

export default spaceReducer;