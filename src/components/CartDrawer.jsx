import { useApp } from "../state/AppContext.jsx";

export default function CartDrawer({open,onClose}){
  const { cart, setCart } = useApp();
  const updateQty = (i, delta)=>{
    setCart(prev=>{
      const next=[...prev];
      next[i]={...next[i], qty: Math.max(1, next[i].qty+delta)};
      return next;
    });
  };
  const removeItem = (i)=>{
    setCart(prev=>prev.filter((_,idx)=>idx!==i));
  };

  return (
    <div className={`drawer ${open?'open':''}`}>
      <div className="drawer-head">
        <h3>Your Cart</h3>
        <button className="icon-btn" onClick={onClose}>✕</button>
      </div>
      <div className="drawer-body">
        {cart.length===0 ? <p>No items yet.</p> :
          cart.map((it,i)=>(
            <div className="cart-row" key={i}>
              <div className="cart-main">
                <strong>{it.title}</strong>
                <div className="muted">{it.kind||'movie'}</div>
              </div>
              <div className="cart-qty">
                <button onClick={()=>updateQty(i,-1)}>-</button>
                <span>{it.qty}</span>
                <button onClick={()=>updateQty(i,1)}>+</button>
              </div>
              <button className="link danger" onClick={()=>removeItem(i)}>remove</button>
            </div>
          ))
        }
      </div>
      <div className="drawer-foot">
        <button className="btn full" onClick={()=>alert("Proceed to checkout (placeholder)")}>Checkout</button>
      </div>
    </div>
  );
}
