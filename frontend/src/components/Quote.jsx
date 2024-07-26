import React, { useState } from "react";

export default function Quote(props) {
  const {
    data: { id, text, tags },
    editQuote,
    deleteQuote,
  } = props;
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fieldContent, setFieldContent] = useState(text); //inits fieldContent to the passed prop

  function handleEntry(event) {
    setFieldContent(event.target.value); //just tracks changing text field
  }

  function handleSubmit(event) {
    event.preventDefault(); //prevent browser refresh
    editQuote(id, fieldContent, tags); //triggers upstream edit function that hits backend, db
    setIsBeingEdited(false); //returns to view mode
  }

  //final delete
  function handleConfirmDelete(event) {
    deleteQuote(id);
  }

  //asks you to confirm first
  function handleDelete() {
    setConfirmDelete(true); //prolly make dynamic? So they can undo this
  }

  function handleSwitchToEditing() {
    setIsBeingEdited((prev) => !prev);
    setFieldContent(text); //if user decides to not edit after all, this clears out their changes
  }

  return (
    <>
      {isBeingEdited ? (
        <form onSubmit={handleSubmit}>
          <input value={fieldContent} onChange={handleEntry}></input>
        </form>
      ) : (
        <>
          <p>{text}</p>
          {tags.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </>
      )}
      <button onClick={handleSwitchToEditing}>Edit</button>
      {confirmDelete ? (
        <button onClick={handleConfirmDelete}>Confirm Delete?</button>
      ) : (
        <button onClick={handleDelete}>Delete</button>
      )}
    </>
  );
}
