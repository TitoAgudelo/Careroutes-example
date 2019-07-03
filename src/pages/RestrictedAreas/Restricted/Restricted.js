import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import Loading from './../../../components/Loading/Loading';
import SetShapeOnMapField from '../../../components/SetShapeOnMapField/SetShapeOnMapField';

import './Restricted.scss';

class RestrictedDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentArea: null,
      currentRegion: null,
      regions: [],
      isLoading: true,
    }

    this.saveArea = this.saveArea.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getRestrictedAreaId(id);
    }

    const loadProps = {
      isActive: true
    }

    this.props.loadRegions(loadProps)
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.area.currentArea && nextProps.area.currentArea.id && !this.props.area.currentArea) {
      this.setState({ currentArea: nextProps.area.currentArea });
      this.props.getRegionId(nextProps.area.currentArea.regionId);
    }

    if (nextProps.region.regions.length !== this.state.regions.length) {
      this.setState({ regions: nextProps.region.regions })
    }

    if (nextProps.region.currentRegion !== this.props.region.currentRegion) {
      this.setState({ currentRegion: nextProps.region.currentRegion })
    }

    const { isLoading, currentArea, regions } = this.state;
    if (isLoading && currentArea && regions.length) {
      this.setState({
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetAreas(true)
    this.props.resetRegions(true)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditArea(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditArea('');
  }

  goBack() {
    history.push('/restricted-areas');
  }

  saveArea(fieldName, name) {
    const { currentArea } = this.state;
    let area = { ...currentArea };

    if (name === 'bounds') {
      area[name] = Object.assign({}, area[name], fieldName);
    } else {
      area[name] = fieldName;
    }

    this.setState({ currentArea: area });
    this.props.updateRestrcitedArea(area);
    this.props.setCurrentFieldToEditArea('');
  }

  render() {
    const { currentFieldName } = this.props.area;
    const { currentArea, currentRegion, regions, isLoading } = this.state;

    return (
      <section className="section-area">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <span className="area-detail-back" onClick={this.goBack}><i className="fas fa-angle-double-left"></i> Back</span>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentArea && currentRegion && regions.length ? (
                  <div className="area-detail">
                    <h1 className="area-detail-title">Restricted Area Detail / {currentArea.name}</h1>
                    <div className="area-detail-tabs">
                      <span className="area-detail-tabs-tab active">Primary Info</span>
                    </div>
                    <div className="area-detail-body">
                      <form className="area-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="area-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentArea.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveArea} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="area-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentArea.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'description' ? (
                          <div className="area-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentArea.description} fieldLabel={'Description'}
                              saveField={this.saveArea} fieldCancel={this.cancelCurrentField} fieldName="description" />
                          </div>
                          ) : (
                          <div className="area-detail-body-form-group" onClick={() => this.toggleEditField('description')}>
                            <FieldGroup fieldInfo={currentArea.description} fieldLabel={'Description'} />
                          </div>
                          )
                        }
                        {currentFieldName === 'regionId' && regions && regions.length > 0 ? (
                          <div className="area-detail-body-form-group editing">
                            <EditSelectField fieldId={currentArea.regionId} fieldLabel={'Regions'} list={regions}
                              saveField={this.saveArea} fieldCancel={this.cancelCurrentField} fieldName="regionId" />
                          </div>
                          ) : (
                          <div className="area-detail-body-form-group" onClick={() => this.toggleEditField('regionId')}>
                            <FieldGroup fieldInfo={currentRegion.name} fieldLabel={'Region'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="area-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentArea.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveArea} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="area-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentArea.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'bounds' ? (
                          <div className="area-detail-body-form-group editing">
                            <FieldEdit
                              isRestrictedArea
                              fieldCancel={this.cancelCurrentField}
                              fieldLabel={'Bounds'}
                              fieldName="bounds"
                              saveField={this.saveArea}
                            />
                          </div>
                          ) : (
                          <div className="area-detail-body-form-group" onClick={() => this.toggleEditField('bounds')}>
                            <FieldGroup
                              fieldLabel={'Bounds'}
                              fieldContent={(
                                <SetShapeOnMapField
                                  className="area-detail-body-bounds-edit"
                                  bounds={currentArea.bounds}
                                />
                              )}
                            />
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
        {props.fieldContent || (
          <span>{props.fieldInfo || '--'}</span>
        )}
      </div>
      <div className="provider-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

RestrictedDetailContainer.propTypes = {
  area: PropTypes.object.isRequired,
  region: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  area: state.area,
  region: state.region,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(RestrictedDetailContainer));
