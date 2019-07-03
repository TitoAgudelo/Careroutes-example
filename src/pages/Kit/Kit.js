import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Kit.scss';

class KitContainer extends Component {

  renderButtons() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h1>Buttons</h1>
        </div>
        <div className="col-xs-6 col-sm-3">
          <div className="buttons-container">
            <label>Primary Button</label>
            <button className="button-primary"><span className="text">New Route</span></button>
          </div>
          <div className="buttons-container">
            <label>Primary Button Active</label>
            <button className="button-primary active"><span className="text">New Route</span></button>
          </div>
        </div>
        <div className="col-xs-6 col-sm-3">
          <div className="buttons-container">
            <label>Secondary Button</label>
            <button className="button-secondary"><span className="text">New Route</span></button>
          </div>
          <div className="buttons-container">
            <label>Secondary Button Active</label>
            <button className="button-secondary active"><span className="text">New Route</span></button>
          </div>
        </div>
        <div className="col-xs-6 col-sm-3">
          <div className="buttons-container">
            <label>Primary Small Button</label>
            <button className="button-small-primary"><span className="text">New Route</span></button>
          </div>
          <div className="buttons-container">
            <label>Primary Small Button Active</label>
            <button className="button-small-primary active"><span className="text">New Route</span></button>
          </div>
        </div>
        <div className="col-xs-6 col-sm-3">
          <div className="buttons-container">
            <label>Secondary Small Button</label>
            <button className="button-small-secondary"><span className="text">New Route</span></button>
          </div>
          <div className="buttons-container">
            <label>Secondary Small Button Active</label>
            <button className="button-small-secondary active"><span className="text">New Route</span></button>
          </div>
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h1>Tables</h1>
        </div>
        <div className="col-xs-12">
          <table cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th>
                  <span>Name</span>
                  <i className="fas fa-angle-down"></i>
                </th>
                <th>
                  <span>Phone</span>
                  <i className="fas fa-angle-down"></i>
                </th>
                <th>
                  <span>Email</span>
                  <i className="fas fa-angle-down"></i>
                </th>
                <th>
                  <span>Drivers License</span>
                  <i className="fas fa-angle-down"></i>
                </th>
                <th>
                  <span>Region</span>
                  <i className="fas fa-angle-down"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="1">Lucie Stone</td>
                <td colSpan="1">(720) 343-9798</td>
                <td colSpan="1">lstone@gmail.com</td>
                <td colSpan="1">94-920-4672</td>
                <td colSpan="1">Southwest Denver</td>
                <td colSpan="4">
                  <i className="fas fa-arrow-right"></i>
                </td>
              </tr>
              <tr>
                <td colSpan="1">Lucie Stone</td>
                <td colSpan="1">(720) 343-9798</td>
                <td colSpan="1">lstone@gmail.com</td>
                <td colSpan="1">94-920-4672</td>
                <td colSpan="1">Southwest Denver</td>
                <td colSpan="4">
                  <i className="fas fa-arrow-right"></i>
                </td>
              </tr>
              <tr>
                <td colSpan="1">Lucie Stone</td>
                <td colSpan="1">(720) 343-9798</td>
                <td colSpan="1">lstone@gmail.com</td>
                <td colSpan="1">94-920-4672</td>
                <td colSpan="1">Southwest Denver</td>
                <td colSpan="4">
                  <i className="fas fa-arrow-right"></i>
                </td>
              </tr>
              <tr>
                <td colSpan="1">Lucie Stone</td>
                <td colSpan="1">(720) 343-9798</td>
                <td colSpan="1">lstone@gmail.com</td>
                <td colSpan="1">94-920-4672</td>
                <td colSpan="1">Southwest Denver</td>
                <td colSpan="4">
                  <i className="fas fa-arrow-right"></i>
                </td>
              </tr>
              <tr>
                <td colSpan="1">Lucie Stone</td>
                <td colSpan="1">(720) 343-9798</td>
                <td colSpan="1">lstone@gmail.com</td>
                <td colSpan="1">94-920-4672</td>
                <td colSpan="1">Southwest Denver</td>
                <td colSpan="4">
                  <i className="fas fa-arrow-right"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  renderFonts() {
    return (
      <div className="row">
        <div className="col-xs-12">
          <h1>Fonts</h1>
        </div>
        <div className="col-xs-12">
          <p className="text-definer">Section Definer (Roboto Bold 24px #282828) use class .text-definer</p>
          <p className="text-button">Small Button Primary (Roboto Regular 20px #0091FF All Caps) use class .text-button</p>
          <p className="text-button-alt">Small Button Primary (Roboto Regular 20px #0091FF All Caps) use class .text-button-alt</p>
          <p className="text-selected">Tab Selected (Roboto Bold 20px #282828) use class .text-selected</p>
          <p className="text-disabled">Tab Selected (Roboto Bold 20px #282828) use class .text-selected</p>
          <p className="text-menu">Navigation Menu (Roboto Regular 20px #D8D8D8) use class .text-menu</p>
          <p className="text-field">Inline Field Value (Roboto Regular 20px #282828) use class .text-field</p>
          <p className="text-label">Label (Roboto Regular 20px B1B1B1) use class .text-label or label tag</p>
          <p className="text-body">Body (Roboto Regular 16px #4E4E4E) use class .text-body</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <section className="section-kit">
        <div className="wrapper">
          { this.renderButtons() }
          { this.renderTable() }
          { this.renderFonts() }
        </div>
      </section>
    );
  }
}

export default withRouter(KitContainer);