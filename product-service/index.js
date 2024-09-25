require('dotenv').config();

const express = require("express");
const cors = require("cors");
const productsRout = require("./routes/products");
const connection = require('./dbconnection/dbconnection');
const helmet = require("helmet");
//express app
const app = express();
// Use Helmet middleware to secure your app
app.use(helmet());
//midleware
app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//   console.log(req.path, res.method);
//   next();
// });

//routes
app.use("/api/products", productsRout);

//connect to DB
connection.once('open',()=>{
    console.log('Product Service DB connected successfully!!');
});

app.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});

//storage
