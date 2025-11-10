const KEY="sl_state_v1"
export function loadState(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return{}}}
export function saveState(obj){try{localStorage.setItem(KEY,JSON.stringify(obj))}catch{}}
export function getSubscription(){const s=loadState();return s.subscription||null}
export function setSubscription(sub){const s=loadState();s.subscription=sub;saveState(s)}
export function clearSubscription(){const s=loadState();s.subscription=null;saveState(s)}
