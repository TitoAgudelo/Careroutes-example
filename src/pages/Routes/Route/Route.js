import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import polyline from '@mapbox/polyline';

import actions from './../../../actions';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import Loading from './../../../components/Loading/Loading';
import MapField from './../../../components/MapField/MapField';
import Waypoints from './../../../components/Waypoints/Waypoints';
import { history } from './../../../helpers/history';

import './Route.scss';

class RouteDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCurrentView: 'route',
      currentRoute: null,
      isLoading: true,
      drivers: [],
      vehicles: [],
      region: null,
      routeId: 0,
    };

    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.saveDriver = this.saveDriver.bind(this);
    this.saveVehicle = this.saveVehicle.bind(this);
  }

  parseUrl(search) {
    return search.replace(/\?/, '').split('&').reduce((prev, current) => {
      const [key, value] = current.split('=');
      return {
        ...prev,
        [key]: value,
      };
    }, {});
  }

  componentDidMount() {
    const loadProps = { isActive: true }
    const id = this.props.match.params.id;
    this.setState({ routeId: id })
    if (id) {
      this.props.getRouteById(id);
    }

    this.props.loadVehicles(loadProps)
    this.props.loadUsers({ ...loadProps, role: 'driver' })

    const { region } = this.parseUrl(this.props.location.search);

    if (region) {
      this.props.getRegionId(region);
    }

  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.route.currentRoute && nextProps.route.currentRoute.id && !this.state.currentRoute) {
      this.setState({ currentRoute: nextProps.route.currentRoute });
    }

    if (nextProps.drivers.length !== this.state.drivers.length) {
      this.setState({ drivers: [ ...nextProps.drivers ] })
    }

    if (nextProps.vehicles.length !== this.state.vehicles.length) {
      this.setState({ vehicles: [ ...nextProps.vehicles ] })
    }

    if (nextProps.currentRegion && nextProps.currentRegion !== this.state.region) {
      this.setState({ region: nextProps.currentRegion })
    }

    const { isLoading, currentRoute, drivers, region } = this.state;
    if (isLoading && currentRoute && region && drivers.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetDrivers(true)
    this.props.resetVehicles(true)
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditRoute('');
  }

  toggleEditField(targetName) {
    console.log(targetName);
    this.props.setCurrentFieldToEditRoute(targetName);
  }

  getDriver(drivers = [], id = -1) {
    return drivers.find(driver => driver.id.toString() === id.toString()) || {};
  }

  getVehicle(vehicles = [], id = -1) {
    return vehicles.find(vehicle => vehicle.id.toString() === id.toString()) || {};
  }

  saveDriver(value, fieldName) {
    const postBody = {
      routeId: +this.state.routeId,
      [fieldName]: +value,
    };

    this.setState(prevState => ({
      currentRoute: {
        ...prevState.currentRoute,
        [fieldName]: value,
      },
    }));

    this.props.updateDriverDetail(postBody);
    this.props.setCurrentFieldToEditRoute('');
  }

  saveVehicle(value, fieldName) {
    const postBody = {
      routeId: +this.state.routeId,
      [fieldName]: +value,
    };

    this.setState(prevState => ({
      currentRoute: {
        ...prevState.currentRoute,
        [fieldName]: value,
      },
    }));

    this.props.updateVehicle(postBody);
    this.props.setCurrentFieldToEditRoute('');
  }

  goBack() {
    history.push('/routes');
  }

  tabView(view) {
    this.setState({ isCurrentView: view })
  }

  render() {
    const { currentFieldName, errorMessage } = this.props.route;
    const { isCurrentView, isLoading, currentRoute, region, drivers, vehicles } = this.state;
    const routeDate = currentRoute && currentRoute.actualStartTime ? moment(currentRoute.actualStartTime).format('MM/DD/YYYY') : '';
    let points = [];
    if (currentRoute && currentRoute.polyline) {
      points = polyline.decode(currentRoute.polyline);
    }

    return (
      <section className="section-route">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="route-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                { isLoading && <Loading /> }
                { currentRoute && (drivers.length && vehicles.length) && (
                  <div className="route-detail">
                    <h1 className="route-detail-title">
                        Routes / {`${(region || {}).name} #${(currentRoute || {}).id}`}
                        <span>({routeDate} - Denver)</span>
                    </h1>
                    <div className="route-detail-tabs">
                      <span className={isCurrentView === 'route' ? 'route-detail-tabs-tab active' : 'route-detail-tabs-tab' } onClick={() => this.tabView('route')}>Primary Info</span>
                      <span className={isCurrentView === 'map' ? 'route-detail-tabs-tab active' : 'route-detail-tabs-tab' } onClick={() => this.tabView('map')}>View Route Map</span>
                      <span className={isCurrentView === 'waypoints' ? 'route-detail-tabs-tab active' : 'route-detail-tabs-tab' } onClick={() => this.tabView('waypoints')}>Way-Points</span>
                    </div>
                    {isCurrentView === 'route' && (
                      <div className="route-detail-body">
                        <form className="route-detail-body-form">
                          <div className="route-detail-body-form-group">
                            <FieldGroup fieldInfo={`${(region || {}).name} #${currentRoute.id}`} fieldLabel="Title" />
                          </div>
                          { currentFieldName === 'driver' ? (
                            <div className="route-detail-body-form-group editing">
                              <EditSelectField fieldId={currentRoute.driverId} fieldLabel="Driver" list={drivers}
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} fieldName="driverId" />
                            </div>
                            ) : (
                            <div className="route-detail-body-form-group" onClick={() => this.toggleEditField('driver')}>
                              <FieldGroup fieldInfo={this.getDriver(drivers, currentRoute.driverId).name} fieldLabel="Driver" />
                            </div>
                            )
                          }
                          <div className="route-detail-body-form-group">
                            <FieldGroup fieldInfo={routeDate} fieldLabel="Date" />
                          </div>
                          { currentFieldName === 'vehicle' ? (
                            <div className="route-detail-body-form-group editing">
                              <EditSelectField fieldId={currentRoute.vehicleId} fieldLabel="Vehicle" list={vehicles}
                                saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} fieldName="vehicleId" />
                            </div>
                            ) : (
                            <div className="route-detail-body-form-group" onClick={() => this.toggleEditField('vehicle')}>
                              <FieldGroup fieldInfo={this.getVehicle(vehicles, currentRoute.vehicleId).title} fieldLabel="Vehicle" />
                            </div>
                            )
                          }
                          <div className="route-detail-body-form-group">
                            <FieldGroup fieldInfo={(((currentRoute.waypoints || [])[0] || {}).location || {}).addressLine1} fieldLabel="Homebase" />
                          </div>
                          <div className="route-detail-body-form-group">
                            <FieldGroup fieldInfo={currentRoute.actualStartTime ? moment(currentRoute.actualStartTime).format('h:mm A') : ''} fieldLabel="Start-Time" />
                          </div>
                          <div className="route-detail-body-form-group">
                            <FieldGroup fieldInfo={currentRoute.actualEndTime ? moment(currentRoute.actualEndTime).format('h:mm A') : ''} fieldLabel="End-Time" />
                          </div>
                        </form>
                      </div>
                    )}
                    {isCurrentView === 'map' && (
                      <MapField markers={points} waypoints={currentRoute.waypoints} />
                    )}
                    {isCurrentView === 'waypoints' && (
                      <Waypoints waypoints={currentRoute.waypoints} routeId={currentRoute.id} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const FieldGroup = ({ fieldLabel, fieldInfo, editable = false }) => {
  return (
    <div className="client-detail-body-form-wrapper">
      <div className="client-detail-body-form-item">
        <label>{fieldLabel}</label>
      </div>
      <div className="client-detail-body-form-item value">
        <span>{fieldInfo || '--'}</span>
      </div>
      {editable && (
        <div className="client-detail-body-form-item">
          <i className="fas fa-pen"></i>
          <span>Edit</span>
        </div>
      )}
    </div>
  )
}

RouteDetailContainer.propTypes = {
  route: PropTypes.object.isRequired,
}

const mapStateToProps = ({ route, driver, vehicle, region }) => ({
  route,
  drivers: driver.drivers,
  vehicles: vehicle.vehicles,
  currentRegion: region.currentRegion,
});

export default withRouter(connect(mapStateToProps, actions)(RouteDetailContainer));
