import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"
import NumberFormat from 'react-number-format'

import actions from './../../../actions'
import { history } from './../../../helpers/history'
import Pagination from './../../../components/Pagination/Pagination'
import SwitchField from './../../../components/SwitchField/SwitchField'
import Loading from './../../../components/Loading/Loading'
import SearchAddressField from '../../../components/SearchAddressField/SearchAddressField'

import Modal from './../../../components/Modal/Modal'

import './Places.scss';
import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './../Clients.style'

class ClientPlacesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      type: '0',
      notes: '',
      contact: '',
      phone: '',
      isActive: true,
      location: {
        state: 'NY',
        zipCode: '10031'
      },

      isOpen: false,
      isLoading: true,
      submitted: false,
      currentPlace: {},
      currentSearch: '',

      places: [],
      placesFilter: [],
      errors: {},
      suggestion: {}
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddress = this.handleAddress.bind(this)
    this.filterClientPlaces = this.filterClientPlaces.bind(this)
    this.handleToggleActive = this.handleToggleActive.bind(this)
  }

  componentWillMount() {
    const { idClient } = this.props
    const loadProps = {
      isActive: true,
      id: idClient
    }

    this.props.loadClientPlaces(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.place.places.length !== this.props.place.places.length) {
      this.setState({ places: [ ...nextProps.place.places ], isLoading: false })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({ currentSearch: nextProps.user.searchField })
      this.filterClientPlaces(nextProps.user.searchField)
    }

    if (nextProps.place.sucessAdded && !this.props.place.sucessAdded) {
      this.toggleModal()
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetClientPlaces(true)
    this.props.setSearchField('')
  }

  toggleModal() {
    if (!this.state.isOpen) {
      this.props.successMessage('')
      this.props.errorMessage('')
    }

    this.setState({ isOpen: !this.state.isOpen })
  }

  goToDetail(id) {
    history.push('/clients/places/' + id)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
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

  filterClientPlaces(currentSearch) {
    const { places } = this.state
    let clientPlacesFilter = []

    clientPlacesFilter = places.filter(place => place.name.indexOf(currentSearch.toLowerCase()) !== -1)

    this.setState({ placesFilter: clientPlacesFilter })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { idClient } = this.props
    const { title, type, notes, contact, phone, location, isActive } = this.state

    if (title && type && notes && phone && contact && location.state) {
      const formProps = { title: title, type: type, notes: notes, phone: phone, isActive: isActive, contact: contact, location: location }
      this.props.createClientPlace(formProps, idClient)
    }
  }

  render() {
    const { errorMessage } = this.props.place
    const { searchField } = this.props.user
    const { title, type, notes, contact, phone, location, isActive, places, placesFilter, submitted, isLoading } = this.state

    let data = []

    if (placesFilter && placesFilter.length > 0) {
      data = [ ...placesFilter ]
    } else {
      data = [ ...places ]
    }

    const columns = [
      {
        Header: () => (<span>Title <i className="fas fa-angle-down"></i></span>),
        accessor: 'title',
        Cell: props => <span className='title'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Type <i className="fas fa-angle-down"></i></span>),
        accessor: 'type',
        Cell: props => <span className='type'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Notes <i className="fas fa-angle-down"></i></span>),
        accessor: 'notes',
        Cell: props => <span className='notes'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Contact <i className="fas fa-angle-down"></i></span>),
        accessor: 'contact',
        Cell: props => <span className='contact'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Active <i className="fas fa-angle-down"></i></span>),
        accessor: 'isActive',
        Cell: props => <span className='isActive'>{props.value ? 'Active' : 'Inactive'}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-places">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-places-head">
                  <h1 className="section-places-head-title">Client Places</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Client Place</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { places.length > 0 ? (
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
                <Modal title="Add New Client Place" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateClientPlace} onSubmit={this.handleSubmit}>
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
                        <label className="care-form-group-item-label">Title</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter title" className="care-form-group-item-field" name="title" value={title} onChange={this.handleChange} />
                        {submitted && !title &&
                          <div className="help-block">Title is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Type</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={type} name="type" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a type</option>
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="school">School</option>
                          <option value="clinic">Clinic</option>
                          <option value="hospital">Hospital</option>
                          <option value="other">Other</option>
                          }
                        </select>
                        {submitted && !type &&
                          <div className="help-block">Type is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Notes</label>
                      </div>
                      <div className="care-form-group-item">
                        <textarea className="care-form-group-item-field" value={notes} onChange={this.handleChange} name="notes" placeholder="Enter notes"></textarea>
                        {submitted && !notes &&
                          <div className="help-block">Notes is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Contact</label>
                      </div>
                      <div className="care-form-group-item">
                        <input className="care-form-group-item-field" value={contact} onChange={this.handleChange} name="contact" placeholder="Enter contact" />
                        {submitted && !contact &&
                          <div className="help-block">Contact is required</div>
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
                      <SwitchField
                        label="Active"
                        id="activeToggle"
                        onAction={this.handleToggleActive}
                        isChecked={isActive ? isActive : false} />
                    </div>
                  </form>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ClientPlacesContainer.propTypes = {
  place: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  place: state.place,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(ClientPlacesContainer))