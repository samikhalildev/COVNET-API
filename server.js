const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path')
const passport = require('passport');

const app = express();

const authApi = require('./api/auth');
const infectionsApi = require('./api/infections');

let web_path = path.join(__dirname, 'web')

// DB
const { database, port } = require('./config/config');

// Connect to MongoDB
mongoose
  .connect(database, { useNewUrlParser: true })
  .then(() => console.log('Mongodb connected'))
  .catch(err => console.log('Mongodb error:', err));


// Body parser middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Routing
app.get('/', (req, res) => {
    if (req.hostname.includes('heroku')) {
        console.log('hostname', req.hostname);
        res.redirect('https://covnet.tech/');
    } else {
        res.sendFile(path.join(web_path, 'landing.html'))
    }
})

// app.get('/portal', (req, res) => {
//     res.sendFile(path.join(web_path, 'SubmitCase.html'))
// })

app.use('/api/auth', authApi);
app.use('/api/infections', infectionsApi);


// Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {

// Set static folder
app.use(express.static(path.join(web_path, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(web_path, 'client', 'build', 'index.html'));
});
// }
  
app.listen(port, () => console.log(`Server running on ${port}`));