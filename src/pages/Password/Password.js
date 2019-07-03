import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import loggedIn from './../../helpers/setAuthToken';

import actions from './../../actions';

import './Password.scss';

class PasswordContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      accessToken: this.props.match.params.token,
      currentUser: {},
      message: '',
      setReady: false
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const token = this.props.match.params.token;

    if (loggedIn()) {
      this.props.logOutUserFirstAccess()
    }

    if (token) {
      this.props.checkAccessToken(token);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { currentUser } = nextProps.auth;

    if (currentUser !== this.props.auth.currentUser && currentUser.id !== this.props.auth.currentUser.id) {
      this.setState({
        currentUser: Object.assign({}, currentUser),
        setReady: true
      });
    }

    return true;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });

    const { password, accessToken } = this.state;
    const model = { password: password, accessToken: accessToken };
    if (password && accessToken) {
      this.props.setPassword(model);
    }
  }

  render() {
    const { password, submitted, setReady, message } = this.state;



    return (
      <section className="password">
        <div className="wrapper">
          <div className="row center-xs">
            <div className="col-xs-12">
              <img className="password-logo" src="/assets/care-routes-logo@3x.png" alt="logo" />
            </div>
            <div className="col-xs-12">
              <div className="password-card">
                <div className="password-card-head">
                  <h1 className="password-card-title">Set your password</h1>
                </div>
                { setReady ? (
                  <form name="form" onSubmit={this.handleSubmit}>
                    <div className="password-card-body">
                      <div className="password-card-body-group">
                        <div className="password-card-body-group-item">
                          <label className="text-label">Password</label>
                        </div>
                        <div className="password-card-body-group-item">
                          <input type="text" placeholder="Enter" name="password" value={password} onChange={this.handleChange} />
                          {submitted && !password &&
                            <div className="help-block">Password is required</div>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="password-card-footer">
                      <div className="password-card-footer-item">
                        <button className="button-primary" disabled={!this.state.password}>
                          <span className="text">Set Password</span>
                        </button>
                      </div>
                      <div className="password-card-footer-item">
                        <span className="text-body">Need help?</span>
                      </div>
                    </div>
                  </form> ) : (
                    <div className="password-card-footer">
                      <div className="password-card-footer-message">
                        <p>{message}</p>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, actions)(PasswordContainer));