const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const HealthProfessionalSchema = new Schema({
    
    name: {
        type: String,
        required: true,
        trim: true
    },
      
    occupation: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    pin: {
        type: String,
        required: true
    },

    dateRegistered: {
        type: Date,
        default: Date.now
    },

    logins: {
        type: Number,
        default: 1
    },

    city: {
        type: Schema.Types.ObjectId,
        ref: 'cities'
    },
    
    infections: [
        {
          type: Schema.Types.ObjectId,
          ref: 'users'
        }
    ]
});

module.exports = HealthProfessional = mongoose.model('healthProfessional', HealthProfessionalSchema);