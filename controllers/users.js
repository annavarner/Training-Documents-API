const mongodb = require("../db/connect");
const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(process.env.MONGODB_URI);
//const { auth, requiresAuth } = require('express-openid-connect');
//const client = new MongoClient(mongodb);

//app.get('/profile', requiresAuth(), (req, res) => {
//  res.send(JSON.stringify(req.oidc.user));
//});


const getAllUsers = async (req, res) => {
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
const getSingleUser = async (req, res) => {
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
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};

/* function login(email, password, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient(process.env.MONGODB_URI);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('trainingdocs');
    const users = db.collection('users');

    users.findOne({ email: email }, function (err, user) {
      if (err || !user) {
        client.close();
        return callback(err || new WrongUsernameOrPasswordError(email));
      }

      bcrypt.compare(password, user.password, function (err, isValid) {
        client.close();

        if (err || !isValid) return callback(err || new WrongUsernameOrPasswordError(email));

        return callback(null, {
            user_id: user._id.toString(),
            nickname: user.nickname,
            email: user.email
          });
      });
    });
  });
}
function createUser(user, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient(process.env.MONGODB_URI);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('trainingdocs');
    const users = db.collection('users');

    users.findOne({ email: user.email }, function (err, withSameMail) {
      if (err || withSameMail) {
        client.close();
        return callback(err || new Error('the user already exists'));
      }

      bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
          client.close();
          return callback(err);
        }

        user.password = hash;
        user.email_verified = false;
        users.insert(user, function (err, inserted) {
          client.close();

          if (err) return callback(err);
          callback(null);
        });
      });
    });
  });
}
function verifyUser (email, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient(process.env.MONGODB_URI);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('trainingdocs');
    const users = db.collection('users');
    const query = { email: email, email_verified: false };

    users.update(query, { $set: { email_verified: true } }, function (err, result) {
      client.close();

      if (err) return callback(err);
      callback(null, result.result.n > 0);
    });
  });
}
function changePassword(email, newPassword, callback) {
  const bcrypt = require('bcrypt');
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient(process.env.MONGODB_URI);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('trainingdocs');
    const users = db.collection('users');

    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) {
        client.close();
        return callback(err);
      }

      users.update({ email: email }, { $set: { password: hash } }, function (err, result) {
        client.close();
        if (err) return callback(err);
        callback(null, result.result.n > 0);
      });
    });
  });
}
function getByEmail(email, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient(process.env.MONGODB_URI);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('trainingdocs');
    const users = db.collection('users');

    users.findOne({ email: email }, function (err, user) {
      client.close();

      if (err) return callback(err);
      if (!user) return callback(null, null);

      return callback(null, {
        user_id: user._id.toString(),
        nickname: user.nickname,
        email: user.email
      });
    });
  });
}

function removeUser(id, callback) {
  const MongoClient = require('mongodb@3.1.4').MongoClient;
  const client = new MongoClient(process.env.MONGODB_URI);

  client.connect(function (err) {
    if (err) return callback(err);

    const db = client.db('trainingdocs');
    const users = db.collection('users');

    users.remove({ email: id }, function (err) {
      client.close();

      if (err) return callback(err);
      callback(null);
    });
  });

}
module.exports = {
  login,
  createUser,
  verifyUser,
  changePassword,
  getByEmail,
  removeUser,
  getAllUsers
}; */

//get all users from database


