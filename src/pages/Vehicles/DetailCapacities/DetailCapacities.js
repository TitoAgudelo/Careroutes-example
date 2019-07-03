import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';

import './DetailCapacities.scss';

class CapacitiesDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCapacity: null,
      isLoading: true,
    }

    this.saveCapacity = this.saveCapacity.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getVehicleCapacityId(id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.capacity.currentCapacity && nextProps.capacity.currentCapacity.id && !this.props.capacity.currentCapacity) {
      this.setState({
        currentCapacity: nextProps.capacity.currentCapacity,
        isLoading: false,
      });
    }

    return true;
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditVehicleCapacity(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditVehicleCapacity('');
  }

  goBack() {
    history.push('/vehicle-capacities');
  }

  saveCapacity(fieldName, name) {
    const { currentCapacity } = this.state;
    let capacity = { ...currentCapacity };
    capacity[name] = fieldName;
    this.setState({ currentCapacity: capacity });
    this.props.updateVehicleCapacity(capacity);
    this.props.setCurrentFieldToEditVehicleCapacity('');
  }

  render() {
    const { currentFieldName } = this.props.capacity;
    const { currentCapacity, isLoading } = this.state;

    return (
      <section className="section-capacity">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="capacity-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentCapacity ? (
                  <div className="capacity-detail">
                    <h1 className="capacity-detail-title">Capacity Detail / {currentCapacity.name}</h1>
                    <div className="capacity-detail-tabs">
                      <span className="capacity-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="capacity-detail-body">
                      <form className="capacity-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="capacity-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentCapacity.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveCapacity} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="capacity-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentCapacity.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="capacity-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentCapacity.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveCapacity} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="capacity-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentCapacity.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                          </div>
                          )
                        }
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

CapacitiesDetailContainer.propTypes = {
  capacity: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  capacity: state.capacity,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(CapacitiesDetailContainer));
