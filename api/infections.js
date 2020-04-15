const express = require('express');
const router = express.Router();
const passport = require('passport');

const Infection = require('../model/Infection');
const City = require('../model/City');
const isEmpty = require('../helpers/isEmpty');
const HealthProfessional = require('../model/HealthProfessional');

// 1. create a case
// This will be called from a web page which will listen for ids and create a new infected user record
router.post('/infectedId', passport.authenticate('jwt', { session: false }), (req, res) => {
    let { infectedId, status, firstName, lastName } = req.body;

    if (!isEmpty(infectedId) && infectedId.trim().length > 0) {
        Infection.findOne({ uniqueId: infectedId }) 
            .then(userFound => {
                
                if (!userFound) {
                    console.log('new')
                    const newInfection = new Infection({
                        uniqueId: infectedId,
                        healthProfessional: req.user.id,
                        coords: [],
                        firstName,
                        lastName,
                        status
                    });

                    if (status == 'infected' && !newInfection.dateInfected) {
                        newInfection.dateInfected = Date.now()
                    } else if (status == 'tested' && !newInfection.dateTested) {
                        newInfection.dateTested = Date.now()
                    }
            
                    newInfection.save()
                        .then(ins => {
                            HealthProfessional.findById(req.user.id).then(doc => {
                                doc.infections.push(ins._id);
                                doc.save();
                            })
                            res.status(200).json({ success: true });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json({ infectedId: `User already added as status` })
                        })
               
                } else {
                    userFound.status = status;

                    if (status == 'infected' && !userFound.dateInfected) {
                        userFound.dateInfected = Date.now()
                    } else if (status == 'tested' && !userFound.dateTested) {
                        userFound.dateTested = Date.now()
                    }
            
                    userFound.save()
                        .then(() => {
                            res.status(200).json({ success: true });
                        })
                        .catch(err => res.status(400).json({ infectedId: `User already added as ${status}` } ))

                }

            }).catch(err => {
                console.log(err);
                return res.status(400).json({ infectedId: 'Could not add infected ID' });
            })
        
    } else {
        res.status(400).json({ infectedId: 'Please enter a valid ID' })
    }
});

// 2. get all confirmed cases that need locations sent
router.get('/casesWithoutCoords', (req, res) => {
    Infection.find({ coords: { $eq: [] }, status: { $eq: 'infected' } })
        .then(infections => {
            res.status(200).json({ success: true, infections })
        })
        .catch(err => res.status(400).json({ err }))
});


// Add infected user location, this will be called from mobile app to send infected user locations
router.post('/', (req, res) => {
    let { uniqueId, coords, city } = req.body;
    console.log(uniqueId)
    console.log(coords)

    if (!isEmpty(coords) && coords.length > 0) {
        Infection.findOne({ uniqueId })
            .then(infection => {
                if (infection) {
                    infection.coords = coords;
                    if (!infection.city)
                        infection.city = city;
                    // infection.infectedTimes = infection.infectedTimes ? infection.infectedTimes + 1 : 1;
                    infection.save()
                        .then(() => {
                            City.findOne({ name: infection.city })
                                .then(foundCity => {
                                    if (foundCity) {
                                        console.log('city found')
                                        foundCity.infections.push(infection._id);
                                        foundCity.save();
                                    } else {
                                        const newCity = new City({
                                            name: city
                                        });
                                        console.log('new city')

                                        newCity.infections.push(infection._id);
                                        newCity.save();
                                    }
                                    res.status(200).json({ success: true });
                                })
                        })
                        .catch(err => res.status(400).json({ err }))
                } else {
                    console.log('id not found');
                    res.status(400).json({ err: "Could not find Id" })
                }

            }).catch(err => res.status(400).json({ err: 'Failed finding user data' }))
    } else {
        res.status(400).json({ success: false })
    }
});

// Return all infections, confirmed and tested
router.get('/', (req, res) => {
    Infection.find()
        .then(infections => {
            res.status(200).json({ success: true, infections })
        })
        .catch(err => res.status(400).json({ err }))
});


// Return all infections done by a doctor
router.get('/infectionsTestedByMe', passport.authenticate('jwt', { session: false }), (req, res) => {
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


router.post('/contact_tracing', (req, res) => {
    let { infectedId, otherUser, date, coords } = req.body;

    Infection.findOne({ uniqueId: infectedId })
        .then(infected => {
            const newInfection = new Infection({
                uniqueId: otherUser,
                parentContact: [infected._id],
                status: 'crossedPaths'
            })
            newInfection.save()
                .then(nInf => {
                    infected.contacts.push(nInf._id);
                    infected.save()
                        .then(() => res.json(200).json({success: true}))
                        .catch(err => res.status(400).json({ err }))
                })
                .catch(err => {
                    console.log(err);
                    Infection.findOne({ uniqueId: otherUser })
                        .then(other => {
                            if (other.status != 'infected') {
                                if (!other.parentContact.includes(infected._id)) {
                                    other.parentContact.push(infected._id);
                                    infected.contacts.push(other._id);
                                    infected.save()
                                    other.save().then(() => res.json({success: true }))
                                } else {
                                    res.json({ msg: 'Already added as contact' })
                                }
                            }
                        })
                })
        })
        .catch(err => res.status(400).json({ err: 'Cannot find infected person' }))
})


// Return all confirmed cases by city
router.get('/:city', (req, res) => {
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
