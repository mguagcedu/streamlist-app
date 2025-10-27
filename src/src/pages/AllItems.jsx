import { useState } from "react";
import ItemRow from "../components/ItemRow.jsx";

export default function AllItems({ items, toggleDone, updateText, removeItem }) {
  const [q, setQ] = useState("");
  const filtered = items.filter((i) =>
    i.text.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <h1>All Items</h1>
      <input
        placeholder="Filter items"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: "0.75rem", padding: "0.5rem", width: "100%" }}
      />
      <ul className="list">
        {filtered.length === 0 ? <p>No matching items</p> : null}
        {filtered.map((it) => (
          <ItemRow
            key={it.id}
            item={it}
            onToggle={toggleDone}
            onUpdate={updateText}
            onRemove={removeItem}
          />
        ))}
      </ul>
    </>
  );
}