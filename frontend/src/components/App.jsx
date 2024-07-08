import React, { useState, useEffect } from "react";
import axios from "axios";
import Quote from "./Quote.jsx";
import "./App.css";

export default function App() {
  const [quotes, setQuotes] = useState([]); //the quotes
  const [tags, setTags] = useState([]); //the possible categories/tags each quote can be assoc with
  // const [sortTag, setSortTag] = useState();

  useEffect(() => {
    async function fetchData() {
      const responseQuotes = await axios.get("http://localhost:3000/all");
      const responseTags = await axios.get("http://localhost:3000/allTags");
      setQuotes(responseQuotes.data);
      setTags(responseTags.data);
    }
    fetchData();
  }, []);

  async function handleQuoteEdit(id, editedText, editedTagList) {
    //just tells backend to update DB
    console.log("Sending data:", { id, editedText, editedTagList });
    await axios.post(
      "http://localhost:3000/editQuote",
      {
        id: id,
        editedText: editedText,
        editedTagList: editedTagList,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return (
    <ul>
      {quotes.map((item) => (
        <Quote key={item.id} data={item} editQuote={handleQuoteEdit} />
      ))}
    </ul>
  );
}
