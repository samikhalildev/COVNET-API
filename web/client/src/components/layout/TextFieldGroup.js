import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RemoveButton from '../layout/RemoveButton';

const TextFieldGroup = ({
    name,
    placeholder,
    value,
    label,
    parentClass,
    classes,
    error,
    info,
    type,
    onChange,
    onRemove,
    disabled
}) => {
    return (
        <div className={`${parentClass ? parentClass : 'form-group'}`}>
            <input type={type}
                   className={classnames(`form-control form-control-lg`, {
                       'is-invalid': error,
                   })}
                   placeholder={placeholder}
                   name={name}
                   value={value}
                   onChange={onChange}
                   disabled={disabled}
            />
            <RemoveButton condition={onRemove} onClick={onRemove} />
            {info && (<small className="form-text text-mutated">{info}</small>)}
            {error && (<div className="invalid-feedback"> {error} </div>)}
        </div>
    )
}

TextFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    info: PropTypes.string,
    disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
    type: 'text'
};

export default TextFieldGroup;
