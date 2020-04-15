const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateLogin = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.age = !isEmpty(data.age) ? data.age : '';
  data.gender = !isEmpty(data.gender) ? data.gender : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.age)) {
    errors.age = 'Age field is required';
  }

  if (Number(data.age) < 1 || Number(data.age) > 120) {
    errors.age = 'Please enter a valid age';
  }

  if (Validator.isEmpty(data.gender)) {
    errors.gender = 'Gender field is required';
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Phone field is required';
  }

  if (!Validator.isLength(data.phone, { min: 4, max: 30 })) {
    errors.pin = 'Please enter a valid phone number';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
