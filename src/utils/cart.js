export const cartCount=c=>c.reduce((n,i)=>n+i.qty,0)
export const cartTotal=c=>c.reduce((s,i)=>s+(i.price*i.qty),0)
export const hasSubscription=c=>c.some(i=>i.type==='subscription')
export function addToCart(cart,item){
  const isSub=item.type==='subscription'
  if(isSub && hasSubscription(cart)) return {cart,error:"Only one subscription can be added at a time."}
  const idx=cart.findIndex(i=>i.id===item.id)
  if(idx>=0){const cp=cart.slice();cp[idx]={...cp[idx],qty:isSub?1:cp[idx].qty+1};return {cart:cp}}
  return {cart:[...cart,{...item,qty:1}]}
}
export const removeFromCart=(c,id)=>c.filter(i=>i.id!==id)
export const setQty=(c,id,q)=>q<=0?removeFromCart(c,id):c.map(i=>i.id===id?{...i,qty:i.type==='subscription'?1:q}:i)
