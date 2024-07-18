import React, { useState } from "react";

export default function CreateQuoteArea(props) {
  const [addedQuote, setAddedQuote] = useState("");
  const [assocTags, setAssocTags] = useState([]);

  const { tagOptions, onQuoteAdd: handleQuoteAdd } = props;

  function handleChangeTags(event) {
    const { value, checked } = event.target; //gets the edited field's name and new value from the change event
    setAssocTags((prevTags) => {
      let newTags;
      if (checked) {
        newTags = [...prevTags, value];
      } else {
        newTags = prevTags.filter((thisTag) => thisTag != value);
      }
      return newTags;
    });
  }

  function handleChangeText(event) {
    const { value } = event.target;
    setAddedQuote(value);
  }

  function handleSubmit(event) {
    event.preventDefault(); //prevent browser refresh
    handleQuoteAdd(addedQuote, assocTags);
    setAddedQuote("");
    setAssocTags([]);
  }

  return (
    <>
      <h2>Add a New Quote</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Enter the quote's text:</label>
        <input
          type="text"
          maxLength="30"
          value={addedQuote}
          onChange={handleChangeText}
        ></input>
        {tagOptions.map((tag, index) => (
          <div key={index}>
            <label htmlFor={tag}>{tag}</label>
            <input
              type="checkbox"
              value={tag}
              checked={assocTags.includes(tag) ? true : false}
              id={tag}
              onChange={handleChangeTags}
            ></input>
          </div>
        ))}
        <button type="submit">Add</button>
      </form>
    </>
  );
}
