import React from 'react';
import { Link } from 'react-router-dom';
import { COLOURS } from '../../utils/constants';

export default ({ userId, name, colourCode }) => {
    let style = {
        backgroundColor: colourCode
    };
    return (
        <Link to={`/user/${userId}`}>
            <div className="pr-2">
                <div className="user-image-container" style={style}>
                    <span className="user-image">{name[0]}</span>
                </div>
            </div>
        </Link>
    )
}
