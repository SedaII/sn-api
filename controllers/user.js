const bcrypt = require("bcrypt");
const { User } = require("../config/db").models;
const { isEmailValid } = require("../utils/isEmailValid");
const { isPasswordValid } = require("../utils/isPasswordValid");
require("dotenv").config();

exports.signUp = (req, res, next) => {
  //check email & password (password validator) validation
  if(!isEmailValid(req.body.email)) {
    return res.status(400).json({ message: "Veuillez indiquer un email valide. Ex : nom@email.fr" });
  }

  if(!isPasswordValid(req.body.password)) {
    return res.status(400).json({ message: "Veuillez indiquer un mot de passe valide. Il doit faire minimum 8 caractères, contenir une majuscule et un caractère spécial. Ex : @Jaimeb1manger" });
  }
  
  // Crypte le mot de passe
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    User.create({email: req.body.email, password: hash})
    .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
    .catch(error => res.status(400).json(error.name === "SequelizeUniqueConstraintError" ? {message: "Email déja utilisée"} : {error}));
  })
  .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
  .then(user => {
    if(!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé !" });
    }

    bcrypt.compare(req.body.password, user.password)
    .then(isValid => {
      if(!isValid) {
        console.log("not valid");
        return res.status(401).json({ message: "Mot de passe incorrect !" });
      }

      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      return res.status(200).json({ message: "Vous êtes bien connecté", user: {id: user.id, isAdmin: user.isAdmin, firstname: user.firstname, lastname: user.lastname, job: user.job}});
    })
    .catch(error => res.status(500).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
        console.log(err)
        return next(err)
      }
      return res.status(200).json({ message: "Vous êtes bien déconnecté" });
});
};

exports.deleteAccount = (req, res, next) => {
  User.destroy({
    where: {
      id: req.session.userId
    }
  })
  .then(() => res.status(200).json({ message: "Compte supprimé !" }))
  .catch((error) => res.status(400).json({ error }));
};

exports.getProfil = (req, res, next) => {
  User.findOne(
    {
    where: {
      id: req.session.userId
    },
    attributes: ["id", "firstname", "lastname", "fullname", "job"]
  })
  .then((profil) => res.status(200).json({ profil }))
  .catch((error) => res.status(400).json({error}));
};

exports.updateProfil = (req, res, next) => {
  User.update(
    {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      job: req.body.job
    },
    {
    where: {
      id: req.session.userId
    }
  })
  .then(() => res.status(200).json({ message: "Profil mis à jour !" }))
  .catch((error) => res.status(400).json({error}));
};