import React, { useMemo } from "react";
import { useApp } from "../state/AppContext.jsx";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useApp();

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  if (cart.length === 0) {
    return <div><h2>Cart</h2><p>Your cart is empty.</p></div>;
  }

  return (
    <div>
      <h2>Cart</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {cart.map(item => (
          <div key={item.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, display: "grid", gridTemplateColumns: "1fr auto auto auto", alignItems: "center", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>{item.name || item.title}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>{item.type === "subscription" ? "Subscription" : item.type === "accessory" ? "Accessory" : "Product"}</div>
            </div>
            <div>${item.price?.toFixed ? item.price.toFixed(2) : "0.00"}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button onClick={() => updateQty(item.id, -1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)}>+</button>
            </div>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, alignItems: "center" }}>
        <button onClick={clearCart}>Clear Cart</button>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Total: ${total.toFixed(2)}</div>
      </div>
    </div>
  );
}
