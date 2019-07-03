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
import SearchAddressField from '../../components/SearchAddressField/SearchAddressField';

import Modal from './../../components/Modal/Modal';

import { tableStyle, headTableThStyle, headTableTrStyle, headTableStyle, bodyTableTdStyle, bodyTrGroupStyle } from './Providers.style';
import './Providers.scss';

class ProvidersContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      name: '',
      contact: '',
      phone: '',
      isActive: true,
      isLoading: true,
      location: {},
      submitted: false,
      types: [],
      providers: [],
      providerTypeId: 0,
      providersFilter: [],
      errors: { },
      suggestion: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleActive = this.handleToggleActive.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
  }

  componentWillMount() {
    const loadProps = {
      isActive: true
    }

    this.props.loadProvidersTypes(loadProps);
    this.props.loadProviders(loadProps);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.provider.providers.length !== this.props.provider.providers.length) {
      this.setState({
        providers: [ ...nextProps.provider.providers ],
        isLoading: false,
      });
    }

    if (nextProps.provider.types.length !== this.props.provider.types.length) {
      this.setState({ types: [ ...nextProps.provider.types ] });
    }

    if (nextProps.user.searchField !== this.props.user.searchField) {
      this.setState({
        currentSearch: nextProps.user.searchField
      });
      this.filterProviders(nextProps.user.searchField);
    }

    if (nextProps.provider.sucessAdded && !this.props.provider.sucessAdded) {
      this.toggleModal();
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetProviders(true)
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
    history.push('/providers/' + id);
  }

  submitCreateProvider = () => {
    console.log('on fire');
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
    const { name, location, isActive, contact, phone, providerTypeId } = this.state;

    if (name && location && location.state && contact && phone && providerTypeId) {
      const formProps = { name: name, isActive: isActive, location: location, contact: contact, phone: phone, providerTypeId: providerTypeId };
      this.props.createProvider(formProps);
    }
  }

  filterProviders(currentSearch) {
    const { providers } = this.state;

    let providersFilter = [];

    providersFilter = providers.filter(provider => {
      return provider.name.indexOf(currentSearch.toLowerCase()) !== -1
    });

    this.setState({
      providersFilter: providersFilter
    });
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
      location: Object.assign({}, location),
    })
  }

  render() {
    const { errorMessage } = this.props.provider;
    const { searchField } = this.props.user;
    const { name, contact, phone, submitted, location, providers, types, providerTypeId, providersFilter, isActive, isLoading } = this.state;

    let data = [];

    if (providersFilter && providersFilter.length > 0) {
      data = [ ...providersFilter ];
    } else {
      data = [ ...providers ]
    }

    const columns = [
      {
        Header: () => (<span>Name <i className="fas fa-angle-down"></i></span>),
        accessor: 'name',
        Cell: props => <span className='name'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Contact <i className="fas fa-angle-down"></i></span>),
        accessor: 'contact',
        Cell: props => <span className='contact'>{props.value}</span>,
        minWidth: 200
      }, {
        Header: () => (<span>Phone <i className="fas fa-angle-down"></i></span>),
        accessor: 'phone',
        Cell: props => <span className='phone'>{props.value}</span>,
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
      <section className="section-providers">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <div className="section-providers-head">
                  <h1 className="section-providers-head-title">Providers</h1>
                  <button className="button-primary" onClick={this.toggleModal}><span className="text">New Provider</span></button>
                </div>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { providers.length > 0 ? (
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

                {types && types.length > 0 && <Modal title="Add New Provider" show={this.state.isOpen} onClose={this.toggleModal} onAction={this.submitCreateProvider} onSubmit={this.handleSubmit}>
                  { errorMessage ? (
                    <div className="care-message-error">
                      <p className="care-message-error-text">{ errorMessage }</p>
                    </div> ) : null
                  }
                  <form className="care-form" onSubmit={this.handleSubmit}>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Address</label>
                      </div>
                      <div className="care-form-group-item">
                        <SearchAddressField
                          className="care-form-group-item-field"
                          placeholder="Write an address here"
                          onChange={this.handleAddress}
                          defaultValue={location.addressLine1}
                        />
                        {submitted && !location.addressLine1 &&
                          <div className="help-block">Location is required</div>
                        }
                      </div>
                    </div>
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
                        <label className="care-form-group-item-label">Contact</label>
                      </div>
                      <div className="care-form-group-item">
                        <input type="text" placeholder="Enter contact name" className="care-form-group-item-field" name="contact" value={contact} onChange={this.handleChange} required />
                        {submitted && !contact &&
                          <div className="help-block">Contact is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Phone</label>
                      </div>
                      <div className="care-form-group-item">
                        <NumberFormat className="care-form-group-item-field" value={phone} onChange={this.handleChange} name="phone" format="+1 (###) ###-####" placeholder="+1 (###) ###-####" mask="_"/>
                        {submitted && !phone &&
                          <div className="help-block">Phone is required</div>
                        }
                      </div>
                    </div>
                    <div className="care-form-group">
                      <div className="care-form-group-item">
                        <label className="care-form-group-item-label">Provider Types</label>
                      </div>
                      <div className="care-form-group-item">
                        <select className="care-form-group-item-select" value={providerTypeId} name="providerTypeId" onChange={(e) => this.handleChange(e)} required>
                          <option value="0" disabled>Select a type</option>
                          { types && types.length > 0 ? (
                              types.map(type => {
                                return (
                                  <option key={ type.id } value={ type.id }>{ type.name }</option>
                                )
                              })
                            ) : (
                              <option selected="selected">No Types</option>
                            )
                          }
                        </select>
                        {submitted && (!providerTypeId || providerTypeId === '0') &&
                          <div className="help-block">Provider Type is required</div>
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

ProvidersContainer.propTypes = {
  loadProviders: PropTypes.func.isRequired,
  provider: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  provider: state.provider,
  auth: state.auth,
  user: state.user
});

export default withRouter(connect(mapStateToProps, actions)(ProvidersContainer));
