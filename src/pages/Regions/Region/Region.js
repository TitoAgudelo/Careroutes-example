import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import Loading from './../../../components/Loading/Loading';

import './Region.scss';

class RegionDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {},
      users: [],
      currentFieldName: '',
      currentRegion: null,
      currentManager: null,
      isLoading: true,
    }

    this.toggleEditField = this.toggleEditField.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.saveRegion = this.saveRegion.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getRegionId(id);
    }

    const loadPropsUser = {
      role: 'manager',
      isActive: true
    }

    this.props.loadUsers(loadPropsUser);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.region.currentRegion && nextProps.region.currentRegion.id && !this.props.region.currentRegion) {
      this.setState({ currentRegion: nextProps.region.currentRegion, isLoading: false });
      this.props.getDriverId(nextProps.region.currentRegion.managerId)
    }

    if (nextProps.driver.drivers.length !== this.props.driver.drivers.length) {
      this.setState({ users: nextProps.driver.drivers })
    }

    if (nextProps.driver.currentDriver !== this.props.driver.currentDriver) {
      this.setState({ currentManager: nextProps.driver.currentDriver })
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetRegions(true)
    this.props.resetDrivers(true)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditRegion(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditRegion('');
  }

  goBack() {
    history.push('/regions');
  }

  saveRegion(fieldName, name) {
    const { currentRegion } = this.state;
    let region = { ...currentRegion };

    if (name === 'homebase') {
      region[name] = Object.assign({}, region[name], fieldName);
    } else {
      region[name] = fieldName;
    }
    this.setState({ currentRegion: region });
    this.props.updateRegion(region);
    this.props.setCurrentFieldToEditRegion('');
  }

  render() {
    const { currentFieldName } = this.props.region;
    const { currentRegion, currentManager, users, isLoading } = this.state;

    return (
      <section className="section-region">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="region-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentRegion && (
                  <div className="region-detail">
                    <h1 className="region-detail-title">Region Detail / {currentRegion.name}</h1>
                    <div className="region-detail-tabs">
                      <span className="region-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="region-detail-body">
                      <form className="region-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="region-detail-body-form-group editing" name="name">
                            <FieldEdit fieldInfo={currentRegion.name} fieldLabel={'Name'} fieldName="name"
                              saveField={this.saveRegion} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="region-detail-body-form-group" name="name" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentRegion.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="region-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentRegion.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveRegion} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="region-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentRegion.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                          </div>
                          )
                        }
                        {currentFieldName === 'managerId' && users && users.length ? (
                          <div className="region-detail-body-form-group editing" name="managerId">
                            <EditSelectField fieldId={currentRegion.managerId} fieldLabel={'Managers'} list={users}
                              saveField={this.saveRegion} fieldCancel={this.cancelCurrentField} fieldName="managerId" />
                          </div>
                          ) : (
                          <div className="region-detail-body-form-group" name="managerId" onClick={() => this.toggleEditField('managerId')}>
                            <FieldGroup fieldInfo={(currentManager || {}).name} fieldLabel={'Manager'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'homebase' ? (
                          <div className="provider-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentRegion.homebase} fieldLabel="Address" fieldName="homebase"
                              saveField={this.saveRegion} fieldCancel={this.cancelCurrentField} isLocation />
                          </div>
                          ) : (
                          <div className="provider-detail-body-form-group" onClick={() => this.toggleEditField('homebase')}>
                            <FieldGroup fieldInfo={(currentRegion.homebase || {}).addressLine1} fieldLabel={'Homebase'} />
                          </div>
                          )
                        }
                      </form>
                    </div>
                  </div>
                )}
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
    <div className="region-detail-body-form-wrapper">
      <div className="region-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="region-detail-body-form-item value">
        <span>{props.fieldInfo || '--'}</span>
      </div>
      <div className="region-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

RegionDetailContainer.propTypes = {
  region: PropTypes.object.isRequired,
  driver: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  region: state.region,
  auth: state.auth,
  driver: state.driver
});

export default withRouter(connect(mapStateToProps, actions)(RegionDetailContainer));
