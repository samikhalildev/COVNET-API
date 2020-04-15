import React from 'react';

export default ({ history, path }) => (
    <button className="btn btn-light back" onClick={() => path ? history.push(path) : history.goBack()}> {'<'} </button>
)
