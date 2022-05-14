const { Comment, User } = require("../config/db").models;

exports.create = async (req, res, next) => {
  console.log(req.body.post_id);
  Comment.create({
    author_name: req.body.author_name,
    content: req.body.content,
    PostId: req.body.post_id,
    UserId: req.session.userId,
  })
    .then(() => res.status(201).json({ message: "Commentaire créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getCommentsByPost = async (req, res, next) => {
  Comment.findAll({
    where: { PostId: req.params.id },
    include: {
      model: User,
      as: "author",
      attributes: ["fullname", "firstname", "lastname"],
    },
    attributes: ["id", "content", "createdAt"],
  })
    .then((comments) => res.status(200).json({ comments }))
    .catch((error) => res.status(400).json({ error }));
};

exports.delete = async (req, res, next) => {
  const comment = await Comment.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (req.session.userId === comment.UserId) {
    comment
      .destroy({
        where: {
          id: req.params.id,
        },
      })
      .then(() => res.status(201).json({ message: "Commentaire supprimé !" }))
      .catch((error) => res.status(400).json({ error }));
  } else {
    return res
      .status(401)
      .json({ message: "Vous n'êtes pas l'auteur du commentaire" });
  }
};
