const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
    poolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
};

mongoose.connect(process.env.DB, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.listen(process.env.APP_PORT, () => {
    console.log('running');
});

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    process.exit(1);
});

module.exports = app;
