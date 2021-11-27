const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// connect to db
connectDB();

app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use("/api/user", require("./Routes/user"));
app.use("/api/contacts", require("./Routes/contacts"));
app.use("/api/auth", require("./Routes/auth"));

// production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
  );
}

app.listen(PORT, () => {
  console.log("server is running");
});
