import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEY = {
  LIST:"sl.list", FAVS:"sl.favorites", CART:"sl.cart", THEME:"sl.theme",
  USER:"sl.user", LOG:"sl.log", RECENT:"sl.recent"
};

const TAX={AL:.04,AK:0,AZ:.056,AR:.065,CA:.0725,CO:.029,CT:.0635,DC:.06,DE:0,FL:.06,GA:.04,HI:.04,IA:.06,ID:.06,IL:.0625,IN:.07,KS:.065,KY:.06,LA:.0445,MA:.0625,MD:.06,ME:.055,MI:.06,MN:.06875,MO:.04225,MS:.07,MT:0,NC:.0475,ND:.05,NE:.055,NH:0,NJ:.06625,NM:.05125,NV:.0685,NY:.04,OH:.0575,OK:.045,OR:0,PA:.06,RI:.07,SC:.06,SD:.045,TN:.07,TX:.0625,UT:.061,VA:.053,VT:.06,WA:.065,WI:.05,WV:.06,WY:0};
const PROMOS={SAVE10:{type:"percent",value:10},WELCOME5:{type:"flat",value:5}};

const AppCtx=createContext(null);
export const useApp=()=>useContext(AppCtx);

export function AppProvider({children}){
  const [list,setList]=useState(()=>JSON.parse(localStorage.getItem(KEY.LIST)||"[]"));
  const [favorites,setFavorites]=useState(()=>JSON.parse(localStorage.getItem(KEY.FAVS)||"[]"));
  const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem(KEY.CART)||"[]"));
  const [theme,setTheme]=useState(()=>localStorage.getItem(KEY.THEME)||"light");
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem(KEY.USER)||`{"mode":"guest"}`));
  const [log,setLog]=useState(()=>JSON.parse(localStorage.getItem(KEY.LOG)||"[]"));
  const [promoCode,setPromoCode]=useState("");
  const [recentSearches,setRecentSearches]=useState(()=>JSON.parse(localStorage.getItem(KEY.RECENT)||"[]"));

  useEffect(()=>localStorage.setItem(KEY.LIST,JSON.stringify(list)),[list]);
  useEffect(()=>localStorage.setItem(KEY.FAVS,JSON.stringify(favorites)),[favorites]);
  useEffect(()=>localStorage.setItem(KEY.CART,JSON.stringify(cart)),[cart]);
  useEffect(()=>{localStorage.setItem(KEY.THEME,theme);document.documentElement.dataset.theme=theme;},[theme]);
  useEffect(()=>localStorage.setItem(KEY.USER,JSON.stringify(user)),[user]);
  useEffect(()=>localStorage.setItem(KEY.LOG,JSON.stringify(log)),[log]);
  useEffect(()=>localStorage.setItem(KEY.RECENT,JSON.stringify(recentSearches)),[recentSearches]);

  const logAction=(type,detail)=>setLog(p=>[{id:crypto.randomUUID(),t:Date.now(),type,detail},...p].slice(0,100));

  // ---- Stream list
  const addListItem=(payload)=>{ // {text, poster_path?, tmdb_id?}
    const item={id:crypto.randomUUID(), text:payload.text, done:false, poster_path:payload.poster_path||null, tmdb_id:payload.tmdb_id||null};
    setList(prev=>[item,...prev]); logAction("list:add", payload.text);
  };
  const toggleListItem=(id)=>{setList(p=>p.map(i=>i.id===id?{...i,done:!i.done}:i));logAction("list:toggle",id);};
  const updateListItem=(id,text)=>{setList(p=>p.map(i=>i.id===id?{...i,text}:i));logAction("list:edit",text);};
  const removeListItem=(id)=>{setList(p=>p.filter(i=>i.id!==id));logAction("list:delete",id);};

  // ---- Favorites (store year and addedAt)
  function toggleFavorite(movie){
    if(!movie?.id) return;
    setFavorites(prev=>{
      const exists=prev.some(f=>f.id===movie.id);
      if(exists){ logAction("fav:remove", movie.title); return prev.filter(f=>f.id!==movie.id); }
      const year=(movie.release_date||"").slice(0,4)||null;
      const item={ id:movie.id, title:movie.title??movie.name??"Untitled", poster_path:movie.poster_path??null, vote_average:movie.vote_average??null, year, addedAt:Date.now() };
      logAction("fav:add", item.title); return [item,...prev];
    });
  }
  const pushRecent=(term)=>setRecentSearches(p=>[term,...p.filter(t=>t!==term)].slice(0,10));

  // ---- Cart with variants (size/model etc.)
  function variantKeyOf(item){ return item?.variant ? `${item.id}|${item.variant}` : item.id; }
  function addToCart(item){
    setCart(prev=>{
      const hasSub=prev.some(i=>i.type==="subscription");
      if(item.type==="subscription" && hasSub){ alert("Only one subscription at a time."); return prev; }
      const key=variantKeyOf(item);
      const idx=prev.findIndex(i=>variantKeyOf(i)===key);
      if(idx>=0){ const next=[...prev]; next[idx]={...next[idx], qty:(next[idx].qty||1)+(item.qty||1)}; logAction("cart:update", item.name); return next; }
      logAction("cart:add", item.name); return [...prev,{...item, qty:item.qty||1}];
    });
  }
  const removeFromCart=(id,variant)=>{ const key=variant?`${id}|${variant}`:id; setCart(p=>p.filter(i=>variantKeyOf(i)!==key)); logAction("cart:remove", key); };
  const setCartQty=(id,qty,variant)=>{ const key=variant?`${id}|${variant}`:id; setCart(p=>p.map(i=>variantKeyOf(i)===key?{...i,qty:Math.max(1,qty)}:i)); logAction("cart:qty", `${key}:${qty}`); };
  const clearCart=()=>{ setCart([]); logAction("cart:clear",""); };

  const cartCount=useMemo(()=>cart.reduce((n,i)=>n+(i.qty||1),0),[cart]);
  const subTotal=useMemo(()=>cart.reduce((s,i)=>s+i.price*(i.qty||1),0),[cart]);
  const userState=user?.state||"MI"; const taxRate=TAX[userState]??0; const tax=+(subTotal*taxRate).toFixed(2);

  const promo=PROMOS[(promoCode||"").toUpperCase()];
  const promoValue=promo ? (promo.type==="percent" ? +(subTotal*promo.value/100).toFixed(2) : Math.min(subTotal,promo.value)) : 0;
  const cartTotal=Math.max(0,+(subTotal+tax-promoValue).toFixed(2));

  // ---- Auth (mock)
  const signIn=(email,name)=>setUser({mode:"signed",email,name,state:userState});
  const register=(email,name)=>setUser({mode:"signed",email,name,state:userState});
  const signOut=()=>setUser({mode:"guest"});
  const setStateForTax=(abbr)=>setUser(u=>({...u,state:(abbr||"").toUpperCase()}));

  return <AppCtx.Provider value={{
    list, addListItem, toggleListItem, updateListItem, removeListItem,
    favorites, toggleFavorite, recentSearches, pushRecent,
    cart, addToCart, removeFromCart, setCartQty, clearCart, cartCount, subTotal, tax, cartTotal,
    promoCode, setPromoCode, promoValue, taxRate, userState,
    theme, setTheme, log, user, signIn, register, signOut, setStateForTax
  }}>{children}</AppCtx.Provider>;
}
