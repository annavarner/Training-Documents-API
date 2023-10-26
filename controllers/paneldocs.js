const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const { docSchema } = require("../helpers/validation_schema");
const { idSchema } = require("../helpers/validation_schema");

//get all documents from database
const getAll = async (req, res) => {
  const result = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

//get one document from database
const getSingle = async (req, res) => {
  const result = await idSchema.validateAsync(req.params.id);
  const docId = new ObjectId(result);
  console.log(docId);
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .findOne({ _id: docId });
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(response);
    };

const createDocument = async (req, res) => {
  console.log(req.params.id);
  const document = {
    title: req.body.title,
    category: req.body.category,
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    docType: req.body.docType,
    description: req.body.description,
    URL: req.body.URL,
    dateAdded: req.body.dateAdded,
    user: req.body.user,
  };
  const result = await docSchema.validateAsync(document);
  console.log(result);
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .insertOne(result);
  if (response.acknowledged) {
    res.status(201).json(response);
    console.log("document added");
  } else {
    res
      .status(500)
      .json(response.error || "Errors occured while creating the document");
  }
};

const updateDocument = async (req, res) => {
  const docId = new ObjectId(req.params.id);
  const document = {
    title: req.body.title,
    category: req.body.category,
    manufacturer: req.body.manufacturer,
    model: req.body.model,
    doctype: req.body.docType,
    description: req.body.description,
    url: req.body.URL,
    date: req.body.dateAdded,
    user: req.body.user,
  };
  const result = await idSchema.validateAsync(document);
  console.log(result);
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .replaceOne({ _id: docId }, result);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the document.");
  }
};

const deleteDocument = async (req, res) => {
  const docId = new ObjectId(req.params.id);
  const result = await idSchema.validateAsync(docId);
  console.log(result);
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .deleteOne({ _id: result }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the document");
  }
};

module.exports = {
  getAll,
  getSingle,
  createDocument,
  updateDocument,
  deleteDocument,
};
