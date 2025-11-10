import React, { useState } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./state/AppContext.jsx";
import StreamList from "./pages/StreamList.jsx";
import Favorites from "./pages/Favorites.jsx";
import Plans from "./pages/Plans.jsx";
import Account from "./pages/Account.jsx";
import CartDropdown from "./components/CartDropdown.jsx";
import "./styles/ui.css";
import "./styles/cart.css";

function Shell({ children }) {
  const { cart, theme, setTheme, themes } = useApp();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div data-theme={theme}>
      <header className="container">
        <div className="row" style={{justifyContent:"space-between"}}>
          <div className="row">
            <Link className="brand" to="/">EZTechMovie</Link>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/favorites">Favorites</Link>
              <Link to="/plans">Plans</Link>
              <Link to="/account">Account</Link>
            </nav>
          </div>
          <div className="row">
            <select
              aria-label="Select theme"
              value={theme}
              onChange={(e)=>setTheme(e.target.value)}
            >
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button className="btn" onClick={() => setCartOpen(v => !v)}>
              Cart ({cart.reduce((s,i)=>s+(i.qty||1),0)})
            </button>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <CartDropdown open={cartOpen} onClose={()=>setCartOpen(false)} />
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}

export default function App(){
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<StreamList/>} />
        <Route path="/favorites" element={<Favorites/>} />
        <Route path="/plans" element={<Plans/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="/movies" element={<Navigate to="/" replace/>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </Shell>
  );
}
