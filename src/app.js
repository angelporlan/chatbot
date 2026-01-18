const express = require('express');
const cors = require('cors');
const config = require('./config');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.use('/api', chatRoutes);

app.use(errorHandler);

module.exports = app;
