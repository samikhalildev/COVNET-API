import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import components
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/">Dashboard</Link>
                </li> 
                <li className="nav-item pr-3">
                    <Link className="nav-link" to="/add">Add</Link>
                </li>
                <li className="nav-item">
                    <Link to="" className="nav-link" onClick={this.onLogoutClick}>
                    Log out
                    </Link>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                </li>
            </ul>
        );

        return (
            <nav className="navbar navbar-expand-sm bg-light mb-4">
                <div className="container">
                    <div className='text-center'>
                        <h3 className='text-primary'>Covnet</h3>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mobile-nav">
                        {isAuthenticated ? authLinks : guestLinks}
                    </div>
                </div>
            </nav>
        )
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    clearProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
