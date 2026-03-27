// timers.js
// Real-time ticking timers + hide delete button on expiry

// timers.js
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  deleteDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export let timersMap = {}; // timerId -> expiryUnixSeconds (UTC)
const DAY_MS = 24 * 3600 * 1000;

let unsubscribeTimers = null;
let attachedForUid = null;
let tickInterval = null;

function nowUnix() { return Math.floor(Date.now() / 1000); }
function msToUnix(ms) { return Math.floor(ms / 1000); }
function tsToMs(ts) {
  if (!ts) return null;
  if (typeof ts === 'number') return ts;
  if (ts.toMillis) return ts.toMillis();
  if (ts.toDate) return ts.toDate().getTime();
  return null;
}
function pad(n){ return String(n).padStart(2,'0'); }
function formatSecondsToHHMMSS(s){ if (s <= 0) return '00:00:00'; const hh = Math.floor(s/3600); const mm = Math.floor((s%3600)/60); const ss = s%60; return `${pad(hh)}:${pad(mm)}:${pad(ss)}`; }

// single 1s tick loop: updates all visible .timer[data-timer-id]
function updateAllTimerElements() {
  const now = nowUnix();
  document.querySelectorAll('.timer[data-timer-id]').forEach(el => {
    const timerId = el.dataset.timerId;
    const expiry = timersMap[timerId];
    const cartItem = el.closest('.cart-item-containers') || document.querySelector(`.js-cart-item-container-${timerId}`);
    const deleteBtn = cartItem ? cartItem.querySelector('.delete-quantity-link') : null;

    if (!expiry) {
      el.textContent = '24:00:00';
      if (deleteBtn) { deleteBtn.style.display = ''; deleteBtn.disabled = false; }
      return;
    }

    const remaining = expiry - now;
    el.dataset.expiry = String(expiry);
    if (remaining <= 0) {
      el.textContent = '00:00:00';
      if (deleteBtn) { deleteBtn.style.display = 'none'; deleteBtn.disabled = true; }
    } else {
      el.textContent = formatSecondsToHHMMSS(remaining);
      if (deleteBtn) { deleteBtn.style.display = ''; deleteBtn.disabled = false; }
    }
  });
}

function ensureTickLoop() {
  if (tickInterval) return;
  updateAllTimerElements();
  tickInterval = setInterval(updateAllTimerElements, 1000);
}
function clearTickLoop() { if (tickInterval) clearInterval(tickInterval); tickInterval = null; }

/**
 * initUserTimers(auth, db)
 * Attaches a snapshot to users/{uid}/timers -> updates timersMap (timerId -> expiryUnix)
 */
export function initUserTimers(auth, db) {
  const attach = () => {
    const user = auth.currentUser;
    if (!user) { console.log('[timers] no user to attach'); return; }
    if (attachedForUid === user.uid) { ensureTickLoop(); return; }

    if (unsubscribeTimers) { try { unsubscribeTimers(); } catch(e){} unsubscribeTimers = null; }
    attachedForUid = user.uid;
    timersMap = {};
    clearTickLoop();

    const col = collection(db, 'users', user.uid, 'timers');
    console.log('[timers] attaching snapshot ->', `users/${user.uid}/timers`);
    unsubscribeTimers = onSnapshot(col, (snap) => {
      const map = {};
      snap.forEach(d => {
        const data = d.data();
        if (!data) return;
        if (typeof data.endMs === 'number') {
          map[d.id] = msToUnix(data.endMs);
          return;
        }
        const startMs = tsToMs(data.startTimestamp);
        if (!startMs) return;
        map[d.id] = msToUnix(startMs + DAY_MS);
      });
      timersMap = map;
      // console for debugging
      console.log('[timers] snapshot ->', timersMap);
      ensureTickLoop();
      updateAllTimerElements();
    }, err => console.error('[timers] onSnapshot error', err));
  };

  if (auth.currentUser) { attach(); return; }
  const unsub = onAuthStateChanged(auth, user => {
    if (user) { attach(); unsub(); }
  });
}

/**
 * createTimerForCartItem(foodId, db, auth)
 * - Create a new timer doc with a unique timerId under users/{uid}/timers/{timerId}
 * - Writes { foodId, startTimestamp: serverTimestamp(), endMs }
 * - Returns timerId (string)
 */
export async function createTimerForCartItem(foodId, db, auth) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not signed in');
  const timerId = `${foodId.replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const timerRef = doc(db, 'users', user.uid, 'timers', timerId);
  const nowMs = Date.now();

  try {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(timerRef);
      if (!snap.exists()) {
        tx.set(timerRef, {
          foodId,
          startTimestamp: serverTimestamp(),
          endMs: nowMs + DAY_MS,
          status: 'running'
        }, { merge: true });
      } else {
        // If exists, check expiry and possibly restart
        const data = snap.data();
        if (typeof data.endMs === 'number' && Date.now() >= data.endMs) {
          tx.update(timerRef, { startTimestamp: serverTimestamp(), endMs: nowMs + DAY_MS, status: 'running' });
        } else if (!data.endMs) {
          tx.update(timerRef, { startTimestamp: serverTimestamp(), endMs: nowMs + DAY_MS, status: 'running' });
        }
      }
    });
    console.log('[timers] created timer', timerId, 'for', foodId);
    return timerId;
  } catch (err) {
    console.error('[timers] createTimerForCartItem failed', err);
    throw err;
  }
}

/**
 * deleteTimerDoc(timerId, db, auth) - deletes a specific timer doc (use when cart item removed)
 */
export async function deleteTimerDoc(timerId, db, auth) {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const ref = doc(db, 'users', user.uid, 'timers', timerId);
    // safe: only delete if exists
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    await deleteDoc(ref);
    console.log('[timers] deleted timer doc', timerId);
  } catch (e) {
    console.warn('[timers] deleteTimerDoc failed', e);
  }
}
