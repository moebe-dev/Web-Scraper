"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/test", (req, res) => {
  res.json({ test: "/test" });
});

router.get("/:articleId", (req, res) => {
  db.Article.findOne({
    _id: req.params.articleId
  })
    .populate("comments")
    .then(article => {
      res.render("comment", {
        article: article,
      });
    })
    .catch(err => res.send(err));
});

router.post("/:articleId", (req, res) => {
  new db.Comment({
    title: req.body.title,
    body: req.body.comment,
    article: req.params.articleId
  })
    .save()
    .then(comment => {
      db.Article.findOne({
        _id: comment.article
      })
        .then(article => {
          article.comments.push(comment._id);
          article
            .save()
            .then(article => {
              res.redirect("/comment/" + comment.article);
            })
            .catch(err => res.send(err));
        })
        .catch(err => res.send(err));
    });
});

router.delete("/:commentId", (req, res) => {
  db.Comment.findOneAndDelete({
    _id: req.params.commentId
  })
    .then(comment => {
      db.Article.findOneAndUpdate({
        _id: comment.article
      }, {
        $pull: { comments: comment._id }
      }, {
        returnNewDocument: true
      })
        .populate("comments")
        .then(article => {
          res.render("comment", {
            article: article,
          });
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
});

module.exports = router;
