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
    //hit backend for a DB change:
    console.log("Sending data to backend:", { id, editedText, editedTagList });
    const { data: newQuote } = await axios.post(
      "http://localhost:3000/editQuote",
      {
        id: id,
        editedText: editedText,
        editedTagList: editedTagList,
      }
    );
    console.log("Received data from backend:", newQuote);
    //update state with just the quote that was changed:
    setQuotes((oldQuotes) => {
      const newQuotes = oldQuotes.map((item) =>
        item.id === newQuote.id ? newQuote : item
      );
      console.log("New, updated quote list:", newQuotes);
      return newQuotes;
    });
  }

  return (
    <ul>
      {quotes.map((item) => (
        <Quote key={item.id} data={item} editQuote={handleQuoteEdit} />
      ))}
    </ul>
  );
}
