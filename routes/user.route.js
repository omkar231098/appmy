const express = require("express");
const { UserModel } = require("../Model/user.model");
const bycrypt = require("bcrypt");
userRouter = express.Router();
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticator");

// post route to register the user

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const UserPresent = await UserModel.findOne({ email });

    if (UserPresent) {
      res.status(200).send({ Message: "User is already Registerd" });
    }
    const HashPassword = await bycrypt.hash(password, 12);
    const NewUser = new UserModel({
      username,
      email,
      password: HashPassword,
    });

    await NewUser.save();

    res.status(200).send({ Message: "Save Successfully" });
  } catch (err) {
    res.status(404).send(err);
  }
});


// post route to login the user

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const UserPresent = await UserModel.findOne({ username });
    if (!UserPresent) {
      res.status(200).send({ msg: "User is not register yet!!" });
    }

    const validpassword = await bycrypt.compare(password, UserPresent.password);

    if (!validpassword) {
      res.send("Password is invalid");
    }
// generate the token
    const token = jwt.sign({ "userID":UserPresent._id}, "masai",{ expiresIn: '3h' });

    res.status(200).send({ msg: "Login Successful", token: token });
  } catch (err) {
    res.status(404).send(err);
  }
});

// get route access the users database
userRouter.get("/",authenticate, async (req, res) => {
  try {
    const user = await UserModel.find();
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send({ msg: "Not able to read" });
  }
});

// patch route to update the users
userRouter.patch("/update/:userid",authenticate, async (req, res) => {
  const { userid } = req.params;
  const payload = req.body;
  try {
    await UserModel.findByIdAndUpdate({ _id: userid }, payload);
    res.status(200).send("User has been updated");
  } catch (err) {
    res.status(404).send({ msg: "Not able to update" });
  }
});

// delete route to delete the user
userRouter.delete("/delete/:userid",authenticate, async (req, res) => {
  const { userid } = req.params;

  try {
    await UserModel.findByIdAndDelete({ _id: userid });
    res.status(200).send("User has been deleted");
  } catch (err) {
    res.status(404).send({ msg: "Not able to delete" });
  }
});









module.exports = { userRouter };
