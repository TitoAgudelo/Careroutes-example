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
import './Programs.scss';

class ProgramsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      duration: '',
      description: '',
      type: '0',
      startTimePicker: moment().startOf('day'),
      startTime: 0,
      endTimePicker: moment().startOf('day'),
      endTime: 0,
      isActive: true,
      isOpen: false,
      isLoading: true,
      submitted: false,
      currentProgram: {},
      programs: [],
      errors: { }
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleActive = this.handleToggleActive.bind(this);
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadPrograms(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.program.programs.length !== this.props.program.programs.length) {
      this.setState({
        programs: [ ...nextProps.program.programs ],
        isLoading: false,
      });
    }

    if (nextProps.program.sucessAdded && !this.props.program.sucessAdded) {
      this.toggleModal();
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetPrograms(true)
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
    history.push('/program-activities/' + id);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleToggleActive() {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }

  onUpdateStartDate(date) {
    let { startTime } = this.state
    startTime = moment(date).format('YYYY-MM-DDTHH:mm')
    this.setState({ startTime: startTime })
  }

  onUpdateEndDate(date) {
    let { endTime } = this.state
    endTime = moment(date).format('YYYY-MM-DDTHH:mm')
    this.setState({ endTime: endTime })
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { name, description, isActive, type, startTime, endTime } = this.state;
    if (name && description && type && startTime && endTime) {
      const formProps = { name: name, description: description, isActive: isActive, type: type, startTime: startTime, endTime: endTime };
      this.props.createProgram(formProps);
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
    const { errorMessage } = this.props.program;
    const { name, description, type, submitted, isActive, startTimePicker, endTimePicker, programs, isLoading } = this.state;

    let data = [ ...programs ];

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Description <i className="fas fa-angle-down"></i></span>),
        accessor: 'description',
        Cell: props => <span className='description'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Type <i className="fas fa-angle-down"></i></span>),
        accessor: 'type',
        Cell: props => <span className='type'>{props.value}</span>,
        minWidth: 200
      }, {
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
      <section className="section-programs">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-programs-head">
                  <h1 className="section-programs-head-title">Activity Programs</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Activity Program</span></button>
                </div>
                <div className="model-detail-tabs">
                  <span className="model-detail-tabs-tab active">
                    <Link className="section-spaces-list-item-link" to="/programmed-activities">Programmed Activities</Link>
                  </span>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { programs.length > 0 ? (
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

                <Modal title="Add New Activity Program" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateProgram} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Name</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter name" className="care-form-group-item-field" name="name" value={name} onChange={this.handleChange} required />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Description</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter desciption" className="care-form-group-item-field" name="description" value={description} onChange={this.handleChange} required />
                        {submitted && !description &&
                          <div className="help-block">Description is required</div>
                        }
                      </div>
                    </div>
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
                        <label className="care-form-group-item-label">Program Type</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={type} name="type" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled selected>Select a type</option>
                          <option value="day-program">day-program</option>
                          <option value="work-program">work-program</option>
                        </select>
                        {submitted && (!type || type === '0') &&
                          <div className="help-block">Type is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <SwitchField
                        label="Active"
                        id="activeToggle"
                        onAction={this.handleToggleActive}
                        isChecked={isActive ? isActive : false} />
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

ProgramsContainer.propTypes = {
  loadPrograms: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  program: state.program,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ProgramsContainer));
