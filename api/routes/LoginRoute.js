const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser, addUser } = require("../../data/UserSQL");

module.exports = router;

router.post("/register", async (req, res) => {
  try {
    const { UserName, Password } = req.body;

    if (!(UserName && Password)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await getUser(UserName);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(Password, 10);
    const NewUser = await addUser({
      UserName: UserName,
      Password: encryptedPassword,
    });
    if (!NewUser) {
      res.status(400).send("User Not Created");
    }
    const token = jwt.sign(
      { user_id: NewUser.id, UserName },
      process.env.TOKEN_KEY,
      { expiresIn: "2h" }
    );

    NewUser.Token = token;
    res.status(201).json(NewUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { UserName, Password } = req.body;
    if (!(UserName && Password)) {
      return res.status(400).send("UserName & Password is required");
    }

    const user = await getUser(UserName);
    if (user && (await bcrypt.compare(Password, user.password))) {
      const token = jwt.sign(
        { user_id: user.id, UserName },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      user.Token = token;
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
