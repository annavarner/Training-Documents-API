const express = require("express");
const router = express.Router();
const swaggerDocument = require('../swagger-output.json');
const swaggerUi = require('swagger-ui-express');

router
    .use("/api-docs", swaggerUi.serve)
    .get("/api-docs", swaggerUi.setup(swaggerDocument));

const docsController = require("../controllers/paneldocs");

router.get("/", docsController.getAll);

router.get("/:id", docsController.getSingle);

router.post("/", docsController.createDocument);

router.put("/:id", docsController.updateDocument);

router.delete("/:id", docsController.deleteDocument);

module.exports = router;
