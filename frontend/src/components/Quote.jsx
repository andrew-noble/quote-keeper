import React, { useState } from "react";

export default function Quote(props) {
  const {
    data: { id, text, tags },
    editQuote,
    deleteQuote,
  } = props;
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [fieldContent, setFieldContent] = useState(text); //inits fieldContent to the passed prop
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  function handleSwitchToEditing() {
    setIsBeingEdited(!isBeingEdited);
    setFieldContent(text); //if user decides to not edit after all, this clears out their changes
  }

  //asks you to confirm first
  function handleDelete() {
    setConfirmDelete(true); //prolly make dynamic? So they can undo this
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
          <ul>
            {tags.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
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
