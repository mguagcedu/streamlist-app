import { Routes, Route } from "react-router-dom";
import NavBar from "./week2/components/NavBar.jsx";
import Home from "./week2/pages/Home.jsx";
import Completed from "./week2/pages/Completed.jsx";
import AllItems from "./week2/pages/AllItems.jsx";
import About from "./week2/pages/About.jsx";
import { useEffect, useState } from "react";

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("streamlist_items_week2");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("streamlist_items_week2", JSON.stringify(items));
  }, [items]);

  const addItem = (text) => {
    if (!text.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      text: text.trim(),
      done: false,
      createdAt: Date.now(),
    };
    setItems((cur) => [item, ...cur]);
  };

  const toggleDone = (id) => {
    setItems((cur) =>
      cur.map((it) => (it.id === id ? { ...it, done: !it.done } : it))
    );
  };

  const updateText = (id, text) => {
    setItems((cur) =>
      cur.map((it) => (it.id === id ? { ...it, text: text.trim() } : it))
    );
  };

  const removeItem = (id) => {
    setItems((cur) => cur.filter((it) => it.id !== id));
  };

  return (
    <div className="container">
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              items={items.filter((i) => !i.done)}
              addItem={addItem}
              toggleDone={toggleDone}
              updateText={updateText}
              removeItem={removeItem}
            />
          }
        />
        <Route
          path="/completed"
          element={
            <Completed
              items={items.filter((i) => i.done)}
              toggleDone={toggleDone}
              updateText={updateText}
              removeItem={removeItem}
            />
          }
        />
        <Route
          path="/all"
          element={
            <AllItems
              items={items}
              toggleDone={toggleDone}
              updateText={updateText}
              removeItem={removeItem}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}