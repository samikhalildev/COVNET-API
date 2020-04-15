const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/config');
const passport = require('passport');
const HealthProfessional = require('../model/HealthProfessional');
const City = require('../model/City');
const validateLogin = require('../helpers/validateLogin');

router.post('/', (req, res) => {
  
  const { errors, isValid } = validateLogin(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  HealthProfessional.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // Check password
        bcrypt.compare(req.body.pin, user.pin).then(isMatch => {

          // User matched
          if (isMatch) {
            // Create JWT payload
            const payload = { id: user.id, name: user.name, email: user.email };

            // Create Token
            jwt.sign(payload, keys.secretOrKey, (err, token) => {
              if (err) throw err;

              user.logins = user.logins + 1
              user.save();

              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
            
          } else {
            errors.email = 'Incorrect details';
            return res.status(404).json(errors);
          }
        });

      } else {

        let { city } = req.body;
        city = city.substring(0, 1).toUpperCase() + city.substring(1);
        console.log(city);

        City.findOne({ name: city })
          .then(cityFound => {
            if (cityFound) {
              createUser(req, res, cityFound);

            } else {
              const newCity = new City({
                name: city
              });

              console.log('new city');

              newCity.save().then(city => {
                console.log(city._id);
                createUser(req, res, city);
              });
            }
          })
          .catch(err => {
            console.log('err', err);
          })

    }
  });
});

const createUser = (req, res, city) => {

  const newUser = new HealthProfessional({
    name: req.body.name,
    occupation: req.body.occupation,
    email: req.body.email,
    pin: req.body.pin,
    city: city._id
  });

  // Generate a hashed password and save user into db
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.pin, salt, (err, hash) => {

      if (err) throw err;
      newUser.pin = hash;
      newUser
        .save()
        .then(user => {
          //Create JWT payload
          const payload = { id: user.id, name: user.name, email: user.email };

          // Create Token
          jwt.sign(payload, keys.secretOrKey, (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          });
        })
        .catch(err => console.log(err));
    });
  });
}

// Protected route

/*  @route      GET api/users/current
    @desc       Return current user
    @access     Private
 */

router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
