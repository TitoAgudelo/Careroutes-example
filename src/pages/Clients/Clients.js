import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"
import NumberFormat from 'react-number-format'

import actions from './../../actions'
import { history } from './../../helpers/history'
import Pagination from './../../components/Pagination/Pagination'
import SwitchField from './../../components/SwitchField/SwitchField'
import Loading from './../../components/Loading/Loading'

import Modal from './../../components/Modal/Modal'

import './Clients.scss';
import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Clients.style'

class ClientsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      dateOfBirth: '',
      phone: '',
      isActive: true,
      regionId: 0,
      providerId: 0,
      spaceTypeId: 0,
      transportedAlone: false,
      restrictedAreaIds: [],
      requirements: [],
      openAreas: true,
      restrictedAreas: [],
      isOpen: false,
      isLoading: true,
      submitted: false,
      currentClient: {},
      currentSearch: '',
      clients: [],
      regions: [],
      clientsFilter: [],
      errors: { },
      suggestion: {}
    }

    this.toggleModal = this.toggleModal.bind(this)
    this.goToDetail = this.goToDetail.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.filterClients = this.filterClients.bind(this)
    this.handleToggleActive = this.handleToggleActive.bind(this)
    this.handleToggleActiveTransport = this.handleToggleActiveTransport.bind(this)
    this.toggleAreas = this.toggleAreas.bind(this)
    this.addAreaToRequirements = this.addAreaToRequirements.bind(this)
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadClients(loadProps)
    this.props.loadRegions(loadProps)
    this.props.loadProviders(loadProps)
    this.props.loadRestrictedAreas(loadProps)
    this.props.loadSpaceTypes(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.client.clients.length !== this.props.client.clients.length) {
      this.setState({ clients: [ ...nextProps.client.clients ] })
    }

    if (nextProps.area.areas.length !== this.props.area.areas.length) {
      this.setState({ restrictedAreas: [ ...nextProps.area.areas ] })
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: [ ...nextProps.region.regions ] })
    }

    if (nextProps.provider.providers.length !== this.props.provider.providers.length) {
      this.setState({ providers: [ ...nextProps.provider.providers ] });
    }

    if (nextProps.space.spaces.length !== this.props.space.spaces.length) {
      this.setState({ spaces: [ ...nextProps.space.spaces ] });
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({ currentSearch: nextProps.user.searchField })
      this.filterClients(nextProps.user.searchField)
    }

    if (nextProps.client.sucessAdded && !this.props.client.sucessAdded) {
      this.toggleModal()
    }

    const { isLoading, clients, regions } = this.state;
    if (isLoading && clients.length && regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetClients(true)
    this.props.resetRegions(true)
    this.props.resetAreas(true)
    this.props.resetProviders(true)
    this.props.setSearchField('')
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

  goToDetail(id) {
    history.push('/clients/' + id)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleToggleActive() {
    const { isActive } = this.state
    this.setState({ isActive: !isActive })
  }

  handleToggleActiveTransport() {
    const { transportedAlone } = this.state
    this.setState({ transportedAlone: !transportedAlone })
  }

  filterClients(currentSearch) {
    const { clients } = this.state
    let clientsFilter = []

    clientsFilter = clients.filter(client => client.name.indexOf(currentSearch.toLowerCase()) !== -1)

    this.setState({ clientsFilter: clientsFilter })
  }

  handleSubmit(e) {
    e.preventDefault()

    this.setState({ submitted: true })
    const { name, dateOfBirth, phone, isActive, regionId, providerId, spaceTypeId, requirements, restrictedAreaIds, transportedAlone } = this.state

    if (name && dateOfBirth && phone && regionId && providerId && spaceTypeId && isActive) {
      const areasId = this.formatRestrictedIds()
      const formProps = { name: name, dateOfBirth: dateOfBirth, phone: phone, isActive: isActive, regionId: regionId, providerId: providerId, spaceTypeId: spaceTypeId, restrictedAreaIds: areasId, transportedAlone: transportedAlone, fundingSourceId: 1 }
      this.props.createClient(formProps)
    }
  }

  formatRestrictedIds = () => {
    const { requirements } = this.state
    let result = [];
    requirements.map(req => { result.push(req.id) })
    this.setState({ restrictedAreaIds: result })
    return result;
  }

  toggleAreas() {
    this.setState({ openAreas: !this.state.openAreas })
  }

  removeRequirement(requirement) {
    const { requirements } = this.state
    const result = requirements.filter(req => req.id !== requirement.id)
    this.setState({ requirements: result })
  }

  addAreaToRequirements(area) {
    const { requirements } = this.state
    const temporal = requirements.filter(requirement => requirement.id === area.id)
    let result = temporal.length === 0 ? [ ...requirements, area ] : [ ...requirements ]
    this.setState({ requirements: result })
  }

  render() {
    const { clients, errorMessage } = this.props.client
    const { searchField } = this.props.user
    const { name, dateOfBirth, phone, requirements, openAreas, restrictedAreas, isActive, regions, regionId, providers, providerId, spaces, spaceTypeId, transportedAlone, clientsFilter, submitted, isLoading } = this.state

    let data = []

    if (clientsFilter && clientsFilter.length > 0) {
      data = [ ...clientsFilter ]
    } else {
      data = [ ...clients ]
    }

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Date of Birth <i className="fas fa-angle-down"></i></span>),
        accessor: 'dateOfBirth',
        Cell: props => <span className='dateOfBirth'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Phone <i className="fas fa-angle-down"></i></span>),
        accessor: 'phone',
        Cell: props => <span className='phone'>{props.value || '--'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Active <i className="fas fa-angle-down"></i></span>),
        accessor: 'isActive',
        Cell: props => <span className='isActive'>{props.value ? 'Active' : 'Inactive'}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Transported Alone <i className="fas fa-angle-down"></i></span>),
        accessor: 'transportedAlone',
        Cell: props => <span className='isActive'>{props.value ? 'Yes' : 'No'}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-clients">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-clients-head">
                  <h1 className="section-clients-head-title">Clients</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Client</span></button>
                </div>
                <div className="model-detail-tabs">
                  <span className="model-detail-tabs-tab active">
                    <Link className="section-spaces-list-item-link" to="/space-types">Space Types</Link>
                  </span>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { clients.length && regions.length ? (
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

               {regions && regions.length > 0 && providers && providers.length > 0 && spaces && spaces.length > 0 &&
                <Modal title="Add New Client" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateClient} onSubmit={this.handleSubmit}>
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
                        <input type="text" placeholder="Enter name" className="care-form-group-item-field" name="name" value={name} onChange={this.handleChange} />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Date of Birth</label>
                      </div>
                      <div className="care-form-group-item">
                        <NumberFormat className="care-form-group-item-field" value={dateOfBirth} onChange={this.handleChange} name="dateOfBirth" format="####-##-##" placeholder="YYYY-MM-DD" mask={['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D']} />
                        {submitted && !dateOfBirth &&
                          <div className="help-block">Date of Birth is required</div>
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
                        <label className="care-form-group-item-label">Restricted Areas</label>
                      </div>
                      {(requirements.length > 0) && (
                        <div className="care-form-group-item">
                          <ul className="care-form-pickup-selected">
                            {requirements.map(requirement => {
                              return (
                                <li className="care-form-pickup-selected-item" key={'requirement' + requirement.id}>
                                  <span className="care-form-pickup-selected-item-text">{requirement.name}</span>
                                  <span className="care-form-pickup-selected-item-icon" onClick={() => this.removeRequirement(requirement)}><i className="fas fa-times"></i></span>
                                </li>
                              )
                            })
                            }
                          </ul>
                        </div>
                      )}
                      <div className="care-form-group-item">
                        <p className="care-form-group-item-legend">Please add restricted areas to requirements.</p>
                      </div>
                      <div className="care-form-dropdown">
                      {openAreas ? (
                          <div className="care-form-dropdown-wrapper">
                            <span className="care-form-dropdown-text" onClick={this.toggleAreas}>Hide Restricted Areas</span>
                            <i className="fas fa-sort-up"></i>
                          </div>
                        ) : (
                          <div className="care-form-dropdown-wrapper">
                            <span className="care-form-dropdown-text" onClick={this.toggleAreas}>Show Restricted Areas</span>
                            <i className="fas fa-sort-down"></i>
                          </div>
                        )
                      }
                      </div>
                      {openAreas && (
                      <div className="care-form-group-item">
                        <ul className="care-form-pickup">
                          {restrictedAreas.map(area => {
                            return (
                              <li className="care-form-pickup-item" key={'area' + area.id} onClick={() => this.addAreaToRequirements(area)}>
                                <span className="care-form-pickup-item-text">{area.name}</span>
                                <i className="fas fa-plus"></i>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      )}
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
                            ) : (
                              <option selected="selected">No Regions</option>
                            )
                          }
                        </select>
                        {submitted && (!regionId || regionId === '0') &&
                          <div className="help-block">Region is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Provider</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={this.state.providerId} name="providerId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a provider</option>
                          { providers && providers.length > 0 ? (
                              providers.map(provider => {
                                return (
                                  <option key={ provider.id } value={ provider.id }>{ provider.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Providers</option>
                            )
                          }
                        </select>
                        {submitted && (!providerId || providerId === '0') &&
                          <div className="help-block">Provider is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Space Types</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={this.state.spaceTypeId} name="spaceTypeId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a space</option>
                          { spaces && spaces.length > 0 ? (
                              spaces.map(space => {
                                return (
                                  <option key={ space.id } value={ space.id }>{ space.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Spaces</option>
                            )
                          }
                        </select>
                        {submitted && (!spaceTypeId || spaceTypeId === '0') &&
                          <div className="help-block">Space Type is required</div>
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
                    <div className="care-form-group">
                      <SwitchField
                        label="Transported Alone"
                        id="transportedAlone"
                        onAction={this.handleToggleActiveTransport}
                        isChecked={transportedAlone ? transportedAlone : false} />
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

ClientsContainer.propTypes = {
  provider: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  space: PropTypes.object.isRequired,
  area: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  provider: state.provider,
  client: state.client,
  area: state.area,
  space: state.space,
  region: state.region,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(ClientsContainer))