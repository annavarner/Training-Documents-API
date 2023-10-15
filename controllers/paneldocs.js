const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

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
  const docId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .findOne({ _id: docId });
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(result);
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
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .insertOne(document);
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
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .replaceOne({ _id: docId }, document);
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
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("paneldocs")
    .deleteOne({ _id: docId }, true);
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
