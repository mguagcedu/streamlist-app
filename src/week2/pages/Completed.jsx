import ItemRow from "../components/ItemRow.jsx";

export default function Completed({ items, toggleDone, updateText, removeItem }) {
  return (
    <>
      <h1>Completed</h1>
      <ul className="list">
        {items.length === 0 ? <p>Nothing completed yet</p> : null}
        {items.map((it) => (
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
