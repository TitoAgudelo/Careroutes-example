import { vehicleModelsConstants } from '../constants';

const INITIAL_STATE = () => ({
	models: [],
  currentModel: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const vehicleModelsReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case vehicleModelsConstants.VEHICLE_MODELS_LIST_MODELS:
      return { ...state, models: [ ...action.payload.models ] };
    case vehicleModelsConstants.VEHICLE_MODELS_ADD:
      return { ...state, models: [ action.payload.model, ...state.models ] };
    case vehicleModelsConstants.VEHICLE_MODELS_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case vehicleModelsConstants.VEHICLE_MODELS_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case vehicleModelsConstants.VEHICLE_MODELS_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case vehicleModelsConstants.VEHICLE_MODELS_UPDATE_ID:
      return { ...state,
        models: [ Object.assign({}, action.payload.model),
          ...state.models.filter(model => model.id !== action.payload.model.id) ] };
    case vehicleModelsConstants.VEHICLE_MODELS_DELETE_ID:
      return { ...state, models: [ ...state.models.filter(model => model.id !== action.payload.model.id) ] };
    case vehicleModelsConstants.VEHICLE_MODELS_SET_SUCCESS:
      return { ...state, currentModel: Object.assign({}, action.payload.model) };
    case vehicleModelsConstants.VEHICLE_MODELS_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case vehicleModelsConstants.VEHICLE_MODELS_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default vehicleModelsReducer;