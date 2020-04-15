
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RemoveButton from '../layout/RemoveButton';

const TextArea = ({
                            name,
                            placeholder,
                            value,
                            error,
                            info,
                            parentClass,
                            classes,
                            onChange,
                            onRemove,
                            onTabPress
                        }) => {
    return (
        <div className={`${parentClass ? parentClass : 'form-group'}`}>
            <textarea
                className={classnames(`form-control form-control-lg`, {
                       'is-invalid': error
                   })}
                   placeholder={placeholder}
                   onKeyDown={onTabPress ? onTabPress : null}
                   name={name}
                   value={value}
                   onChange={onChange}
            />
            <RemoveButton condition={onRemove} onClick={onRemove} />
            {info && (<small className="form-text text-mutated">{info}</small>)}
            {error && (<div className="invalid-feedback"> {error} </div>)}
        </div>
    )
}

TextArea.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    info: PropTypes.string
};



export default TextArea;
