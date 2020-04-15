
import { GET_CONTENT, GET_COMMENT_REPLIES, CONTENT_LOADING, GET_CONTENT_BY_ID, REMOVE_COMMENT } from '../actions/types';
import isEmpty from '../utils/is-empty';
import containsElement from '../utils/containsElement';

const initialState = {
    data: null,
    loading: false
};

export default function(state = initialState, action) {

    switch (action.type) {
        case GET_CONTENT:
            return {
                ...state,
                data: action.payload,
                loading: false
            };

        case GET_CONTENT_BY_ID:
            if (isEmpty(state.data) || state.data.length === 0) {
                return {
                    data: [action.payload],
                    loading: false
                }
            } else {
                let contentFoundIndex = state.data.map(c => c._id.toString()).indexOf(action.payload._id)

                if (contentFoundIndex !== -1) {
                    state.data[contentFoundIndex] = action.payload;
                    console.log(state);
                    return {
                        ...state,
                        loading: false
                    }
                } 

                return {
                    data: [
                        ...state.data,
                        action.payload
                    ],
                    loading: false
                }
            }

        case GET_COMMENT_REPLIES:
            let contentIndex = state.data.map(c => c._id.toString()).indexOf(action.payload.content.toString())

            if (contentIndex !== -1) {
                let commentIndex = state.data[contentIndex].comments.map(c => c._id.toString()).indexOf(action.payload._id.toString())
                if (commentIndex !== -1) {
                    state.data[contentIndex].comments[commentIndex] = action.payload
                    console.log(action.payload);
                    return {
                        ...state,
                        loading: false
                    };
                }
            }

        case CONTENT_LOADING:
            return {
                ...state,
                loading: true
            };

        case REMOVE_COMMENT:
            let { commentId, contentId, replyId } = action.payload;

            contentIndex = containsElement(state.data, contentId, '_id')
            if (contentIndex !== -1) {
                if (isEmpty(replyId)) {
                    let comments = state.data[contentIndex].comments.filter((c => c._id.toString() != commentId.toString()));
                    state.data[contentIndex].comments = comments;

                } else {
                    let commentIndex = containsElement(state.data[contentIndex].comments, commentId, '_id')
                    if (commentIndex !== -1) {
                        let removeIndex = containsElement(state.data[contentIndex].comments[commentIndex].replies, replyId, '_id');
                        if (removeIndex !== -1) {
                            state.data[contentIndex].comments[contentIndex].replies.splice(removeIndex, 1);
                        }
                    }
                }
                
                return {
                    ...state,
                    loading: false
                };
            }

        default:
            return state;
    }
}
