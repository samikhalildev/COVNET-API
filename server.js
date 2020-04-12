const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')

const app = express();

const infections_api = require('./api/infectionsAPI');

let portal_path = path.join(__dirname, 'web')
app.use('/portal', express.static(portal_path))

// Body parser middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db_URI = process.env.MONGODB_URI || "mongodb://localhost/covid";

mongoose.connect(db_URI, { useNewUrlParser: true })
    .then(() => console.log('Mongodb connected'))
    .catch(err => console.log('Mongodb error:', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(portal_path, 'landing.html'))
})

app.get('/portal', (req, res) => {
    res.sendFile(path.join(portal_path, 'SubmitCase.html'))
})

app.use('/api/infections', infections_api);

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => console.log(`Server running on ${app.get('port')}`));