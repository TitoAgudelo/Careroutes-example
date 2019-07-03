import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import DateTimePicker from 'react-datetime-picker';
import RRuleGenerator from 'react-rrule-generator';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';

import Loading from './../../../components/Loading/Loading';
import Modal from './../../../components/Modal/Modal';

import "react-big-calendar/lib/css/react-big-calendar.css";
import './ProgrammedActivity.scss';

class ProgrammedActivityDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProgrammed: null,
      currentProgram: null,
      currentActivity: null,
      isLoading: true,
      activities: null,
      submitted: false,
      isOpen: false,
      isEditing: false,
      programId: 0,
      activityId: 0,
    }

    this.saveProgrammedActivity = this.saveProgrammedActivity.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.initializeData = this.initializeData.bind(this);

    this.isClosingModal = false;
  }

  componentWillMount() {
    const { programId, activityId } = this.props.match.params;
    this.setState({ programId, activityId });

    if (programId && activityId) {
      this.props.getProgrammedById(activityId, programId);
    }

    this.initializeData();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.programmed.currentProgrammed
      && nextProps.programmed.currentProgrammed.id
      && nextProps.programmed.currentProgrammed !== this.state.currentProgrammed
    ) {
      this.setState({ currentProgrammed: nextProps.programmed.currentProgrammed });
      this.props.getProgramById(nextProps.programmed.currentProgrammed.programId)
      this.props.getActivityById(nextProps.programmed.currentProgrammed.activityId)
    }

    if (nextProps.activity.activities.length !== this.props.activity.activities.length) {
      this.setState({ activities: nextProps.activity.activities });
    }

    if (nextProps.program.currentProgram !== this.props.program.currentProgram) {
      this.setState({ currentProgram: nextProps.program.currentProgram })
    }

    if (nextProps.activity.currentActivity !== this.props.activity.currentActivity) {
      this.setState({ currentActivity: nextProps.activity.currentActivity })
    }

    const { isLoading, currentProgrammed, activities } = this.state;
    if (isLoading && currentProgrammed && activities) {
      this.setState({
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetProgrammed(true);
    this.props.resetActivities(true);
  }

  initializeData() {
    const loadProps = { isActive: true}
    this.props.loadActivities(loadProps)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditProgrammed(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditProgrammed('');
  }

  goBack() {
    const { programId } = this.props.match.params;
    history.push(`/programmed-activities/${programId}`);
  }

  saveProgrammedActivity(fieldName, name) {
    const { currentProgrammed, currentActivity, activityId, activities } = this.state;
    let programmedActivity = { ...currentProgrammed };

    if (typeof fieldName === 'object') {
      programmedActivity[name] = fieldName.format('HH:mm');
    } else {
      programmedActivity[name] = fieldName;
    }

    this.setState({
      currentProgrammed: programmedActivity,
      currentActivity: activities[fieldName] || currentActivity,
    });
    this.props.updateProgrammed(programmedActivity, activityId);
    this.props.setCurrentFieldToEditProgrammed('');
  }

  handleSelect(e) {
    const startDate = moment(e.start).format('YYYY-MM-DDTHH:mm')
    let { currentEvent } = this.state
    currentEvent.startDate = startDate
    this.setState({ isOpen: !this.state.isOpen, currentEvent: currentEvent })
  }

  toggleModal = () => {
    const { isOpen, isEditing } = this.state;
    let newState = {};

    if (!isOpen) {
      this.props.successMessage('');
      this.props.errorMessage('');
    }

    if (isOpen) {
      const currentEvent = this.getDefaultEvent()
      newState = Object.assign({}, newState, { currentEvent });
      if (isEditing) { newState = Object.assign({}, newState, { isEditing: false }) }
    }

    newState = Object.assign({}, newState, { isOpen: !isOpen })
    this.setState(newState, () => (this.isClosingModal = false));
  }

  handleTimeChange = (e) => {
    const date = new Date(e)
    const momentDate = moment(e)
    let { currentEvent } = this.state
    if (date) {
      const minutes = date.getMinutes()
      const hours = date.getHours()
      const total = minutes + (hours * 60)
      currentEvent['duration'] = total
      currentEvent['durationDate'] = momentDate
      this.setState({ currentEvent: currentEvent })
    }
  }

  getTimeEditable(timeField) {
    return typeof timeField === 'string'
      ? moment(timeField, 'HH:mm')
      : timeField;
  }

  render() {
    const { currentFieldName, errorMessage } = this.props.programmed;
    const { currentProgrammed, currentEvent, isLoading, isEditing, isCurrentView, isOpen, submitted, activities, regions, models, users, currentProgram, currentActivity, owner, currentModel, openRecurrence } = this.state;

    return (
      <section className="section-vehicle">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="vehicle-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentProgrammed && currentProgram && currentActivity && activities ? (
                  <div className="vehicle-detail">
                    <h1 className="vehicle-detail-title">Programmed Activities Detail</h1>
                    <div className="client-detail-tabs">
                      <span className="client-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="vehicle-detail-body">
                      <form className="vehicle-detail-body-form">
                        <div className="region-detail-body-form-group" onClick={() => this.toggleEditField('programId')}>
                          <FieldGroup fieldInfo={currentProgram.name} fieldLabel={'Program'} editable={false}/>
                        </div>
                        { currentFieldName === 'activityId' ? (
                          <div className="region-detail-body-form-group editing">
                            <EditSelectField fieldId={currentProgrammed.activityId} fieldLabel={'Activity'} list={activities}
                              saveField={this.saveProgrammedActivity} fieldCancel={this.cancelCurrentField} fieldName="activityId" />
                          </div>
                          ) : (
                          <div className="region-detail-body-form-group" onClick={() => this.toggleEditField('activityId')}>
                            <FieldGroup fieldInfo={currentActivity.name} fieldLabel={'Activity'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'startTime' ? (
                          <div className="vehicle-detail-body-form-group editing">
                            <FieldEdit fieldInfo={this.getTimeEditable(currentProgrammed.startTime)} fieldLabel={'Start Time'} fieldName="startTime"
                                      saveField={this.saveProgrammedActivity} fieldCancel={this.cancelCurrentField} isTime />
                          </div>
                          ) : (
                          <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('startTime')}>
                            <FieldGroup fieldInfo={currentProgrammed.startTime} fieldLabel={'Start Time'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'endTime' ? (
                          <div className="vehicle-detail-body-form-group editing">
                            <FieldEdit fieldInfo={this.getTimeEditable(currentProgrammed.endTime)} fieldLabel={'End Time'} fieldName="endTime"
                                      saveField={this.saveProgrammedActivity} fieldCancel={this.cancelCurrentField} isTime />
                          </div>
                          ) : (
                          <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('endTime')}>
                            <FieldGroup fieldInfo={currentProgrammed.endTime} fieldLabel={'End Time'} />
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

const FieldGroup = ({ fieldLabel = '', fieldInfo = '', editable = true }) => {
  return (
    <div className="provider-detail-body-form-wrapper">
      <div className="provider-detail-body-form-item">
        <label>{fieldLabel}</label>
      </div>
      <div className="provider-detail-body-form-item value">
        <span>{fieldInfo || '--'}</span>
      </div>
      {editable && (
        <div className="provider-detail-body-form-item">
          <i className="fas fa-pen"></i>
          <span>Edit</span>
        </div>
      )}
    </div>
  )
}

ProgrammedActivityDetailContainer.propTypes = {
  schedule: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  driver: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  programmed: state.programmed,
  program: state.program,
  activity: state.activity,
});

export default withRouter(connect(mapStateToProps, actions)(ProgrammedActivityDetailContainer));
