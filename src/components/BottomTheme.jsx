import React,{useEffect,useState} from "react";
import { setTheme, currentTheme } from "../utils/theme.js";

export default function BottomTheme(){
  const [t,setT]=useState(currentTheme());
  useEffect(()=>{ setTheme(t); },[t]);
  return (
    <div className="bottom-bar">
      <div className="bottom-inner">
        <select value={t} onChange={e=>setT(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
}
