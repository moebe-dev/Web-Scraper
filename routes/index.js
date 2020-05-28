"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");
const scraper = require("./api/scrape");

router.get("/test", (req, res) => {
  res.json({ test: "/test" });
});

router.get("/", (req, res) => {
  db.Article.find({}).sort({ createdAt: -1 })
    .then(result => {
      console.log(`Article count: ${result.length}`);
      res.render("index", { article: result });
    })
    .catch(err => {
      res.render("index", { article: "failed to get articles" });
    });
});

router.get("/commented", (req, res) => {
  db.Article.find({
    comments: {
      $exists: true,
      $ne: []
    }
  }).sort({ createdAt: -1 })
    .then(result => {
      console.log(`Article count(commented): ${result.length}`);
      res.render("index", { article: result });
    })
    .catch(err => {
      res.render("index", { article: "failed to get articles" });
    });
});

function waitAndReloadRoot(res) {
  res.redirect('/');
}

router.get("/scrape", (req, res) => {
  scraper()
    .then(articleInfo => {
      res.redirect('/');
    })
    .catch(error => {
      res.json(error);
    });
});

module.exports = router;
