import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import loggedIn from './../../helpers/setAuthToken';

import actions from './../../actions';

import './Aside.scss';

class Aside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    }

    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
      this.setState({
        auth: nextProps.auth
      });
    }

    return true;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    this.props.setSearchField(value);
  }

  render() {
    const { search } = this.state;

    const authAside = (
      <aside className={ this.props.menuOpen ? "app-aside expanded" : "app-aside" }>
        <div className="app-aside-search" onClick={!this.props.menuOpen ? this.props.toggleMenu : null}>
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search" name="search" autoComplete="off" value={search} onChange={this.handleChange}></input>
        </div>
        <div className="app-aside-menu">
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} exact to="/" className="app-aside-menu-item-inside">
              <i className="fas fa-map"></i>
              <span>Dispatch View</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/routes" className="app-aside-menu-item-inside">
              <i className="fas fa-route"></i>
              <span>Routes</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/drivers" className="app-aside-menu-item-inside">
              <i className="fas fa-id-card-alt"></i>
              <span>Drivers</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/vehicles" className="app-aside-menu-item-inside">
              <i className="fas fa-car"></i>
              <span>Vehicles</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/clients" className="app-aside-menu-item-inside">
              <i className="fas fa-users"></i>
              <span>Clients</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/regions" className="app-aside-menu-item-inside">
              <i className="fas fa-archway"></i>
              <span>Regions</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/providers" className="app-aside-menu-item-inside">
              <i className="fas fa-fire"></i>
              <span>Providers</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/restricted-areas" className="app-aside-menu-item-inside">
              <i className="fas fa-archway"></i>
              <span>Rest. Areas</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/program-activities" className="app-aside-menu-item-inside">
              <i className="fas fa-hiking"></i>
              <span>Prog. Activities</span>
            </NavLink>
          </div>
          <div className="app-aside-menu-item">
            <NavLink activeStyle={{ background: '#00060B' }} to="/facilities" className="app-aside-menu-item-inside">
              <i className="fas fa-warehouse"></i>
              <span>Facilities</span>
            </NavLink>
          </div>
        </div>
      </aside>
    )

    const aside = (null);

    return (
      <div>{ loggedIn() ? authAside : aside }</div>
    );
  }
}

Aside.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

Aside.defaultProps = {
  menuOpen: false
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.user
});

export default withRouter(connect(mapStateToProps, actions)(Aside));