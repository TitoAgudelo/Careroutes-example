import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { history } from './../../../helpers/history';
import actions from './../../../actions';

import FieldEdit from './../../../components/EditField/EditField';
import EditSwitchField from './../../../components/EditSwitchField/EditSwitchField';
import EditSelectField from './../../../components/EditSelectField/EditSelectField';
import Loading from './../../../components/Loading/Loading';

import './Program.scss';

class ProgramDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProgram: null,
      isLoading: true,
    }

    this.saveActivity = this.saveActivity.bind(this);
    this.toggleEditField = this.toggleEditField.bind(this);
    this.cancelCurrentField = this.cancelCurrentField.bind(this);
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    if (id) {
      this.props.getProgramById(id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.program.currentProgram && nextProps.program.currentProgram.id && !this.props.program.currentProgram) {
      let currentProgram = nextProps.program.currentProgram
      const date = new Date(moment(currentProgram.startDate).startOf('day'))
      const startTimePicker = moment(date).add(currentProgram.startTime, 'minutes')
      const endTimePicker = moment(date).add(currentProgram.endTime, 'minutes')

      this.setState({
        currentProgram: nextProps.program.currentProgram,
        startTimePicker: startTimePicker,
        endTimePicker: endTimePicker,
        isLoading: false,
      });
    }

    return true;
  }

  componentWillUnmount() {
    this.props.resetPrograms(true)
  }

  toggleEditField(targetName) {
    this.props.setCurrentFieldToEditProgram(targetName);
  }

  cancelCurrentField() {
    this.props.setCurrentFieldToEditProgram('');
  }

  goBack() {
    history.push('/program-activities');
  }

  saveActivity(fieldName, name) {
    const { currentProgram } = this.state;
    let program = { ...currentProgram };
    program[name] = fieldName;
    this.setState({ currentProgram: program });
    this.props.updateProgram(program);
    this.props.setCurrentFieldToEditProgram('');
  }

  render() {
    const { currentFieldName } = this.props.program;
    const { currentProgram, startTimePicker, endTimePicker, isLoading } = this.state;

    return (
      <section className="section-program">
        <div className="wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <Link to="/program-activities">
                  <span className="program-detail-back"><i className="fas fa-angle-double-left"></i> Back</span>
                </Link>
                {
                  isLoading ? (
                    <Loading />
                  ) : null
                }
                { currentProgram ? (
                  <div className="program-detail">
                    <h1 className="program-detail-title">Activity Program Detail / {currentProgram.name}</h1>
                    <div className="program-detail-tabs">
                      <span className="program-detail-tabs-tab active">Primary Info</span>
                      <span
                        className="program-detail-tabs-tab"
                        onClick={() => {
                          history.push(`/programmed-activities/${currentProgram.id}`);
                        }}
                      >
                        Programmed Activities
                      </span>
                    </div>
                    <div className="program-detail-body">
                      <form className="program-detail-body-form">
                        { currentFieldName === 'name' ? (
                          <div className="program-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProgram.name} fieldLabel={'Name'} fieldName="name"
                                       saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="program-detail-body-form-group" onClick={() => this.toggleEditField('name')}>
                            <FieldGroup fieldInfo={currentProgram.name} fieldLabel={'Name'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'description' ? (
                          <div className="program-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProgram.description} fieldLabel={'Description'}
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} fieldName="description" />
                          </div>
                          ) : (
                          <div className="program-detail-body-form-group" onClick={() => this.toggleEditField('description')}>
                            <FieldGroup fieldInfo={currentProgram.description} fieldLabel={'Description'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'type' ? (
                          <div className="program-detail-body-form-group editing">
                            <FieldEdit fieldInfo={currentProgram.type} fieldLabel={'Type'}
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} fieldName="type" />
                          </div>
                          ) : (
                          <div className="program-detail-body-form-group" onClick={() => this.toggleEditField('type')}>
                            <FieldGroup fieldInfo={currentProgram.type} fieldLabel={'Type'} />
                          </div>
                          )
                        }
                        { currentFieldName === 'isActive' ? (
                          <div className="program-detail-body-form-group editing">
                            <EditSwitchField fieldTag={currentProgram.isActive} fieldLabel={'Active'} fieldName="isActive"
                              saveField={this.saveActivity} fieldCancel={this.cancelCurrentField} />
                          </div>
                          ) : (
                          <div className="program-detail-body-form-group" onClick={() => this.toggleEditField('isActive')}>
                            <FieldGroup fieldInfo={currentProgram.isActive ? 'Active' : 'Inactive'} fieldLabel={'Active'} />
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
    <div className="program-detail-body-form-wrapper">
      <div className="program-detail-body-form-item">
        <label>{props.fieldLabel}</label>
      </div>
      <div className="program-detail-body-form-item value">
        <span>{props.fieldInfo || '--'}</span>
      </div>
      <div className="program-detail-body-form-item">
        <i className="fas fa-pen"></i>
        <span>Edit</span>
      </div>
    </div>
  )
}

ProgramDetailContainer.propTypes = {
  program: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  program: state.program,
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(ProgramDetailContainer));
