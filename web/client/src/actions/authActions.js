import axios from 'axios';
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from 'jwt-decode';

// Action types
import { SET_CURRENT_USER } from "./types";
import { GET_ERRORS } from "./types";


// Actions gets called from component props which they call reducers to change the state of the data

// Register
export const accessUser = (userData, history) => dispatch => {
    axios
        .post('http://localhost:5000/api/auth', userData)
        .then(res => {
            console.log(res);

            // Once we get the response back, save to LocalStorage
            const { token } = res.data;

            // Set token to LocalStorage
            localStorage.setItem('jwtToken', token);

            // Set token to Auth header
            setAuthToken(token);

            // Set user to state

            // decode token to get user data
            const decoded = jwt_decode(token);

            // Set current user
            dispatch(setCurrentUser(decoded));

            history.push('/');
        })
        .catch(err =>
            {
                console.log(err);
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            }
        );
};


// Login - Get User Token
export const loginUser = (userData) => dispatch => {
    axios
        .post('/api/account', userData)
        .then(res => {

            // Once we get the response back, save to LocalStorage
            const { token } = res.data;

            // Set token to LocalStorage
            localStorage.setItem('jwtToken', token);

            // Set token to Auth header
            setAuthToken(token);

            // Set user to state

            // decode token to get user data
            const decoded = jwt_decode(token);

            // Set current user
            dispatch(setCurrentUser(decoded));

        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
};


// Log user out
export const logoutUser = () => dispatch => {

    // Remove token from localStorage
    localStorage.removeItem('jwtToken');

    // Remove account header for future requests
    setAuthToken(false);

    // Set current user to {} which will set isAuthenticate to false
    dispatch(setCurrentUser({}));

};
