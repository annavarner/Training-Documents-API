const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require("./db/connect");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { auth, requiresAuth } = require('express-openid-connect');

app
  .use(bodyParser.json())
  .use("/api-docs", swaggerUi.serve)
  .use("/api-docs", swaggerUi.setup(swaggerDocument))
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Reqested-With, Content-Type, Accept, Z-Key",
    );
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    );
    next();
  })
  .use(cors())
  .use("/", require("./routes"));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get('/paneldocs', requiresAuth())


process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`,
  );
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(process.env.port || 3000);
    console.log("MongoDb is connected");
    console.log(`Connected to DB. Web Server is listening on port ${port}`);
  }
});
