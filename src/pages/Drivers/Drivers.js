import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"
import NumberFormat from 'react-number-format'

import actions from './../../actions'
import { history } from './../../helpers/history'
import Pagination from './../../components/Pagination/Pagination'
import SwitchField from './../../components/SwitchField/SwitchField'
import Loading from './../../components/Loading/Loading'
import SearchAddressField from '../../components/SearchAddressField/SearchAddressField'
import Modal from './../../components/Modal/Modal'

import './Drivers.scss'
import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Driver.style'

class DriversContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      name: '',
      phone: '',
      email: '',
      license: '',
      regionId: 0,
      isActive: true,
      isLoading: true,
      usersFilter: [],
      submitted: false,
      currentSearch: '',
      errors: { },
      drivers: [],
      regions: [],
    }

    this.handleAddress = this.handleAddress.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.filterDrivers = this.filterDrivers.bind(this)
    this.handleToggleActive = this.handleToggleActive.bind(this)
  }

  componentWillMount() {
    const loadProps = {
      role: 'driver',
      isActive: true
    }
    const regionsProps = { isActive: true }
    this.props.loadUsers(loadProps)
    this.props.loadRegions(regionsProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.driver.drivers.length !== this.props.driver.drivers.length) {
      this.setState({
        drivers: [ ...nextProps.driver.drivers ],
      })
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: nextProps.region.regions })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({ currentSearch: nextProps.user.searchField })
      this.filterDrivers(nextProps.user.searchField)
    }

    if (nextProps.driver.sucessAdded && !this.props.driver.sucessAdded) {
      this.toggleModal()
    }

    const { isLoading } = this.state;
    if (isLoading && nextProps.driver.drivers.length && nextProps.region.regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetDrivers(true)
    this.props.resetRegions(true)
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
    history.push('/driver/' + id)
  }

  submitCreateDriver = () => {
    console.log('on fire')
  }

  handleAddress({ result }) {
    const location = {
      addressLine1: result.value,
      addressLine2: '',
      city: result.city,
      state: result.state,
      zipCode: result.postalCode,
      coordinates: Object.assign({}, result.latlng)
    }

    this.setState({
      address: Object.assign({}, location),
    })
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  filterDrivers(currentSearch) {
    const { drivers } = this.state

    let usersFilter = []

    usersFilter = drivers.filter(user => {
      return (user.name.indexOf(currentSearch.toLowerCase()) !== -1 || user.email.indexOf(currentSearch.toLowerCase()) !== -1)
    })

    this.setState({
      usersFilter: usersFilter
    })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { fullname, phone, email, license, regionId, address } = this.state

    if (fullname && phone && email && license && regionId && address.addressLine1) {
      const formProps = { name: fullname, phone: phone, email: email, driverLicense: license, role: 'driver', regionId: regionId, address }
      this.props.createDriver(formProps)
    }
  }

  render() {
    const { errorMessage } = this.props.driver
    const { searchField } = this.props.user;
    const { address, fullname, phone, email, license, regionId, drivers, regions, submitted, usersFilter, isActive, isLoading } = this.state

    let data = []

    if (usersFilter && usersFilter.length > 0) {
      data = [ ...usersFilter ]
    } else {
      data = [ ...drivers ]
    }

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Phone <i className="fas fa-angle-down"></i></span>),
        accessor: 'phone',
        Cell: props => <span className='phone'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Email <i className="fas fa-angle-down"></i></span>),
        accessor: 'email',
        Cell: props => <span className='email'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Driver License <i className="fas fa-angle-down"></i></span>),
        accessor: 'driverLicense',
        Cell: props => <span className='driverLicense'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Role <i className="fas fa-angle-down"></i></span>),
        accessor: 'role',
        Cell: props => <span className='role'>{props.value || '--'}</span>,
        minWidth: 200
      },
      {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-drivers">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-drivers-head">
                  <h1 className="section-drivers-head-title">Drivers</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Driver</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { drivers.length && regions.length ? (
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

                {regions && regions.length > 0 && drivers && drivers.length > 0 && <Modal title="Add New Driver" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateDriver} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Name</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="fullname" value={fullname} onChange={this.handleChange} />
                        {submitted && !fullname &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Phone</label>
                      </div>
                      <div className="care-form-group-item">
                        <NumberFormat className="care-form-group-item-field" value={phone} onChange={this.handleChange} name="phone" format="+1 (###) ###-####" placeholder="+1 (###) ###-####" mask="_"/>
                        {submitted && !phone &&
                          <div className="help-block">Phone is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Email</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="email" value={email} onChange={this.handleChange}  />
                        {submitted && !email &&
                          <div className="help-block">Email is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Driver License #</label>
                      </div>
                      <div className="care-form-group-item">
                        <NumberFormat className="care-form-group-item-field" value={license} onChange={this.handleChange} name="license" format="##_###_####" placeholder="--_---_----" mask="-"/>
                        {submitted && !license &&
                          <div className="help-block">Driver License is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Region</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={regionId} name="regionId" onChange={(e) => this.handleChange(e)} required>
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
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Address</label>
                      </div>
                      <div className="care-form-group-item">
                        <SearchAddressField
                          className="care-form-group-item-field"
                          placeholder="Write an address here"
                          onChange={this.handleAddress}
                          defaultValue={address.addressLine1}
                        />
                        {submitted && !address.addressLine1 &&
                          <div className="help-block">Address is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <SwitchField
                        label="Active"
                        id="activeToggle"
                        onAction={this.handleToggleActive}
                        isChecked={isActive ? isActive : false} />
                    </div>
                  </form>
                </Modal> }
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

DriversContainer.propTypes = {
  driver: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number
}

DriversContainer.defaultProps = {
  initialPage: 1,
  pageSize: 10
}

const mapStateToProps = (state) => ({
  driver: state.driver,
  region: state.region,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(DriversContainer))
