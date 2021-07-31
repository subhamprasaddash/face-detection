//clean the code before shoing on CV

// to use import add : "type": "module" in package.json

import express from "express";
import path from "path";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcryptjs";

const app = express();
var __dirname = path.resolve(); // resolves the error: __dirname not found.

app.use(express.urlencoded({ extended: true })); // if extended:false --> return [Objects: null]
app.use(express.json()); // parses to json
app.use(cors());

const database = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "SDE@h3HHB",
    database: "smartfacedetection",
  },
  searchPath: ["smartfacedetection_db"],
});

/*
/signin --> POST , respond-->success/fail
/signup --> POST, respond--> user
/profile/:id --> GET, return-->user
/imageRank --> PUT -->updated user rank
*/

app.get("/", (req, res) => {
  res.send("connected to backend");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("bad request");
  }
  database
    .select("*")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return database
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json(err));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

// here we can not use conditional statements like singin coz we are creating a new user
//SignUp
app.post("/signup", (req, res) => {
  const { email, name, password } = req.body; //destructuring: req.body.email, req.body.password, req.body.name

  if (!email || !name || !password) {
    return res.status(400).json("bad request");
  }

  const hash = bcrypt.hashSync(password);

  database
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into("login")
        .returning("email")
        .then((loginEmail) => {
          return trx("users")
            .returning("*")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })

    .catch((err) => res.status(400).json("Failed to signup"));
});

//Profile Id
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  database
    .select("*")
    .from("users")
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user);
      } else {
        res.json("User does not exist");
      }
    })
    .catch((err) => res.status(404).json(err));
});

//Rank
app.put("/imageRank", (req, res) => {
  const { id } = req.body;
  database("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .then((entries) => {
      res.json(entries[0]);
    })

    .catch((err) => res.status(400).json(err));
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3002;
  console.log(`PORT is set to ${port}`);
}
app.listen(port);
