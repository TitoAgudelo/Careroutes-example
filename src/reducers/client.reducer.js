import { clientsConstants } from '../constants';

const INITIAL_STATE = () => ({
	clients: [],
  currentClient: null,
  currentFieldName: '',
  sucessAdded: false,
  successMessage: '',
  errorMessage: ''
});

const clientsReducer = ( state = new INITIAL_STATE(), action ) => {
	switch(action.type){
    case clientsConstants.CLIENT_LIST_CLIENTS:
      return { ...state, clients: [ ...action.payload.clients ] };
    case clientsConstants.CLIENT_ADD:
      return { ...state, clients: [ action.payload.client, ...state.clients ] };
    case clientsConstants.CLIENT_SUCCESS_ADDED:
      return { ...state, sucessAdded: action.payload.flag }
    case clientsConstants.CLIENT_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload.message }
    case clientsConstants.CLIENT_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload.message }
    case clientsConstants.CLIENT_UPDATE_ID:
      return { ...state,
        clients: [ Object.assign({}, action.payload.client),
          ...state.clients.filter(client => client.id !== action.payload.client.id) ] };
    case clientsConstants.CLIENT_DELETE_ID:
      return { ...state, clients: [ ...state.clients.filter(client => client.id !== action.payload.client.id) ] };
    case clientsConstants.CLIENT_SET_SUCCESS:
      return { ...state, currentClient: Object.assign({}, action.payload.client) };
    case clientsConstants.CLIENT_SET_FIELD_SUCCESS:
      return { ...state, currentFieldName: action.payload.fieldName };
    case clientsConstants.CLIENT_RESET:
      const newState = new INITIAL_STATE();
      return newState;
    default:
      return state
	}
}

export default clientsReducer;