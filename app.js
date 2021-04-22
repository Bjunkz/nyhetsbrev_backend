var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb+srv://admin:NPMu6cRXDZhZ5zb@nyhetsbrev.oxnvr.mongodb.net/nyhetsbrev?retryWrites=true&w=majority", {
        useUnifiedTopology: true
})
.then(client => {
    console.log("vi är uppkopplade mot databasen")
    
    const db = client.db("newsletter")
    app.locals.db = db;
})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
