const express = require("express");
const path = require("path");
const cors = require("cors");
const { errorHandler } = require("./lib/errorHandler");
const corsOptions = require("./lib/corsOptions");
const helmet = require("helmet");

const app = express();

app.use(cors(corsOptions));
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("Bypass-Tunnel-Reminder", "Yes");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/static");
});

app.use(errorHandler);

module.exports = app;
