import React, { useState } from "react";

export default function CreateQuoteArea(props) {
  const [content, setContent] = useState({ text: "", tags: [] });

  const { tagOptions } = props;

  function handleChange(event) {
    const { name, value, checked } = event.target; //gets the edited field's name and new value from the change event
    setContent((prevContent) => {
      if (name != "text") {
        let newTags;
        checked
          ? (newTags = [...prevContent.tags, value])
          : (newTags = prevContent.tags.filter((thisTag) => thisTag != value));
        return { ...prevContent, tags: newTags }; //new state var if tags was changed
      } else {
        return { ...prevContent, text: value }; //new state var if text was changed
      }
    });
  }

  function handleTagDelete(tagToDelete) {
    //just reduces the state variable by the specified tag
    setContent((prevContent) => {
      const newTags = prevContent.tags.filter(
        (thisTag) => thisTag != tagToDelete
      );
      return { ...prevContent, tags: newTags };
    });
  }

  function handleSubmit(event) {
    event.preventDefault(); //prevent browser refresh
    //call upstream addQuote func
  }

  return (
    <>
      <h2>Add a New Quote</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="text">Enter the quote's text:</label>
        <input
          type="text"
          name="text"
          maxLength="30"
          value={content.text}
          onChange={handleChange}
        ></input>
        {tagOptions.map((tag, index) => (
          <div key={index}>
            <label htmlFor={tag}>{tag}</label>
            <input
              type="checkbox"
              name={tag}
              value={tag}
              id={tag}
              onChange={handleChange}
            ></input>
          </div>
        ))}
      </form>
    </>
  );
}
