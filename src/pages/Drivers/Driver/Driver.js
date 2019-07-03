import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import DateTimePicker from 'react-datetime-picker';
import RRuleGenerator from './../../../components/RRuleGeneratorModal/RRuleGeneratorModal';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';
import Modal from './../../../components/Modal/Modal';

import "react-big-calendar/lib/css/react-big-calendar.css";
import './Driver.scss';

class DriverDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDriver: null,
      currentRegion: null,
      isLoading: true,
      events: [],
      regions: [],
      isCurrentView: 'driver',
      submitted: false,
      isOpen: false,
      isEditing: false,
      driverEvents: [],
      idDriver: 0,
      currentEvent: {
        title: '',
        description: '',
        startDate: '',
        durationDate: moment().startOf('day'),
        duration: 0,
        recurrencePattern: '',
        eventType: 'driver-shift',
        body: {},
      },
      openRecurrence: false,
    }

    this.saveDriver = this.saveDriver.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRecurrence = this.handleRecurrence.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.onUpdateDate = this.onUpdateDate.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.initializeData = this.initializeData.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.onView = this.onView.bind(this);
    this.toggleCustomRecurrence = this.toggleCustomRecurrence.bind(this);

    this.isClosingModal = false;
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    this.setState({ idDriver: id })
    if (id) {
      this.props.getDriverId(id);
    }
    this.initializeData(id);

    const loadProps = { isActive: true}
    this.props.loadRegions(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.driver.currentDriver && nextProps.driver.currentDriver.id && !this.props.driver.currentDriver) {
      this.setState({ currentDriver: nextProps.driver.currentDriver });
      this.props.getRegionId(nextProps.driver.currentDriver.regionId)
    }

    if (nextProps.schedule.events.length !== this.props.schedule.events.length) {
      this.setState({ driverEvents: nextProps.schedule.events })
      this.setEventsToCalendar(nextProps.schedule.events)
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: nextProps.region.regions })
    }

    if (nextProps.region.currentRegion !== this.props.region.currentRegion) {
      this.setState({ currentRegion: nextProps.region.currentRegion })
    }

    if (nextProps.schedule.currentEvent !== this.props.schedule.currentEvent) {
      let currentEvent = nextProps.schedule.currentEvent
      const date = new Date(moment(currentEvent.startDate).startOf('day'))
      currentEvent.durationDate = moment(date).add(currentEvent.duration, 'minutes')
      this.setState({ currentEvent: currentEvent })
      this.initializeData()
      if (!this.isClosingModal) {
        this.isClosingModal = true;
        this.toggleModal()
      }
    }

    if ((nextProps.schedule.sucessAdded && !this.props.schedule.sucessAdded) || (!this.props.schedule.successEdited && nextProps.schedule.successEdited)) {
      if (!this.isClosingModal) {
        this.isClosingModal = true;
        this.props.resetEditStatus();
        this.toggleModal();
      }
    }

    const { isLoading, currentDriver, regions } = this.state;
    if (isLoading && currentDriver && regions && regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetSchedulingEvents(true)
    this.props.resetRegions(true)
  }

  initializeData(id) {
    const { idDriver } = this.state
    const today = moment();
    const props = {
      startDate: today.startOf('week').toISOString(),
      endDate: today.endOf('week').toISOString(),
      driverId : id || idDriver
    }
    this.props.loadScheduling(props)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditDriver(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditDriver('');
  }

  goBack() {
    history.push('/drivers');
  }

  tabView(view) {
    this.setState({ isCurrentView: view })
  }

  saveDriver(fieldName, name) {
    const { currentDriver } = this.state;
    let driver = { ...currentDriver };

    if (name === 'homebase') {
      driver[name] = Object.assign({}, driver[name], fieldName);
    } else {
      driver[name] = fieldName;
    }

    this.setState({ currentDriver: driver });
    this.props.updateDriver(driver);
    this.props.setCurrentFieldToEditDriver('');
  }

  setEventsToCalendar = (events) => {
    const result = []
    let eventFormat = {}
    if (events.length > 0) {
      events.map(event => {
        eventFormat = this.setFormatEvent(event)
        result.push(eventFormat)
      })

      this.setState({ events: result })
    }
  }

  setFormatEvent = (event) => {
    const eventFormat = {
      start: new Date(event.startDate),
      end: new Date(moment(event.startDate).add(event.duration, 'minutes')),
      title: event.title,
      id: event.id
    }
    return eventFormat
  }

  getDefaultEvent = () => {
    const currentEvent = {
      title: '',
      description: '',
      startDate: '',
      duration: 0,
      recurrencePattern: '',
      eventType: 'driver-shift',
      body: {},
    }

    return currentEvent;
  }

  handleSelect(e) {
    const startDate = moment(e.start).format('YYYY-MM-DDTHH:mm')
    let { currentEvent } = this.state
    currentEvent.startDate = startDate
    this.setState({ isOpen: !this.state.isOpen, currentEvent: currentEvent })
  }

  toggleModal() {
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

  handleChange(e) {
    const { name, value } = e.target;
    const { currentEvent } = this.state;
    const event = currentEvent;
    event[name] = value;
    this.setState({ currentEvent: event });
  }

  handleRecurrence(rrule) {
    this.setState((prevState) => ({
      currentEvent: {
        ...prevState.currentEvent,
        recurrencePattern: rrule,
      },
    }));
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

  onUpdateDate(date) {
    let { currentEvent } = this.state
    currentEvent.startDate = moment(date).format('YYYY-MM-DDTHH:mm')
    this.setState({ currentEvent: currentEvent })
  }

  editEvent(e) {
    this.setState({ isEditing: true })
    this.props.getSchedulingById(e.id)
  }

  handleSubmitEvent(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    const { currentEvent, currentDriver } = this.state
    const body = { driverId: currentDriver.id }
    if (currentEvent.title && currentEvent.description && currentEvent.startDate && currentEvent.duration && currentDriver.regionId && currentEvent.eventType) {
      let formProps = currentEvent;
      formProps.regionId = currentDriver.regionId;
      formProps.body = body;
      this.props.createSchedulingEvent(formProps);
    }
  }

  updateEvent() {
    const { currentEvent } = this.state
    if (currentEvent.id) { this.props.updateSchedulingEvent(currentEvent) }
  }

  deleteEvent() {
    const { currentEvent } = this.state
    if (currentEvent.id) { this.props.deleteSchedulingEvent(currentEvent) }
  }

  onView(dates, view) {
    const { idDriver } = this.state
    const today = moment();
    const props = {
      startDate: today.startOf('week').toISOString(),
      endDate: today.endOf('week').toISOString(),
      driverId : idDriver
    }

    if (view === 'month' || view === 'agenda') {
      props.startDate = moment(dates[0]).startOf('month').toISOString()
      props.endDate = moment(dates[0]).endOf('month').toISOString()
    } else if (view === 'week' || dates.length > 2) {
      props.startDate = moment(dates[0]).toISOString()
      props.endDate = moment(dates[6]).toISOString()
    }
    this.props.loadScheduling(props)
  }

  toggleCustomRecurrence() {
    this.setState((prevState) => ({
      openRecurrence: !prevState.openRecurrence,
    }));
  }

  render() {
    const { currentFieldName, errorMessage } = this.props.driver;
    const { currentDriver, currentEvent, isLoading, isEditing, isCurrentView, isOpen, submitted, events, regions, currentRegion, openRecurrence } = this.state;
    const localizer = BigCalendar.momentLocalizer(moment)

    return (
      <section className="section-driver">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="driver-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentDriver && currentRegion && regions.length ? (
                  <div className="driver-detail">
                    <h1 className="driver-detail-title">Driver Detail / {currentDriver.name}</h1>
                    <div className="client-detail-tabs">
                      <span className={isCurrentView === 'driver' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('driver')}>Primary Info</span>
                      <span className={isCurrentView === 'calendar' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('calendar')}>Driver Schedule</span>
                    </div>
                    {isCurrentView === 'driver' && (
                      <div className="driver-detail-body">
                        <form className="driver-detail-body-form">
                          { currentFieldName === 'name' ? (
                            <div className="driver-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentDriver.name} fieldLabel={'Name'} fieldName="name"
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="driver-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                              <FieldGroup fieldInfo={currentDriver.name} fieldLabel={'Name'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'phone' ? (
                            <div className="driver-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentDriver.phone} fieldLabel={'Phone'}
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} fieldName="phone"
                                mask="_" format="+1 (###) ###-####" placeholder="+1 (###) ###-####" />
                            </div>
                            ) : (
                            <div className="driver-detail-body-form-group" onClick={() => this.toggleEditField('phone')}>
                              <FieldGroup fieldInfo={currentDriver.phone} fieldLabel={'Phone'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'email' ? (
                            <div className="driver-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentDriver.email} fieldLabel={'Email'} fieldName="email"
                                        saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="driver-detail-body-form-group" onClick={() => this.toggleEditField('email')}>
                              <FieldGroup fieldInfo={currentDriver.email} fieldLabel={'Email'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'license' ? (
                            <div className="driver-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentDriver.driverLicense} fieldLabel={'Drivers License #'}
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} fieldName="license"
                                format="##_###_####" placeholder="--_---_----" mask="-" />
                            </div>
                            ) : (
                            <div className="driver-detail-body-form-group" onClick={() => this.toggleEditField('license')}>
                              <FieldGroup fieldInfo={currentDriver.driverLicense} fieldLabel={'Drivers License #'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'regionId' ? (
                            <div className="driver-detail-body-form-group editing">
                              <EditSelectField fieldId={currentDriver.regionId} fieldLabel={'Regions'} list={regions}
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} fieldName="regionId" />
                            </div>
                            ) : (
                            <div className="driver-detail-body-form-group" onClick={() => this.toggleEditField('regionId')}>
                              <FieldGroup fieldInfo={currentRegion.name} fieldLabel={'Region'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'address' ? (
                            <div className="provider-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentRegion.address} fieldLabel="Address" fieldName="address"
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} isLocation />
                            </div>
                            ) : (
                            <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('address')}>
                              <FieldGroup fieldInfo={(currentRegion.address || {}).addressLine1} fieldLabel={'Address'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'isActive' ? (
                            <div className="driver-detail-body-form-group editing">
                              <EditSwitchField fieldTag={currentDriver.isActive} fieldLabel={'Active'} fieldName="isActive"
                                saveField={this.saveDriver} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="driver-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                              <FieldGroup fieldInfo={currentDriver.isActive ? 'active' : 'inactive'} fieldLabel={'Active'} />
                            </div>
                            )
                          }
                        </form>
                      </div>
                    )}
                    {isCurrentView === 'calendar' && (
                      <div className="client-calendar">
                        <BigCalendar
                          selectable
                          localizer={localizer}
                          events={events}
                          startAccessor="start"
                          defaultView="week"
                          endAccessor="end"
                          onSelectSlot={this.handleSelect}
                          onSelectEvent={this.editEvent}
                          onRangeChange={this.onView}
                          style={{ height: "100vh" }}
                        />
                      </div>
                    )}
                  </div>
                ) : null }
              </div>
            </div>
          </div>
        </div>

        <Modal
          title={isEditing ? "Edit Event" : "Add New Event"}
          show={isOpen}
          onClose={() => {
            this.isClosingModal = true;
            this.toggleModal();
          }}
          onAction={this.submitCreateEvent}
          onSubmit={isEditing ? this.updateEvent : this.handleSubmitEvent}
        >
          { errorMessage ? (
            <div className="care-message-error">
              <p className="care-message-error-text">{ errorMessage }</p>
            </div> ) : null
          }
          <form className="care-form" onSubmit={isEditing ? this.updateEvent : this.handleSubmitEvent}>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Schedule Title</label>
              </div>
              <div className="care-form-group-item">
                <input type="text" placeholder="Enter title" className="care-form-group-item-field" name="title" value={currentEvent.title} onChange={this.handleChange} required />
                {submitted && !currentEvent.title &&
                  <div className="help-block">Title is required</div>
                }
              </div>
            </div>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Description</label>
              </div>
              <div className="care-form-group-item">
                <textarea type="text" placeholder="Enter description" className="care-form-group-item-field" name="description" value={currentEvent.description} onChange={this.handleChange} required />
                {submitted && !currentEvent.description &&
                  <div className="help-block">Description is required</div>
                }
              </div>
            </div>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Start Date</label>
              </div>
              <div className="care-form-group-item">
                {isEditing && currentEvent.startDate ? (
                    <DateTimePicker onChange={this.onUpdateDate} value={new Date(currentEvent.startDate)} />
                  ) : (
                    <input type="text" placeholder="Enter start date" className="care-form-group-item-field" name="startDate" value={currentEvent.startDate} onChange={this.handleChange} disabled={true} required />
                  )
                }
                {submitted && !currentEvent.startDate &&
                  <div className="help-block">Start Date is required</div>
                }
              </div>
            </div>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Duration</label>
                <p className="care-form-group-item-legend">Duration format HH:mm</p>
              </div>
              <div className="care-form-group-item">
                <TimePicker showSecond={false} minuteStep={15} value={currentEvent.durationDate} onChange={this.handleTimeChange} placeholder="HH:MM" />
                {submitted && !currentEvent.duration &&
                  <div className="help-block">Duration is required</div>
                }
              </div>
            </div>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Custom Recurrence</label>
              </div>
              <div className="care-form-dropdown">
                {openRecurrence ? (
                  <div className="care-form-dropdown-wrapper">
                    <span className="care-form-dropdown-text" onClick={this.toggleCustomRecurrence}>Hide Custom Recurrence</span>
                    <i className="fas fa-sort-up"></i>
                  </div>
                ) : (
                  <div className="care-form-dropdown-wrapper">
                    <span className="care-form-dropdown-text" onClick={this.toggleCustomRecurrence}>Show Custom Recurrence</span>
                    <i className="fas fa-sort-down"></i>
                  </div>
                )}
              </div>
              {openRecurrence && (
                <div className="care-form-group-item">
                  <RRuleGenerator handleRecurrence={this.handleRecurrence} />
                </div>
              )}
            </div>
            {isEditing && (
              <div className="care-form-group">
                <div className="care-form-group-item">
                  <div className="buttons-container">
                    <button type="button" className="button-secondary" onClick={this.deleteEvent}><span className="text">Delete Event</span></button>
                  </div>
                </div>
              </div>
              )
            }
          </form>
        </Modal>
      </section>
    );
  }
}

const FieldGroup = (props) => {
  return (
    <div className="driver-detail-body-form-wrapper">
      <div className="driver-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="driver-detail-body-form-item value">
        <span>{props.fieldInfo || '--'}</span>
      </div>
      <div className="driver-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

DriverDetailContainer.propTypes = {
  driver: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  schedule: state.schedule,
  region: state.region,
  driver: state.driver,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(DriverDetailContainer));
