//clean the code before shoing on CV

// to use import add : "type": "module" in package.json

import express from "express";
import path from "path";
import cors from "cors";
// import knex from "knex";
// import bcrypt from "bcryptjs";

const app = express();
var __dirname = path.resolve(); // resolves the error: __dirname not found.

app.use(express.urlencoded({ extended: true })); // if extended:false --> return [Objects: null]
app.use(express.json()); // parses to json
app.use(cors());

const database = {
  users: [
    {
      id: "1",
      name: "admin",
      email: "admin@gmail.com",
      password: "password",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  // res.send("connected to backend");
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    (err) => res.json(err);
  }
});

// here we can not use conditional statements like singin coz we are creating a new user
//SignUp
app.post("/signup", (req, res) => {
  const { email, name, password } = req.body; //destructuring: req.body.email, req.body.password, req.body.name

  database.users.push({
    id: 1,
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

//Profile Id
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  database.users.forEach((user) => {
    if (user.id === id) {
      return res.json(user);
    } else {
      res.status(400).json("user not found");
    }
  });
});

//Rank
app.put("/imageRank", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("user not found");
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3002;
  console.log(`PORT is set to ${port}`);
}
app.listen(port);
