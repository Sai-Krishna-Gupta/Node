const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const request = require("request");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: 'true',
  auth: {
    user: "donotreply.bitwise@gmail.com",
    pass: "lbpq avax dait xnyc",
  },
});
app.post("/sendEmail", async (req, res) => {
  const mailOptions = {
    from: "donotreply.bitwise@gmail.com",
    to: "saikrishnagupta786@icloud.com",
    subject: req.body.subject,
    text: req.body.text,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.send({ message: "Email sent Successfully" });
  } catch (err) {
    console.error("Error Sending Email: ", err);
  }
});

mongoose.set("strictQuery", true);
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
mongoose.connect(
  "mongodb+srv://saikrishnagupta786:KanakDbPassword@cluster0.kjzng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  clientOptions
);
const schema = new mongoose.Schema({
  data: String,
  title: String,
  postedBy: String,
  date: String,
  upVotes: Number,
  downVotes: Number,
});
const writerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  admin: Boolean,
});
const changeSchema = new mongoose.Schema({
  change: String,
  priority: String,
});
let article = mongoose.model("articles", schema);
let writer = mongoose.model("writers", writerSchema);
let change = mongoose.model("changes", changeSchema);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  app.post("/addChange", (req, res) => {
    var dataReceived = req.body
    request.post(
      {
        url: "https://node-ljy1.onrender.com/sendEmail",
        json: {
          email: "saikrishnagupta786@icloud.com",
          subject: "Change Added",
          text: `${dataReceived.postedBy} has suggested ${dataReceived.change} with a priority ${req.body.priority}`,
        },
      },
      (err, res, body) => {
        if (err) {
          console.error("Error Sending Email", err);
          return;
        }
        console.log("Created Post: ", body);
      }
    );
    change
      .create({ change: req.body.change, priority: req.body.priority })
      .then(
        (result) => {
          res.send(result);
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.get("/emailsRegistered", (req, res) => {
    writer
      .find({}, { email: 1, _id: 0 })
      .then(
        (result) => {
          res.send(result);
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.get("/nonAdminWriters", (req, res) => {
    writer
      .find({ ["admin"]: false })
      .then(
        (result) => {
          res.send({ result });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/deleteWriter", (req, res) => {
    writer
      .deleteOne(req.body)
      .then(
        (result) => {
          res.send({ result });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/getLogin", (req, res) => {
    writer
      .find(req.body)
      .then(
        (result) => {
          res.send({ result });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/addWriter", (req, res) => {
    writer
      .create(req.body)
      .then(
        (result) => {
          res.send({ message: "Record Added" });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.get("/readAll", (req, res) => {
    article
      .find({})
      .then(
        (result) => {
          res.send({ result });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/readOne", (req, res) => {
    article
      .findOne(req.body)
      .then(
        (result) => {
          res.send({ result });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
    p;
  });
  app.post("/deleteOne", (req, res) => {
    article
      .deleteOne(req.body)
      .then(
        (result) => {
          res.send({ message: "Record Deleted" });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/insertOne", (req, res) => {
    article
      .create(req.body)
      .then(
        (result) => {
          res.send({ message: "Record Added" });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });
});
