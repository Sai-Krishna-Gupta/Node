const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric OTP
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saikrishnagupta786@gmail.com",
    pass: "pjlm hvik ydcl fkta",
  },
});
app.post("/sendEmail", async (req, res) => {
  const OTP = generateOTP();
  const mailOptions = {
    from: "saikrishnagupta786@gmail.com",
    to: req.body.email,
    subject: "OTP",
    text: `Here is the OTP to verify your email address to become a writer for our company.\n${OTP}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.send({ message: "Email sent Successfully", OTP: OTP });
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
let article = mongoose.model("articles", schema);
let writer = mongoose.model("writers", writerSchema);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
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
    console.log(req.body);
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
