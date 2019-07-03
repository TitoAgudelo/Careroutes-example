import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import loggedIn from './setAuthToken';

function PrivateRoute(props) {
  const { component: Component, path } = props;
  return (
    <Route path={path} render={() => {
      if (loggedIn()) {
        return <Component />
      }

      return <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
    }} />
  );
}

export default PrivateRoute;