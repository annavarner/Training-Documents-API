const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require("./db/connect");

app
  .use(bodyParser.json())
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
  .use("/", require("./routes"));
//.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(process.env.port || 3000);
    console.log("MongoDb is connected");
    console.log(`Connected to DB. Web Server is listening on port ${port}`);
  }
});
