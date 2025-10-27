import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Completed from "./pages/Completed.jsx";
import AllItems from "./pages/AllItems.jsx";
import About from "./pages/About.jsx";
import { useEffect, useState } from "react";

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("streamlist_items");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("streamlist_items", JSON.stringify(items));
  }, [items]);

  const addItem = (text) => {
    if (!text.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      text: text.trim(),
      done: false,
      createdAt: Date.now()
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