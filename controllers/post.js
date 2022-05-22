const { Comment, Post, User } = require("../config/db").models;
const fs = require("fs");

exports.create = async (req, res, next) => {
  Post.create({
    author_name: req.body.author_name,
    title: req.body.title,
    image: req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : req.body.image,
    UserId: req.session.userId,
    description: req.body.description
  })
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllPosts = async (req, res, next) => {
  Post.findAll({
    include: [
      {
        model: Comment,
        as: "comments",
        attributes: ["id", "content", "createdAt", "UserId"],
        include: { model: User, as: "author", attributes: ["fullname", "firstname", "lastname", "id"] },
        limit: 2,
        order: [["createdAt", "DESC"]],
      },
      { model: User, as: "author", attributes: ["fullname", "firstname", "lastname", "id"] },
    ],
    order: [["createdAt", "DESC"]],
    attributes: ["id", "image", "title", "createdAt", "description"]
  })
    .then((posts) => res.status(200).json({ posts }))
    .catch((error) => res.status(400).json({ error }));
};

exports.delete = async (req, res, next) => {
  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (req.session.userId === post.UserId) {
    if(post.image) {
      const filename = post.image.split("/images/")[1];
      fs.unlink(`images/${filename}`, (error) => console.log(error));
    }
      Post.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then(() => res.status(201).json({ message: "Post supprimé !" }))
        .catch((error) => res.status(400).json({ error }));

  } else {
    return res
      .status(403)
      .json({ message: "You're not the author of the post" });
  }
};
