import React, { useState } from "react";

export default function CreateQuoteArea(props) {
  const [content, setContent] = useState({ text: "", tags: [] });

  function handleChange(event) {
    const { name, value } = event.target; //gets the edited field's name and new value from the change event
  }

  function handleSubmit(event) {
    event.preventDefault(); //prevent browser refresh
    //call upstream addQuote func
  }

  return (
    <>
      <h2>Add a New Quote</h2>
      <form onSubmit={handleSubmit}>
        <label for="quote-text-entry">Enter the quote's text</label>
        <input
          type="text"
          name="quote-text-entry"
          maxlength="30"
          onChange={handleChange}
        ></input>

        <label for="quote-tags-entry">
          Select up to three tags to associate with this quote
        </label>
        <input list="tag-options" name="quote-tags-entry"></input>
        <select id="tag-options">
          <option value="Usable">Usable</option>
        </select>
        <button type="submit">Add</button>
      </form>
    </>
  );
}
