import React from 'react';

export default ({ condition, onClick=false, noBg=false }) => condition ? <span className={`btn icon-ele ${!noBg ? 'icon-error-bg' : null}`} onClick={onClick ? onClick : null}><i className="fa fa-times-circle mt-2"/></span> : null


