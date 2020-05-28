$(document).on("click", ".delete-comment", function () {
  const commentId = $(this).attr("comment-id");

  $.ajax({
    method: "DELETE",
    url: "/comment/" + commentId
  })
    .then(function (data) {
      console.log(data);
      window.location.reload();
    });
});

$(document).on("click", ".delete-article", function () {
  const articleId = $(this).attr("article-id");

  $.ajax({
    method: "DELETE",
    url: "/api/articles/" + articleId
  })
    .then(function (data) {
      console.log(data);
      window.location.reload();
    });
});
