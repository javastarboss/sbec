// cart.js
// check.js (updated)
import { initUserTimers, timersMap, deleteTimerDoc } from './timers.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { updateDeliveryOption } from '../cart/cart.js';
import { deliveryOptions } from '../cart/delivery-option.js';
import { food } from "../food.unit/food.js";
import { paymentsummary } from "../payments/payment.js";
import { getfood } from "../food.unit/food.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

function hideLoading(){
  setTimeout(()=>{
    const loader = document.getElementById("loading-screen")
    if(loader) {
      loader.style.display = "none";
      loader.classList.add('hidden');
      setTimeout(()=> loader.remove(), 300)
    }
  }, 1300)
}

// MAIN FLOW
onAuthStateChanged(auth, async (user) => {
  if (user) {
    hideLoading();

    // Ensure timers listener is active
    initUserTimers(auth, db);

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    Loading();

    if (docSnap.exists()) {
      const cart = docSnap.data().cart || [];
      displayFullCart(cart);
    }
  } else {
    window.location.href = "login.html";
  }
});

function Loading(){
  setTimeout(()=>{
    const loader = document.getElementById("loading-screen")
    if(loader) {
      loader.style.display = "none";
      loader.classList.add('hidden');
      setTimeout(()=> loader.remove(), 300)
    }
  }, 1300)
}

// displayFullCart uses timersMap keyed by timerId
async function displayFullCart(cart) {
  const container = document.querySelector('.order-summary');
  let contain = "";

  const him = document.getElementById('text');
  const scales = matchMedia('(max-width: 530px)');
  if(scales.matches && him) him.style.display='none';

  const user = auth.currentUser;
  let userName = "Anonymous";
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      userName = data.name || "Anonymous";
    }else {
    window.location.href='login.html';
  }
  }

  let zero = 0;
  cart.forEach((displaytop) => {
    zero += displaytop.quantity;
    const zeroEl = document.getElementById('zero');
    if (zeroEl) zeroEl.textContent = zero;
  });

  for (const inner of cart) {
    const foodid = inner.save;
    const matchingfood = getfood(foodid);
    if (!matchingfood) continue;

    const deliveryOptionId = inner.deliveryOptionId;
    let deliveryOption = deliveryOptions.find(o => o.id === deliveryOptionId) || deliveryOptions[0] || { deliveryDays: 0 };

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd D MMMM YYYY');

    // initialTimerText: use inner.timerId (unique per cart item)
    let initialTimerText = '24:00:00';
    const timerId = inner.timerId || ''; // may be undefined
    if (timerId && timersMap && timersMap[timerId]) {
      const nowUnix = dayjs().unix();
      let left = timersMap[timerId] - nowUnix;
      if (left < 0) left = 0;
      const hh = String(Math.floor(left / 3600)).padStart(2, '0');
      const mm = String(Math.floor((left % 3600) / 60)).padStart(2, '0');
      const ss = String(left % 60).padStart(2, '0');
      initialTimerText = `${hh}:${mm}:${ss}`;
    }

    // container includes timer-id in classes & data attributes so timers.js can find the exact element(s)
    const containerClass = timerId ? `js-cart-item-container-${timerId}` : `js-cart-item-container-${matchingfood.save}`;

    contain += `
      <div class="cart-item-containers ${containerClass}" style="background-image: url(media/no4.jpg); background-repeat: no-repeat;background-size: 100%">
        <div class="timer" data-timer-id="${timerId}" data-food="${matchingfood.save}">${initialTimerText}</div>
        <div class="delivery-date">Ordered for: ${dateString}</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingfood.Image}">
          <div class="cart-item-details">
            <div class="product-name">${matchingfood.name}</div>
            <div class="product-price">D${matchingfood.price}</div>
            <div class="product-quantity">
              <span>Quantity: <span class="quantity-label">${inner.quantity}</span></span>
              <button class="delete-quantity-link btn" data-timer-id="${timerId || ''}" data-food="${matchingfood.name}" style='background-color: rgb(9, 253, 9);  border-bottom: solid white 3px;'>Delete</button>
            </div>
          </div>
          <div class="reaction-options">
            <div class="top"> Select Ur Order Date</div>
            ${deliveryOptionsHtml(matchingfood, inner)}
          </div>
        </div>
        <div class="usernameDiv">🧑‍🍳 Ordered by: <strong class='ano'>${userName}</strong></div>
      </div>`;
  }

  function deliveryOptionsHtml (matchingfood, inner) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd D MMM YY');
      const ischecked = deliveryOption.id === inner.deliveryOptionId;
      html += `
        <div class="reaction-options-pick js-delivery-options" data-save="${matchingfood.name}" data-delivery-option-id="${deliveryOption.id}">
          <label class="l3">
            <input type="radio" name="feel-${matchingfood.name}" value="${deliveryOption.id}" ${ischecked ? 'checked' : ''} />
            Order Date: ${dateString}
          </label>
        </div>`;
    });
    return html;
  }

  container.innerHTML = contain;
  paymentsummary(cart);
  attachDeleteButtons();
  attachUpdateButtons();
  reverse();

  // reattach listeners for newly inserted DOM (delivery change listener)
  container.addEventListener('change', async (e) => {
    const input = e.target;
    if (!input || input.tagName !== 'INPUT' || input.type !== 'radio') return;
    const optionWrapper = input.closest('.js-delivery-options');
    if (!optionWrapper) return;
    const save = optionWrapper.dataset.save;
    const deliveryOptionId = input.value;
    try {
      await updateDeliveryOption(save, deliveryOptionId);
      updateDeliveryDateUI(save, deliveryOptionId);
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(userRef);
        const newCart = snap.exists() ? (snap.data().cart || []) : [];
        displayFullCart(newCart);
      }
    } catch (err) {
      console.error("Error updating delivery option:", err);
      alert("Failed to save delivery date. Try again.");
    }
  });
}

// Delete button: only allow delete when timer not expired (or no timer)
function attachDeleteButtons() {
  document.querySelectorAll('.delete-quantity-link').forEach((link) => {
    link.addEventListener('click', async () => {
      const timerId = link.dataset.timerId || '';
      const foodNameToDelete = link.dataset.food;

      try {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const currentCart = data.cart || [];
        const currentMoney = data.money || 0;

        // find cart item index to delete: first matching by timerId if set, else match by save/name
        let indexToDelete = -1;
        if (timerId) {
          indexToDelete = currentCart.findIndex(item => item.timerId === timerId);
        }
        if (indexToDelete === -1) {
          // fallback: match by save === foodNameToDelete OR by name matching
          indexToDelete = currentCart.findIndex(item => item.save === foodNameToDelete || getfood(item.save)?.name === foodNameToDelete);
        }
        if (indexToDelete === -1) {
          console.warn('Delete: cart item not found in firestore cart for', foodNameToDelete, timerId);
          return;
        }

        const itemToDelete = currentCart[indexToDelete];

        // Check timer state: if there is a timerId and it's expired -> block deletion
        if (itemToDelete.timerId) {
          const expiry = timersMap[itemToDelete.timerId];
          const now = dayjs().unix();
          if (expiry && expiry <= now) {
            alert('This item has reached its 24-hour lock and cannot be deleted.');
            return; // block delete
          }
        }

        // Proceed deletion: remove item and refund money
        const matchingFoodItem = food.find(f => f.name === itemToDelete.save) || getfood(itemToDelete.save) || null;
        const refundAmount = matchingFoodItem ? (matchingFoodItem.price * itemToDelete.quantity) : 0;
        const updatedCart = currentCart.filter((_, i) => i !== indexToDelete);

        // Update Firestore: set new cart and money
        await setDoc(userRef, {
          cart: updatedCart,
          money: currentMoney + refundAmount,
          lastDeleteTime: Date.now()
        }, { merge: true });

        // If the deleted item had a timer, remove timer doc too
        if (itemToDelete.timerId) {
          try {
            await deleteTimerDoc(itemToDelete.timerId, db, auth);
          } catch (e) {
            // non-fatal, timer doc may have expired or already removed
            console.warn('Failed to delete timer doc after cart deletion', e);
          }
        }

        // Update local timersMap (best-effort)
        if (itemToDelete.timerId && timersMap[itemToDelete.timerId]) {
          delete timersMap[itemToDelete.timerId];
        }

        // re-render cart
        displayFullCart(updatedCart);
      } catch (error) {
        console.error("❌ Error during delete:", error);
        alert("❌ Error: " + error.message);
      }
    });
  });
}

// other helpers (attachUpdateButtons, reverse, updateDeliveryDateUI) remain unchanged...
function attachUpdateButtons() { /* same as before */ 
  document.querySelectorAll('.update-quantity-link').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cartItem = btn.closest('.cart-item-containers');
      if (!cartItem) return;
      cartItem.classList.add('is-editing-quantity');
    });
  });
}
function reverse (){
  document.querySelectorAll('.save-quantity-link ').forEach((reform)=>{
    reform.addEventListener('click', ()=>{
      const revert = reform.closest('.cart-item-containers')
      revert.classList.add('link-primary')
    });
  });
}
function updateDeliveryDateUI(save, deliveryOptionId) {
  const container = document.querySelector(`.js-cart-item-container-${save}`);
  if (!container) return;
  const option = deliveryOptions.find(o => o.id === deliveryOptionId);
  if (!option) return;
  const today = dayjs();
  const deliveryDate = today.add(option.deliveryDays, 'days');
  const dateString = deliveryDate.format('ddd /D /MMM /YYYY');
  const dateElem = container.querySelector('.delivery-date');
  if (dateElem) dateElem.textContent = `Confirmed date: ${dateString}`;
}
