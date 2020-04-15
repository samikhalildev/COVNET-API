
// React
import React, { Component } from 'react';

// Connecting redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

// Components
import TextFieldGroup from '../layout/TextFieldGroup';

// import the action that you want to use
import { accessUser } from "../../actions/authActions";

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            pin: '',
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/');
        }

        if (nextProps.errors){
            this.setState({ errors: nextProps.errors });
        }
    }

    onChange = (event) => {
        this.setState({
           [event.target.name]: event.target.value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();

        const userData = {
            email: this.state.email,
            pin: this.state.pin
        };

        this.props.accessUser(userData, this.props.history);
    }

    render() {

        const { errors } = this.state;

        return (
            <div className="container center-width">
                <div className="row">
                    <h1 className="display-4 m-auto pb-3 heading1">Covnet Portal</h1>
                </div>
                <div className="row">
                    <div className="col">
                        <form noValidate onSubmit={this.onSubmit}>

                            <TextFieldGroup
                                type="email"
                                placeholder="Email Address"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}
                                error={errors.email}
                            />

                            <TextFieldGroup
                                type="password"
                                placeholder="Password"
                                name="pin"
                                value={this.state.pin}
                                onChange={this.onChange}
                                error={errors.pin}
                            />

                            <input type="submit" value="Login" className="btn btn-info btn-block bg-success mt-4"/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    accessUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { accessUser })(withRouter(Login));
