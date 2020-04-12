const express = require('express');
const router = express.Router();
const Infection = require('../model/infections');
const isEmpty = require('../helpers/isEmpty');

// Return all infected locations
router.get('/', (req, res) => {
    Infection.find()
        .then(infections => {
            res.status(200).json({ success: true, infections })
        })
        .catch(err => res.status(400).json({ err }))
});

// This will be called from a web page which will listen for ids and create a new infected user record
router.post('/infectedId', (req, res) => {
    let { infectedId } = req.body;

    if (!isEmpty(infectedId) && infectedId.trim().length > 0) {
        Infection.findOne({ uniqueId: infectedId }) 
            .then(found => {
                
                if (!found) {
                    const newInfection = new Infection({
                        uniqueId: infectedId,
                        coords: []
                    });
            
                    newInfection.save()
                        .then(() => res.status(200).json({ success: true }))
                        .catch(err => res.status(400).json({ err: 'User already added as infected' }))
                } else {
                    res.status(400).json({ err: 'User has already been added as infected' })
                }

            }).catch(err => {
                console.log(err);
                return res.status(400).json({ err: 'Could not add ID' });
            })
        
    } else {
        res.status(400).json({ err: 'Please enter a valid ID' })
    }
});


// Add infected user location, this will be called from mobile app to send infected user locations
router.post('/', (req, res) => {
    let { uniqueId, coords } = req.body;
    console.log(uniqueId)
    console.log(coords)

    if (!isEmpty(coords) && coords.length > 0) {
        Infection.findOne({ uniqueId })
            .then(infection => {
                if (infection) {
                    infection.coords = coords;
                    infection.dateInfected = Date.now();
                    infection.infectedTimes = infection.infectedTimes ? infection.infectedTimes + 1 : 1;
                    infection.save()
                    .then(() => res.status(200).json({ success: true }))
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

module.exports = router;
