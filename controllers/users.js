/* const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

//get all users from database
const getAll = async (req, res) => {
  const result = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("users")
    .find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};
//get one user from database
const getSingle = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("users")
    .findOne({ _id: userId });
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(result);
};

const createUser = async (req, res) => {
  console.log(req.params.id);
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
    authLevel: req.body.authLevel,
  };
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("users")
    .insertOne(user);
  if (response.acknowledged) {
    res.status(201).json(response);
    console.log("user added");
  } else {
    res
      .status(500)
      .json(response.error || "Errors occured while creating the user");
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
    authLevel: req.body.authLevel,
  };
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("users")
    .replaceOne({ _id: userId }, user);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while updating the user.");
  }
};

const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db("trainingdocs")
    .collection("users")
    .deleteOne({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || "An error occurred while deleting the user");
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
 */