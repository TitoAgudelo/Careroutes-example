import React, { Component } from 'react';

import SwitchField from './../SwitchField/SwitchField';

class EditSwitchField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldTag: this.props.fieldTag
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { fieldTag } = this.state;
    this.setState({ fieldTag: !fieldTag });
  }

  render() {
    const { fieldTag } = this.state;

    return (
      <div className="driver-detail-body-form-wrapper" >
        <div className="driver-detail-body-form-item">
          <label>{this.props.fieldLabel}</label>
        </div>
        <div className="driver-detail-body-form-item value">
          <SwitchField onAction={this.handleChange} isChecked={fieldTag} />
        </div>
        <div className="driver-detail-body-form-item">
          <span className="region-detail-body-form-item-cancel" onClick={this.props.fieldCancel}>Cancel</span>
          <span className="region-detail-body-form-item-save" onClick={() => this.props.saveField(fieldTag, this.props.fieldName)}>Save</span>
        </div>
      </div>
    )
  }
}

export default EditSwitchField;