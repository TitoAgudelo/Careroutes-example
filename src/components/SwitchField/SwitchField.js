import React, { PureComponent } from 'react';
import { string, bool, func } from 'prop-types';

import './SwitchField.scss';

class SwitchField extends PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onAction(!this.props.isChecked);
  }

  render() {
    const { label, required, disabled, id } = this.props;

    return (
      <div className="care-switch">
        { label ? (
          <label htmlFor={id} className="care-switch-label">
            {label}
          </label>
        ) : null }
        <div className="care-switch-inner">
          <input
            id={id || ''}
            name={id || ''}
            value={1}
            type="checkbox"
            className="care-switch-field"
            disabled={disabled}
            required={required}
            checked={this.props.isChecked}
            onChange={this.handleChange} />
          <span className={this.props.isChecked ? 'care-switch-checkbox checked' : 'care-switch-checkbox'} >
            <div className="inner"></div>
          </span>
        </div>
      </div>
    )
  }
}

SwitchField.propTypes = {
  id: string,
  label: string,
  required: bool,
  isChecked: bool,
  disabled: bool,
  className: string,
  onAction: func.isRequired
}

SwitchField.defaultProps = {
  label: '',
  required: false,
  isChecked: false,
  disabled: false,
  className: ''
}

export default SwitchField;