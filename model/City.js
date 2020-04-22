const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CitySchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    infections: [
        {
          type: Schema.Types.ObjectId,
          ref: 'users'
        }
    ]
});

module.exports = City = mongoose.model('cities', CitySchema);