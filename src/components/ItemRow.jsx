import { useState } from "react";
import { FaTrash, FaEdit, FaSave, FaCheck } from "react-icons/fa";

export default function ItemRow({ item, onToggle, onUpdate, onRemove }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(item.text);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== item.text) onUpdate(item.id, trimmed);
    setEdit(false);
  };

  return (
    <li className={`row ${item.done ? "done" : ""}`}>
      <button
        className="icon-btn"
        aria-label={item.done ? "Mark incomplete" : "Mark complete"}
        onClick={() => onToggle(item.id)}
        title="Toggle complete"
      >
        <FaCheck aria-hidden="true" />
      </button>

      {edit ? (
        <input
          className="edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          autoFocus
        />
      ) : (
        <span className="row-text">{item.text}</span>
      )}

      {edit ? (
        <button className="icon-btn" aria-label="Save" onClick={save}>
          <FaSave aria-hidden="true" />
        </button>
      ) : (
        <button
          className="icon-btn"
          aria-label="Edit"
          onClick={() => setEdit(true)}
        >
          <FaEdit aria-hidden="true" />
        </button>
      )}

      <button
        className="icon-btn danger"
        aria-label="Delete"
        onClick={() => onRemove(item.id)}
      >
        <FaTrash aria-hidden="true" />
      </button>
    </li>
  );
}