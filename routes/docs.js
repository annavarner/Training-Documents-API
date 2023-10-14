const express = require("express");
const router = express.Router();
// const swaggerDocument = require('../swagger-output.json');
// const swaggerUi = require('swagger-ui-express');

const docsController = require("../controllers/docs.js");

router.get("/", docsController.getAll);

router.get("/:id", docsController.getSingle);

router.post("/", docsController.createDocument);

router.put("/:id", docsController.updateDocument);

router.delete("/:id", docsController.deleteDocument);

// router.use('/api-docs', swaggerUi.serve);
// router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;
