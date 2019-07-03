import React, { Component } from 'react';

class EditSelectField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldId: this.props.fieldId
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ fieldId: value });
  }

  render() {
    const { fieldId } = this.state;

    return (
      <div className="driver-detail-body-form-wrapper" >
        <div className="driver-detail-body-form-item">
          <label>{this.props.fieldLabel}</label>
        </div>
        <div className="driver-detail-body-form-item value">
          <select className="care-form-group-item-select" value={fieldId} name={this.props.fieldName} onChange={(e) => this.handleChange(e)} required>
            <option value="0" disabled>Select a {this.props.fieldLabel}</option>
            { this.props.list && this.props.list.length > 0 && (
                this.props.list.map(item => {
                  return <option key={ item.id } value={ item.id }>{ item.name || item.title }</option>
                })
              )
            }
          </select>
        </div>
        <div className="driver-detail-body-form-item">
          <span className="region-detail-body-form-item-cancel" onClick={this.props.fieldCancel}>Cancel</span>
          <span className="region-detail-body-form-item-save" onClick={() => this.props.saveField(fieldId, this.props.fieldName)}>Save</span>
        </div>
      </div>
    )
  }
}

export default EditSelectField;