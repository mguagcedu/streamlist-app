import React from "react";
import { useApp } from "../context/AppContext.jsx";

export default function Billing(){
  const { cartTotal } = useApp();
  return (
    <section className="route">
      <h1>Billing</h1>
      <p className="kbd">Total due: ${cartTotal.toFixed(2)}</p>
      <p>(Mock page for now.)</p>
    </section>
  );
}
