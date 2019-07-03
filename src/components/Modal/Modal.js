import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Modal.scss';

class Modal extends Component {
  render() {
    const { onClose, onSubmit, children, title } = this.props;

    if(!this.props.show) {
      return null;
    }

    return (
      <div className="backdrop">
        <div className="modal">
          <div className="modal-head">
            <h2 className="modal-head-title">{title}</h2>
            <i className="fas fa-times modal-head-icon" onClick={onClose}></i>
          </div>
          <div className="modal-body">
            {children}
          </div>
          <div className="modal-footer">
            <button className="button-small-secondary" onClick={onClose}><span className="text">Cancel</span></button>
            <button className="button-small-primary" onClick={onSubmit}><span className="text">Save</span></button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string.isRequired
};

Modal.defaultProps = {
  show: false
}

export default Modal;