const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const e = require("express");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);
app.use(express.json({ limit: "100mb" }));

app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "donotreply.bitwise@gmail.com",
    pass: "lbpq avax dait xnyc",
  },
});

function verifyApiKey(req, res) {
  const apiKey = req.headers["api-key"];
  if (!apiKey || apiKey !== "SaiRam@123") {
    return res.status(403).json({ message: "Forbidden: Invalid API Key" });
  }
  return 0;
}
app.post("/sendEmail", async (req, res) => {
  verifyApiKey(req, res);
  const mailOptions = {
    from: "donotreply.bitwise@gmail.com",
    to: req.body.email,
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
const subscriberSchema = new mongoose.Schema({
  email: String,
});
const schema = new mongoose.Schema({
  data: String,
  title: String,
  postedBy: String,
  date: String,
  upVotes: Number,
  downVotes: Number,
});
const imageSchema = new mongoose.Schema(
  {
    filename: String,
    data: Buffer,
  },
  { timestamps: true }
);
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
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const articleVotesSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "article",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  liked: Boolean,
});
const IndianCompanySchema = new mongoose.Schema({
  "SYMBOL \r\n": String,
  "OPEN \r\n": String,
  "HIGH \r\n": String,
  "LOW \r\n": String,
  "PREV. CLOSE \r\n": String,
  "LTP \r\n": String,
  "INDICATIVE CLOSE \r\n": String,
  "CHNG \r\n": String,
  "%CHNG \r\n": String,
  "VOLUME \r\n(shares)": String,
  "VALUE \r\n (₹ Crores)": String,
  "52W H \r\n": String,
  "52W L \r\n": String,
  "30 D   %CHNG \r\n": String,
  "365 D % CHNG \r\n": String,
  "Date \r\n": String,
});
const IndianIndicesSchema = new mongoose.Schema({
  "SYMBOL \r\n": String,
  "CHNG \r\n": String,
  "%CHNG \r\n": String,
  "LTP \r\n": String,
  category: String,
});
const gitSchema = new mongoose.Schema({}, { strict: false });
const newsLetterSchema = new mongoose.Schema({
  data: String,
});

let subscriber = mongoose.model("subscribers", subscriberSchema);
let article = mongoose.model("articles", schema);
let writer = mongoose.model("writers", writerSchema);
let change = mongoose.model("changes", changeSchema);
let user = mongoose.model("Users", userSchema);
let articleVote = mongoose.model("Votes", articleVotesSchema);
let Image = mongoose.model("Image", imageSchema);
let IndianCompany = mongoose.model("IndianCompany", IndianCompanySchema);
let gitModel = mongoose.model("gitPAT", gitSchema);
let newsLetter = mongoose.model("NewsLetter", newsLetterSchema);
let IndianIndices = mongoose.model("Indices", IndianIndicesSchema);

const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
function sendEmail(email, subject, text) {
  axios
    .post(
      "https://node-ljy1.onrender.com/sendEmail",
      {
        email: email,
        subject: subject,
        text: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": "SaiRam@123",
        },
      }
    )
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
db.once("open", () => {
  app.post("/setIndices", (req, res) => {
    verifyApiKey(req, res);
    IndianIndices.deleteMany({ category: req.body[0].category })
      .then((result) => {
        console.log(`${result.deletedCount} documents deleted.`);
        IndianIndices.insertMany(req.body)
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
      })
      .catch((err) => {
        console.log(err);
      });
  });
  app.post("/findByCategory", (req, res) => {
    verifyApiKey(req, res);
    IndianIndices.find(req.body)
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
  app.post("/setNewsLetter", (req, res) => {
    verifyApiKey(req, res);
    newsLetter
      .deleteMany({})
      .then((result) => {
        newsLetter
          .create(req.body)
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
      })
      .catch((err) => {
        console.log(err);
      });
  });
  app.get("/getNewsLetter", (req, res) => {
    verifyApiKey(req, res);
    newsLetter
      .find({})
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
  app.get("/getGitPAT", (req, res) => {
    verifyApiKey(req, res);
    gitModel
      .find({})
      .then(
        (result) => {
          res.send({ PAT: result[0].gitPAT });
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log("Error deleting documents:", err);
      });
  });
  app.get("/getCompanyData", (req, res) => {
    verifyApiKey(req, res);
    IndianCompany.find({})
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
  app.post("/updateCompanyData", (req, res) => {
    verifyApiKey(req, res);
    IndianCompany.deleteMany({})
      .then((result) => {
        console.log(`${result.deletedCount} documents deleted.`);
        IndianCompany.insertMany(req.body)
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
      })
      .catch((err) => {
        console.log("Error deleting documents:", err);
      });
  });
  app.post("/userVotes", (req, res) => {
    verifyApiKey(req, res);
    //HAVE TO DO LATER>>>>>>>>>>>>>>>>>>>>>>>>>>>
  });
  app.post("/articleVoted", (req, res) => {
    verifyApiKey(req, res);
    req.body.articleId = new mongoose.Types.ObjectId(req.body.articleId);
    articleVote
      .create(req.body)
      .then(
        (result) => {
          //Nothing To Do;
        },
        (err) => {
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
    article
      .findByIdAndUpdate(req.body.articleId, {
        $inc: { upVotes: req.body.upVotes, downVotes: req.body.downVotes },
      })
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
  app.post("/addUser", (req, res) => {
    verifyApiKey(req, res);
    user
      .create(req.body)
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
  app.get("/usersRegistered", (req, res) => {
    verifyApiKey(req, res);
    user
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
  app.post("/addChange", (req, res) => {
    verifyApiKey(req, res);
    sendEmail(
      "saikrishnagupta786@gmail.com",
      "Change Added",
      `\"${req.body.postedBy}\" has suggested \"${req.body.change}\" with a priority \"${req.body.priority}\"`
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
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
  app.post("/getUser", (req, res) => {
    verifyApiKey(req, res);
    user
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
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
    verifyApiKey(req, res);
    article
      .create(req.body)
      .then(
        (result) => {
          subscriber.find({}, { email: 1, _id: 0 }).then((result) => {
            result.forEach((element) => {
              console.log(element);
              sendEmail(
                element.email,
                "New Article",
                `${req.body.postedBy} has posted a new article. Click here to check it out: https://bitwise-hub.github.io/bitwise/browser/`
              );
            });
          });
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
  app.post("/addSubscriber", (req, res) => {
    verifyApiKey(req, res);
    subscriber
      .create({ email: req.body.email })
      .then(
        (result) => {
          sendEmail(req.body.email, req.body.subject, req.body.text);
          res.send({ message: "Record Added" });
        },
        (err) => {
          console.log(err.message);
          res.send(err.message);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  });

  app.get("/subscriberList", (req, res) => {
    verifyApiKey(req, res);
    subscriber
      .find({})
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
});
