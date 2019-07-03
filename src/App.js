import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { func, bool } from 'prop-types';

import PrivateRoute from './helpers/auth-requested';

import Header from './components/Header/Header';
import Aside from './components/Aside/Aside';

import LoginContainer from './pages/Login/Login';
import ResetContainer from './pages/Reset/Reset';
import PasswordContainer from './pages/Password/Password';
import BadContainer from './pages/Bad/Bad';
import SignOut from './pages/Signout/Signout';

import KitContainer from './pages/Kit/Kit';
import HomeContainer from './pages/Home/Home';
import DriversContainer from './pages/Drivers/Drivers';
import DriverDetailContainer from './pages/Drivers/Driver/Driver';
import UsersContainer from './pages/Users/Users';
import UserDetailContainer from './pages/Users/User/User';
import RegionsContainer from './pages/Regions/Regions';
import RegionDetailContainer from './pages/Regions/Region/Region';
import ClientsContainer from './pages/Clients/Clients';
import ClientsDetailContainer from './pages/Clients/Client/Client';
import RoutesContainer from './pages/Routes/Routes';
import RoutesDetailContainer from './pages/Routes/Route/Route';
import VehiclesContainer from './pages/Vehicles/Vehicles';
import DetailVehiclesContainer from './pages/Vehicles/DetailVehicles/DetailVehicles';
import CapacitiesContainer from './pages/Vehicles/Capacities/Capacities';
import CapacitiesDetailContainer from './pages/Vehicles/DetailCapacities/DetailCapacities';
import ModelsContainer from './pages/Vehicles/Models/Models';
import ModelsDetailContainer from './pages/Vehicles/DetailModels/DetailModels';
import FacilitiesContainer from './pages/Facilities/Facilities';
import FacilityDetailContainer from './pages/Facilities/Facility/Facility';
import ProfileContainer from './pages/Profile/Profile';
import ProvidersContainer from './pages/Providers/Providers';
import ProviderDetailContainer from './pages/Providers/Provider/Provider';
import RestrictedAreasContainer from './pages/RestrictedAreas/RestrictedAreas';
import RestrictedDetailContainer from './pages/RestrictedAreas/Restricted/Restricted';
import SpaceTypesContainer from './pages/SpaceTypes/SpaceTypes';
import SpaceTypeContainer from './pages/SpaceTypes/SpaceType/SpaceType';
import ActivitiesContainer from './pages/Activities/Activities';
import ActivityDetailContainer from './pages/Activities/Activity/Activity';
import ProgramContainer from './pages/Programs/Programs';
import ProgramDetailContainer from './pages/Programs/Program/Program';
import ProgrammedContainer from './pages/Programmed/Programmed';
import DispatcherContainer from './pages/Dispatcher/Dispatcher';
import ProgrammedActivityDetailContainer from './pages/Programmed/ProgrammedActivity/ProgrammedActivity';

import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header toggleMenu={this.props.handleToggleMenu}
            menuOpen={this.props.menuOpen} />
        <div className="app-content">
          <Aside menuOpen={this.props.menuOpen} />
          <main className={this.props.menuOpen ? 'expanded app-main' : '' + this.props.isAuthenticated ? 'app-main' : 'app-main full'}>
            <div className="main-content">
              <div className="content">
                <Switch>
                  <Route exact path="/login" component={LoginContainer} />
                  <Route exact path="/reset" component={ResetContainer} />
                  <Route exact path="/first-access/:token" component={PasswordContainer} />
                  <Route exact path="/bad" component={BadContainer} />
                  <Route exact path="/signout" component={SignOut} />
                  <Route exact path="/kit" component={KitContainer} />
                  <PrivateRoute exact path="/home" component={HomeContainer} />
                  <PrivateRoute exact path="/drivers" component={DriversContainer} />
                  <PrivateRoute exact path="/driver/:id" component={DriverDetailContainer} />
                  <PrivateRoute exact path="/users" component={UsersContainer} />
                  <PrivateRoute exact path="/users/:id" component={UserDetailContainer} />
                  <PrivateRoute exact path="/regions" component={RegionsContainer} />
                  <PrivateRoute exact path="/regions/:id" component={RegionDetailContainer} />
                  <PrivateRoute exact path="/clients" component={ClientsContainer} />
                  <PrivateRoute exact path="/clients/:id" component={ClientsDetailContainer} />
                  <PrivateRoute exact path="/routes" component={RoutesContainer} />
                  <PrivateRoute exact path="/routes/:id" component={RoutesDetailContainer} />
                  <PrivateRoute exact path="/vehicles" component={VehiclesContainer} />
                  <PrivateRoute exact path="/vehicles/:id" component={DetailVehiclesContainer} />
                  <PrivateRoute exact path="/vehicle-capacities" component={CapacitiesContainer} />
                  <PrivateRoute exact path="/vehicle-capacities/:id" component={CapacitiesDetailContainer} />
                  <PrivateRoute exact path="/vehicle-models" component={ModelsContainer} />
                  <PrivateRoute exact path="/vehicle-models/:id" component={ModelsDetailContainer} />
                  <PrivateRoute exact path="/facilities" component={FacilitiesContainer} />
                  <PrivateRoute exact path="/facilities/:id" component={FacilityDetailContainer} />
                  <PrivateRoute exact path="/profile" component={ProfileContainer} />
                  <PrivateRoute exact path="/providers" component={ProvidersContainer} />
                  <PrivateRoute exact path="/providers/:id" component={ProviderDetailContainer} />
                  <PrivateRoute exact path="/restricted-areas" component={RestrictedAreasContainer} />
                  <PrivateRoute exact path="/restricted-areas/:id" component={RestrictedDetailContainer} />
                  <PrivateRoute exact path="/space-types" component={SpaceTypesContainer} />
                  <PrivateRoute exact path="/space-types/:id" component={SpaceTypeContainer} />
                  <PrivateRoute exact path="/activities" component={ActivitiesContainer} />
                  <PrivateRoute exact path="/activities/:id" component={ActivityDetailContainer} />
                  <PrivateRoute exact path="/program-activities" component={ProgramContainer} />
                  <PrivateRoute exact path="/program-activities/:id" component={ProgramDetailContainer} />
                  <PrivateRoute exact path="/programmed-activities/:id" component={ProgrammedContainer} />
                  <PrivateRoute exact path="/programmed-activities/:programId/activities/:activityId" component={ProgrammedActivityDetailContainer} />
                  <PrivateRoute exact path="/" component={DispatcherContainer} />
                </Switch>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  handleToggleMenu: func,
  menuOpen: bool
}

const mapStateToProps = state => ({
  menuOpen: state.menu.showMenu,
  isAuthenticated: state.auth.isAuthenticated
})

export const mapDispatchToProps = dispatch => ({
  handleToggleMenu: () => dispatch({
    type: 'MENU_TOGGLE'
  })
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
