import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import { logOutUser } from './../../actions/auth';

import './Home.scss';

class HomeContainer extends Component {
  onLogout(e) {
    e.preventDefault();

    this.props.logOutUser(this.props.history);
  }

  render() {
    return (
      <section className="section-home">
        <div className="wrapper">
          <div className="row">
            <div className="col-xs-12">
              <p>Welcome to Careroutes Dispatcher App</p>
              <span onClick={this.onLogout.bind(this)}>Logout</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

HomeContainer.protoTypes = {
  logOutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logOutUser })(withRouter(HomeContainer));