import AddItemForm from "../components/AddItemForm.jsx";
import ItemRow from "../components/ItemRow.jsx";

export default function Home({ items, addItem, toggleDone, updateText, removeItem }) {
  return (
    <>
      <h1>StreamList</h1>
      <AddItemForm onAdd={addItem} />
      <ul className="list">
        {items.length === 0 ? <p>No open items</p> : null}
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