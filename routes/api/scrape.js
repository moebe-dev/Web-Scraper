"use strict";

const db = require("../../models");

const axios = require("axios");
const cheerio = require("cheerio");

const EETimesURL = "https://www.eetimes.com/";

const UA = [
  'Wget/1.19.4 (linux-gnu)',
  'Googlebot/2.1 (+http://www.google.com/bot.html)'
];

function randomIndexForUA() {
  return Math.floor(Math.random() * 10 ** Math.ceil(Math.log10(UA.length))) % UA.length;
}

function setUserAgent() {
  axios.defaults.headers.common['User-Agent'] = UA[randomIndexForUA()];
}

function scrapeEETimes(url = EETimesURL) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      timeout: 29000
    })
      .then(response => {
        const articleInfo = collectEETimesNews(response.data);
        console.log(`Found ${articleInfo.length} articles`);
        if (articleInfo.length > 0) {
          addArticles(articleInfo);
          resolve(articleInfo);
        } else {
          resolve("No articles found");
        }
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

function collectEETimesNews(data) {
  let articles = [];
  const $ = cheerio.load(data);

  const contexts = [$("#newsTop .container .segment-main .columns .block"),
  $("#newsTop .container .segment-main #paginateMainDiv .block")];

  contexts.forEach(context => {
    context.each(function (i, element) {
      articles.push({
        headline: $(".card .card-body .card-title a", element).text(),
        summary: $(".card .card-body .card-text", element).text(),
        link: $(".card figure a", element).attr("href"),
        imageURL: $(".card figure a img", element).attr("src")
      });
    });
  });

  return articles;
}

function addArticles(articles) {
  articles.forEach(item => {
    db.Article.findOneAndUpdate({
      link: item.link
    },
      item, {
      upsert: true,
      returnNewDocument: true
    })
      .then(doc => {
        return doc;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  });
}

module.exports = scrapeEETimes;
