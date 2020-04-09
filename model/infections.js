const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const InfectionSchema = new Schema({
    
    uniqueId: {
        type: String,
        required: true,
        unique: true
    },

    coords: [
        {
            _id: false,
            latitude: {
                type: String
            },

            longitude: {
                type: String
            },

            timestamp: {
                type: String
            }
        }
    ],

    dateInfected: {
        type: Date
    },

    infectedTimes: {
        type: Number
    }
});

module.exports = Infection = mongoose.model('infections', InfectionSchema);