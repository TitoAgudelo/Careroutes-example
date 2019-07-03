import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import loggedIn from './../../helpers/setAuthToken';

import * as actions from '../../actions/auth';

import './Login.scss';

class LoginContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      submitted: false,
      errors: { },
      message: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && password) {
      const formProps = { email: email, password: password };
      this.props.signin(formProps);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }

    if (nextProps.auth.messageFailure !== this.props.auth.messageFailure) {
      this.setState({
        message: nextProps.auth.messageFailure
      });
    }
  }

  renderAlert(){
		if(this.props.errorMessage){
			return(
				<div className="alert alert-danger">
					<strong>Oops!</strong> {this.props.errorMessage}
				</div>
				);
		}
	}

  render() {
    const { email, password, submitted } = this.state;
    const { messageFailure } = this.props.auth;

    if (loggedIn()) {
      return <Redirect to={{ pathname: '/' }} />
    }

    return (
      <section className="login">
        <div className="wrapper">
          <div className="row center-xs">
            <div className="col-xs-12">
              <img className="login-logo" src="./assets/care-routes-logo@3x.png" alt="logo" />
            </div>
            {
              messageFailure ? (
                <div className="col-xs-12">
                  <p className="login-card-message">{messageFailure}</p>
                </div>
              ) : null
            }

            <div className="col-xs-12">
              <div className="login-card">
                <div className="login-card-head">
                  <h1 className="login-card-title">Login</h1>
                </div>
                {this.renderAlert()}
                <form name="form" onSubmit={this.handleSubmit}>
                  <div className="login-card-body">
                    <div className="login-card-body-group">
                      <div className="login-card-body-group-item">
                        <label className="text-label">Email Address</label>
                      </div>
                      <div className="login-card-body-group-item">
                        <input type="text" placeholder="name@domain.com" name="email" value={email} onChange={this.handleChange} />
                        {submitted && !email &&
                          <div className="help-block">Email is required</div>
                        }
                      </div>
                    </div>
                    <div className="login-card-body-group">
                      <div className="login-card-body-group-item">
                        <label className="text-label">Password</label>
                      </div>
                      <div className="login-card-body-group-item">
                        <input type="password" placeholder="Enter" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                          <div className="help-block">Password is required</div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="login-card-footer">
                  <div className="login-card-footer-item">
                    <div className="login-card-footer-item-forgot">
                      <Link to="/reset" className="text-body">Forgot Password</Link>
                    </div>
                    <button className="button-primary" disabled={!this.state.email && !this.state.password}>
                      <span className="text">Login</span>
                    </button>
                  </div>
                  <div className="login-card-footer-item">
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

LoginContainer.propTypes = {
  signin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(connect(mapStateToProps, actions)(LoginContainer));
