import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function AppProvider({ children }){
  const themes = ["Light","Dim","Sepia","Ocean","Midnight","Dark"];
  const [theme, setTheme] = useState(() => localStorage.getItem("sl-theme") || "Light");
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); localStorage.setItem("sl-theme", theme); },[theme]);

  // cart
  const [cart, setCart] = useState([]);
  function addToCart(item){
    setCart(c => {
      // One subscription rule
      if(item.type === "subscription" && c.some(i => i.type === "subscription")) return c;
      // Max 3 accessories rule
      if(item.type === "accessory" && c.filter(i => i.type === "accessory").length >= 3) return c;

      const i = c.findIndex(x => x.id === item.id);
      if(i >= 0){
        const copy = [...c];
        copy[i] = {...copy[i], qty: (copy[i].qty||1)+1};
        return copy;
      }
      return [...c, {...item, qty: 1}];
    });
  }
  function removeFromCart(id, qty=1){
    setCart(c => {
      const i = c.findIndex(x => x.id === id);
      if(i < 0) return c;
      const next = [...c];
      const left = (next[i].qty||1) - qty;
      if(left <= 0) next.splice(i,1); else next[i] = {...next[i], qty:left};
      return next;
    });
  }
  const clearCart = () => setCart([]);

  // lists
  const [myList, setMyList] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addToList = (m) => setMyList(lst => lst.some(x=>x.id===m.id) ? lst : [...lst, m]);
  const removeFromList = (id) => setMyList(lst => lst.filter(x=>x.id!==id));

  const toggleFavorite = (m) =>
    setFavorites(f => f.some(x=>x.id===m.id) ? f.filter(x=>x.id!==m.id) : [...f, m]);

  const value = useMemo(()=>({
    // theming
    themes, theme, setTheme,
    // cart
    cart, addToCart, removeFromCart, clearCart,
    // lists
    myList, addToList, removeFromList,
    favorites, toggleFavorite,
  }), [themes, theme, cart, myList, favorites]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
