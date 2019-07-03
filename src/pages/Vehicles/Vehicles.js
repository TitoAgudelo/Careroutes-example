import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"

import actions from './../../actions'
import { history } from './../../helpers/history'
import Pagination from './../../components/Pagination/Pagination'
import SwitchField from './../../components/SwitchField/SwitchField'
import Modal from './../../components/Modal/Modal'
import Loading from './../../components/Loading/Loading'

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Capacities/Capacities.style'
import './Vehicles.scss'

class VehiclesContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      licensePlate: '',
      mileage: 0,
      isCompanyOwned: false,
      ownerId: 0,
      title: '',
      modelId: 0,
      regionId: 0,
      isActive: true,
      isLoading: true,
      isOpen: false,
      submitted: false,
      currentVehicle: {},
      currentSearch: '',
      vehicles: [],
      vehiclesFilter: [],
      errors: { },
      suggestion: {}
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    const loadProps = { isActive: true }
    const loadPropsUser = { role: 'driver', isActive: true }

    this.props.loadVehicles(loadProps)
    this.props.loadVehiclesModels(loadProps)
    this.props.loadRegions(loadProps)
    this.props.loadUsers(loadPropsUser)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.vehicle.vehicles.length !== this.props.vehicle.vehicles.length) {
      this.setState({
        vehicles: [ ...nextProps.vehicle.vehicles ],
      })
    }

    if (nextProps.region.regions.length !== this.props.region.regions.length) {
      this.setState({ regions: [ ...nextProps.region.regions ] })
    }

    if (nextProps.driver.drivers.length !== this.props.driver.drivers.length) {
      this.setState({ users: [ ...nextProps.driver.drivers ] });
    }

    if (nextProps.model.models.length !== this.props.model.models.length) {
      this.setState({ models: [ ...nextProps.model.models ] })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({ currentSearch: nextProps.user.searchField })
      this.filterVehicles(nextProps.user.searchField)
    }

    if (nextProps.vehicle.sucessAdded && !this.props.vehicle.sucessAdded) {
      this.toggleModal()
    }

    const { isLoading } = this.state;
    if (isLoading && nextProps.vehicle.vehicles.length && nextProps.region.regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetVehicles(true)
    this.props.resetRegions(true)
    this.props.resetVehiclesModels(true)
    this.props.resetDrivers(true)
    this.props.setSearchField('')
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('')
      this.props.errorMessage('')
    }

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  goToDetail(id) {
    history.push('/vehicles/' + id)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  handleToggleCompanyOwner = () => {
    const { isCompanyOwned } = this.state
    this.setState({ isCompanyOwned: !isCompanyOwned })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { title, mileage, licensePlate, isActive, isCompanyOwned, ownerId, modelId, regionId } = this.state

    if (mileage && licensePlate && ownerId && modelId && regionId && title) {
      const formProps = { title: title, mileage: mileage, licensePlate: licensePlate, isActive: isActive, isCompanyOwned: isCompanyOwned, ownerId: ownerId, modelId: modelId, regionId: regionId }
      this.props.createVehicle(formProps)
    }
  }

  filterVehicles(currentSearch) {
    const { vehicles } = this.state

    let vehiclesFilter = []

    vehiclesFilter = vehicles.filter(vehicle => {
      return vehicle.licensePlate.indexOf(currentSearch.toLowerCase()) !== -1
    })

    this.setState({
      vehiclesFilter
    })
  }

  render() {
    const { errorMessage } = this.props.vehicle
    const { licensePlate, title, isActive, mileage, isCompanyOwned, submitted, vehicles, vehiclesFilter, isLoading, ownerId, modelId, regionId, regions, models, users } = this.state

    let data = []

    if (vehiclesFilter && vehiclesFilter.length > 0) {
      data = [ ...vehiclesFilter ]
    } else {
      data = [ ...vehicles ]
    }

    const columns = [
      {
        Header: () => (<span>Title <i className="fas fa-angle-down"></i></span>),
        accessor: 'title',
        Cell: props => <span className='title'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>License Plate <i className="fas fa-angle-down"></i></span>),
        accessor: 'licensePlate',
        Cell: props => <span className='licensePlate'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Mileage <i className="fas fa-angle-down"></i></span>),
        accessor: 'mileage',
        Cell: props => <span className='mileage'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Company Owner <i className="fas fa-angle-down"></i></span>),
        accessor: 'isCompanyOwned',
        Cell: props => <span className='isCompanyOwned'>{props.value ? 'Company Owner' : 'No company owner'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Active <i className="fas fa-angle-down"></i></span>),
        accessor: 'isActive',
        Cell: props => <span className='active'>{props.value ? 'Active' : 'Inactive'}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-vehicles">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-vehicles-head">
                  <h1 className="section-vehicles-head-title">Vehicles</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Vehicle</span></button>
                </div>
                <div className="model-detail-tabs">
                  <span className="model-detail-tabs-tab active">
                    <Link className="section-vehicles-list-item-link" to="/vehicle-capacities">Vehicles Capacities</Link>
                  </span>
                  <span className="model-detail-tabs-tab active">
                    <Link className="section-vehicles-list-item-link" to="/vehicle-models">Vehicles Models</Link>
                  </span>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { vehicles.length > 0 ? (
                  <ReactTable
                    style={tableStyle}
                    getTheadThProps={() => { return { style: headTableThStyle } }}
                    getTheadTrProps={() => { return { style: headTableTrStyle } }}
                    getTheadProps={() => { return { style: headTableStyle } }}
                    getTdProps={() => { return { style: bodyTableTdStyle } }}
                    getTrGroupProps={(state, rowInfo, column, instance) => { return {
                      style: bodyTrGroupStyle,
                      onClick: () => {
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
                  />
                ) : null }

              {users && users.length > 0 && models && models.length > 0 && regions && regions.length > 0 &&
                <Modal title="Add New Vehicle" show={this.state.isOpen} onClose={this.toggleModal} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form">
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">License Plate</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="licensePlate" value={licensePlate} onChange={(e) => this.handleChange(e)} required />
                        {submitted && !licensePlate &&
                          <div className="help-block">License Plate is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Title</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="title" value={title} onChange={(e) => this.handleChange(e)} required />
                        {submitted && !title &&
                          <div className="help-block">Title is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Mileage</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="mileage" value={mileage} onChange={(e) => this.handleChange(e)} required />
                        {submitted && !mileage &&
                          <div className="help-block">Mileage is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Owner</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={this.state.ownerId} name="ownerId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a owner</option>
                          { users && users.length > 0 ? (
                              users.map(user => {
                                return (
                                  <option key={ user.id } value={ user.id }>{ user.name }</option>
                                )
                              })
                            ) : null
                          }
                        </select>
                        {submitted && (!ownerId || ownerId === '0') &&
                          <div className="help-block">Owner is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Model</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={this.state.modelId} name="modelId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a model</option>
                          { models && models.length > 0 ? (
                              models.map(model => {
                                return (
                                  <option key={ model.id } value={ model.id }>{ model.name }</option>
                                )
                              })
                            ) : null
                          }
                        </select>
                        {submitted && (!modelId || modelId === '0') &&
                          <div className="help-block">Model is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Region</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={this.state.regionId} name="regionId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a region</option>
                          { regions && regions.length > 0 ? (
                              regions.map(region => {
                                return (
                                  <option key={ region.id } value={ region.id }>{ region.name }</option>
                                )
                              })
                            ) : null
                          }
                        </select>
                        {submitted && (!regionId || regionId === '0') &&
                          <div className="help-block">Region is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group half">
                      <SwitchField label="Company Owned" id="activeCompanyToggle" onAction={this.handleToggleCompanyOwner} isChecked={isCompanyOwned ? isCompanyOwned : false} />
                      <SwitchField label="Active" id="activeToggle" onAction={() => this.handleToggleActive} isChecked={isActive ? isActive : false} />
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


VehiclesContainer.propTypes = {
  loadVehicles: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  vehicle: state.vehicle,
  region: state.region,
  driver: state.driver,
  model: state.model,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(VehiclesContainer))
