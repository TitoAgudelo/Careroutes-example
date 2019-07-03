import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ReactTable from "react-table"

import actions from './../../../actions'
import { history } from './../../../helpers/history'
import Pagination from './../../../components/Pagination/Pagination'
import SwitchField from './../../../components/SwitchField/SwitchField'
import Modal from './../../../components/Modal/Modal'
import Loading from './../../../components/Loading/Loading'

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from '../Capacities/Capacities.style'
import './Models.scss'

class ModelsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      make: '',
      capacities: [],
      requirements: [],
      openCapacities: true,
      isActive: true,
      isLoading: true,
      isOpen: false,
      submitted: false,
      currentModel: {},
      currentSearch: '',
      models: [],
      modelsFilter: [],
      errors: { },
      suggestion: {},
      currentCapacity: '',
      filterCapacities: null,
    }

    this.goBack = this.goBack.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleCapacities = this.toggleCapacities.bind(this)
    this.addCapacityToRequirements = this.addCapacityToRequirements.bind(this)
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadVehiclesCapacities(loadProps);
    this.props.loadVehiclesModels(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.model.models.length !== this.props.model.models.length) {
      this.setState({
        models: [ ...nextProps.model.models ],
        isLoading: false,
      })
    }

    if (nextProps.capacity.capacities.length !== this.props.capacity.capacities.length) {
      this.setState({ capacities: [ ...nextProps.capacity.capacities ] })
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({
        currentSearch: nextProps.user.searchField
      })
      this.filterModels(nextProps.user.searchField)
    }

    if (nextProps.model.sucessAdded && !this.props.model.sucessAdded) {
      this.toggleModal()
    }

    return true
  }

  componentWillUnmount() {
    this.props.resetVehiclesModels(true)
    this.props.resetVehiclesCapacities(true)
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

  goBack() {
    history.push('/vehicles/')
  }

  goToDetail(id) {
    history.push('/vehicle-models/' + id);
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
    const { name, make, requirements, isActive } = this.state

    if (name && isActive && make && requirements.length > 0) {
      const formProps = { name: name, make: make, isActive: isActive, capacities: requirements }
      this.props.createVehicleModel(formProps)
    }
  }

  filterModels(currentSearch) {
    const { models } = this.state

    let modelsFilter = []

    modelsFilter = models.filter(model => {
      return model.name.indexOf(currentSearch.toLowerCase()) !== -1
    })

    this.setState({
      modelsFilter
    })
  }

  toggleCapacities() {
    this.setState({ openCapacities: !this.state.openCapacities })
  }

  removeRequirement(requirement) {
    const { requirements } = this.state
    const result = requirements.filter(req => req.capacityId !== requirement.capacityId)
    this.setState({ requirements: result })
  }

  addCapacityToRequirements(capacity) {
    const { requirements } = this.state
    const formated = this.setFormatCapacity(capacity)
    const temporal = requirements.filter(requirement => requirement.capacityId === formated.capacityId)
    let result = temporal.length === 0 ? [ ...requirements, formated ] : [ ...requirements ]
    this.setState({ requirements: result })
  }

  setFormatCapacity = (capacity) => {
    let result = { capacityId: capacity.id, name: capacity.name, value: capacity.seats || 0 }
    return result
  }

  addValueToRequirement = (requirement) => {
    const { requirements } = this.state
    let result = requirements
    let foundIndex = result.findIndex(item => item.capacityId === requirement.capacityId);
    result[foundIndex].value = result[foundIndex].value + 1;
    this.setState({ requirements: result })
  }

  removeValueToRequirement = (requirement) => {
    const { requirements } = this.state
    let result = requirements
    let foundIndex = result.findIndex(item => item.capacityId === requirement.capacityId);
    result[foundIndex].value = result[foundIndex].value > 0 ? result[foundIndex].value - 1 : result[foundIndex].value;
    this.setState({ requirements: result })
  }

  render() {
    const { errorMessage } = this.props.model
    const { searchField } = this.props.user
    const { name, make, capacities, requirements, openCapacities, currentCapacity, filterCapacities, isActive, submitted, models, modelsFilter, isLoading } = this.state

    let data = []

    if (modelsFilter && modelsFilter.length > 0) {
      data = [ ...modelsFilter ]
    } else {
      data = [ ...models ]
    }

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Make <i className="fas fa-angle-down"></i></span>),
        accessor: 'make',
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
      <section className="section-models">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <span className="model-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                </div>
                <div className="section-models-head">
                  <h1 className="section-models-head-title">Vehicle Models</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Vehicle Model</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { models.length > 0 ? (
                  <ReactTable
                    style={tableStyle}
                    getTheadThProps={(state, rowInfo, column) => { return { style: headTableThStyle } }}
                    getTheadTrProps={(state, rowInfo, column) => { return { style: headTableTrStyle } }}
                    getTheadProps={(state, rowInfo, column) => { return { style: headTableStyle } }}
                    getTdProps={(state, rowInfo, column) => { return { style: bodyTableTdStyle } }}
                    getTrGroupProps={(state, rowInfo, column, instance) => { return {
                      style: bodyTrGroupStyle,
                      onClick: (e) => {
                        const id = rowInfo.original.id || null;
                        if (id) { this.goToDetail(id); }
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

                <Modal title="Add New Model" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateModel} onSubmit={this.handleSubmit}>
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
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="name" value={name} onChange={(e) => this.handleChange(e)} required />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Make</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="make" value={make} onChange={(e) => this.handleChange(e)} required />
                        {submitted && !make &&
                          <div className="help-block">Make is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Capacities</label>
                      </div>
                      {(requirements.length > 0) && (
                        <div className="care-form-group-item">
                          <ul className="care-form-pickup-selected">
                            {requirements.map(requirement => {
                              return (
                                <li className="care-form-pickup-selected-item" key={'requirement' + requirement.capacityId}>
                                  <span className="care-form-pickup-selected-item-text">{requirement.name}</span>
                                  <span className="care-form-pickup-selected-item-actions">
                                    <span className="action-item" onClick={() => this.removeValueToRequirement(requirement)}><i className="fas fa-caret-down"></i></span>
                                    <span className="action-item-text">{requirement.value}</span>
                                    <span className="action-item" onClick={() => this.addValueToRequirement(requirement)}><i className="fas fa-caret-up"></i></span>
                                  </span>
                                  <span className="care-form-pickup-selected-item-icon" onClick={() => this.removeRequirement(requirement)}><i className="fas fa-times"></i></span>
                                </li>
                              )
                            })
                            }
                          </ul>
                        </div>
                      )}
                      {submitted && requirements.length === 0 &&
                        <div className="help-block">Capacities are required</div>
                      }
                      <div className="care-form-group-item">
                        <p className="care-form-group-item-legend">Please add capacities to vehicle model.</p>
                      </div>
                      <div className="care-form-dropdown">
                      {openCapacities ? (
                          <div className="care-form-dropdown-wrapper">
                            <span className="care-form-dropdown-text" onClick={this.toggleCapacities}>Hide Capacities</span>
                            <i className="fas fa-sort-up"></i>
                          </div>
                        ) : (
                          <div className="care-form-dropdown-wrapper">
                            <span className="care-form-dropdown-text" onClick={this.toggleCapacities}>Show Capacities</span>
                            <i className="fas fa-sort-down"></i>
                          </div>
                        )
                      }
                      </div>
                      {openCapacities && (
                      <div className="care-form-group-item">
                        <ul className="care-form-pickup">
                          {capacities.map(capacity => {
                            return (
                              <li className="care-form-pickup-item" key={'capacity' + capacity.id} onClick={() => this.addCapacityToRequirements(capacity)}>
                                <span className="care-form-pickup-item-text">{capacity.name}</span>
                                <i className="fas fa-plus"></i>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      )}
                    </div>
                    <div className="care-form-group">
                      <SwitchField label="Active" id="activeToggle" onAction={() => this.handleToggleActive} isChecked={isActive ? isActive : false} />
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

ModelsContainer.propTypes = {
  loadVehiclesModels: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  model: state.model,
  capacity: state.capacity,
  auth: state.auth,
  user: state.user
})

export default withRouter(connect(mapStateToProps, actions)(ModelsContainer))
