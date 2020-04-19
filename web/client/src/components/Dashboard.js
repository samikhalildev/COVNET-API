
import React, { Component } from 'react';
import axios from 'axios';
import '../styles/main.css';
import { Link } from 'react-router-dom';
// Connecting Redux
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logoutUser } from "../actions/authActions";
import { getContent } from "../actions/contentActions";
import isEmpty from '../utils/is-empty';
import Spinner from './layout/Spinner';
import Moment from 'moment';
import host from '../config/api';

const API = host + '/api/users';

class Search extends Component {

    constructor() {
        super();
        this.state = {
            city: '',
            loading: true,
            infections: [],
            confirmedCases: []
        }
    }

    componentDidMount() {
        this.getInfections();
    }

    getInfections = () => {
        axios.get(API + '/tested-by-me')
            .then(res => {
                if (res && res.data && res.data.success) {
                    this.setState({ infections: res.data.infections, city: res.data.city }, () => this.getConfirmedCases());
                }
            })
            .catch(err => {
                console.log(err.response.data)
            })
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    getConfirmedCases = () => {
        console.log(this.state.infections);
        let confirmedCases = this.state.infections.filter(infection => infection.status == 'infected');
        this.setState({ confirmedCases, loading: false });
    }

    markAsInfected = (userId, i) => {
        let {infections} = this.state;
        let data = {
            infectedId: userId,
            status: 'infected'
        }
        axios.post(API + '/confirmed-case', data)
            .then(res => {
                console.log(res);
                if (res.data.success) {
                    infections[i].status = 'infected'
                    this.setState({infections})
                }
            })
            .catch(err => {
                if (err && err.response && err.response.data) {
                    console.log(err.response.data)
                }
            })
    }

    render() {
        const { loading, city, infections, confirmedCases } = this.state;

        let infectionsHTML = '';

        if (loading)
            infectionsHTML = <Spinner/>;

        else if (infections.length) {
            infectionsHTML = (
                <div className="col pp">
                    <h3>Hi {this.props.auth.user.name}, you have tested {infections.length} patients in {city}</h3>
                    <span>{confirmedCases.length} confirmed cases and {infections.length - confirmedCases.length} un-confirmed.</span>
                    <ul className="list-group mmt">
                        { infections.map((user, i) => {
                            return <li className="list-group-item"> ID: {user._id}
                                <p> Info: {user.firstName} {user.lastName} {user.email} {user.phone} {user.age ? `, age: ${user.age}` : null} </p>
                                
                                <p> {!isEmpty(user.dateTested) && `Tested ${Moment(user.dateTested).fromNow()}`} {!isEmpty(user.dateInfected) && `Infected ${Moment(user.dateInfected).fromNow()}`} </p>

                                {user.coords.length ? (
                                    <p>
                                        Location received. {user.contacts.length ? `${user.firstName} has been in close contact with ${user.contacts.length} other users` : 'No close contact with anyone close'}
                                    </p>
                                ) : user.status == 'tested' ? (
                                    <button onClick={() => this.markAsInfected(user._id, i)} className="btn btn-danger"> {`Mark as infected`} </button>
                                ) : null }
                             </li> 
                        })}
                    </ul>
                </div>
            );
        } else {
            infectionsHTML = <h3>You haven't added any users, <Link to='/add'>add a user here</Link></h3>
        }
       
        return <>
            <div className="container center-wifdth">
                <div className="row">
                    {infectionsHTML}
                </div>
            </div>
        </>
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, getContent })(withRouter(Search));
