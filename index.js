require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || process.argv[2] || 8080;

const remindersRouter = require('./routes/reminders');

app.use(cors({
    origin: process.env.CLIENT_URL
  }));
  
app.use(express.json());
app.use(express.static('./public'));

app.use((req, res, next) => {
  console.log('Request: ', req.ip, req.path);
  next();
});

app.use('/reminders', remindersRouter);

app.listen(port, () => console.log(`Listening on ${port}`));