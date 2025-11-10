const KEY="sl_theme";
export function applyThemeOnLoad(){
  try{
    const saved = localStorage.getItem(KEY) || "light";
    document.documentElement.setAttribute("data-theme", saved);
  }catch{}
}
export function setTheme(v="light"){
  document.documentElement.setAttribute("data-theme", v);
  try{ localStorage.setItem(KEY, v); }catch{}
}
export function currentTheme(){
  return document.documentElement.getAttribute("data-theme") || "light";
}
