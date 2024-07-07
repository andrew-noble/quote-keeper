import React, { useState } from "react";

export default function Quote(props) {
  const { id, text, tags, editQuote } = props;

  return (
    <>
      <p>{text}</p>
      <ul>
        {tags.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={() => editQuote()}>Edit</button>
    </>
  );
}
