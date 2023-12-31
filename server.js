const express = require('express');
const app = express();
const port = 8080;
const middleware = require('./middleware');
const path = require("path")
const bodyParser = require('body-parser')
const mongoose = require("./database");
const session = require("express-session")

const server = app.listen(port, () => console.log("Listening on " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: "coins",
    resave: false,
    saveUninitialized: false
}));

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');
const remitRoute = require('./routes/remitRouters')

// Api routes
const logApiRoute = require('./routes/api/log');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use('/remit', remitRoute);

app.use('/api/log', logApiRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "홈",
        userLoggedIn: req.session.user,
    }
    res.status(200).render("home", payload);
});
