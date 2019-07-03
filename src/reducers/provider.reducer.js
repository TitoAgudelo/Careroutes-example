import { providerConstants } from '../constants';

const INITIAL_STATE = () => ({
  providers: [],
  types: [],
  currentProvider: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const providersReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case providerConstants.PROVIDER_LIST_PROVIDERS:
      return { ...state, providers: [ ...action.payload.providers ] };
    case providerConstants.PROVIDER_GET_PROVIDER_TYPES:
      return { ...state, types: [ ...action.payload.types ] };
    case providerConstants.PROVIDER_ADD:
      return { ...state, providers: [ action.payload.provider, ...state.providers ] };
    case providerConstants.PROVIDER_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case providerConstants.PROVIDER_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case providerConstants.PROVIDER_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case providerConstants.PROVIDER_UPDATE_ID:
      return { ...state,
        providers: [ Object.assign({}, action.payload.provider),
          ...state.providers.filter(provider => provider.id !== action.payload.provider.id) ] };
    case providerConstants.PROVIDER_DELETE_ID:
      return { ...state, providers: [ ...state.providers.filter(provider => provider.id !== action.payload.provider.id) ] };
    case providerConstants.PROVIDER_SET_SUCCESS:
      return { ...state, currentProvider: Object.assign({}, action.payload.provider) };
    case providerConstants.PROVIDER_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case providerConstants.PROVIDER_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default providersReducer;