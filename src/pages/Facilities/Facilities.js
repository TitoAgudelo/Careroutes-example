import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"
import NumberFormat from 'react-number-format'
import AlgoliaPlaces from 'algolia-places-react'

import actions from '../../actions'
import { history } from '../../helpers/history'
import Pagination from '../../components/Pagination/Pagination'
import SwitchField from '../../components/SwitchField/SwitchField'
import Modal from '../../components/Modal/Modal'
import Loading from '../../components/Loading/Loading'
import SearchAddressField from '../../components/SearchAddressField/SearchAddressField'

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Facilities.style'
import './Facilities.scss'

class FacilitiesContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      phone: '',
      contact: '',
      location: {},
      isActive: true,
      isLoading: true,
      isOpen: false,
      submitted: false,
      currentFacility: {},
      currentSearch: '',
      facilities: [],
      facilitiesFilter: [],
      errors: {},
      suggestion: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleToggleActive = this.handleToggleActive.bind(this)
    this.handleAddress = this.handleAddress.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadFacilities(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.facility.facilities !== this.props.facility.facilities || nextProps.facility.facilities.length !== this.props.facility.facilities.length) {
      this.setState({
        facilities: [ ...nextProps.facility.facilities ],
        isLoading: false,
      })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({
        currentSearch: nextProps.user.searchField
      })
      this.filterFacilities(nextProps.user.searchField)
    }

    if (nextProps.facility.sucessAdded && !this.props.facility.sucessAdded) {
      this.toggleModal()
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetFacilities(true)
    this.props.setSearchField('')
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('')
      this.props.errorMessage('')
    }

    this.setState({ isOpen: !this.state.isOpen })
  }

  goToDetail(id) {
    history.push('/facilities/' + id)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { name, phone, contact, location, isActive } = this.state

    if (name && phone && contact && location && location.state && isActive) {
      const formProps = { name: name, phone: phone, isActive: isActive, contact: contact, location: location }
      this.props.createFacility(formProps)
    }
  }

  filterFacilities(currentSearch) {
    const { facilities } = this.state

    let facilitiesFilter = []

    facilitiesFilter = facilities.filter(facility => {
      return facility.name.indexOf(currentSearch.toLowerCase()) !== -1
    })

    this.setState({ facilitiesFilter })
  }

  goBack() {
    history.push('/vehicles/')
  }

  handleAddress({ result }) {
    const location = {
      addressLine1: result.value,
      addressLine2: '',
      city: result.city,
      state: result.state,
      zipCode: result.postalCode || '10031',
      coordinates: Object.assign({}, result.latlng)
    }

    this.setState({
      location: Object.assign({}, location),
    })
  }

  render() {
    const { errorMessage } = this.props.facility
    const { searchField } = this.props.user
    const { name, phone, contact, isActive, location, submitted, facilities, facilitiesFilter, isLoading } = this.state

    let data = []

    if (facilitiesFilter && facilitiesFilter.length > 0) {
      data = [ ...facilitiesFilter ]
    } else {
      data = [ ...facilities ]
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
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Contact <i className="fas fa-angle-down"></i></span>),
        accessor: 'contact',
        Cell: props => <span className='name'>{props.value}</span>,
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
      <section className="section-facilities">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <span className="model-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                </div>
                <div className="section-facilities-head">
                  <h1 className="section-facilities-head-title">Facilities</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Facility</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { facilities.length > 0 ? (
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

                <Modal title="Add New Facility" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateFacility} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Address</label>
                      </div>
                      <div className="care-form-group-item">
                        <SearchAddressField
                          className="care-form-group-item-field"
                          placeholder="Write an address here"
                          onChange={this.handleAddress}
                          defaultValue={location.addressLine1}
                        />
                        {submitted && !location.addressLine1 &&
                          <div className="help-block">Location is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Name</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter name" className="care-form-group-item-field" name="name" value={name} onChange={this.handleChange} required />
                        {submitted && !name &&
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
                          <div className="help-block">Make is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Contact</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter contact name" className="care-form-group-item-field" name="contact" value={contact} onChange={this.handleChange} required />
                        {submitted && !contact &&
                          <div className="help-block">Make is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <SwitchField label="Active" id="activeToggle" onAction={this.handleToggleActive} isChecked={isActive ? isActive : false} />
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

FacilitiesContainer.propTypes = {
  loadFacilities: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  facility: state.facility,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(FacilitiesContainer))
