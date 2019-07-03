import { regionConstants } from '../constants';

const INITIAL_STATE = () => ({
	regions: [],
  currentRegion: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const regionsReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case regionConstants.REGION_LIST_REGIONS:
      return { ...state, regions: [ ...action.payload.regions ] };
    case regionConstants.REGION_ADD:
      return { ...state, regions: [ action.payload.region, ...state.regions ] };
    case regionConstants.REGION_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case regionConstants.REGION_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case regionConstants.REGION_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case regionConstants.REGION_UPDATE_ID:
      return { ...state,
        regions: [ Object.assign({}, action.payload.region),
          ...state.regions.filter(region => region.id !== action.payload.region.id) ] };
    case regionConstants.REGION_DELETE_ID:
      return { ...state, regions: [ ...state.regions.filter(region => region.id !== action.payload.region.id) ] };
    case regionConstants.REGION_SET_SUCCESS:
      return { ...state, currentRegion: Object.assign({}, action.payload.region) };
    case regionConstants.REGION_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case regionConstants.REGION_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default regionsReducer;