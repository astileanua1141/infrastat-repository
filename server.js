if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(methodOverride("_method"));
//where css, style files are:
app.use(express.static("public"));
app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());

// Database config
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const invoiceEntriesRouter = require("./routes/invoiceEntries");
app.use("/invoiceEntries", invoiceEntriesRouter);

const invoicesRouter = require("./routes/invoices");
app.use("/invoices", invoicesRouter);

const settingsRouter = require("./routes/settings");
app.use("/settings", settingsRouter);

const catalogRouter = require("./routes/catalog");
app.use("/catalog", catalogRouter);
// localhost:3000/catalog/anything

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render("error");
});

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
