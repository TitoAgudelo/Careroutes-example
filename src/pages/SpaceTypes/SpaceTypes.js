import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from "react-table";

import actions from './../../actions';
import { history } from './../../helpers/history';
import Pagination from './../../components/Pagination/Pagination';
import Loading from './../../components/Loading/Loading';
import SwitchField from './../../components/SwitchField/SwitchField'

import Modal from './../../components/Modal/Modal';

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './../Regions/Regions.style';
import './SpaceTypes.scss';

class SpaceTypesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      name: '',
      isActive: true,
      requirements: [],
      spaces: [],
      spacesFilter: [],
      capacities: [],
      openCapacities: true,
      currentSpace: {},
      submitted: false,
      isLoading: true,
      errors: { },
      suggestion: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goBack = this.goBack.bind(this)
    this.toggleCapacities = this.toggleCapacities.bind(this);
    this.addCapacityToRequirements = this.addCapacityToRequirements.bind(this);
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadSpaceTypes(loadProps);
    this.props.loadVehiclesCapacities(loadProps);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.space.spaces.length !== this.props.space.spaces.length) {
      this.setState({ spaces: [ ...nextProps.space.spaces ], isLoading: false });
    }

    if (nextProps.capacity.capacities.length !== this.props.capacity.capacities.length) {
      this.setState({ capacities: [ ...nextProps.capacity.capacities ] })
    }

    if (nextProps.space.sucessAdded && !this.props.space.sucessAdded) {
      this.toggleModal();
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetSpaces(true)
    this.props.resetVehiclesCapacities(true)
    this.props.setSearchField('')
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('');
      this.props.errorMessage('');
    } else {
      this.setState({ requirements: [], name: '' })
    }

    this.setState({ isOpen: !this.state.isOpen });
  }

  goToDetail(id) {
    history.push('/space-types/' + id);
  }

  goBack() {
    history.push('/clients/')
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { name, isActive, requirements } = this.state;

    if (name && requirements.length > 0) {
      const formProps = { name: name, isActive: isActive, requirements: requirements };
      this.props.createSpaceType(formProps);
    }
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
    const { errorMessage } = this.props.space;
    const { name, submitted, isActive, requirements, spaces, isLoading, capacities, openCapacities } = this.state;

    // if (regions.length > 0 && managers.length > 0) {
    //   this.setManagerToRegions();
    // }

    const data = spaces;

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
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
      <section className="section-spaces">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div>
                  <span className="model-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                </div>
                <div className="section-spaces-head">
                  <h1 className="section-spaces-head-title">Space Types</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Space Type</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { spaces.length > 0 ? (
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
                    pageSize={spaces.length > 7 ? 7 : data.length}
                    showPageSizeOptions={false}
                    showPageJump={true}
                  />
                ) : null }

                <Modal title="Add New Space Type" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateSpace} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form">
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Name</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="name" value={name} onChange={this.handleChange} required />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Requirements</label>
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
                        <div className="help-block">Requirements are required</div>
                      }
                      <div className="care-form-group-item">
                        <p className="care-form-group-item-legend">Please add capacities to requirements.</p>
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
    );
  }
}

SpaceTypesContainer.propTypes = {
  loadSpaceTypes: PropTypes.func.isRequired,
  capacity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  space: state.space,
  capacity: state.capacity
});

export default withRouter(connect(mapStateToProps, actions)(SpaceTypesContainer));
