import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import TimePicker from 'rc-time-picker';
import moment from 'moment';

import SearchAddressField from '../SearchAddressField/SearchAddressField';
import SetShapeOnMapField from '../SetShapeOnMapField/SetShapeOnMapField';

class FieldEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldInfo: this.props.fieldInfo
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (this.props.isRestrictedArea) {
      const restrictedArea = Object.assign({}, e)

      this.setState({
        fieldInfo: Object.assign({}, restrictedArea),
      })
    } else if (this.props.isLocation) {
      const result = Object.assign({}, e.result)
      const location = {
        addressLine1: result.value,
        addressLine2: '',
        city: result.city,
        state: result.state,
        zipCode: result.postalCode,
        coordinates: Object.assign({}, result.latlng)
      }

      this.setState({
        fieldInfo: Object.assign({}, location),
      })
    } else if (this.props.isTime) {
      const momentDate = moment(e);
      this.setState({ fieldInfo: momentDate });
    } else {
      const { value } = e.target;
      this.setState({ fieldInfo: value })
    }
  }

  renderEditableField() {
    const { fieldInfo } = this.state;

    if (this.props.isRestrictedArea) {
      return (
        <SetShapeOnMapField onChange={this.handleChange} />
      );
    }

    if (this.props.isLocation) {
      return (
        <SearchAddressField
          className="care-form-group-item-field"
          placeholder="Write an address here"
          onChange={this.handleChange}
          defaultValue={(fieldInfo || {}).addressLine1}
        />
      );
    }

    console.log(this.props.isTime, fieldInfo, moment(fieldInfo));
    if (this.props.isTime) {
      return (
        <TimePicker
          showSecond={false}
          minuteStep={15}
          value={fieldInfo}
          onChange={this.handleChange}
          placeholder="HH:MM"
        />
      )
    }

    if (this.props.format) {
      return (
        <NumberFormat className="care-form-group-item-field" value={fieldInfo} onChange={this.handleChange} name={this.props.fieldName}
          format={this.props.format} placeholder={this.props.placeholder} mask={this.props.mask} />
      );
    }

    return (
      <input className="care-form-group-item-field" type="text" placeholder={this.props.placeholder}
        name={this.props.fieldName} value={fieldInfo} onChange={this.handleChange} />
    );
  }

  render() {
    const { fieldInfo } = this.state;

    return (
      <div className="driver-detail-body-form-wrapper" >
        <div className="driver-detail-body-form-item">
          <label>{this.props.fieldLabel}</label>
        </div>
        <div className="driver-detail-body-form-item value">
          {this.renderEditableField()}
        </div>
        <div className="driver-detail-body-form-item">
          <span className="region-detail-body-form-item-cancel" onClick={this.props.fieldCancel}>Cancel</span>
          <span className="region-detail-body-form-item-save" onClick={() => this.props.saveField(fieldInfo, this.props.fieldName)}>Save</span>
        </div>
      </div>
    )
  }
}

export default FieldEdit;