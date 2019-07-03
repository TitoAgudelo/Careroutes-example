import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import ReactTable from 'react-table';
import NumberFormat from 'react-number-format';
import moment from 'moment';

import actions from './../../actions';
import { history } from './../../helpers/history'
import Loading from './../../components/Loading/Loading';
import Pagination from './../../components/Pagination/Pagination';
import Modal from './../../components/Modal/Modal'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './Routes.scss';
import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Routes.style'

class RoutesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRegion: 'none',
      selectedDate: new Date(),
      selectedDateDatePicker: new Date(),
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
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDatePicker = this.handleChangeDatePicker.bind(this);
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
    const { routes, successAdded, errorListMessage } = this.props.route;
    const { routes: prevRoutes, successAdded: prevSuccessAdded, errorListMessage: prevListMessage } = prevProps.route;
    const { isLoading } = this.state;
    if (routes && (prevRoutes !== routes) || errorListMessage && isLoading) {
      this.setState({
        isLoading: false,
      });
    }

    if (successAdded && !prevSuccessAdded) {
      this.toggleModal();
    }
  }

  componentWillUnmount() {
    this.props.resetRegions(true)
    this.props.resetVehicles(true)
    this.props.resetDrivers(true)
    this.props.resetRoutes(true)
  }

  goToDetail(id) {
    const { regions } = this.props;
    const { selectedRegion } = this.state;
    const region = this.getRegion(regions, selectedRegion);

    history.push(`/routes/${id}?region=${region.id}`);
  }

  handleChange(event) {
    const { name, value } = event.target
    this.setState(prevState => ({
      newRoute: {
        ...prevState.newRoute,
        [name]: value,
      },
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

  handleSubmit(event) {
    event.preventDefault()

    this.setState({ submitted: true })
    const { newRoute: { date, regionId } } = this.state

    if (date && regionId) {
      const route = { date, regionId }
      this.props.generateRoute(route)
    }
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

  getColumns({ region, drivers, vehicles }) {
    return [
      {
        Header: () => (<span>Title <i className="fas fa-angle-down"></i></span>),
        accessor: 'id',
        Cell: props => <span className='title'>{`${(region || {}).name} #${props.value}`}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Driver <i className="fas fa-angle-down"></i></span>),
        accessor: 'driverId',
        Cell: props => <span className='driver'>{(this.getDriver(drivers, props.value) || {}).name || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Date <i className="fas fa-angle-down"></i></span>),
        accessor: 'actualStartTime',
        Cell: props => <span className='actualStartTime'>{props.value ? moment(props.value).format('MM/DD/YYYY') : '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Vehicle <i className="fas fa-angle-down"></i></span>),
        accessor: 'vehicleId',
        Cell: props => <span className='vehicle'>{(this.getVehicle(vehicles, props.value) || {}).title || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Starting Location <i className="fas fa-angle-down"></i></span>),
        accessor: 'waypoints[0].location.addressLine1',
        Cell: props => <span className='addressLine1'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: () => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ];
  }

  toggleModal() {
    if (!this.state.isOpen) {
      this.props.successMessage('')
      this.props.errorMessage('')
    }

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { drivers, regions, route, vehicles } = this.props;
    const { routes, errorMessage, errorListMessage, errorGenerateMessage } = route;
    const { isLoading, newRoute, selectedDate, selectedDateDatePicker, selectedRegion, submitted } = this.state;
    const { date, regionId } = newRoute;
    const formattedDate = moment(selectedDate).format('dddd, MMMM Do, YYYY');
    const data = [ ...routes ];
    const columns = this.getColumns({ region: this.getRegion(regions, selectedRegion), drivers, vehicles });

    return (
      <section className="section-routes">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-routes-head">
                  <div className="section-routes-head-left">
                    <h1 className="section-routes-head-title">Routes ({ formattedDate })</h1>
                    <DatePicker
                      selected={selectedDateDatePicker}
                      onChange={this.handleChangeDatePicker}
                      dateFormat="MMMM dd yyyy"
                    />
                    <div className="section-routes-head-controls">
                      <span onClick={this.handleDateChange('subtract')}><i className="fas fa-angle-left"></i></span>
                      <span onClick={this.handleDateChange('add')}><i className="fas fa-angle-right"></i></span>
                    </div>
                    <select className="section-routes-head-regions" defaultValue={selectedRegion} onChange={this.handleRegionChange}>
                      <option value="none">Region</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>{region.name}</option>
                      ))}
                    </select>
                  </div>
                  <button className="button-primary" onClick={this.toggleModal}>
                    <span className="text">Generate Routes</span>
                  </button>
                </div>
                <div className="model-detail-tabs">
                  <span className="model-detail-tabs-tab active">
                    <Link className="section-spaces-list-item-link" to="/day">Day View</Link>
                  </span>
                </div>
                { isLoading && <Loading /> }
                { errorListMessage && <p>{errorListMessage}</p> }
                { !isLoading && routes.length > 0 ? (
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
                ) : null }
                {regions && regions.length > 0 && <Modal title="Generate Route" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitGenerateRoute} onSubmit={this.handleSubmit}>
                  { errorMessage && (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> )
                  }
                  { errorGenerateMessage && (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorGenerateMessage }</p>
                    </div> )
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Date</label>
                      </div>
                      <div className="care-form-group-item">
                        <NumberFormat className="care-form-group-item-field" value={date} onChange={this.handleChange} name="date" format="####-##-##" placeholder="YYYY-MM-DD" mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D']} />
                        {submitted && !date &&
                          <div className="help-block">Date is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Region</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={regionId} name="regionId" onChange={this.handleChange} required>
                          <option value="-1" disabled>Select a region</option>
                          { regions && regions.length > 0 ? (
                              regions.map(region => {
                                return (
                                  <option key={region.id} value={region.id}>{region.name}</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Regions</option>
                            )
                          }
                        </select>
                        {submitted && (!regionId || regionId === -1) &&
                          <div className="help-block">Region is required</div>
                        }
                      </div>
                    </div>
                  </form>
                </Modal> }
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

export default withRouter(connect(mapStateToProps, actions)(RoutesContainer));