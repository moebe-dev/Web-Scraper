const express = require("express");
const router = express.Router();
const db = require("../../models");

router.get("/test", (req, res) => {
  res.json({ test: "/api/article/test" });
});

router.get("/", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.get("/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.post("/:id", function (req, res) {
  db.Comment.create(req.body)
    .then(function (dbComment) {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        comment: dbComment._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

router.delete("/:id", function (req, res) {
  db.Article.deleteOne({
    _id: req.params.id
  })
    .then(result => {
      db.Comment.deleteMany({
        article: req.params.id
      })
        .then(delComments => {
          res.json(delComments);
        })
        .catch(commErr => res.json(commErr));
    })
    .catch(err => res.json(err));
});

module.exports = router;
