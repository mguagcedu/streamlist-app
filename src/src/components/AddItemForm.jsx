import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AddItemForm({ onAdd }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onAdd(text);
    setText("");
  };

  return (
    <form className="add-form" onSubmit={submit}>
      <input
        aria-label="New item"
        placeholder="Add a new item"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">
        <FaPlus aria-hidden="true" /> Add
      </button>
    </form>
  );
}