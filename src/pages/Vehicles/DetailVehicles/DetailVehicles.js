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
import './DetailVehicles.scss';

class DetailVehiclesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentVehicle: null,
      currentRegion: null,
      currentOwner: null,
      currentModel: null,
      isLoading: true,
      events: [],
      regions: [],
      users: [],
      models: [],
      isCurrentView: 'vehicle',
      submitted: false,
      isOpen: false,
      isEditing: false,
      vehicleEvents: [],
      idVehicle: 0,
      currentEvent: {
        title: '',
        description: '',
        startDate: '',
        durationDate: moment().startOf('day'),
        duration: 0,
        recurrencePattern: '',
        eventType: 'vehicle-availability',
        body: {},
      },
      openRecurrence: false,
    }

    this.saveVehicle = this.saveVehicle.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
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
    this.setState({ idVehicle: id })
    if (id) {
      this.props.getVehicleId(id);
    }
    this.initializeData(id);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.vehicle.currentVehicle && nextProps.vehicle.currentVehicle.id && !this.props.vehicle.currentVehicle) {
      this.setState({ currentVehicle: nextProps.vehicle.currentVehicle });
      this.props.getRegionId(nextProps.vehicle.currentVehicle.regionId)
      this.props.getVehicleModelId(nextProps.vehicle.currentVehicle.modelId)
      if (nextProps.vehicle.currentVehicle.ownerId) {
        this.props.getDriverId(nextProps.vehicle.currentVehicle.ownerId)
      }
    }

    if (nextProps.schedule.events.length !== this.props.schedule.events.length) {
      this.setState({ vehicleEvents: nextProps.schedule.events })
      this.setEventsToCalendar(nextProps.schedule.events)
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: nextProps.region.regions })
    }

    if (nextProps.model.models.length !== this.props.model.models.length) {
      this.setState({ models: nextProps.model.models })
    }

    if (nextProps.driver.drivers.length !== this.props.driver.drivers.length) {
      this.setState({ users: nextProps.driver.drivers })
    }

    if (nextProps.region.currentRegion !== this.props.region.currentRegion) {
      this.setState({ currentRegion: nextProps.region.currentRegion })
    }

    if (nextProps.model.currentModel !== this.props.model.currentModel) {
      this.setState({ currentModel: nextProps.model.currentModel })
    }

    if (nextProps.driver.currentDriver !== this.props.driver.currentDriver) {
      this.setState({ currentOwner: nextProps.driver.currentDriver })
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

    const { isLoading, currentVehicle, regions } = this.state;
    if (isLoading && currentVehicle && regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetSchedulingEvents(true)
    this.props.resetRegions(true)
    this.props.resetDrivers(true)
    this.props.resetVehiclesModels(true)
  }

  initializeData(id) {
    const { idVehicle } = this.state
    const today = moment();
    const props = {
      startDate: today.startOf('week').toISOString(),
      endDate: today.endOf('week').toISOString(),
      vehicleId : id || idVehicle
    }
    this.props.loadScheduling(props)

    const loadProps = { isActive: true}
    this.props.loadRegions(loadProps)
    this.props.loadUsers(loadProps)
    this.props.loadVehiclesModels(loadProps)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditVehicle(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditVehicle('');
  }

  goBack() {
    history.push('/vehicles/');
  }

  tabView(view) {
    this.setState({ isCurrentView: view })
  }

  saveVehicle(fieldName, name) {
    const { currentVehicle } = this.state;
    let vehicle = { ...currentVehicle };
    vehicle[name] = fieldName;

    this.setState({ currentVehicle: vehicle });
    this.props.updateVehicle(vehicle);
    this.props.setCurrentFieldToEditVehicle('');
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
      eventType: 'vehicle-availability',
      body: {},
    }

    return currentEvent
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

    const {currentEvent, currentVehicle } = this.state
    const body = { vehicleId: currentVehicle.id }
    if (currentEvent.title && currentEvent.description && currentEvent.startDate && currentEvent.duration && currentVehicle.regionId && currentEvent.eventType) {
      let formProps = currentEvent;
      formProps.regionId = currentVehicle.regionId;
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
    const { currentFieldName, errorMessage } = this.props.vehicle;
    const { currentVehicle, currentEvent, isLoading, isEditing, isCurrentView, isOpen, submitted, events, regions, models, users, currentRegion, currentOwner: owner, currentModel, openRecurrence } = this.state;
    const localizer = BigCalendar.momentLocalizer(moment)
    const currentOwner = owner || {};

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
                { currentVehicle && currentOwner && currentRegion && currentModel && regions.length ? (
                  <div className="vehicle-detail">
                    <h1 className="vehicle-detail-title">Vehicle Detail / {currentVehicle.licensePlate}</h1>
                    <div className="client-detail-tabs">
                      <span className={isCurrentView === 'vehicle' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('vehicle')}>Primary Info</span>
                      <span className={isCurrentView === 'calendar' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('calendar')}>Vehicle Schedule</span>
                    </div>
                    {isCurrentView === 'vehicle' && (
                      <div className="vehicle-detail-body">
                        <form className="vehicle-detail-body-form">
                          { currentFieldName === 'licensePlate' ? (
                            <div className="vehicle-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentVehicle.licensePlate} fieldLabel={'License Plate'} fieldName="licensePlate"
                                        saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('licensePlate')}>
                              <FieldGroup fieldInfo={currentVehicle.licensePlate} fieldLabel={'License Plate'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'title' ? (
                            <div className="vehicle-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentVehicle.title} fieldLabel={'Title'} fieldName="title"
                                        saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('title')}>
                              <FieldGroup fieldInfo={currentVehicle.title} fieldLabel={'Title'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'mileage' ? (
                            <div className="vehicle-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentVehicle.mileage} fieldLabel={'Mileage'} fieldName="mileage"
                                        saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('mileage')}>
                              <FieldGroup fieldInfo={currentVehicle.mileage} fieldLabel={'Mileage'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'isActive' ? (
                            <div className="vehicle-detail-body-form-group editing">
                              <EditSwitchField fieldTag={currentVehicle.isActive} fieldLabel={'Active'} fieldName="isActive"
                                saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                              <FieldGroup fieldInfo={currentVehicle.isActive ? 'active' : 'inactive'} fieldLabel={'Active'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'isCompanyOwned' ? (
                            <div className="vehicle-detail-body-form-group editing">
                              <EditSwitchField fieldTag={currentVehicle.isCompanyOwned} fieldLabel={'Company Owner'} fieldName="isCompanyOwned"
                                saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="vehicle-detail-body-form-group" onClick={() => this.toggleEditField('isCompanyOwned')}>
                              <FieldGroup fieldInfo={currentVehicle.isCompanyOwned ? 'Company owner' : 'No owner'} fieldLabel={'Company Owner'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'regionId' && regions && regions.length ? (
                            <div className="region-detail-body-form-group editing">
                              <EditSelectField fieldId={currentVehicle.regionId} fieldLabel={'Regions'} list={regions}
                                saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} fieldName="regionId" />
                            </div>
                            ) : (
                            <div className="region-detail-body-form-group" onClick={() => this.toggleEditField('regionId')}>
                              <FieldGroup fieldInfo={currentRegion.name} fieldLabel={'Region'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'modelId' && models && models.length ? (
                            <div className="region-detail-body-form-group editing">
                              <EditSelectField fieldId={currentVehicle.modelId} fieldLabel={'Models'} list={models}
                                saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} fieldName="modelId" />
                            </div>
                            ) : (
                            <div className="region-detail-body-form-group" onClick={() => this.toggleEditField('modelId')}>
                              <FieldGroup fieldInfo={currentModel.name} fieldLabel={'Model'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'ownerId' && users && users.length ? (
                            <div className="region-detail-body-form-group editing">
                              <EditSelectField fieldId={currentVehicle.ownerId} fieldLabel={'Owners'} list={users}
                                saveField={this.saveVehicle} fieldCancel={this.cancelCurrentField} fieldName="ownerId" />
                            </div>
                            ) : (
                            <div className="region-detail-body-form-group" onClick={() => this.toggleEditField('ownerId')}>
                              <FieldGroup fieldInfo={currentOwner.name} fieldLabel={'Owner'} />
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
          title={isEditing ? 'Edit Event' : 'Add New Event'}
          show={isOpen}
          onClose={this.toggleModal}
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
                {submitted && !currentEvent.durationTime &&
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

DetailVehiclesContainer.propTypes = {
  schedule: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  model: PropTypes.object.isRequired,
  driver: PropTypes.object.isRequired,
  vehicle: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  schedule: state.schedule,
  region: state.region,
  model: state.model,
  driver: state.driver,
  vehicle: state.vehicle,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(DetailVehiclesContainer));
