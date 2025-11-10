import React from "react";
import { useApp } from "../state/AppContext.jsx";

const imgURL = (item) => {
  // Prefer item's own img; fallback to TMDB poster path; else tiny placeholder
  if (item.img) return item.img;
  if (item.poster_path) return `https://image.tmdb.org/t/p/w200${item.poster_path}`;
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='120'><rect width='100%' height='100%' fill='%23eee'/></svg>";
};

export default function CartDropdown({ open, onClose }) {
  const { cart, addToCart, removeFromCart, clearCart } = useApp();
  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  if (!open) return null;

  return (
    <div className="cart-dd" role="dialog" aria-label="Shopping cart">
      <div className="cart-dd-header">
        <strong>Cart</strong>
        <button className="cart-dd-close" onClick={onClose}>✕</button>
      </div>

      {cart.length === 0 ? (
        <div className="cart-dd-empty">Your cart is empty.</div>
      ) : (
        <div className="cart-dd-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-dd-row">
              <img src={imgURL(item)} alt={item.name || item.title} />
              <div className="cart-dd-info">
                <div className="cart-dd-title">
                  {item.name || item.title || "Item"}
                  {item.type === "subscription" && <span className="badge">Subscription</span>}
                  {item.type === "accessory" && <span className="badge">Accessory</span>}
                </div>
                <div className="cart-dd-meta">
                  <span>${(item.price || 0).toFixed(2)}</span>
                </div>
                <div className="cart-dd-qty">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => removeFromCart(item.id, 1)}
                  >−</button>
                  <span>{item.qty || 1}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => addToCart(item)}
                  >+</button>
                </div>
                <button
                  className="cart-dd-remove"
                  onClick={() => removeFromCart(item.id, item.qty || 1)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-dd-footer">
        <div className="cart-dd-subtotal">
          <span>Subtotal</span>
          <strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div className="cart-dd-actions">
          <button className="outline" onClick={clearCart}>Clear</button>
          <a className="primary" href="/checkout">Checkout</a>
        </div>
      </div>
    </div>
  );
}
