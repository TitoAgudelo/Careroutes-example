import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import './Profile.scss';

class ProfileContainer extends Component {
  render() {
    return (
      <section className="section-profile">
        <div className="wrapper">
          <div className="row">
            <div className="col-xs-12">
              <h1>Profile</h1>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(ProfileContainer);