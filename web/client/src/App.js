import React, { Component } from 'react';

// React Router
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// CSS
import './styles/main.css';

// JWT Token
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';

// Actions
import { logoutUser, setCurrentUser } from './actions/authActions';

// Components
import PrivateRoute from './components/layout/PrivateRoute';

import Navbar from './components/layout/Navbar';

import Login from './components/account/Login';
import Access from './components/account/Access';
import Dashboard from './components/Dashboard';
import NewCase from './components/NewCase';

// Check for token
if (localStorage.jwtToken) {
  // Set account token header
  setAuthToken(localStorage.jwtToken);

  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);

  // Set user and isAuthenticate
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
              <Navbar/>
              <Route exact path='/register' component={Access} />
              <Route exact path='/login' component={Login} />
              <Switch>
                <PrivateRoute exact path='/' component={Dashboard} />
                <PrivateRoute exact path='/add' component={NewCase} />
              </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
