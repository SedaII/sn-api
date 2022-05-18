const express = require("express");
const db = require("./config/db");
const rateLimit = require("express-rate-limit");
const expressSession = require("express-session");
const SessionStore = require("express-session-sequelize")(expressSession.Store);
require("dotenv").config();

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const path = require("path");

const sequelizeSessionStore = new SessionStore({
	db: db
});

const app = express();

try {
  if(false) {
    db.drop()
    .then(console.log("All tables dropped"));
  }
  db.authenticate()
  .then(console.log("Connection has been established successfully."));
  db.sync()
  .then(console.log("All models were synchronized successfully."));
} catch (error) {
  console.error("Unable to connect to the database:", error);
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Trop de requête envoyé, veuillez attendre quelques minutes.",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(express.json(), limiter);

app.use(expressSession({
	secret: process.env.SESSION_SECRET,
	store: sequelizeSessionStore,
	resave: false,
	saveUninitialized: false,
  cookie: {
    sameSite: "strict"
  }
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.use("/images", express.static(path.resolve(__dirname) + "/images"));

app.use("/", (req, res) => res.status(200).json({message: "Serveur en marche !"}));


module.exports = app;