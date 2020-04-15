import axios from 'axios';

// Import types
import {CONTENT_LOADING, GET_PROFILE, REMOVE_COMMENT, GET_COMMENT_REPLIES, GET_PROFILES, CLEAR_CURRENT_PROFILE, GET_CONTENT_BY_ID, GET_ERRORS, SET_CURRENT_USER, GET_CONTENT } from "./types";
import isEmpty from '../utils/is-empty';

// If calling an API request, use dispatch

// Get current profile
// export const getCurrentProfile = () => dispatch => {
//     dispatch(setContentLoading());
//     axios
//         .get('/api/profile')
//         .then(res => {
//                 dispatch({
//                     type: GET_PROFILE,
//                     payload: res.data
//                 })
//             }
//         )
//         .catch(err => {
//                 dispatch({
//                     type: GET_PROFILE,
//                     payload: {}
//                 })
//             }
//         )
// // };

// // Get profile by handle
// export const getProfileByHandle = (handle) => dispatch => {
//     dispatch(setContentLoading());

//     axios
//         .get(`/api/profile/handle/${handle}`)
//         .then(res => {
//                 dispatch({
//                     type: GET_PROFILE,
//                     payload: res.data
//                 })
//             }
//         )
//         .catch(err => {
//                 dispatch({
//                     type: GET_PROFILE,
//                     payload: null
//                 })
//             }
//         )
// };

export const getContent = () => dispatch => {
    dispatch(setContentLoading());
    axios
        .get(`/api/content`)
        .then(res => {
                dispatch({
                    type: GET_CONTENT,
                    payload: res.data
                })
            }
        )
        .catch(err => {
                dispatch({
                    type: GET_CONTENT,
                    payload: null
                })
            }
        )
};

export const getContentById = (id,history) => dispatch => {
    dispatch(setContentLoading());
    axios.get(`/api/content/${id}`)
        .then(res => {
            if (!isEmpty(res.data)) {
                dispatch({
                    type: GET_CONTENT_BY_ID,
                    payload: res.data
                })
            } else {
                history.push('/');
            }
        })
        .catch(err => {
            console.log(err.message)
        })
}

// Create Content
export const createContent = (contentData, history) => dispatch => {
    axios
        .post('/api/content', contentData)
        .then(res => {
            history.push('/');
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Edit Content
export const editContent = (contentData, history) => dispatch => {
    axios
        .post(`/api/content/${contentData.id}`, contentData)
        .then(res => {
            console.log(res.data);
            history.push({ pathname: `/content/${res.data._id}`, state: { content: res.data} });
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// Delete Content
export const deleteContent = (id, history) => dispatch => {
    if(window.confirm('Are you sure you want to delete this page?')){
        axios
            .delete(`/api/content/${id}`)
            .then(res => history.push('/'))
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
};



// Like/unlike, comment/delete comment 

export const likeUnlikeContent = contentId => dispatch => {    
    axios
        .post(`/api/content/like/unlike/${contentId}`)
        .then(res => {
            console.log(res.data);
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const addCommentUnderContent = (contentId, data) => dispatch => {
    axios
        .post(`/api/content/comment/${contentId}`, data)
        .then(res => {
            if (!isEmpty(res.data)) {
                dispatch({
                    type: GET_CONTENT_BY_ID,
                    payload: res.data
                })
            }
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const likeComment = (commentId, contentId) => dispatch => {
    axios
        .post(`/api/content/like/comment/${commentId}`)
        .then(res => {
            console.log(res);
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const replyToComment = (parentCommentId, contentId, data) => dispatch => {
    axios
        .post(`/api/content/reply/${parentCommentId}/${contentId}`, data)
        .then(res => {
            dispatch({
                type: GET_COMMENT_REPLIES,
                payload: res.data
            })
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const getReplies = parentCommentId => dispatch => {
    axios.get(`/api/content/replies/${parentCommentId}`)
    .then(res => {
        dispatch({
            type: GET_COMMENT_REPLIES,
            payload: res.data
        })
    })
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
}

export const deleteCommentById = commentId => dispatch => {
    axios
        .delete(`/api/content/comment/${commentId}`)
        .then(res => {
            if (!isEmpty(res.data)) {
                dispatch({
                    type: GET_CONTENT_BY_ID,
                    payload: res.data
                })
            }
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );

};


// Get all profiles
export const getProfiles = () => dispatch => {
    dispatch(setContentLoading());
    axios
        .get('/api/profile/all')
        .then(res =>
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        )
        .catch(err =>
            dispatch({
                type: GET_PROFILES,
                payload: null
            })
        );
};


// Delete Account
export const deleteAccount = () => dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!')){
        axios
            .delete('/api/profile')
            .then(res => {
                    console.log(res.data);
                    dispatch({
                        type: SET_CURRENT_USER,
                        payload: {}
                    })
                }
            )
            .catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            )
    }
};

export const setContentLoading = () => {
    return {
        type: CONTENT_LOADING
    }
}


// Clear profile
export const clearProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
};
