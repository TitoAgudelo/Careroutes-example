import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bool } from 'prop-types';

import { history } from './helpers';

export default function(ComposedComponent) {
  class Authentication extends Component {
		componentWillMount(){
			if (!this.props.authenticated)
      	history.push('/');
		}

		componentWillUpdate(nextProps){
			if (!nextProps.authenticated)
      	history.push('/');
		}

		render(){
			return <ComposedComponent { ...this.props }/>
		}
	}

  Authentication.propTypes = {
    authenticated: bool
  }

	function mapStateToProps(state){
		return { authenticated: state.auth.authenticated };
	}

	return connect(mapStateToProps)(Authentication);
}