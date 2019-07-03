import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import actions from './../../actions';
import { history } from './../../helpers/history';
import Pagination from './../../components/Pagination/Pagination';
import SwitchField from './../../components/SwitchField/SwitchField';
import Loading from './../../components/Loading/Loading';
import Modal from './../../components/Modal/Modal';

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './../Providers/Providers.style';
import './Programmed.scss';

class ProgrammedContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startTimePicker: moment().startOf('day'),
      startTime: 0,
      endTimePicker: moment().startOf('day'),
      endTime: 0,
      activityId: 0,
      isOpen: false,
      isLoading: true,
      submitted: false,
      currentProgrammed: {},
      programmed: [],
      activities: [],
      errors: { }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleActive = this.handleToggleActive.bind(this);
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    const loadProps = {
      programId: id,
      isActive: true
    }

    this.props.loadActivities(loadProps)
    this.props.loadProgrammed(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.programmed.programmed.length !== this.props.programmed.programmed.length) {
      this.setState({
        programmed: [ ...nextProps.programmed.programmed ],
        isLoading: false,
      });
    }

    if (nextProps.activity.activities.length !== this.props.activity.activities.length) {
      this.setState({
        activities: [ ...nextProps.activity.activities ],
      });
    }

    if (nextProps.programmed.sucessAdded && !this.props.programmed.sucessAdded) {
      this.toggleModal();
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetProgrammed(true)
    this.props.resetActivities(true)
    this.props.setSearchField('')
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('');
      this.props.errorMessage('');
    }

    this.setState({ isOpen: !this.state.isOpen });
  }

  goToDetail(id) {
    const programId = this.props.match.params.id;
    history.push(`/programmed-activities/${programId}/activities/${id}`);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleToggleActive() {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { startTimePicker, endTimePicker, activityId } = this.state;
    if (activityId && startTimePicker && endTimePicker) {
      const programId = this.props.match.params.id;
      const formProps = { startTime: startTimePicker.format('HH:mm'), endTime: endTimePicker.format('HH:mm'), activityId: activityId };
      this.props.createProgrammed(formProps, programId);
    }
  }

  handleTimeChangeStart = (e) => {
    const date = new Date(e)
    const momentDate = moment(e)
    let { startTime, startTimePicker } = this.state
    if (date) {
      const minutes = date.getMinutes()
      const hours = date.getHours()
      const total = minutes + (hours * 60)
      startTime = total
      startTimePicker = momentDate
      this.setState({ startTime: startTime, startTimePicker: startTimePicker })
    }
  }

  handleTimeChangeEnd = (e) => {
    const date = new Date(e)
    const momentDate = moment(e)
    let { endTime, endTimePicker } = this.state
    if (date) {
      const minutes = date.getMinutes()
      const hours = date.getHours()
      const total = minutes + (hours * 60)
      endTime = total
      endTimePicker = momentDate
      this.setState({ endTime: endTime, endTimePicker: endTimePicker })
    }
  }

  render() {
    const { errorMessage } = this.props.programmed;
    const { submitted, startTimePicker, endTimePicker, programmed, isLoading, activities, activityId } = this.state;

    let data = [ ...programmed ];

    const columns = [
      {
        Header: () => (<span>Start Time <i className="fas fa-angle-down"></i></span>),
        accessor: 'startTime',
        Cell: props => <span className='startTime'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>End Time <i className="fas fa-angle-down"></i></span>),
        accessor: 'endTime',
        Cell: props => <span className='endTime'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-programmed">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-programmed-head">
                  <h1 className="section-programmed-head-title">Programmed Activities</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Activity Programmed</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { programmed.length > 0 ? (
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

                <Modal title="Add New Activity Programmed" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateProgram} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Start Time</label>
                      </div>
                      <div className="care-form-group-item">
                        <TimePicker showSecond={false} minuteStep={15} value={startTimePicker} onChange={this.handleTimeChangeStart} placeholder="HH:MM" />
                        {submitted && !startTimePicker &&
                          <div className="help-block">Start time is required</div>
                        }
                        {submitted && startTimePicker >= endTimePicker &&
                          <div className="help-block">End time need to be older than Start Date</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">End Time</label>
                      </div>
                      <div className="care-form-group-item">
                        <TimePicker showSecond={false} minuteStep={15} value={endTimePicker} onChange={this.handleTimeChangeEnd} placeholder="HH:MM" />
                        {submitted && !endTimePicker &&
                          <div className="help-block">End time is required</div>
                        }
                        {submitted && startTimePicker >= endTimePicker &&
                          <div className="help-block">End time need to be older than Start Date</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Activity</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={activityId} name="activityId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a activity</option>
                          { activities && activities.length > 0 ? (
                              activities.map(activity => {
                                return (
                                  <option key={ activity.id } value={ activity.id }>{ activity.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Activities</option>
                            )
                          }
                        </select>
                        {submitted && (!activityId || activityId === '0') &&
                          <div className="help-block">Activity is required</div>
                        }
                      </div>
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

ProgrammedContainer.propTypes = {
  loadProgrammed: PropTypes.func.isRequired,
  loadActivities: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  programmed: state.programmed,
  activity: state.activity,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ProgrammedContainer));
