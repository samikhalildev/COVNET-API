
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

const API = 'http://localhost:5000/api/infections';

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
        axios.get(API + '/infectionsTestedByMe')
            .then(res => {
                if (res.data.success) {
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
                        { infections.map(infection => {
                            return <li className="list-group-item"> ID: {infection.uniqueId}
                                <p> Info: {infection.firstName} {infection.lastName} {infection.email} {infection.phone} {infection.age ? `, age: {infection.age}` : null} </p>
                                
                                <p> {!isEmpty(infection.dateTested) && `Tested ${Moment(infection.dateTested).fromNow()}`} {!isEmpty(infection.dateInfected) && `Infected ${Moment(infection.dateInfected).fromNow()}`} </p>

                                {infection.contacts.length ? <p className="">Has been in close contact with {infection.contacts.length} other users</p> : 'No close contact with anyone close'}
                             </li> 
                        })}
                    </ul>
                </div>
            );
        } else {
            infectionsHTML = <h3>You haven't added any users, <Link to='/add'>add a person here</Link></h3>
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
