import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from "react-table";
import NumberFormat from 'react-number-format';

import actions from './../../actions';
import { history } from './../../helpers/history';
import Pagination from './../../components/Pagination/Pagination';
import SwitchField from './../../components/SwitchField/SwitchField';
import Loading from './../../components/Loading/Loading';
import Modal from './../../components/Modal/Modal';

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './../Providers/Providers.style';
import './Activities.scss';

class ActivitiesContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      duration: '',
      cost: 0,
      capacity: 0,
      isActive: true,
      facilityId: 0,
      openAreas: true,
      isOpen: false,
      isLoading: true,
      submitted: false,
      currentActivity: {},
      activities: [],
      errors: { },
      suggestion: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleActive = this.handleToggleActive.bind(this);
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadActivities(loadProps)
    this.props.loadFacilities(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.activity.activities.length !== this.props.activity.activities.length) {
      this.setState({
        activities: [ ...nextProps.activity.activities ],
        isLoading: false,
      });
    }

    if (nextProps.facility.facilities !== this.props.facility.facilities || nextProps.facility.facilities.length !== this.props.facility.facilities.length) {
      this.setState({ facilities: [ ...nextProps.facility.facilities ] })
    }

    if (nextProps.activity.sucessAdded && !this.props.activity.sucessAdded) {
      this.toggleModal();
    }

    return true;
  }

  componentWillUnmount() {
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
    history.push('/activities/' + id);
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
    const { name, duration, isActive, cost, capacity, facilityId } = this.state;
    const format = parseInt(cost.substr(1))
    if (name && duration && format && capacity && facilityId) {
      const formProps = { name: name, isActive: isActive, duration: duration, cost: format, capacity: capacity, facilityId: facilityId };
      this.props.createActivity(formProps);
    }
  }

  render() {
    const { errorMessage } = this.props.activity;
    const { name, duration, cost, submitted, capacity, facilityId, facilities, isActive, activities, isLoading } = this.state;

    let data = [ ...activities ];

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Duration <i className="fas fa-angle-down"></i></span>),
        accessor: 'duration',
        Cell: props => <span className='duration'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Cost <i className="fas fa-angle-down"></i></span>),
        accessor: 'cost',
        Cell: props => <span className='cost'>${props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Capacity <i className="fas fa-angle-down"></i></span>),
        accessor: 'capacity',
        Cell: props => <span className='capacity'>{props.value}</span>,
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
      <section className="section-activities">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-activities-head">
                  <h1 className="section-activities-head-title">Activities</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Activity</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { activities.length > 0 ? (
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

                {facilities && facilities.length > 0 && <Modal title="Add New Activity" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateProvider} onSubmit={this.handleSubmit}>
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
                        <label className="care-form-group-item-label">Duration</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter duration" className="care-form-group-item-field" name="duration" value={duration} onChange={this.handleChange} required />
                        {submitted && !duration &&
                          <div className="help-block">Duration is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Cost</label>
                      </div>
                      <div className="care-form-group-item">
                        <NumberFormat className="care-form-group-item-field" value={cost} onChange={this.handleChange} name="cost" placeholder="Enter cost" thousandSeparator={true} prefix={'$'} />
                        {submitted && !cost &&
                          <div className="help-block">Cost is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Capacity</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter capacity" className="care-form-group-item-field" name="capacity" value={capacity} onChange={this.handleChange} required />
                        {submitted && !capacity &&
                          <div className="help-block">Capacity is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Provider Types</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={facilityId} name="facilityId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a type</option>
                          { facilities && facilities.length > 0 ? (
                              facilities.map(facility => {
                                return (
                                  <option key={ facility.id } value={ facility.id }>{ facility.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Facilities</option>
                            )
                          }
                        </select>
                        {submitted && (!facilityId || facilityId === '0') &&
                          <div className="help-block">Facilities is required</div>
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
                </Modal> }
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ActivitiesContainer.propTypes = {
  loadActivities: PropTypes.func.isRequired,
  facility: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  activity: state.activity,
  facility: state.facility,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ActivitiesContainer));
