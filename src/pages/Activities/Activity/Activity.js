import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import Loading from './../../../components/Loading/Loading';

import './Activity.scss';

class ActivityDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentActivity: null,
      currentFacility: null,
      facilities: [],
      isLoading: true,
    }

    this.saveActivity = this.saveActivity.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getActivityById(id);
    }

    const loadProps = {
      isActive: true
    }

    this.props.loadFacilities(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.activity.currentActivity && nextProps.activity.currentActivity.id && !this.props.activity.currentActivity) {
      this.setState({
        currentActivity: nextProps.activity.currentActivity,
        isLoading: false,
      });
      this.props.getFacilityById(nextProps.activity.currentActivity.facilityId)
    }

    if (nextProps.facility.facilities.length !== this.props.facility.facilities.length) {
      this.setState({ facilities: [ ...nextProps.facility.facilities ] })
    }

    if (nextProps.facility.currentFacility !== this.props.facility.currentFacility) {
      this.setState({ currentFacility: nextProps.facility.currentFacility })
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetActivities(true)
    this.props.resetFacilities(true)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditActivity(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditActivity('');
  }

  goBack() {
    history.push('/activities');
  }

  saveActivity(fieldName, name) {
    const { currentActivity } = this.state;
    let activity = { ...currentActivity };
    activity[name] = fieldName;
    this.setState({ currentActivity: activity });
    this.props.updateActivity(activity);
    this.props.setCurrentFieldToEditActivity('');
  }

  render() {
    const { currentFieldName } = this.props.activity;
    const { currentActivity, currentFacility, facilities, isLoading } = this.state;

    return (
      <section className="section-activity">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <Link to="/activities">
                  <span className="activity-detail-back"><i className="fas fa-angle-double-left"></i> Back</span>
                </Link>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentActivity && currentFacility ? (
                  <div className="activity-detail">
                    <h1 className="activity-detail-title">Activity Detail / {currentActivity.name}</h1>
                    <div className="activity-detail-tabs">
                      <span className="activity-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="activity-detail-body">
                      <form className="activity-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="activity-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentActivity.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="activity-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentActivity.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'duration' ? (
                          <div className="activity-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentActivity.duration} fieldLabel={'Duration'}
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} fieldName="duration" />
                          </div>
                          ) : (
                          <div className="activity-detail-body-form-group" onClick={() => this.toggleEditField('duration')}>
                            <FieldGroup fieldInfo={currentActivity.duration} fieldLabel={'Duration'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'cost' ? (
                          <div className="activity-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentActivity.cost} fieldLabel={'Cost'} fieldName="cost"
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField}
                              placeholder="Enter number" />
                          </div>
                          ) : (
                          <div className="activity-detail-body-form-group" onClick={() => this.toggleEditField('cost')}>
                            <FieldGroup fieldInfo={currentActivity.cost} fieldLabel={'Cost'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'capacity' ? (
                          <div className="activity-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentActivity.capacity} fieldLabel={'Capacity'} fieldName="capacity"
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField}
                              placeholder="Enter capacity" />
                          </div>
                          ) : (
                          <div className="activity-detail-body-form-group" onClick={() => this.toggleEditField('capacity')}>
                            <FieldGroup fieldInfo={currentActivity.capacity} fieldLabel={'Capacity'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="activity-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentActivity.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="activity-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentActivity.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                          </div>
                          )
                        }
                        {currentFieldName === 'facilityId' && facilities && facilities.length? (
                          <div className="activity-detail-body-form-group editing">
                            <EditSelectField fieldId={currentActivity.facilityId} fieldLabel={'Facilities'} list={facilities}
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} fieldName="facilityId" />
                          </div>
                          ) : (
                          <div className="activity-detail-body-form-group" onClick={() => this.toggleEditField('facilityId')}>
                            <FieldGroup fieldInfo={currentFacility.name} fieldLabel={'Facility'} />
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
    <div className="activity-detail-body-form-wrapper">
      <div className="activity-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="activity-detail-body-form-item value">
        <span>{props.fieldInfo || '--'}</span>
      </div>
      <div className="activity-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

ActivityDetailContainer.propTypes = {
  activity: PropTypes.object.isRequired,
  facility: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  activity: state.activity,
  facility: state.facility,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ActivityDetailContainer));
