import React, { useState, useEffect } from "react";
import axios from "axios";
import Quote from "./Quote.jsx";
import "./App.css";
import CreateQuoteArea from "./CreateQuoteArea.jsx";

export default function App() {
  const [quotes, setQuotes] = useState([]); //the quotes in {id, text, tags[]} format
  const [tags, setTags] = useState([]); //the possible categories/tags each quote can be assoc with
  // const [sortTag, setSortTag] = useState();

  useEffect(() => {
    async function fetchData() {
      const responseQuotes = await axios.get("http://localhost:3000/all");
      const responseTags = await axios.get("http://localhost:3000/allTags");
      const listOfTags = responseTags.data.map((tagObj) => tagObj.tag_name); //unpacks object into simple array
      setQuotes(responseQuotes.data);
      setTags(listOfTags);
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

  async function handleQuoteAdd(text, tags) {
    console.log("Sending data to backend:", { text, tags });
    const response = await axios.post("http://localhost:3000/addQuote", {
      text: text,
      tags: tags,
    });
    console.log(`New quote added with id: ${response.data.id}`);
    setQuotes((oldQuotes) => {
      return [...oldQuotes, response.data];
    });
  }

  return (
    <>
      <CreateQuoteArea tagOptions={tags} onQuoteAdd={handleQuoteAdd} />
      <ul>
        {quotes.map((item) => (
          <Quote key={item.id} data={item} editQuote={handleQuoteEdit} />
        ))}
      </ul>
    </>
  );
}
