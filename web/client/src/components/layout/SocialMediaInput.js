
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import RemoveButton from '../layout/RemoveButton';

const SocialMediaInput = ({
                      name,
                      value,
                      error,
                      parentClass,
                      onChange,
                      onRemove,
                      icon,
                      placeholder,
                      onTabPress
                  }) => {
    return (
        <div className={`${parentClass ? parentClass : 'form-group'}`}>
            <div className="input-group-prepend">
                <span className="input-group-text">
                    { icon }
                </span>
            </div>
            <input
                className={classnames(`form-control form-control-lg `, {
                    'is-invalid': error
                })}
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={onChange}
                onKeyDown={onTabPress ? onTabPress : null}
            />
            <RemoveButton condition={onRemove} onClick={onRemove} />
            {error && (<div className="invalid-feedback"> {error} </div>)}

        </div>
    )
}

SocialMediaInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
};

SocialMediaInput.defaultProps = {
    type: 'text'
};

export default SocialMediaInput;
