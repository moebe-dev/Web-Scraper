"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  title: {
    type: String,
    default: null
  },

  body: {
    type: String,
    required: true
  },

  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
