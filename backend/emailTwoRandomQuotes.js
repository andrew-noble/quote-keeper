#!/home/andrew/.nvm/versions/node/v21.6.2/bin/node

import pg from "pg";
import nodemailer from "nodemailer";
import "dotenv/config";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "quotes",
  password: process.env.DB_PASSWORD,
  port: 5432,
});
db.connect();

//currently using googles "app password" feature to get into my gmail to send myself something. Better would be to use Oauth but I don't want to build that right now.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
});

const htmlMessageBuilder = function (quotes) {
  //function that takes an array of 2 quotes and returns an html snippet of them formatted slightly
  let text = `<ul><li>${quotes[0]}</li><li>${quotes[1]}</li></ul>`;
  return text;
};

const getTwoRandomQuotes = async function () {
  //returns an array of two random quotes from the database that have funny and practical tags
  const twoRandomQuotesQuery =
    "SELECT q.text FROM quotes q JOIN quote_tag_association qa1 ON q.id = qa1.quote_id JOIN quote_tag_association qa2 ON q.id = qa2.quote_id JOIN tags t1 ON qa1.tag_id = t1.id JOIN tags t2 ON qa2.tag_id = t2.id WHERE t1.tag_name = 'Practical' AND t2.tag_name = 'Funny';";
  const result = await db.query(twoRandomQuotesQuery);
  const quotes = result.rows.map((row) => row.text); //this gets out just the text column of each db record
  return quotes;
};

const quotesArray = await getTwoRandomQuotes(); //get the html and plaintext messages ready
const quotesPlainText = quotesArray.join(" ");
const quotesHtml = htmlMessageBuilder(quotesArray);

const message = {
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: "Your Quotes for the Day!",
  text: quotesPlainText,
  html: quotesHtml,
};

transporter.sendMail(message, (err, info) => {
  //send the message
  const now = new Date();
  const nowString = now.toDateString();
  if (err) {
    console.log(`${nowString}: ` + err);
  } else {
    console.log(`${nowString}: Email sent successfully`);
  }
  db.end(); //close the db connection when done sending the email.
  process.exit(1);
});
