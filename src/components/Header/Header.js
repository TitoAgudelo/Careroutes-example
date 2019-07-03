import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import loggedIn from './../../helpers/setAuthToken';

import actions from './../../actions';

import './Header.scss';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpenProfile: false, username: '' };
  }

  componentDidMount() {
    const name = localStorage.getItem('username');
    this.setState({
      username: name
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
      this.setState({
        auth: nextProps.auth
      });
    }

    return true;
  }

  toggleProfile = () => {
    this.setState({
      isOpenProfile: !this.state.isOpenProfile
    });
  }

  render() {
    const { isOpenProfile, username } = this.state;

    const authHeader = (
      <header>
        <nav className="navbar">
          <span className={ this.props.menuOpen ? "navbar-toggle expanded" : "navbar-toggle closed" } onClick={this.props.toggleMenu}>
            <i className="fas fa-bars"></i>
            <Link to="/">
              <img className="navbar-toggle-logo" src="/assets/care-routes-logo-white@2x.png" alt="logo" />
            </Link>
          </span>
          <span className={ this.props.menuOpen ? "navbar-icon expanded" : "navbar-icon closed" }>
            <Link to="/">
              <img src="/assets/care-routes-logo@2x.png" alt="logo" />
            </Link>
          </span>
          {
            username ? (
              <ul className="navbar-nav">
                <li className="navbar-nav-item" onClick={ this.toggleProfile }>
                  <span className="navbar-nav-item-user">
                    {username}
                    <i className={ isOpenProfile ? 'fas fa-caret-down navbar-nav-item-user-icon show' : 'fas fa-caret-down navbar-nav-item-user-icon' }></i>
                  </span>
                  <div className={ isOpenProfile ? 'navbar-nav-item-dropdown expanded' : 'navbar-nav-item-dropdown' }>
                    <ul className="navbar-nav-item-dropdown-list">
                      <li className="navbar-nav-item-dropdown-list-item">
                        <i className="fas fa-user-circle"></i>
                        <Link to="profile">
                          <span>profile</span>
                        </Link>
                      </li>
                      <li className="navbar-nav-item-dropdown-list-item">
                        <i className="fas fa-cog"></i>
                        <span>settings</span>
                      </li>
                      <li className="navbar-nav-item-dropdown-list-item" onClick={this.props.logOutUser}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>logout</span>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="navbar-nav-item-account">
                  <i className="fas fa-user-circle"></i>
                </li>
                <li className="navbar-nav-item-notification">
                  <i className="fas fa-bell"></i>
                  <span>0</span>
                </li>
              </ul>
            ) : null
          }
        </nav>
      </header>
    );

    const guessHeader = (
      null
    );

    return (
      <div>
        { loggedIn() ? authHeader : guessHeader }
      </div>
    );
  }
}

Header.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  menuOpen: PropTypes.bool.isRequired,
  auth: PropTypes.object.isRequired
}

Header.defaultProps = {
  menuOpen: false
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(Header));
