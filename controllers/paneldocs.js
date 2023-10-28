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
  try {
    //   const result = await idSchema.validateAsync(req.params.id);
    // } catch (err) {}
    const docId = new ObjectId(req.params.id);
    if (!docId) {
      res.status(400).send({ message: 'Document ID cannot be empty!' });
      return;
    }
    console.log(docId);
    const response = await mongodb
      .getDb()
      .db("trainingdocs")
      .collection("paneldocs")
      .findOne({ _id: docId });
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(response);
  }
  catch (err) {
    res.status(500).json(err);
  }
};

const createDocument = async (req, res) => {
  try {
    console.log(req.params.id);
    //const result = await docSchema.validateAsync(req.params.id);
    //console.log([req.params]);
    const document = {
      title: req.body.title,
      category: req.body.category,
      manufacturer: req.body.manufacturer,
      model: req.body.model,
      docType: req.body.docType,
      description: req.body.description,
      URL: req.body.URL,
      dateAdded: req.body.dateAdded,
      user: req.body.user
    }
    const response = await mongodb
      .getDb()
      .db("trainingdocs")
      .collection("paneldocs")
      .insertOne(document);
    if (response.acknowledged) {
      res.status(201).json(document);
      console.log("document added");
    } else {
      res
        .status(500)
        .json(response.error || "Errors occured while creating the document");
    }
  }
  catch (err) {
    res.status(500).json(err)
  }
};

const updateDocument = async (req, res) => {
  try {
    //const result = await idSchema.validateAsync(req.params.id);
    const docId = new ObjectId(req.params.id);
    if (!docId) {
      res.status(400).send({ message: 'Document ID cannot be empty!' });
      return;
    }
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
    console.log(document);
  }
  catch (err) {
    res.status(500).json(err);
  }
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
  try {
    //const result = await idSchema.validateAsync(req.params.id);
    const docId = new ObjectId(req.params.id);

    console.log(docId);
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
  } catch (err) {
    res.status(500).json(err);
  };

  module.exports = {
    getAll,
    getSingle,
    createDocument,
    updateDocument,
    deleteDocument,
  }
};
