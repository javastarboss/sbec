// cart/cart.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ---- Firebase config (same as your other files) ----
const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};

// initialize (safe to call multiple times in modules)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---- Local cart (exported so other modules can read it) ----
export let cart = [
 
];

// ---- Add to cart (updates local cart and saves to Firestore) ----
export async function addtocart(save, price = 0) {
  // update local cart
  let matchingItem = cart.find(item => item.save === save);
  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({ save, quantity: 1, price, deliveryOptionId: '1' });
  }

  // persist to Firestore (if user logged in)
  const user = auth.currentUser;
  if (!user) return; // offline/local only if not signed in
  const userRef = doc(db, 'users', user.uid);
  try {
    await updateDoc(userRef, { cart: cart });
  } catch (err) {
    // if user doc doesn't exist, create it
    await setDoc(userRef, { cart: cart }, { merge: true });
  }
}

// ---- Save current local cart to Firestore (helper) ----
export async function saveCartToFirestore() {
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, { cart: cart });
}

// ---- Remove an item from cart (by product name 'save') ----
export async function removeFromCart(save) {
  // remove locally
  cart = cart.filter(item => item.save !== save);

  // persist to Firestore
  const user = auth.currentUser;
  if (!user) return cart;
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, { cart: cart });
  return cart;
}

// ---- Update delivery option for a single cart item
//    (saves to Firestore and keeps local export in sync)
export async function updateDeliveryOption(save, newDeliveryOptionId) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // prefer server copy but fall back to local cart
    const currentCart = snap.exists() ? (snap.data().cart || []) : cart;

    const item = currentCart.find(i => i.save === save);
    if (!item) {
      // update local if present and inform caller
      const localItem = cart.find(i => i.save === save);
      if (localItem) localItem.deliveryOptionId = newDeliveryOptionId;
      throw new Error("Cart item not found");
    }

    item.deliveryOptionId = newDeliveryOptionId;

    // Write back to Firestore
    await updateDoc(userRef, { cart: currentCart });

    // update local exported cart
    cart = currentCart;

    return currentCart;
  } catch (err) {
    console.error("updateDeliveryOption error:", err);
    throw err;
  }
}

// ---- Utility: load cart from Firestore into local `cart` array ----
export async function loadCartFromFirestore() {
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;
  const data = snap.data();
  const remoteCart = data.cart || [];
  // replace local cart contents (preserve reference by emptying & pushing)
  cart.length = 0;
  remoteCart.forEach(i => cart.push(i));
  return cart;
}
