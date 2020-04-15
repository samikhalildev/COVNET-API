const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const InfectionSchema = new Schema ({
    
    uniqueId: {
        type: String,
        required: true,
        unique: true
    },

    // infected, tested, crossedPaths
    status: {
        type: String
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

    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String
    },

    phone: {
        type: String
    },

    age: {
        type: Number
    },

    gender: {
        type: String
    },

    city: {
        type: String
    },

    dateTested: {
        type: Date
    },

    dateInfected: {
        type: Date
    },

    infectedTimes: {
        type: Number
    },

    healthProfessional: {
        type: Schema.Types.ObjectId,
        ref: 'healthprofessionals'
    },

    parentContact: [
        {
            type: Schema.Types.ObjectId,
            ref: 'infections'
        }
    ],
    
    contacts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'infections'
        }
    ]
});

module.exports = Infection = mongoose.model('infections', InfectionSchema);