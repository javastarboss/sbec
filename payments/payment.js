import { getfood } from "../food.unit/food.js"; // adjust path if needed

export function paymentsummary(cart = []) {
  try {
    console.log("%cpaymentsummary() START", "color: teal; font-weight:700");
    console.log("received cart:", cart);

    if (!Array.isArray(cart)) {
      console.warn("paymentsummary: cart is not array. coercing to []");
      cart = [];
    }

    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach(ci => {
      console.log(" - cart item:", ci);
      const product = getfood(ci.save);
      if (!product) {
        console.warn("paymentsummary: product not found for", ci.save);
        return;
      }
      const price = Number(product.price) || 0;
      const qty = Number(ci.quantity) || 0;
      totalPrice += price * qty;
      totalItems += qty;
    });

    console.log("paymentsummary: totals", { totalPrice, totalItems });

    const html = `
      <div class="payment-summary-title">Order Summary</div>
      <div class="payment-summary-row">
        <div>Subtotal:</div><div class="payment-summary-money">D${totalPrice.toFixed(2)}</div>
        </div><div class="payment-summary-row"><div>Items:</div>
        <div class="payment-summary-money">${totalItems}</div></div>
        <div class="payment-summary-row total-row"><div>Order total:</div>
        <div class="payment-summary-money">D${totalPrice.toFixed(2)}</div></div>
       <a href='orders.html'> <button class="place-order-button button-primary button" style=' border-bottom: solid white 5px;'>Place your order</button></a>
        `
    ;

    const target = document.querySelector(".js-payment-summary");
    console.log("paymentsummary: target element:", target);
    if (target) {
      target.innerHTML = html;
      console.log("%cpaymentsummary() RENDERED into DOM", "color:green");
      // expose for debugging if you want:
      window.__lastPaymentsummary = { totalPrice, totalItems, html };
      return true;
    } else {
      console.warn("paymentsummary: .js-payment-summary not found. returning html.");
      window.__lastPaymentsummary = { totalPrice, totalItems, html };
      return html;
    }
  } catch (err) {
    console.error("paymentsummary: unexpected error", err);
    throw err;
  }
}

// expose function for manual testing from console:
window.paymentsummary_debug = paymentsummary;
