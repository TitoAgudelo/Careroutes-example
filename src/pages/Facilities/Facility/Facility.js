import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../../../helpers/history';
import actions from '../../../actions';

import FieldEdit from '../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from '../../../components/Loading/Loading';

import './Facility.scss';

class FacilityDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFacility: null,
      isLoading: true,
    }

    this.saveFacility = this.saveFacility.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getFacilityById(id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.facility.currentFacility && nextProps.facility.currentFacility.id && !this.props.facility.currentFacility) {
      this.setState({
        currentFacility: nextProps.facility.currentFacility,
        isLoading: false,
      });
    }

    return true;
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditFacility(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditFacility('');
  }

  goBack() {
    history.push('/facilities');
  }

  saveFacility(fieldName, name) {
    const { currentFacility } = this.state;
    let facility = { ...currentFacility };

    if (name === 'location') {
      facility[name] = Object.assign({}, facility[name], fieldName);
    } else {
      facility[name] = fieldName;
    }

    this.setState({ currentFacility: facility });
    this.props.updateFacility(facility);
    this.props.setCurrentFieldToEditFacility('');
  }

  render() {
    const { currentFieldName } = this.props.facility;
    const { currentFacility, isLoading } = this.state;

    return (
      <section className="section-facility">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="facility-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentFacility ? (
                  <div className="facility-detail">
                    <h1 className="facility-detail-title">Facility Detail / {currentFacility.name}</h1>
                    <div className="facility-detail-tabs">
                      <span className="facility-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="facility-detail-body">
                      <form className="facility-detail-body-form">
                        { currentFieldName === 'location' ? (
                          <div className="provider-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentFacility.location} fieldLabel="Address" fieldName="location"
                              saveField={this.saveFacility} fieldCancel={this.cancelCurrentField} isLocation />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('location')}>
                            <FieldGroup fieldInfo={currentFacility.location.addressLine1} fieldLabel={'Address'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'name' ? (
                          <div className="facility-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentFacility.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveFacility} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="facility-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentFacility.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'phone' ? (
                          <div className="facility-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentFacility.name} fieldLabel={'Phone'} fieldName="phone"
                                       saveField={this.saveFacility} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="facility-detail-body-form-group" onClick={() => this.toggleEditField('phone')}>
                            <FieldGroup fieldInfo={currentFacility.phone} fieldLabel={'Phone'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'contact' ? (
                          <div className="facility-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentFacility.contact} fieldLabel={'Contact'} fieldName="contact"
                              saveField={this.saveFacility} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="facility-detail-body-form-group" onClick={() => this.toggleEditField('contact')}>
                            <FieldGroup fieldInfo={currentFacility.contact} fieldLabel={'Contact'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="facility-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentFacility.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveFacility} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="facility-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentFacility.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
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

FacilityDetailContainer.propTypes = {
  facility: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  facility: state.facility,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(FacilityDetailContainer));
