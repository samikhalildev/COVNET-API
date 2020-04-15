import isEmpty from './is-empty';

const validateLogin = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.occupation = !isEmpty(data.occupation) ? data.occupation : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.pin = !isEmpty(data.pin) ? data.pin : '';
  data.city = !isEmpty(data.city) ? data.city : '';
  

  if (isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else if (!data.email.includes('health')) {
    errors.email = 'You must be a health provider to access the system'
  }

  if (isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (isEmpty(data.city)) {
    errors.city = 'City field is required';
  }

  if (isEmpty(data.occupation)) {
    errors.occupation = 'Occupation field is required';
  }

  if (isEmpty(data.pin)) {
    errors.pin = 'Pin field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateLogin;