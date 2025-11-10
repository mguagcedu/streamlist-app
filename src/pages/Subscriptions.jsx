import React,{useState} from "react"; import {CATALOG} from "../data/Data.js"; import {useApp} from "../context/AppContext.jsx"; import {hasSubscription} from "../utils/cart.js"
export default function Subscriptions(){
  const {cart,addToCart}=useApp(); const [msg,setMsg]=useState(""); const subs=CATALOG.filter(x=>x.type==='subscription'); const accs=CATALOG.filter(x=>x.type==='accessory')
  function add(it){setMsg(""); if(it.type==='subscription' && hasSubscription(cart)){setMsg("Only one subscription can be added at a time."); return} addToCart(it)}
  const Card=({it})=>(<article className="card"><h3>{it.name}</h3><div className="meta">${it.price.toFixed(2)} — {it.desc}</div><div style={{marginTop:10}}><button onClick={()=>add(it)}>Add to Cart</button></div></article>)
  return (<section className="route" aria-label="Subscriptions"><h1>Subscriptions</h1>{msg&&<div className="alert">{msg}</div>}
    <div className="grid">{subs.map(s=><Card key={s.id} it={s}/>)}</div><h2 style={{marginTop:20}}>Accessories</h2><div className="grid">{accs.map(a=><Card key={a.id} it={a}/>)}</div></section>)
}
