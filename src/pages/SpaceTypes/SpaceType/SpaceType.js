import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';

import './SpaceType.scss';

class SpaceTypeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentSpace: null,
      capacities: [],
      isLoading: true,
    }

    this.saveSpace = this.saveSpace.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getRequirements = this.getRequirements.bind(this);
  }

  componentWillMount() {
    const loadProps = { isActive: true }
    const id = this.props.match.params.id
    if (id) {
      this.props.getSpaceTypeId(id);
    }
    this.props.loadVehiclesCapacities(loadProps);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.space.currentSpace && nextProps.space.currentSpace.id && !this.props.space.currentSpace) {
      this.setState({
        currentSpace: nextProps.space.currentSpace,
        isLoading: false,
      });
    }

    if (nextProps.capacity.capacities.length !== this.props.capacity.capacities.length) {
      this.setState({ capacities: [ ...nextProps.capacity.capacities ] })
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetSpaces(true)
    this.props.resetVehiclesCapacities(true)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditSpace(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditSpace('');
  }

  goBack() {
    history.push('/space-types');
  }

  getRequirements() {
    const { currentSpace, capacities } = this.state
    let result = []
    if (currentSpace && currentSpace.requirements) {
      currentSpace.requirements.forEach(item => {
        const value = capacities.find(capacity => capacity.id === item.capacityId)
        item.name = value.name
      })
      return currentSpace.requirements
    }
    return result
  }

  saveSpace(fieldName, name) {
    const { currentSpace } = this.state;
    let space = { ...currentSpace };
    space[name] = fieldName;
    this.setState({ currentSpace: space });
    this.props.updateSpaceType(space);
    this.props.setCurrentFieldToEditSpace('');
  }

  render() {
    const { currentFieldName } = this.props.space;
    const { currentSpace, isLoading, capacities } = this.state;

    return (
      <section className="section-space">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="space-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentSpace && capacities.length > 0 ? (
                  <div className="space-detail">
                    <h1 className="space-detail-title">Space Type Detail / {currentSpace.name}</h1>
                    <div className="space-detail-tabs">
                      <span className="space-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="space-detail-body">
                      <form className="space-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="space-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentSpace.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveSpace} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="space-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentSpace.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="space-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentSpace.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveSpace} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="space-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentSpace.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'requirements' ? (
                          <div className="space-detail-body-form-group editing">

                          </div>
                          ) : (
                          <div className="space-detail-body-form-group" onClick={() => this.toggleEditField('requirements')}>
                            <FieldList fieldList={this.getRequirements()} fieldGroup={capacities} fieldLabel={'Requirements'} />
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

SpaceTypeContainer.propTypes = {
  space: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  capacity: state.capacity,
  space: state.space,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(SpaceTypeContainer));
