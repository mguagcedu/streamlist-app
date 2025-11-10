import React from "react";
import { useApp } from "../state/AppContext.jsx";

const planImages = {
  basic: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60",
  standard: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&auto=format&fit=crop&q=60",
  premium: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
};

const accessories = [
  { id:"acc-remote", type:"accessory", name:"EZ Remote Pro", price:19.99, img:"https://images.unsplash.com/photo-1591337676887-a217a6970a8f?w=800&auto=format&fit=crop&q=60" },
  { id:"acc-hdmi", type:"accessory", name:"HDMI 2.1 Cable (6 ft)", price:14.99, img:"https://images.unsplash.com/photo-1526178616484-4fdc6f1a3d5a?w=800&auto=format&fit=crop&q=60" },
  { id:"acc-stand", type:"accessory", name:"Adjustable TV Stand", price:39.99, img:"https://images.unsplash.com/photo-1527430253228-e93688616381?w=800&auto=format&fit=crop&q=60" },
  { id:"acc-mount", type:"accessory", name:"Wall Mount Bracket", price:29.99, img:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=60" },
];

export default function Plans(){
  const { cart, addToCart } = useApp();

  const subscriptionInCart = cart.find(i => i.type === "subscription");
  const accessoriesInCart = cart.filter(i => i.type === "accessory").length;

  const plans = [
    { id:"plan-basic", type:"subscription", tier:"Basic", desc:"720p streaming • 1 screen", price:7.99, img:planImages.basic },
    { id:"plan-standard", type:"subscription", tier:"Standard", desc:"1080p streaming • 2 screens", price:12.99, img:planImages.standard },
    { id:"plan-premium", type:"subscription", tier:"Premium", desc:"4K HDR • 4 screens • Ultra sound", price:17.99, img:planImages.premium },
  ];

  const canAddAccessory = accessoriesInCart < 3;

  return (
    <section>
      <h1>Membership Plans</h1>
      <div className="hstack" style={{flexWrap:"wrap"}}>
        {plans.map(p => (
          <article className="card" key={p.id} style={{width:320}}>
            <img src={p.img} alt={p.tier} />
            <div className="p">
              <strong className="kicker">{p.tier}</strong>
              <p className="dim">{p.desc}</p>
              <p><strong>${p.price.toFixed(2)}/mo</strong></p>
              <button
                className="btn"
                disabled={!!subscriptionInCart}
                onClick={()=>addToCart(p)}
              >
                {subscriptionInCart ? "Subscription Selected" : "Add Subscription"}
              </button>
              <p className="small dim">Only one subscription can be in cart.</p>
            </div>
          </article>
        ))}
      </div>

      <h2 style={{marginTop:18}}>Accessories (max 3 total)</h2>
      <div className="hstack" style={{flexWrap:"wrap"}}>
        {accessories.map(a => (
          <article className="card" key={a.id} style={{width:320}}>
            <img src={a.img} alt={a.name} />
            <div className="p">
              <strong className="kicker">{a.name}</strong>
              <p><strong>${a.price.toFixed(2)}</strong></p>
              <button
                className="btn"
                disabled={!canAddAccessory}
                onClick={()=>addToCart(a)}
              >
                {canAddAccessory ? "Add Accessory" : "Limit Reached"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
