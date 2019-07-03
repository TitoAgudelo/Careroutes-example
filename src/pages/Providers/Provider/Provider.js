import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';

import './Provider.scss';

class ProviderDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProvider: null,
      currentType: null,
      isLoading: true,
      types: [],
    }

    this.saveProvider = this.saveProvider.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getProviderId(id);
    }

    const loadProps = {
      isActive: true
    }

    this.props.loadProvidersTypes(loadProps);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.provider.currentProvider && nextProps.provider.currentProvider.id && !this.props.provider.currentProvider) {
      this.setState({
        currentProvider: nextProps.provider.currentProvider,
        isLoading: false,
      });
    }

    if (nextProps.provider.types.length !== this.props.provider.types.length) {
      this.setState({ types: [ ...nextProps.provider.types ] });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetProviders(true)
    this.props.setSearchField('')
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditProvider(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditProvider('');
  }

  goBack() {
    history.push('/providers');
  }

  // setProviderType(currentProvider, types) {
  //   const currentType = types.filter(type => type.id === currentProvider.providerTypeId)
  //   const result = currentType.length > 0 ? Object.assign({}, currentType[0]) : {};
  //   this.setState({ currentType: result })
  // }

  saveProvider(fieldName, name) {
    const { currentProvider } = this.state;
    let provider = { ...currentProvider };

    if (name === 'location') {
      provider[name] = Object.assign({}, provider[name], fieldName);
    } else {
      provider[name] = fieldName;
    }

    this.setState({ currentProvider: provider });
    this.props.updateProvider(provider);
    this.props.setCurrentFieldToEditProvider('');
  }

  render() {
    const { currentFieldName } = this.props.provider;
    const { currentProvider, currentType, types, isLoading } = this.state;

    return (
      <section className="section-provider">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <Link to="/providers">
                  <span className="provider-detail-back"><i className="fas fa-angle-double-left"></i> Back</span>
                </Link>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentProvider ? (
                  <div className="provider-detail">
                    <h1 className="provider-detail-title">Provider Detail / {currentProvider.name}</h1>
                    <div className="provider-detail-tabs">
                      <span className="provider-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="provider-detail-body">
                      <form className="provider-detail-body-form">
                        { currentFieldName === 'location' ? (
                          <div className="provider-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProvider.location} fieldLabel="Address" fieldName="location"
                              saveField={this.saveProvider} fieldCancel={this.cancelCurrentField} isLocation />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('location')}>
                            <FieldGroup fieldInfo={currentProvider.location.addressLine1} fieldLabel={'Address'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'name' ? (
                          <div className="provider-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProvider.name} fieldLabel={'Name'} fieldName="name"
                              saveField={this.saveProvider} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentProvider.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'contact' ? (
                          <div className="provider-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProvider.contact} fieldLabel={'Contact'}
                              saveField={this.saveProvider} fieldCancel={this.cancelCurrentField} fieldName="contact" />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('contact')}>
                            <FieldGroup fieldInfo={currentProvider.contact} fieldLabel={'Contact'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'phone' ? (
                          <div className="provider-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProvider.phone} fieldLabel={'Phone'} fieldName="phone"
                              saveField={this.saveProvider} fieldCancel={this.cancelCurrentField}
                              mask="_" format="+1 (###) ###-####" placeholder="+1 (###) ###-####" />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('phone')}>
                            <FieldGroup fieldInfo={currentProvider.phone} fieldLabel={'Phone'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="provider-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentProvider.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveProvider} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentProvider.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
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

ProviderDetailContainer.propTypes = {
  provider: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  provider: state.provider,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ProviderDetailContainer));
