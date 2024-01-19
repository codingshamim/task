/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require("express");
const cors = require("cors");
const database = require("./lib/data.js");
const app = express();
const multer = require("multer");
const path = require("path");
app.use(express.json());
app.use(cors());

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post("/submitQsn", upload.single("file"), (req, res) => {
  try {
    // Access uploaded file information
    const file = req.file;
    const mydes = req.body.description;
    const title = req.body.title;
    const submitQsnPhoto = {
      id: crypto.randomUUID(),
      title,
      file: file.filename,
      description: mydes,
      method: "photo",
    };
    database.createDataBase("./.db/submitted.json", submitQsnPhoto);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Handle additional text data from the textarea
    const description = req.body.description;
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/alldata", (req, res) => {
  database.readDatabase("./.db/submitted.json", (data) => {
    res.send(data);
  });
});
app.post("/alldata/delete", (req, res) => {
  database.deleteDatabase("./.db/submitted.json", req.body.id)
});
app.post("/users", (req, res) => {
  database.createDataBase("./.db/users.json", req.body);
});
app.post("/delete", (req, res) => {
  const id = req.body.id;
  database.deleteDatabase("./.db/users.json", id);
});
app.post("/deleteReq", (req, res) => {
  const id = req.body;
  console.log(id);
  database.deleteDatabase("./.db/request.json", id.id);
});
app.post("/accrequest", (req, res) => {
  const body = req.body;
  database.createDataBase("./.db/request.json", body);
});


app.post("/questions", (req, res) => {
  const body = req.body;
  console.log(body);
  database.createDataBase("./.db/question.json", body);
});
app.get("/questions", (req, res) => {
  database.readDatabase("./.db/question.json", (data) => {
    res.send(data);
  });
});
app.get("/questions/:id", (req, res) => {
  const myid = req.params.id;
  database.readDatabase("./.db/question.json", (data) => {
    const result = data.find((item) => item.id == myid);
    res.send(result);
  });
});
app.get("/alldata/:id", (req, res) => {
  const myid = req.params.id;
  database.readDatabase("./.db/submitted.json", (data) => {
    const result = data.find((item) => item.id == myid);
    res.send(result);
  });
});

app.post("/mcqSubmit", (req, res) => {
  const body = req.body;
  body.method = "mcq";
  database.createDataBase("./.db/submitted.json", body);
});

app.post("/questions/delete", (req, res) => {
  database.deleteDatabase("./.db/question.json", req.body.delt);
});
app.get("/users", (req, res) => {
  database.readDatabase("./.db/users.json", (data) => {
    res.send(data);
  });
});
app.get("/request", (req, res) => {
  database.readDatabase("./.db/request.json", (data) => {
    res.send(data);
  });
});

app.listen(5000, () => {
  console.log("hello world");
});
