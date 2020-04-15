const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateLogin = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.occupation = !isEmpty(data.occupation) ? data.occupation : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.pin = !isEmpty(data.pin) ? data.pin : '';
  data.city = !isEmpty(data.city) ? data.city : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isLength(data.pin, { min: 4, max: 30 })) {
    errors.pin = 'Pin must be at least 4 characters';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.pin)) {
    errors.pin = 'Pin field is required';
  }

  if (data.register) {

    if (Validator.isEmpty(data.name)) {
      errors.name = 'Name field is required';
    }

    if (Validator.isEmpty(data.city)) {
      errors.city = 'City field is required';
    }

    if (Validator.isEmpty(data.occupation)) {
      errors.occupation = 'Occupation field is required';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
