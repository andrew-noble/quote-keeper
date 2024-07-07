import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";

const db_pw = process.env.DB_PASSWORD;

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "quotes",
  password: db_pw,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //this just serves static files from the public folder
// app.use([clientErrorHandler, databaseErrorHandler, serverErrorHandler]); //my custom error handler middleware
app.use(cors({ origin: "http://localhost:5173" })); //this just permits requests from my frontend. Google CORS

app.get("/", (req, res) => {
  try {
    console.log("hello, world!");
  } catch (error) {
    console.log("Error: " + error);
  }
});

app.get("/all", async (req, res) => {
  const result = await db.query(
    //retrieves quotes and their associated tags
    "SELECT q.id, q.text, COALESCE(json_agg(t.tag_name), '[]') AS tags FROM quotes q JOIN quote_tag_association qt_a on (q.id = qt_a.quote_id) JOIN tags t on (qt_a.tag_id = t.id) GROUP BY q.id ORDER BY q.id"
  );
  res.json(result.rows); //best practice to just send data over
});

app.get("/allTags", async (req, res) => {
  const result = await db.query("SELECT * from tags");
  res.json(result.rows);
});

app.post("/editQuote", async (req, res) => {
  console.log(req.body);
  // const result = await db.query("UPDATE quotes SET text = $1 WHERE id = $2", []
});

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("SIGINT", () => {
  //process is the lowest level node.js entity here
  console.log("Ctrl-C detected, ending server gracefully");
  //this is a higher level http.server object created by the even higher level express object express.app
  server.close(() => db.end());
});
