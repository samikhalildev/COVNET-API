
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from './layout/TextFieldGroup';
import axios from 'axios';

import '../styles/main.css';
import isEmpty from '../utils/is-empty';
import host from '../config/api';

class NewCase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            infectedId: '',
            symptomsDate: '',
            status: 'infected',
            errors: {}
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
        let { firstName, lastName, infectedId, symptomsDate, status } = this.state;
        let errors = {};

        if (isEmpty(infectedId)) {
            errors.infectedId = 'You must enter the infected ID';
        }

        if (isEmpty(firstName)) {
            errors.firstName = 'You must enter the a first name';
        }

        if (isEmpty(lastName)) {
            errors.lastName = 'You must enter the a last name';
        }

        this.setState({ errors });

        if (Object.keys(errors).length > 0) {
            return false;
        }

        const newCase = {
            infectedId,
            firstName,
            lastName,
            status
        }

        if (!isEmpty(symptomsDate)) {
            newCase.symptomsDate = symptomsDate; 
        }

        console.log(newCase)

        axios.post(host + '/api/infections/infectedId', newCase)
            .then(res => {
                console.log(res);
                if (res.data.success) {
                    this.props.history.push('/')
                }
            })
            .catch(err => {
                if (err && err.response && err.response.data) {
                    this.setState({ errors: err.response.data });
                }
            })
    };

    render() {
        const {errors} = this.state;
        return (
            <div className="container center-width">
                <div className="row">
                    <h2 className="display-4 m-auto pb-3 heading1">Add a new case or test</h2>
                </div>
                 <div className="row">
                    <div className="col">
                        <form noValidate onSubmit={this.onSubmit}>

                            <div className='form-group'>
                                <span className="in" >
                                    <input type="radio" name='status' 
                                        value='infected' 
                                        checked={this.state.status == 'infected'} 
                                        onChange={this.onChange} 
                                    /> Confirmed
                                </span>

                                <span className="in" >
                                    <input type="radio" name='status' 
                                        value='tested'
                                        onChange={this.onChange} 
                                    /> Tested
                                </span>
                                <small className="form-text text-mutated">Has this person been confirmed with the virus or tested?</small>
                            </div>

                            <TextFieldGroup
                                type="text"
                                placeholder="Infected ID"
                                name="infectedId"
                                value={this.state.infectedId}
                                onChange={this.onChange}
                                error={errors.infectedId}
                            />

                            <TextFieldGroup
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={this.state.firstName}
                                onChange={this.onChange}
                                error={errors.firstName}
                            />

                            <TextFieldGroup
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                value={this.state.lastName}
                                onChange={this.onChange}
                                error={errors.lastName}
                            />

                            <input type="submit" value="Submit" className="btn btn-info btn-block bg-success mt-4"/>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    auth: state.auth,
    content: state.content
});


export default connect(mapStateToProps, { })(NewCase);
