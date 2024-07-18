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

app.use(bodyParser.json());
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
  const result = await db.query("SELECT tag_name from tags");
  res.json(result.rows);
});

app.post("/editQuote", async (req, res) => {
  const { id, editedText, editedTagList } = req.body; //need to implement tag list updating later

  try {
    //beefy query that updates a id-specified quote's text, then returns its id, text, tagList
    const result = await db.query(
      "WITH updated AS (UPDATE quotes SET text = $1 WHERE id = $2 RETURNING id, text) SELECT u.id, u.text, COALESCE(json_agg(t.tag_name), '[]') AS tags FROM updated u LEFT JOIN quote_tag_association qt_a ON u.id = qt_a.quote_id LEFT JOIN tags t ON qt_a.tag_id = t.id GROUP BY u.id, u.text;",
      [editedText, id]
    );
    const data = result.rows[0];
    res.json(data);
  } catch (e) {
    console.log("Error modifying the database record --->", e);
  }
});

app.post("/addQuote", async (req, res) => {
  const { text, tags } = req.body;

  try {
    //first add the quote data
    const result = await db.query(
      "INSERT INTO quotes (text) VALUES ($1) RETURNING id",
      [text]
    );
    const newQuoteId = result.rows[0].id;
    //then add appropriate q-t associations to attach tags to quote
    await db.query(
      "INSERT INTO quote_tag_association (quote_id, tag_id) SELECT $1, tags.id FROM tags WHERE tags.tag_name = ANY($2)",
      [newQuoteId, tags]
    );
    //finally, return all the new quote's data to the user
    const newQuote = await db.query(
      "SELECT q.id, q.text, json_agg(t.tag_name) AS tags FROM quotes q LEFT JOIN quote_tag_association qt_a ON q.id = qt_a.quote_id LEFT JOIN tags t ON qt_a.tag_id = t.id WHERE q.id = $1 GROUP BY q.id, q.text",
      [newQuoteId]
    );
    res.json(newQuote.rows[0]);
  } catch (e) {
    console.log("Error modifying the database record --->", e);
  }
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
