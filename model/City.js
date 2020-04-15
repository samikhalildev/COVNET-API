const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CitySchema = new Schema({

    name: {
        type: String,
        required: true
    },

    infections: [
        {
          type: Schema.Types.ObjectId,
          ref: 'infections'
        }
    ]
});

module.exports = City = mongoose.model('cities', CitySchema);