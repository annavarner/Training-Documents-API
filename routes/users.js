const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users");

//router.get("/", usersController.createUser)

router.get("/allusers", usersController.getAllUsers);

router.get("/:id", usersController.getSingleUser);

//router.get("/:id", usersController.getByEmail());

router.post("/", usersController.createUser);

//router.post("/login", usersController.login());
router.put("/:id", usersController.updateUser);
//router.put("/:id", usersController.changePassword());

router.delete("/:id", usersController.deleteUser)
//router.delete("/:id", usersController.removeUser());

module.exports = router;
