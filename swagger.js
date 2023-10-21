const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Training Documents API",
    description:
      "An API to list & manage alarm panel training/reference documents built for CSE341",
  },
  host: "training-docs.onrender.com",
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/index.js", "./routes/paneldocs.js"];

swaggerAutogen(outputFile, routes, doc);
