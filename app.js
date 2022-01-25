const express = require("express");   //framework, basically used to specify what fx.n is called for a particular http methods(GET, POST, PUT, DELETE)
const dotenv = require('dotenv');   //automatically loads env variables
const app = express();      
const bodyParser = require('body-parser');    //send data through http requests

dotenv.config({path: './config/config.env'});
require('./db/conn'); 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", require('./routes/authentication'));
app.use(require('./routes/user'));

app.use(require('./routes/common'));


const port = process.env.PORT;

const middleware = (req, res, next) => {
  console.log(`This is a middleware`);
  next();
};

app.get("/about", middleware, (req, res) => {
  res.send("This is the about page");
});

app.get("/contact", (req, res) => {
  res.send("This is the contact page");
});

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
