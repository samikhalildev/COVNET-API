
// React
import React, { Component } from 'react';

// Connecting Redux
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

// Components
import TextFieldGroup from '../layout/TextFieldGroup';

// Actions
import { accessUser } from '../../actions/authActions';
import validateLogin from '../../utils/validateLogin'

// Defining a custom component/class
class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            occupation: '',
            city: '',
            email: '',
            pin: '',
            errors: {}
        };
    };

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({ errors: nextProps.errors });
        }
    }

    // This method gets triggered when a user enters something
    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    // This method gets called when a user submits
    onSubmit = (event) => {
        event.preventDefault();

        const newUser = {
            email: this.state.email,
            name: this.state.name,
            occupation: this.state.occupation,
            city: this.state.city,
            pin: this.state.pin,
            register: true
        };

        const { errors, isValid } = validateLogin(newUser);

        if (isValid) {
            console.log(newUser);
            this.props.accessUser(newUser, this.props.history);
        } else {
            this.setState({ errors });
        }

    };

    render() {

        // Desctructing allows us to pull errors from the state object
        const { errors } = this.state;
        const { user } = this.props.auth;

        // Set class 'is-invalid' only if there is an errors name.

        return (
            <div className="container center-width">
                <div className="row">
                    <h1 className="display-4 m-auto pb-3 heading1">Covnet Portal</h1>
                </div>
                <div className="row">
                    <div className="col">
                        <form noValidate onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChange}
                                error={errors.name}
                            />
                            <TextFieldGroup
                                type="text"
                                placeholder="Occupation"
                                name="occupation"
                                value={this.state.occupation}
                                onChange={this.onChange}
                                error={errors.occupation}
                            />
                            <TextFieldGroup
                                type="text"
                                placeholder="City"
                                name="city"
                                value={this.state.city}
                                onChange={this.onChange}
                                error={errors.city}
                            />
                            <TextFieldGroup
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}
                                error={errors.email}
                            />

                            <TextFieldGroup
                                type="password"
                                placeholder="Your secret pin"
                                name="pin"
                                value={this.state.pin}
                                onChange={this.onChange}
                                error={errors.pin}
                            />

                            <input type="submit" value="Register" className="btn btn-info btn-block bg-success mt-4"/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

// mapping state to props, state.account comes from the rootreducer
const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

// Export all actions used
export default connect(mapStateToProps, { accessUser })(withRouter(Register));

