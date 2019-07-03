import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import loggedIn from './../../helpers/setAuthToken';

import { userActions } from '../../actions/auth';

import './Reset.scss';

class ResetContainer extends Component {
    constructor(props) {
      super(props);

      // reset status
      this.props.dispatch(userActions.logout());

      this.state = {
        email: '',
        submitted: false
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
      if (loggedIn()) {
        this.props.logOutUserFirstAccess()
      }
    }

    handleChange(e) {
      const { name, value } = e.target;
      this.setState({ [name]: value });
    }

    handleSubmit(e) {
      e.preventDefault();

      this.setState({ submitted: true });
      const { email } = this.state;
      const { dispatch } = this.props;
      if (email) {
        dispatch(userActions.resetPassword(email));
      }
    }

    render() {
      const { email, submitted } = this.state;

      return (
        <section className="reset">
          <div className="wrapper">
            <div className="row center-xs">
              <div className="col-xs-12">
                <img className="reset-logo" src="./assets/care-routes-logo@3x.png" alt="logo" />
              </div>
              <div className="col-xs-12">
                <div className="reset-card">
                  <div className="reset-card-head">
                    <h1 className="reset-card-title">Reset Password</h1>
                  </div>
                  <form name="form" onSubmit={this.handleSubmit}>
                    <div className="reset-card-body">
                      <div className="reset-card-body-group">
                        <div className="reset-card-body-group-item">
                          <label className="text-label">Email Address</label>
                        </div>
                        <div className="reset-card-body-group-item">
                          <input type="text" placeholder="name@domain.com" name="email" value={email} onChange={this.handleChange} />
                          {submitted && !email &&
                            <div className="help-block">Email is required</div>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="reset-card-footer">
                      <div className="reset-card-footer-item">
                        <div className="login-card-footer-item-forgot">
                          <Link to="/login" className="text-body">Login</Link>
                        </div>
                        <button className="button-primary" disabled={!this.state.email}>
                          <span className="text">Reset</span>
                        </button>
                      </div>
                      <div className="reset-card-footer-item">
                        <span className="text-body">Need help?</span>
                      </div>
                  </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
  }

  function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
      loggingIn
    };
  }

  export default withRouter(connect(mapStateToProps)(ResetContainer));