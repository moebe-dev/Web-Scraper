"use strict";

const express = require("express");
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const index = require("./routes/index");
const comment = require("./routes/comment");
const articles = require("./routes/api/articles");

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use("/", index);
app.use("/comment", comment);
app.use("/api/articles", articles);

mongoose.connect(db.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => console.log(`Connected to MongoDB ${db.MONGODB_URI}`))
  .catch(err => console.log(err));

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
