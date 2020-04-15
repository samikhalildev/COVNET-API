let DB_URI;

if (process.env.NODE_ENV === 'production') {
  DB_URI = process.env.MONGO_URI;
} else {
  DB_URI = 'mongodb://localhost/covnet';
}

module.exports = {
  port: process.env.PORT || 5000,
  database: DB_URI,
  secretOrKey: '#$k92jR324ew2131f2FL@$22'
};
