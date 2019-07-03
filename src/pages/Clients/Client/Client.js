import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import BigCalendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import DateTimePicker from 'react-datetime-picker';
import RRuleGenerator from './../../../components/RRuleGeneratorModal/RRuleGeneratorModal';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import ClientPlacesContainer from './../Places/Places';

import FieldEdit from './../../../components/EditField/EditField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';
import Modal from './../../../components/Modal/Modal';
import SwitchField from './../../../components/SwitchField/SwitchField';

import 'rc-time-picker/assets/index.css';
import './Client.scss';

class ClientDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClient: null,
      currentRegion: null,
      currentProvider: null,
      currentSpace: null,
      isLoading: true,
      activities: [],
      programs: [],
      events: [],
      regions: [],
      places: [],
      providers: [],
      spaces: [],
      isCurrentView: 'client',
      idClient: 0,
      areas: [],
      submitted: false,
      isOpen: false,
      isEditing: false,
      clientEvents: [],
      currentEvent: {
        title: '',
        description: '',
        startDate: '',
        durationDate: moment().startOf('day'),
        duration: 0,
        recurrencePattern: '',
        eventType: 'client-commitment',
        programId: 0,
        body: {},
        pickup: {
          placeId: 'none',
          option: 'none',
        },
        dropoff: {
          placeId: 'none',
          option: 'none',
        },
      },
      openRecurrence: false,
    }

    this.saveClient = this.saveClient.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleOriginDestinationChange = this.handleOriginDestinationChange.bind(this);
    this.handleRecurrence = this.handleRecurrence.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
    this.getRequirements = this.getRequirements.bind(this);
    this.editEvent = this.editEvent.bind(this);
    this.onUpdateDate = this.onUpdateDate.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.initializeData = this.initializeData.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.onView = this.onView.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleCustomRecurrence = this.toggleCustomRecurrence.bind(this);

    this.isClosingModal = false;
  }

  componentWillMount() {
    const loadProps = { isActive: true }
    const id = this.props.match.params.id;
    this.setState({ idClient: id })
    if (id) {
      this.props.getClientById(id);
    }
    this.props.loadRestrictedAreas(loadProps)
    this.props.loadRegions(loadProps)
    this.props.loadProviders(loadProps)
    this.props.loadSpaceTypes(loadProps)
    this.props.loadActivities(loadProps)
    this.props.loadClientPlaces({ ...loadProps, id })
    this.props.loadPrograms(loadProps)
    this.initializeData(id);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.client.currentClient && nextProps.client.currentClient.id && !this.props.client.currentClient) {
      this.setState({ currentClient: nextProps.client.currentClient });
      this.props.getRegionId(nextProps.client.currentClient.regionId)
      this.props.getProviderId(nextProps.client.currentClient.providerId)
      this.props.getSpaceTypeId(nextProps.client.currentClient.spaceTypeId)
    }

    if (nextProps.area.areas.length !== this.props.area.areas.length) {
      this.setState({ areas: [ ...nextProps.area.areas ] })
    }

    if (nextProps.schedule.events.length !== this.props.schedule.events.length) {
      this.setState({ clientEvents: nextProps.schedule.events })
      this.setEventsToCalendar(nextProps.schedule.events)
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: nextProps.region.regions })
    }

    if (nextProps.provider.providers.length !== this.props.provider.providers.length) {
      this.setState({ providers: nextProps.provider.providers })
    }

    if (nextProps.space.spaces.length !== this.props.space.spaces.length) {
      this.setState({ spaces: nextProps.space.spaces })
    }

    if (nextProps.activity.activities.length !== this.props.activity.activities.length) {
      this.setState({ activities: nextProps.activity.activities })
    }

    if (nextProps.place.places.length !== this.state.places.length) {
      this.setState({ places: nextProps.place.places })
    }

    if (nextProps.region.currentRegion !== this.props.region.currentRegion) {
      this.setState({ currentRegion: nextProps.region.currentRegion })
    }

    if (nextProps.provider.currentProvider !== this.props.provider.currentProvider) {
      this.setState({ currentProvider: nextProps.provider.currentProvider })
    }

    if (nextProps.space.currentSpace !== this.props.space.currentSpace) {
      this.setState({ currentSpace: nextProps.space.currentSpace })
    }

    if (nextProps.program.programs.length !== this.props.program.programs.length) {
      this.setState({ programs: [ ...nextProps.program.programs ] });
    }

    if (nextProps.schedule.currentEvent && nextProps.schedule.currentEvent !== this.props.schedule.currentEvent) {
      let currentEvent = nextProps.schedule.currentEvent
      const { pickup, dropoff, program } = currentEvent.body;

      currentEvent.pickup = {};
      currentEvent.dropoff = {};

      if (pickup) {
        if (pickup.place) {
          currentEvent.pickup.option = 'places';
          currentEvent.pickup.placeId = pickup.place.id;
        }
        if (pickup.time) {
          const momentDate = moment(pickup.time, 'HH:mm');
          const date = new Date(momentDate)
          const minutes = date.getMinutes();
          const hours = date.getHours();
          const total = minutes + (hours * 60);
          currentEvent.pickup.duration = total;
          currentEvent.pickup.durationDate = momentDate;
        }
      } else {
        currentEvent.pickup.option = 'none';
        currentEvent.pickup.placeId = 'none';
      }

      if (dropoff) {
        if (dropoff.place) {
          currentEvent.dropoff.option = 'places';
          currentEvent.dropoff.placeId = dropoff.place.id;
        }
        if (dropoff.time) {
          const momentDate = moment(dropoff.time, 'HH:mm');
          const date = new Date(momentDate)
          const minutes = date.getMinutes();
          const hours = date.getHours();
          const total = minutes + (hours * 60);
          currentEvent.dropoff.duration = total;
          currentEvent.dropoff.durationDate = momentDate;
        }

      } else {
        currentEvent.dropoff.option = 'none';
        currentEvent.dropoff.placeId = 'none';
      }

      if (program) {
        currentEvent.programId = program.id;
      }

      const date = new Date(moment(currentEvent.startDate).startOf('day'))
      currentEvent.startDate = moment(date).format('YYYY-MM-DDTHH:mm')
      currentEvent.durationDate = moment(date).add(currentEvent.duration, 'minutes')
      console.log(currentEvent);
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

    const { isLoading, currentClient, regions, places } = this.state;
    if (isLoading && currentClient && regions.length && places.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetClients(true)
    this.props.resetAreas(true)
    this.props.resetRegions(true)
    this.props.resetProviders(true)
    this.props.resetActivities(true)
    this.props.resetClientPlaces(true)
    this.props.resetPrograms(true)
  }

  initializeData(id) {
    const { idClient } = this.state
    const today = moment();
    const props = {
      startDate: today.startOf('week').toISOString(),
      endDate: today.endOf('week').toISOString(),
      clientId : id || idClient
    }
    this.props.loadScheduling(props)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditClient(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditClient('');
  }

  goBack() {
    history.push('/clients');
  }

  tabView(view) {
    if (view === 'places') {
      this.props.resetClientPlaces(true);
    }
    this.setState({ isCurrentView: view })
  }

  saveClient(fieldName, name) {
    const { currentClient } = this.state;
    let client = { ...currentClient };
    client[name] = fieldName;
    this.setState({ currentClient: client });
    this.props.updateClient(client);
    this.props.setCurrentFieldToEditClient('');
  }

  getRequirements() {
    const { currentClient, areas } = this.state
    let result = []
    if (currentClient && currentClient.restrictedAreaIds) {
      currentClient.restrictedAreaIds.forEach(item => {
        const value = areas.find(area => area.id === item)
        result.push(value)
      })
    }
    return result
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
      durationDate: moment().startOf('day'),
      recurrencePattern: '',
      eventType: 'client-commitment',
      body: {},
      pickup: {
        option: 'none',
        placeId: 'none',
        time: 'none',
      },
      dropoff: {
        option: 'none',
        placeId: 'none',
        time: 'none',
      },
    }

    return currentEvent;
  }

  handleSelect(e) {
    const startDate = moment(e.start).format('YYYY-MM-DDTHH:mm')
    const currentEvent = this.getDefaultEvent();
    currentEvent.startDate = startDate
    this.setState({ isOpen: !this.state.isOpen, isEditing: false, currentEvent: currentEvent })
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
      if (isEditing) { newState = Object.assign({}, newState) }
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

  handleOptionChange(e) {
    const { name, value } = e.target;
    const { currentEvent } = this.state;
    const event = Object.assign({}, currentEvent);
    event[name].option = value;
    this.setState({ currentEvent: event });
  }

  handleOriginDestinationChange(field) {
    return (e) => {
      const { name, value } = e.target;
      const { currentEvent } = this.state;
      const event = Object.assign({}, currentEvent);
      event[field][name] = value;
      this.setState({ currentEvent: event });
    }
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

  handleOriginDestinationTimeChange(field) {
    return (e) => {
      const date = new Date(e)
      const momentDate = moment(e)
      let { currentEvent } = this.state
      if (date) {
        const minutes = date.getMinutes()
        const hours = date.getHours()
        const total = minutes + (hours * 60)
        currentEvent[field].duration = total
        currentEvent[field].durationDate = momentDate
        this.setState({ currentEvent: currentEvent })
      }
    }
  }

  handleToggleChange() {
    this.setState(prevState => ({
      currentEvent: {
        ...prevState.currentEvent,
        options: {
          planReturnRide: !prevState.currentEvent.options.planReturnRide,
        },
      },
    }));
  }

  onUpdateDate(date) {
    let { currentEvent } = this.state
    currentEvent.startDate = moment(date).format('YYYY-MM-DDTHH:mm')
    this.setState({ currentEvent: currentEvent })
  }

  editEvent(e) {
    this.setState({ isEditing: true }, () => {
      this.props.getSchedulingById(e.id)
    })
  }

  getOriginDestinationPayload(currentEvent, originDestination) {
    const field = currentEvent[originDestination];
    return field.option === 'activities' ? ({
      activityId: field.activityId
    }) : ({
      placeId: field.placeId
    })
  }

  handleSubmitEvent(e) {
    e.preventDefault();

    this.setState({ submitted: true });

    const { currentEvent, currentClient } = this.state

    const body = {
      clientId: currentClient.id,
      programId: currentEvent.programId,
      pickup: {
        placeId: currentEvent.pickup.placeId,
        time: currentEvent.pickup && currentEvent.pickup.durationDate ? currentEvent.pickup.durationDate.format('HH:mm') : ''
      },
      dropoff: {
        placeId: currentEvent.dropoff.placeId,
        time: currentEvent.dropoff && currentEvent.dropoff.durationDate ? currentEvent.dropoff.durationDate.format('HH:mm') : ''
      }
    }

    if (currentEvent.title && currentEvent.description && currentEvent.startDate && currentEvent.duration && currentClient.regionId && currentEvent.eventType && currentEvent.pickup.placeId && currentEvent.dropoff.placeId && currentEvent.programId) {
      let formProps = currentEvent;
      delete formProps['programId']
      formProps.regionId = currentClient.regionId;
      formProps.body = body;
      this.props.createSchedulingEvent(formProps);
    }
  }

  updateEvent() {
    const { currentEvent, currentClient } = this.state

    const body = {
      clientId: currentClient.id,
      programId: currentEvent.programId,
      pickup: {
        placeId: currentEvent.pickup.placeId,
        time: currentEvent.pickup && currentEvent.pickup.durationDate ? currentEvent.pickup.durationDate.format('HH:mm') : ''
      },
      dropoff: {
        placeId: currentEvent.dropoff.placeId,
        time: currentEvent.dropoff && currentEvent.dropoff.durationDate ? currentEvent.dropoff.durationDate.format('HH:mm') : ''
      }
    }

    if (currentEvent.id) {
      let formProps = currentEvent;
      delete formProps['programId']
      formProps.regionId = currentClient.regionId;
      formProps.body = body;

      this.props.updateSchedulingEvent(currentEvent)
    }
  }

  deleteEvent(e) {
    e.preventDefault();
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
    const { currentFieldName, errorMessage } = this.props.client;
    const { idClient, currentClient, currentRegion, currentSpace, currentProvider, currentEvent, isLoading, isEditing, isCurrentView, places, programs, areas, submitted, isOpen, events, regions, providers, spaces, openRecurrence } = this.state;
    const localizer = BigCalendar.momentLocalizer(moment)

    return (
      <section className="section-client">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="client-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentClient && areas.length > 0 && currentRegion && currentSpace && currentProvider && regions.length && places.length && (
                  <div className="client-detail">
                    <h1 className="client-detail-title">Client Detail / {currentClient.name}</h1>
                    <div className="client-detail-tabs">
                      <span className={isCurrentView === 'client' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('client')}>Primary Info</span>
                      <span className={isCurrentView === 'calendar' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('calendar')}>Client Schedule</span>
                      <span className={isCurrentView === 'places' ? 'client-detail-tabs-tab active' : 'client-detail-tabs-tab' } onClick={() => this.tabView('places')}>Client Places</span>
                    </div>
                    {isCurrentView === 'client' && (
                      <div className="client-detail-body">
                        <form className="client-detail-body-form">
                          { currentFieldName === 'name' ? (
                            <div className="client-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentClient.name} fieldLabel={'Name'} fieldName="name"
                                        saveField={this.saveClient} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                              <FieldGroup fieldInfo={currentClient.name} fieldLabel={'Name'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'dateOfBirth' ? (
                            <div className="client-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentClient.dateOfBirth} fieldLabel={'Date of Birth'}
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} fieldName="dateOfBirth" />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('description')}>
                              <FieldGroup fieldInfo={currentClient.dateOfBirth} fieldLabel={'Date of Birth'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'phone' ? (
                            <div className="client-detail-body-form-group editing">
                              <FieldEdit fieldInfo={currentClient.phone} fieldLabel={'Phone'} fieldName="phone"
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('phone')}>
                              <FieldGroup fieldInfo={currentClient.phone} fieldLabel={'Phone'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'isActive' ? (
                            <div className="client-detail-body-form-group editing">
                              <EditSwitchField fieldTag={currentClient.isActive} fieldLabel={'Active'} fieldName="isActive"
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                              <FieldGroup fieldInfo={currentClient.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'transportedAlone' ? (
                            <div className="client-detail-body-form-group editing">
                              <EditSwitchField fieldTag={currentClient.transportedAlone} fieldLabel={'Transported Alone'} fieldName="transportedAlone"
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('transportedAlone')}>
                              <FieldGroup fieldInfo={currentClient.transportedAlone ? 'Yes' : 'No'} fieldLabel={'Transported Alone'} />
                            </div>
                            )
                          }
                          { currentFieldName === 'restrictedAreaIds' ? (
                            <div className="space-detail-body-form-group editing">

                            </div>
                            ) : (
                            <div className="space-detail-body-form-group" onClick={() => this.toggleEditField('restrictedAreaIds')}>
                              <FieldList fieldList={this.getRequirements()} fieldLabel={'Restricted Areas'} />
                            </div>
                            )
                          }
                          {currentFieldName === 'regionId' && regions && regions.length ? (
                            <div className="client-detail-body-form-group editing">
                              <EditSelectField fieldId={currentClient.regionId} fieldLabel={'Regions'} list={regions}
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} fieldName="regionId" />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('regionId')}>
                              <FieldGroup fieldInfo={currentRegion.name} fieldLabel={'Region'} />
                            </div>
                            )
                          }
                          {currentFieldName === 'providerId' && providers && providers.length ? (
                            <div className="client-detail-body-form-group editing">
                              <EditSelectField fieldId={currentClient.providerId} fieldLabel={'Providers'} list={providers}
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} fieldName="providerId" />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('providerId')}>
                              <FieldGroup fieldInfo={currentProvider.name} fieldLabel={'Provider'} />
                            </div>
                            )
                          }
                          {currentFieldName === 'spaceTypeId' && spaces && spaces.length ? (
                            <div className="client-detail-body-form-group editing">
                              <EditSelectField fieldId={currentClient.spaceTypeId} fieldLabel={'Spaces Types'} list={spaces}
                                saveField={this.saveClient} fieldCancel={this.cancelCurrentField} fieldName="spaceTypeId" />
                            </div>
                            ) : (
                            <div className="client-detail-body-form-group" onClick={() => this.toggleEditField('spaceTypeId')}>
                              <FieldGroup fieldInfo={currentSpace.name} fieldLabel={'Space Type'} />
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
                    {isCurrentView === 'places' && (
                      <ClientPlacesContainer idClient={idClient} />
                    )}
                  </div>
                )}
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
                <label className="care-form-group-item-label">Activity Program</label>
                <p className="care-form-group-item-legend">Please set an activity</p>
              </div>
              <div className="care-form-group-item">
                <select className="care-form-group-item-select" value={currentEvent.programId || 'none'} name="programId" onChange={this.handleChange} required>
                  <option value="none" disabled>Select a activity</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>{program.name}</option>
                    ))}
                </select>
                {submitted && !currentEvent.programId &&
                  <div className="help-block">Activity program is required</div>
                }
              </div>
            </div>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Pickup</label>
                <p className="care-form-group-item-legend">Please set a place</p>
              </div>
              <div className="care-form-group-item">
                <select className="care-form-group-item-select" value={currentEvent.pickup.placeId || 'none'} name="placeId" onChange={this.handleOriginDestinationChange('pickup')} required>
                  <option value="none" disabled>Select a place</option>
                    {places.map(place => (
                      <option key={place.id} value={place.id}>{place.title}</option>
                    ))}
                </select>
                {submitted && !currentEvent.pickup.placeId &&
                  <div className="help-block">Pickup place is required</div>
                }
              </div>
              <div className="care-form-group-item">
                <p className="care-form-group-item-legend">Early pickup time (leave empty if not required)</p>
              </div>
              <div className="care-form-group-item">
                <TimePicker showSecond={false} minuteStep={15} value={currentEvent.pickup.durationDate} onChange={this.handleOriginDestinationTimeChange('pickup')} placeholder="HH:MM" />
              </div>
            </div>
            <div className="care-form-group">
              <div className="care-form-group-item">
                <label className="care-form-group-item-label">Dropoff</label>
                <p className="care-form-group-item-legend">Please set a place</p>
              </div>
              <div className="care-form-group-item">
                <select className="care-form-group-item-select" value={currentEvent.dropoff.placeId || 'none'} name="placeId" onChange={this.handleOriginDestinationChange('dropoff')} required>
                  <option value="none" disabled>Select a place</option>
                    {places.map(place => (
                      <option key={place.id} value={place.id}>{place.title}</option>
                    ))}
                </select>
                {submitted && !currentEvent.dropoff.placeId &&
                  <div className="help-block">Dropoff place is required</div>
                }
              </div>
              <div className="care-form-group-item">
                <p className="care-form-group-item-legend">Late dropoff time (leave empty if not required)</p>
              </div>
              <div className="care-form-group-item">
                <TimePicker showSecond={false} minuteStep={15} value={currentEvent.dropoff.durationDate} onChange={this.handleOriginDestinationTimeChange('dropoff')} placeholder="HH:MM" />
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

const FieldList = (props) => {
  return (
    <div className="space-detail-body-form-wrapper">
      <div className="space-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="space-detail-body-form-item value">
        {
          props.fieldList.map(item => {
            return <span className="space-detail-list-item" key={'area-item' + item.id}>{item.name}</span>
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
    <div className="client-detail-body-form-wrapper">
      <div className="client-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="client-detail-body-form-item value">
        <span>{props.fieldInfo || '--'}</span>
      </div>
      <div className="client-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

ClientDetailContainer.propTypes = {
  client: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  provider: PropTypes.object.isRequired,
  space: PropTypes.object.isRequired,
  area: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  program: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  client: state.client,
  region: state.region,
  provider: state.provider,
  space: state.space,
  schedule: state.schedule,
  area: state.area,
  auth: state.auth,
  activity: state.activity,
  place: state.place,
  program: state.program,
});

export default withRouter(connect(mapStateToProps, actions)(ClientDetailContainer));
