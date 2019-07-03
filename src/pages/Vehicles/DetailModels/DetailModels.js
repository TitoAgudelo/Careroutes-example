import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';
import Modal from '../../../components/Modal/Modal';

import './DetailModels.scss';

class ModelsDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentModel: null,
      isLoading: true,
      capacities: [],
      requirements: [],
      openCapacities: true,
      isOpen: false,
      submitted: false,
    }

    this.saveModel = this.saveModel.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getRequirements = this.getRequirements.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleCapacities = this.toggleCapacities.bind(this);
    this.addValueToRequirement = this.addValueToRequirement.bind(this);
    this.removeValueToRequirement = this.removeValueToRequirement.bind(this);
    this.addCapacityToRequirements = this.addCapacityToRequirements.bind(this);
    this.setFormatCapacity = this.setFormatCapacity.bind(this);
    this.removeRequirement = this.removeRequirement.bind(this);
    this.saveModelfromModal = this.saveModelfromModal.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    const loadProps = { isActive: true };
    if (id) {
      this.props.loadVehiclesCapacities(loadProps);
      this.props.getVehicleModelId(id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.capacity.capacities.length !== this.props.capacity.capacities.length) {
      this.setState({ capacities: [ ...nextProps.capacity.capacities ] })
    }

    if (nextProps.model.currentModel && nextProps.model.currentModel.id && !this.props.model.currentModel) {
      this.setState({
        currentModel: nextProps.model.currentModel,
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetVehiclesModels(true)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditVehicleModel(targetName);
    
    if (targetName === 'capacities') {
      this.setState({
        requirements: this.state.currentModel.capacities
      })
      this.toggleModal();
    }
    
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditVehicleModel('');
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('');
      this.props.errorMessage('');
    }

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleCapacities() {
    this.setState({ openCapacities: !this.state.openCapacities })
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

  addCapacityToRequirements(capacity) {
    const { requirements } = this.state
    const formated = this.setFormatCapacity(capacity)
    const temporal = requirements.filter(requirement => requirement.capacityId === formated.capacityId)
    let result = temporal.length === 0 ? [...requirements, formated] : [...requirements]
    this.setState({ requirements: result })
  }

  setFormatCapacity = (capacity) => {
    let result = { capacityId: capacity.id, name: capacity.name, value: capacity.seats || 0 }
    return result
  }

  removeRequirement(requirement) {
    const { requirements } = this.state
    const result = requirements.filter(req => req.capacityId !== requirement.capacityId)
    this.setState({ requirements: result })
  }

  goBack() {
    history.push('/vehicle-models');
  }

  saveModel(fieldName, name) {
    const { currentModel } = this.state;
    let model = { ...currentModel };
    model[name] = fieldName;
    this.setState({ currentModel: model });
    this.props.updateVehicleModel(model);
    this.props.setCurrentFieldToEditVehicleModel('');
  }
  
  saveModelfromModal(e) {
    
    const { requirements, isOpen } = this.state;
    
    if (isOpen && requirements && requirements.length === 0) {
      e.preventDefault()
      this.setState({
        submitted: true,
      })
    }
    
    if (isOpen && requirements && requirements.length > 0) {
      const { currentModel } = this.state;
      let model = { ...currentModel };
      
      model['capacities'] = requirements;
      this.setState({
        submitted: false,
        currentModel:model
      })
      this.props.updateVehicleModel(model);
      this.props.setCurrentFieldToEditVehicleModel('');
    }
  }

  getRequirements() {
    const { currentModel, capacities } = this.state
    let result = []
    if (currentModel && currentModel.capacities) {
      currentModel.capacities.forEach(item => {
        const value = capacities.find(capacity => capacity.id === item.capacityId)
        item.name = value.name
      })
      return currentModel.capacities
    }
    return result
  }

  render() {
    const { currentFieldName, errorMessage } = this.props.model;
    const { currentModel, isLoading, capacities, requirements, openCapacities, submitted } = this.state;

    return (
      <section className="section-model">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="model-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentModel && capacities.length > 0 ? (
                  <div className="model-detail">
                    <h1 className="model-detail-title">Vehicle Model Detail / {currentModel.name}</h1>
                    <div className="model-detail-tabs">
                      <span className="model-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="model-detail-body">
                      <form className="model-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="model-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentModel.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveModel} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="model-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentModel.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'make' ? (
                          <div className="model-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentModel.make} fieldLabel={'Make'} fieldName="make"
                                       saveField={this.saveModel} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="model-detail-body-form-group" onClick={() => this.toggleEditField('make')}>
                            <FieldGroup fieldInfo={currentModel.make} fieldLabel={'Make'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="model-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentModel.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveModel} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="model-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentModel.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'capacities' && this.state.isOpen &&
                            <Modal title="Edit Capacities" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateModel} onSubmit={this.saveModelfromModal}>
                              {errorMessage ? (
                                <div className="care-message-error">
                                  <p className="care-message-error-text">{errorMessage}</p>
                                </div>) : null
                              }
                              <form className="care-form" onSubmit={this.saveModelfromModal}>
                                <div className="care-form-group">
                                  <div className="care-form-group-item">
                                    <label className="care-form-group-item-label">Capacities</label>
                                  </div>
                              {requirements.length > 0 && (
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
                              </form>
                            </Modal>
                        }
                          <div className="space-detail-body-form-group" onClick={() => this.toggleEditField('capacities')}>
                            <FieldList fieldList={this.getRequirements()} fieldGroup={capacities} fieldLabel={'Capacities'} />
                          </div>
                      </form>
                    </div>
                  </div>
                ) : null }
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const FieldList = (props) => {
  return (
    <div className="space-detail-body-form-wrapper">
      <div className="space-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="space-detail-body-form-item value">
        {
          props.fieldList.map(item => {
            return <span className="space-detail-list-item" key={'capcity-item' + item.capacityId}>{item.name} - {item.value}</span>
          })
        }
      </div>
      <div className="space-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

const FieldGroup = (props) => {
  return (
    <div className="provider-detail-body-form-wrapper">
      <div className="provider-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="provider-detail-body-form-item value">
        <span>{props.fieldInfo || '--'}</span>
      </div>
      <div className="provider-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

ModelsDetailContainer.propTypes = {
  model: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  capacity: state.capacity,
  model: state.model,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ModelsDetailContainer));
