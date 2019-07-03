import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTable from "react-table";

import actions from './../../actions';
import { history } from './../../helpers/history';
import Pagination from './../../components/Pagination/Pagination';
import Loading from './../../components/Loading/Loading';
import Modal from './../../components/Modal/Modal';
import SearchAddressField from '../../components/SearchAddressField/SearchAddressField'

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Regions.style';
import './Regions.scss';

class RegionsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      name: '',
      manager: '',
      managerId: '0',
      homebase: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      },
      submitted: false,
      isLoading: true,
      regions: [],
      managers: [],
      errors: { }
    };

    this.handleAddress = this.handleAddress.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setManagerToRegions = this.setManagerToRegions.bind(this);
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    const loadPropsUser = {
      role: 'manager',
      isActive: true
    }

    this.props.loadUsers(loadPropsUser);
    this.props.loadRegions(loadProps);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({
        regions: [ ...nextProps.region.regions ],
        isLoading: false,
      });
    }

    if (nextProps.driver.drivers.length !== this.props.driver.drivers.length) {
      this.setState({
        managers: [ ...nextProps.driver.drivers ]
      });
    }

    if (nextProps.region.sucessAdded && !this.props.region.sucessAdded) {
      this.toggleModal();
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetRegions(true)
    this.props.resetDrivers(true)
    this.props.setSearchField('')
  }

  toggleModal = () => {
    if (!this.state.isOpen) {
      this.props.successMessage('');
      this.props.errorMessage('');
    }

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  goToDetail(id) {
    history.push('/regions/' + id);
  }

  submitCreateRegion = () => {
    console.log('on fire');
  }

  handleAddress({ result }) {
    const location = {
      addressLine1: result.value,
      addressLine2: '',
      city: result.city,
      state: result.state,
      zipCode: result.postalCode,
      coordinates: Object.assign({}, result.latlng)
    }

    this.setState({
      homebase: Object.assign({}, location),
    })
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { name, managerId, homebase } = this.state;

    if (name && managerId && homebase.addressLine1) {
      const formProps = { name: name, isActive: true, managerId: managerId, homebase };
      this.props.createRegion(formProps);
    }
  }

  setManagerToRegions() {
    const { managers, regions } = this.state;
    let flag = false;
    let regionList = [];

    if (regions)
    regions.map((region) => {
      const manager = managers.filter(user => user.id === region.managerId);

      if (!region.manager) {
        flag = true;
      }

      if (manager) {
        region.manager = Object.assign({}, manager)
      }

      regionList.push(region);
      return region;
    });

    if (regionList.length > 0 && flag) {
      this.setState({
        regions: [ ...regionList ]
      });
    }
  }

  render() {
    const { errorMessage } = this.props.region;
    const { name, submitted, managerId, homebase, regions, managers, isLoading } = this.state;

    if (regions.length > 0 && managers.length > 0) {
      this.setManagerToRegions();
    }

    const data = regions;

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Active <i className="fas fa-angle-down"></i></span>),
        accessor: 'isActive',
        Cell: props => <span className='phone'>{props.value ? 'Active' : 'Inactive'}</span>,
        minWidth: 200
      }, {
        Header: '',
        Cell: props => <span className='detail'>DETAILS <i className="fas fa-arrow-right"></i></span>,
      }
    ]

    return (
      <section className="section-regions">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-regions-head">
                  <h1 className="section-regions-head-title">Regions</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Region</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { regions.length > 0 ? (
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
                    pageSize={regions.length > 7 ? 7 : data.length}
                    showPageSizeOptions={false}
                    showPageJump={true}
                  />
                ) : null }

                {managers && managers.length > 0 && <Modal title="Add New Region" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateDriver} onSubmit={this.handleSubmit}>
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
                        <input type="text" placeholder="Enter" className="care-form-group-item-field" name="name" value={name} onChange={this.handleChange} required />
                        {submitted && !name &&
                          <div className="help-block">Name is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Manager</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={this.state.managerId} name="managerId" onChange={this.handleChange} required>
                          <option value="0" disabled>Select a manager</option>
                          { managers.length > 0 ? (
                              managers.map(manager => {
                                return (
                                  <option key={ manager.id } value={ manager.id }>{ manager.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No managers</option>
                            )
                          }
                        </select>
                        {submitted && (!managerId || managerId === '0') &&
                          <div className="help-block">Manager is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Homebase</label>
                      </div>
                      <div className="care-form-group-item">
                        <SearchAddressField
                          className="care-form-group-item-field"
                          placeholder="Write an address here"
                          onChange={this.handleAddress}
                          defaultValue={homebase.addressLine1}
                        />
                        {submitted && !homebase.addressLine1 &&
                          <div className="help-block">Homebase is required</div>
                        }
                      </div>
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

RegionsContainer.propTypes = {
  loadUsers: PropTypes.func.isRequired,
  region: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  region: state.region,
  auth: state.auth,
  driver: state.driver
});

export default withRouter(connect(mapStateToProps, actions)(RegionsContainer));
