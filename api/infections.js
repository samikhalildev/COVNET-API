const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../model/User');
const City = require('../model/City');
const isEmpty = require('../helpers/isEmpty');
const HealthProfessional = require('../model/HealthProfessional');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/new-user', (req, res) => {
    const newUser = new User({})
    newUser.save()
        .then(user => {
            res.status(200).json({ success: true, userId: user._id })
        })
        .catch(err => {
            console.log(err)
            res.status(400).json({ err })
        })
});

// 1. create a case
// This will be called from a web page which will listen for ids and create a new infected user record
router.post('/confirmed-case', passport.authenticate('jwt', { session: false }), (req, res) => {
    let { infectedId, status, firstName, lastName } = req.body;
    
    if (!isEmpty(infectedId) && infectedId.trim().length > 0 && ObjectId.isValid(infectedId)) {
        User.findById(infectedId) 
            .then(user => {

                if (user.firstName == firstName && user.lastName == lastName && user.status == status)
                    return res.status(400).json({ infectedId: 'User already added' })
        
                if (!isEmpty(firstName))
                    user.firstName = firstName

                if (!isEmpty(lastName))
                    user.lastName = lastName

                user.coords = []
                user.healthProfessional = req.user.id
                user.status = status

                if (status == 'infected' && !user.dateInfected) {
                    user.dateInfected = Date.now()
                } else if (status == 'tested' && !user.dateTested) {
                    user.dateTested = Date.now()
                }
        
                user.save()
                    .then(() => {
                        HealthProfessional.findById(req.user.id).then(doc => {
                            if (!doc.infections.includes(infectedId)) {
                                doc.infections.push(infectedId);
                                doc.save()
                                    .then(() => res.status(200).json({ success: true }))
                                    .catch(() => res.status(200).json({ success: true }))
                            } else {
                                res.status(200).json({ success: true })
                            }
                        })
                    })
                    .catch(err => console.log(err))

            }).catch(err => {
                console.log(err);
                return res.status(400).json({ infectedId: 'Invalid user ID' });
            })
        
    } else {
        res.status(400).json({ infectedId: 'Please enter a valid user ID' })
    }
});

// 2. get all confirmed cases that need locations sent
router.get('/new-cases', (req, res) => {
    User.find({ coords: { $eq: [] }, status: { $eq: 'infected' } })
        .then(users => {
            res.status(200).json({ success: true, infections: users })
        })
        .catch(err => res.status(400).json({ err }))
});

// Add infected user location, this will be called from mobile app to send infected user locations
router.post('/infected/locations', (req, res) => {
    let { userId, coords, city } = req.body;
    console.log(userId)
    console.log(coords)
    let alreadyAddedToCity = false;

    if (!isEmpty(coords) && coords.length > 0 && ObjectId.isValid(userId)) {
        User.findById(userId)
            .then(user => {
                if (user) {
                    if (user.coords && user.coords.length)
                        alreadyAddedToCity = true;

                    user.coords = coords;

                    if (!user.city)
                        user.city = city;
                    // infection.infectedTimes = infection.infectedTimes ? infection.infectedTimes + 1 : 1;
                    user.save()
                        .then(() => {
                            if (!alreadyAddedToCity) {
                                City.findOne({ name: user.city })
                                    .then(foundCity => {
                                        if (foundCity) {
                                            console.log('city found')
                                            if (!foundCity.infections.includes(userId)) {
                                                foundCity.infections.push(userId);
                                                foundCity.save();
                                            }
                                        } else {
                                            const newCity = new City({
                                                name: city
                                            });
                                            console.log('new city')

                                            newCity.infections.push(userId);
                                            newCity.save();
                                        }
                                        res.status(200).json({ success: true });
                                    })
                            } else {
                                res.status(200).json({ success: true });
                            }
                        })
                        .catch(err => res.status(400).json({ err }))
                } else {
                    console.log('Invalid ID');
                    res.status(400).json({ err: "Invalid ID" })
                }

            }).catch(err => res.status(400).json({ err: 'Invalid ID' }))
    } else {
        res.status(400).json({ success: false, err: 'Invalid user ID' })
    }
});

// // Return all infections, confirmed and tested
// router.get('/', (req, res) => {
//     Infection.find()
//         .then(infections => {
//             res.status(200).json({ success: true, infections })
//         })
//         .catch(err => res.status(400).json({ err }))
// });

// Return all infections done by a doctor
router.get('/tested-by-me', passport.authenticate('jwt', { session: false }), (req, res) => {
    HealthProfessional.findById(req.user.id) 
        .populate('infections')
        .populate('city')
        .then(doc => {
            res.status(200).json({ success: true, infections: doc.infections, city: doc.city.name })
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ err })
        })
});


// router.post('/contact_tracing', (req, res) => {
//     let { infectedId, otherUser, date, coords } = req.body;

//     User.findById(userId)
//         .then(infected => {
//             const newUser = new User({
//                 userId: otherUser,
//                 parentContact: [infected._id],
//                 status: 'crossedPaths'
//             })
//             newUser.save()
//                 .then(nInf => {
//                     infected.contacts.push(nInf._id);
//                     infected.save()
//                         .then(() => res.json(200).json({success: true}))
//                         .catch(err => res.status(400).json({ err }))
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     Infection.findById(otherUser)
//                         .then(other => {
//                             if (other.status != 'infected') {
//                                 if (!other.parentContact.includes(infected._id)) {
//                                     other.parentContact.push(infected._id);
//                                     infected.contacts.push(other._id);
//                                     infected.save()
//                                     other.save().then(() => res.json({success: true }))
//                                 } else {
//                                     res.json({ msg: 'Already added as contact' })
//                                 }
//                             }
//                         })
//                 })
//         })
//         .catch(err => res.status(400).json({ err: 'Cannot find infected person' }))
// })


// Return all confirmed cases by city
router.get('/infected/:city', (req, res) => {
    let { city } = req.params;

    if (city.length > 1)
        city = city.substring(0, 1).toUpperCase() + city.substring(1).toLowerCase();

    console.log(city);

    City.findOne({ name: city })
        .populate({
            path: 'infections',
            match: { 'status': 'infected' },
        })
        .then(city => {
            console.log(city.infections)
            res.status(200).json({ success: true, infections: city.infections })
        })
        .catch(err => res.status(400).json({ err: 'City not found' }))
});



module.exports = router;
