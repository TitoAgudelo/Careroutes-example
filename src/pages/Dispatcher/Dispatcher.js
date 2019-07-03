import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import ReactTable from "react-table"
import moment from 'moment';

import actions from './../../actions';
import { history } from './../../helpers/history';

import Loading from './../../components/Loading/Loading';
import MapField from './../../components/MapField/MapField';
import Pagination from './../../components/Pagination/Pagination'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './../Clients/Clients.style'

import './Dispatcher.scss';

class DispatcherContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRegion: 'none',
      selectedDate: new Date(),
      selectedDateDatePicker: new Date(),
      isCurrentView: 'live',
      isLoading: false,
      submitted: false,
      newRoute: {
        date: '',
        regionId: -1,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.calculateMarkers = this.calculateMarkers.bind(this);
    this.getCommingRoutes = this.getCommingRoutes.bind(this);
    this.getCompletedRoutes = this.getCompletedRoutes.bind(this);
    this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this);
    this.tabView = this.tabView.bind(this);
    this.goToDetail = this.goToDetail.bind(this);
    this.getRouteData = this.getRouteData.bind(this);
  }

  componentDidMount() {
    const loadProps = {
      isActive: true,
    }

    this.props.loadRegions(loadProps)
    this.props.loadVehicles(loadProps)
    this.props.loadUsers({ ...loadProps, role: 'driver' })
  }

  componentDidUpdate(prevProps) {
    const { routes, errorListMessage } = this.props.route;
    const { routes: prevRoutes, errorListMessage: prevListMessage } = prevProps.route;
    const { isLoading } = this.state;
    if (routes && (prevRoutes !== routes) || errorListMessage && isLoading) {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this.props.resetRegions(true)
    this.props.resetVehicles(true)
    this.props.resetDrivers(true)
    this.props.resetRoutes(true)
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState(prevState => ({
      newRoute: { ...prevState.newRoute, [name]: value },
    }));
  }

  handleChangeDatePicker(date) {
    this.setState({
      selectedDateDatePicker: date,
      selectedDate: moment(date)
    });
    const { selectedDateDatePicker, selectedRegion } = this.state;
    this.performRoutesFetch(moment(selectedDateDatePicker), selectedRegion);
  }

  handleDateChange(operation) {
    return () => {
      const { selectedDate } = this.state;

      if (operation === 'add' && this.isToday(selectedDate)) {
        return;
      }

      const newDate = moment(selectedDate)[operation](1, 'days');
      this.setState({
        selectedDate: newDate,
        selectedDateDatePicker: new Date(newDate),
      }, () => {
        const { selectedDate, selectedRegion } = this.state;
        this.performRoutesFetch(selectedDate, selectedRegion);
      });
    };
  }

  handleRegionChange(event) {
    const { value } = event.target;
    this.setState({
      selectedRegion: value,
    }, () => {
      const { selectedDate, selectedRegion } = this.state;
      this.performRoutesFetch(selectedDate, selectedRegion);
    });
  }

  performRoutesFetch(date, region) {
    if (region === 'none') {
      return;
    }

    const routeProps = {
      date: moment(date).format('YYYY-MM-DD'), // Date sample with data: '2019-04-01'
      regionId: region,
    };

    this.setState({
      isLoading: true,
    }, () => {
      this.props.loadRoutes(routeProps)
    });
  }

  tabView(view) {
    this.setState({ isCurrentView: view })
  }

  isToday(date) {
    const today = new Date();
    const formattedToday = moment(today).format('MMM Do YY');
    const formattedDate = moment(date).format('MMM Do YY');

    return formattedDate === formattedToday;
  }

  getRegion(regions = [], id = -1) {
    return regions.find(region => region.id.toString() === id.toString());
  }

  getDriver(drivers = [], id = -1) {
    return drivers.find(driver => driver.id.toString() === id.toString());
  }

  getVehicle(vehicles = [], id = -1) {
    return vehicles.find(vehicle => vehicle.id.toString() === id.toString());
  }

  getRouteData(routes) {
    const { drivers, vehicles } = this.props;

    (routes || []).forEach(route => {
      let driver = this.getDriver(drivers, route.driverId)
      let vehicle = this.getVehicle(vehicles, route.vehicleId)
      const location = route.waypoints[0].location

      route.driver = Object.assign({}, driver)
      route.driverName = driver.name
      route.vehicle = Object.assign({}, vehicle)
      route.vehicleName = vehicle.title
      route.locationName = location.addressLine1 + ' ' + location.city + ', ' + location.state
    })

    return routes
  }

  calculateMarkers(routes) {
    const result = [];
    const routesInfo = [];

    (routes || []).forEach(route => {
      const routeData = { routeNumber: route.id };
      (route.waypoints || []).forEach(waypoint => {
        if (waypoint.type === 'start') {
          result.push([waypoint.mapppedCoordinates.lat, waypoint.mapppedCoordinates.lng])
        }
        if (waypoint.type === 'end') {
          routeData.arriveDateTime = (waypoint.estimatedTimeWindow || {}).end;
        }
      })
      routesInfo.push(routeData);
    });

    return [result, routesInfo];
  }

  getCommingRoutes(routes) {
    let result = [];
    const today = new Date();
    const time = moment(today).valueOf();

    (routes || []).forEach(route => {
      (route.waypoints || []).forEach(waypoint => {
        if (waypoint.type === 'start') {
          const startTime = moment(waypoint.estimatedTimeWindow.start).valueOf();
          if (startTime > time) {
            result.push(route);
          }
        }
      })
    })

    if (result.length > 0) {
      result = this.getRouteData(result)
    }

    return result;
  }

  getCompletedRoutes(routes) {
    let result = [];
    const today = new Date();
    const time = moment(today).valueOf();

    (routes || []).forEach(route => {
      (route.waypoints || []).forEach(waypoint => {
        if (waypoint.type === 'end') {
          const endTime = moment(waypoint.estimatedTimeWindow.end).valueOf();
          if (time > endTime) {
            result.push(route);
          }
        }
      })
    })

    if (result.length > 0) {
      result = this.getRouteData(result)
    }

    return result;
  }

  goToDetail(id) {
    history.push('/routes/' + id)
  }

  render() {
    const { regions, route } = this.props;
    const { routes, errorMessage, errorListMessage, errorGenerateMessage } = route;
    const { isLoading, newRoute, selectedDate, selectedDateDatePicker, selectedRegion, submitted, isCurrentView } = this.state;
    const { date, regionId } = newRoute;
    const formattedDate = moment(selectedDate).format('dddd, MMMM Do, YYYY');

    let markers = [];
    let infos = [];
    let comming = [];
    let completed = [];
    if (routes && routes.length) {
      [markers, infos] = this.calculateMarkers(routes)
      comming = this.getCommingRoutes(routes)
      completed = this.getCompletedRoutes(routes)
    }

    let data = []

    if (comming && comming.length > 0 && isCurrentView === 'comming') {
      data = [ ...comming ]
    } else if (completed && completed.length > 0 && isCurrentView === 'completed') {
      data = [ ...completed ]
    }

    const columns = [
      {
        Header: () => (<span>Title <i className="fas fa-angle-down"></i></span>),
        accessor: 'id',
        Cell: props => <span className='id'>Route: {props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Driver <i className="fas fa-angle-down"></i></span>),
        accessor: 'driverName',
        Cell: props => <span className='driver'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Date <i className="fas fa-angle-down"></i></span>),
        accessor: 'actualStartTime',
        Cell: props => <span className='actualStartTime'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Vehicle <i className="fas fa-angle-down"></i></span>),
        accessor: 'vehicleName',
        Cell: props => <span className='vehicle'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Location <i className="fas fa-angle-down"></i></span>),
        accessor: 'locationName',
        Cell: props => <span className='location'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-dispatcher">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-dispatcher-head">
                  <div className="section-dispatcher-head-left">
                    <h1 className="section-dispatcher-head-title">Routes ({formattedDate})</h1>
                    <DatePicker
                      selected={selectedDateDatePicker}
                      onChange={this.handleChangeDatePicker}
                      dateFormat="MMMM dd yyyy"
                    />
                    <div className="section-dispatcher-head-controls">
                      <span onClick={this.handleDateChange('subtract')}><i className="fas fa-angle-left"></i></span>
                      <span onClick={this.handleDateChange('add')}><i className="fas fa-angle-right"></i></span>
                    </div>
                    <select className="section-dispatcher-head-regions" defaultValue={selectedRegion} onChange={this.handleRegionChange}>
                      <option value="none">Region</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="dispatcher-detail-tabs">
                  <span className={isCurrentView === 'live' ? 'dispatcher-detail-tabs-tab active' : 'dispatcher-detail-tabs-tab' } onClick={() => this.tabView('live')}>Live Routes Map</span>
                  <span className={isCurrentView === 'upcoming' ? 'dispatcher-detail-tabs-tab active' : 'dispatcher-detail-tabs-tab' } onClick={() => this.tabView('upcoming')}>Upcoming Routes</span>
                  <span className={isCurrentView === 'completed' ? 'dispatcher-detail-tabs-tab active' : 'dispatcher-detail-tabs-tab' } onClick={() => this.tabView('completed')}>Completed Routes</span>
                </div>
                { isLoading && <Loading /> }
                { errorListMessage && <p>{errorListMessage}</p> }
                { (markers && markers.length && isCurrentView === 'live') ? (<MapField routes={markers} infos={infos}/>) : isCurrentView === 'live' ? <p>No live routes in map for now use May 9th & default region.</p> : null }
                { (comming && comming.length > 0 && isCurrentView === 'upcoming') ? (
                  <ReactTable
                    style={tableStyle}
                    getTheadThProps={(state, rowInfo, column) => { return { style: headTableThStyle } }}
                    getTheadTrProps={(state, rowInfo, column) => { return { style: headTableTrStyle } }}
                    getTheadProps={(state, rowInfo, column) => { return { style: headTableStyle } }}
                    getTdProps={(state, rowInfo, column) => { return { style: bodyTableTdStyle } }}
                    getTrGroupProps={(state, rowInfo, column, instance) => { return {
                      style: bodyTrGroupStyle,
                      onClick: (e) => {
                        const id = rowInfo.original.id || null
                        if (id) { this.goToDetail(id) }
                      }
                    } }}
                    PaginationComponent={Pagination}
                    data={data}
                    columns={columns}
                    defaultPageSize={5}
                    pageSize={data.length > 7 ? 7 : data.length}
                    showPageSizeOptions={false}
                    showPageJump={true}
                    getTrProps={(state, rowInfo, column) => {
                      return {
                        style: {}
                      }
                    }}
                  />
                ) : isCurrentView === 'upcoming' ? <p>No routes for your preferences</p> : null }
                { (completed && completed.length > 0 && isCurrentView === 'completed') ?
                  (
                    <ReactTable
                      style={tableStyle}
                      getTheadThProps={(state, rowInfo, column) => { return { style: headTableThStyle } }}
                      getTheadTrProps={(state, rowInfo, column) => { return { style: headTableTrStyle } }}
                      getTheadProps={(state, rowInfo, column) => { return { style: headTableStyle } }}
                      getTdProps={(state, rowInfo, column) => { return { style: bodyTableTdStyle } }}
                      getTrGroupProps={(state, rowInfo, column, instance) => { return {
                        style: bodyTrGroupStyle,
                        onClick: (e) => {
                          const id = rowInfo.original.id || null
                          if (id) { this.goToDetail(id) }
                        }
                      } }}
                      PaginationComponent={Pagination}
                      data={data}
                      columns={columns}
                      defaultPageSize={5}
                      pageSize={data.length > 7 ? 7 : data.length}
                      showPageSizeOptions={false}
                      showPageJump={true}
                      getTrProps={(state, rowInfo, column) => {
                        return {
                          style: {}
                        }
                      }}
                    />
                  )
                  : isCurrentView === 'completed' ? <p>No routes for your preferences</p> : null }
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({ route, driver, region, vehicle }) => ({
  route,
  regions: region.regions,
  vehicles: vehicle.vehicles,
  drivers: driver.drivers,
});

export default withRouter(connect(mapStateToProps, actions)(DispatcherContainer));