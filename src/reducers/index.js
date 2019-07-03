import { combineReducers } from "redux";

import menu from './menu.reducer';
import authentication from './authentication.reducer';
import authReducer from './auth.reducer';
import errorReducer from './error.reducer';
import driversReducer from './driver.reducer';
import regionsReducer from './region.reducer';
import providersReducer from './provider.reducer';
import restrictedReducer from './restricted.reducer';
import clientsReducer from './client.reducer';
import clientPlacesReducer from './client.place.reducer';
import vehicleReducer from './vehicle.reducer';
import vehicleCapacitiesReducer from './vehicle.capacities.reducer';
import vehicleModelsReducer from './vehicle.models.reducer';
import facilitiesReducer from './facilities.reducer';
import activitiesReducer from './activities.reducer';
import programsReducer from './programs.reducer';
import programmedReducer from './programmed.reducer';
import userReducer from './user.reducer';
import spaceReducer from './space.reducer';
import schedulingReducer from './scheduling.reducer';
import routesReducer from './routes.reducer';


export default combineReducers({
  menu,
  authentication,
  auth: authReducer,
  errors: errorReducer,
  driver: driversReducer,
  region: regionsReducer,
  user: userReducer,
  provider: providersReducer,
  area: restrictedReducer,
  client: clientsReducer,
  place: clientPlacesReducer,
  vehicle: vehicleReducer,
  capacity: vehicleCapacitiesReducer,
  model: vehicleModelsReducer,
  facility: facilitiesReducer,
  space: spaceReducer,
  activity: activitiesReducer,
  program: programsReducer,
  programmed: programmedReducer,
  schedule: schedulingReducer,
  route: routesReducer,
});
