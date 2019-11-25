const auth = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const express = require("express");
const router = express.Router();


// router.get("/login", auth, async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");
//   res.send(user);
// });

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ 'email': req.body.email });
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        res.status(200).send({
          msg: 'success',
          token: user.generateAuthToken(),
          userId: user._id,
          userRole: user.role
        });
      } else {
        res.status(400).send(JSON.stringify({ msg: "Invalid user/pass" }));
      }
    } else {
      res.status(400).send(JSON.stringify({ msg: "Invalid user/pass" }));
    }
  }
  catch (err) {
    console.log(err);
    res.send(401).send({ msg: "Server/error" });
  }
});

router.put("/register", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(JSON.stringify({ msg: "User already registered." }));

  user = new User({
    password: req.body.password,
    email: req.body.email,
    role: req.body.role
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(JSON.stringify({
    email: user.email
  }));
});

module.exports = router;