import React,{useEffect,useRef,useState} from "react";
import { TMDB_IMG } from "../utils/tmdb.js";

export default function Carousel({items=[], interval=3000, onClick}) {
  const [i,setI]=useState(0);
  const timer=useRef(null);
  useEffect(()=>{
    if(!items.length) return;
    timer.current = setInterval(()=> setI(v=>(v+1)%items.length), interval);
    return ()=> clearInterval(timer.current);
  },[items, interval]);
  if(!items.length) return null;
  const cur = items[i];
  const img = cur?.backdrop_path || cur?.poster_path;
  return (
    <div className="carousel">
      <button className="car-btn left" onClick={()=>setI(i=> (i-1+items.length)%items.length)}>‹</button>
      <div className="car-frame" onClick={()=>onClick?.(cur)}>
        {img ? <img src={TMDB_IMG+img} alt={cur.title||cur.name}/> : <div className="car-ph">No image</div>}
        <div className="car-caption">
          <strong>{cur.title || cur.name}</strong>
          <span>{(cur.release_date||"").slice(0,4)}</span>
        </div>
      </div>
      <button className="car-btn right" onClick={()=>setI(i=> (i+1)%items.length)}>›</button>
    </div>
  );
}
