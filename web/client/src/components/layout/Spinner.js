import React from 'react';
import spinner from '../spinner.gif';

export default () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col"/>
                <div className="col">
                    <img src={spinner}
                        alt="Loading..."
                        style={{width: '200px', margin: 'auto', display: 'block'}} />
                </div>
                <div className="col"/>
            </div>
        </div>
    )
}
