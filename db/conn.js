const mongoose = require('mongoose');

const url = process.env.DATABASE;

mongoose
.connect(url)
.then(() => {
  console.log(`Connection Successful`);
})
.catch((error) => {
  console.log(error);
});