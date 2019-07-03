import * as userActions from './auth';
import * as driversActions from './drivers';
import * as regionsActions from './regions';
import * as providersActions from './providers';
import * as restrictedActions from './restricted';
import * as clientsActions from './clients';
import * as clientPlacesActions from './client.places';
import * as searchActions from './users';
import * as vehiclesActions from './vehicles';
import * as vehiclesCapacitiesActions from './vehicle.capacities';
import * as vehiclesModelsActions from './vehicle.models';
import * as facilitiesActions from './facilities';
import * as spaceTypeActions from './spaces';
import * as activitiesActions from './activities';
import * as programsActions from './programs';
import * as programmedActions from './programmed';
import * as schedulingActions from './scheduling';
import * as routesActions from './routes';
import { alertActions } from './alert';
import { menuActions } from './menu';

const actions = Object.assign(
  {},
  driversActions,
  regionsActions,
  alertActions,
  menuActions,
  userActions,
  searchActions,
  providersActions,
  restrictedActions,
  clientsActions,
  clientPlacesActions,
  vehiclesActions,
  vehiclesCapacitiesActions,
  vehiclesModelsActions,
  facilitiesActions,
  spaceTypeActions,
  activitiesActions,
  programsActions,
  programmedActions,
  schedulingActions,
  routesActions,
);

export default actions;