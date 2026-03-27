// cart/user.js (debug-friendly, self-contained)
// Drop into your project (replace the previous cart/user.js).
// Requires being loaded as a module: <script type="module" src="cart/user.js"></script>

import { getfood } from "../food.unit/food.js"; // keep path consistent

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  query,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ---------- firebase config ----------
const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};

let app;
if (!getApps || getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getFirestore(app);

// ---------- helpers for terms ----------
function getCurrentTermKey(date = new Date()){
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  if (month >= 9) return `firstTerm_${year}`;
  if (month >= 4) return `thirdTerm_${year}`;
  return `secondTerm_${year}`;
}
function termKeyToLabel(key){
  const m = key.match(/(firstTerm|secondTerm|thirdTerm)_(\d{4})/i);
  if (!m) return key;
  const pretty = m[1] === 'firstTerm' ? 'First Term' : (m[1] === 'secondTerm' ? 'Second Term' : 'Third Term');
  return `${pretty} ${m[2]}`;
}
function getCurrentTermLabel(){ return termKeyToLabel(getCurrentTermKey()); }

// ---------- UI setup ----------
function ensureUI() {
  // header
  let header = document.getElementById('header');
  if (!header) {
    header = document.createElement('div');
    header.id = 'header';
    header.style.cssText = 'display:flex;gap:12px;align-items:center;position:fixed;top:0;left:0;right:0;padding:10px;background:#f3f0e6;z-index:999';
    const rel = document.createElement('div');
    rel.id = 'rel';
    const input = document.createElement('input');
    input.id = 'input';
    input.placeholder = 'Search users...';
    input.style.cssText = 'padding:8px 12px;border-radius:6px;border:3px solid #ccc;';
    rel.appendChild(input);
    const cvsBtn = document.createElement('button');
    cvsBtn.id = 'cvs';
    cvsBtn.textContent = 'Cvs File';
    cvsBtn.style.cssText = 'padding:8px 12px;border-radius:6px;background:#111;color:#fff;border:none;cursor:pointer';
    header.appendChild(rel);
    header.appendChild(cvsBtn);
    document.body.appendChild(header);

    // spacer so content isn't hidden under fixed header
    const spacer = document.createElement('div');
    spacer.id = 'header-spacer';
    spacer.style.height = '64px';
    document.body.insertBefore(spacer, document.body.firstChild.nextSibling);
  }

  // container
  let container = document.getElementById('container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'container';
    container.style.cssText = 'margin:20px;padding:10px;';
    document.body.appendChild(container);
  }

  // attach click once for export button (may be re-attached but safe)
  const cvsBtn = document.getElementById('cvs');
  cvsBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    cvsBtn.disabled = true;
    cvsBtn.textContent = 'Preparing CSV...';
    try {
      await exportAllTermsCsv();
    } catch (err) {
      console.error('CSV export failed', err);
      alert('CSV export failed — see console');
    } finally {
      cvsBtn.disabled = false;
      cvsBtn.textContent = 'Cvs File';
    }
  });

  // live search (debounced)
  const search = document.getElementById('input');
  let to = null;
  search.addEventListener('input', () => {
    clearTimeout(to);
    to = setTimeout(() => {
      filterTableRows(search.value.trim().toLowerCase());
    }, 180);
  });
}

// ---------- rendering ----------
function renderTable(rows, termLabel = getCurrentTermLabel()) {
  ensureUI();
  const container = document.getElementById('container');

  // create table markup
  const table = document.createElement('table');
  table.setAttribute('border', '1');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.fontFamily = 'Arial, Helvetica, sans-serif';
  table.style.fontSize = '18px';
  table.style.color = '#111';

  // header
  table.innerHTML = `
    <thead>
      <tr><th colspan="4" class="main-header" style="padding:12px;background:#222;color:#fff;text-align:center;">${escapeHtml(termLabel)}</th></tr>
      <tr style="background:#eee;color:#000">
        <th style="padding:8px;text-align:left">Name</th>
        <th style="padding:8px;text-align:left">UserID</th>
        <th style="padding:8px;text-align:left">Email</th>
        <th style="padding:8px;text-align:right">AmountUsed</th>
        <th style="padding:8px;text-align:right">CurrentBalance</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector('tbody');

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="padding:16px;text-align:center;color:#666">No users found</td></tr>`;
  } else {
    tbody.innerHTML = rows.map(r => `
      <tr>
        <td style="padding:8px;border-bottom:3px solid #ddd">${escapeHtml(r.name)}</td>
        <td style="padding:8px;border-bottom:3px solid #ddd">${escapeHtml(r.userIdField)}</td>
        <td style="padding:8px;border-bottom:3px solid #ddd">${escapeHtml(r.email)}</td>
        <td style="padding:8px;border-bottom:3px solid #ddd;text-align:right">${Number(r.amountUsed||0).toFixed(2)}</td>
        <td style="padding:8px;border-bottom:3px solid #ddd;text-align:right">${Number(r.money||0).toFixed(2)}</td>
      </tr>
    `).join('');
  }

  // replace existing content
  const containerEl = document.getElementById('container');
  containerEl.innerHTML = '';
  containerEl.appendChild(table);
}

// ---------- helpers ----------
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"]/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c] || c
  );
}

function filterTableRows(q) {
  const table = document.querySelector('#container table');
  if (!table) return;
  const trs = Array.from(table.querySelectorAll('tbody tr'));
  if (!q) {
    trs.forEach(tr => tr.style.display = '');
    return;
  }
  trs.forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// compute cart total using getfood fallback
function computeCartTotal(userData){
  const cart = Array.isArray(userData?.cart) ? userData.cart : [];
  let sum = 0;
  for (const item of cart) {
    let price = 0;
    try {
      if (typeof getfood === 'function') {
        const f = getfood(item.save);
        price = (f && f.price != null) ? Number(f.price) : Number(item.price ?? 0);
      } else {
        price = Number(item.price ?? 0);
      }
    } catch (e) {
      price = Number(item.price ?? 0);
    }
    const qty = Number(item.quantity ?? 1);
    sum += (price * qty);
  }
  return sum;
}

// ---------- data fetch & render ----------
async function fetchAndShowUsers() {
  ensureUI();
  console.log('Fetching users from Firestore...');
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    if (!snap || !snap.docs) {
      console.warn('No documents returned from users collection.');
      renderTable([], getCurrentTermLabel());
      return;
    }

    const rows = [];
    for (const d of snap.docs) {
      const u = d.data() || {};
      const name = u.name || '';
      const userIdField = (u.id != null) ? String(u.id) : d.id;
      const email = u.email || '';
      const money = Number(u.money ?? 0);

      // compute amountUsed as sum of cart if terms not present; if terms exist we sum them
      let amountUsed = 0;
      if (u.terms && typeof u.terms === 'object' && Object.keys(u.terms).length > 0) {
        // sum all terms into single AmountUsed column (you said you wanted one number per user)
        for (const [k,v] of Object.entries(u.terms)) {
          amountUsed += Number((v && v.amountUsed) ? v.amountUsed : 0);
        }
      } else {
        // fallback — compute current cart total
        amountUsed = computeCartTotal(u);
      }

      rows.push({ name, userIdField, email, amountUsed, money });
    }

    console.log(`Fetched ${rows.length} users.`);
    renderTable(rows, getCurrentTermLabel());
  } catch (err) {
    console.error('Error fetching users:', err);
    // If this is a permissions error, show explicit guidance
    if (err && err.code && err.code === 'permission-denied' || /permission/i.test(String(err))) {
      alert('Permission error reading users. Check Firestore rules for the "users" collection (Missing or insufficient permissions). See console for details.');
    } else {
      alert('Failed to fetch users — see console for details.');
    }
    renderTable([], getCurrentTermLabel());
  }
}

// ---------- export CSV (all terms) ----------
async function exportAllTermsCsv(){
  try {
    const usersCol = collection(db, 'users');
    const snap = await getDocs(usersCol);
    if (!snap || !snap.docs) {
      alert('No users found.');
      return;
    }

    const rows = [];
    for (const userDoc of snap.docs) {
      const u = userDoc.data() || {};
      const name = u.name || '';
      const userIdField = (u.id != null) ? String(u.id) : userDoc.id;
      const email = u.email || '';
      const currentBalance = Number(u.money ?? 0);

      if (u.terms && typeof u.terms === 'object' && Object.keys(u.terms).length > 0) {
        for (const [tk, val] of Object.entries(u.terms)) {
          rows.push({
            termLabel: termKeyToLabel(tk),
            name,
            userId: userIdField,
            email,
            amountUsed: Number(val?.amountUsed ?? 0),
            balance: currentBalance
          });
        }
      } else {
        // fallback: current term with computed cart
        rows.push({
          termLabel: getCurrentTermLabel(),
          name,
          userId: userIdField,
          email,
          amountUsed: computeCartTotal(u),
          balance: currentBalance
        });
      }
    }

    if (!rows.length) {
      alert('Nothing to export.');
      return;
    }

    // build CSV
    const header = ['Term','Name','UserID','Email','AmountUsed','CurrentBalance'];
    const escape = s => {
      if (s == null) return '';
      const str = String(s);
      if (/[,"\r\n]/.test(str)) return `"${str.replace(/"/g,'""')}"`;
      return str;
    };
    const lines = [header.map(escape).join(',')];
    for (const r of rows) {
      lines.push([r.termLabel, r.name, r.userId, r.email, Number(r.amountUsed||0).toFixed(2), Number(r.balance||0).toFixed(2)].map(escape).join(','));
    }
    const csvText = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_terms_export_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('CSV export failed:', err);
    if (err && /permission/i.test(String(err))) {
      alert('Permission error exporting CSV. Check Firestore rules for reads.');
    } else {
      alert('CSV export failed — see console for details.');
    }
    throw err;
  }
}

// ---------- helper to add amount to user's current term ----------
export async function addAmountToUserTerm(userUid, amount) {
  try {
    if (!userUid) throw new Error('no userUid provided');
    const termKey = getCurrentTermKey();
    const userRef = doc(db, 'users', userUid);
    await updateDoc(userRef, {
      [`terms.${termKey}.amountUsed`]: increment(Number(amount)),
      [`terms.${termKey}.updatedAt`]: serverTimestamp()
    });
    console.log(`Successfully added ${amount} to ${userUid} ${termKey}`);
    return true;
  } catch (err) {
    console.error('addAmountToUserTerm error:', err);
    throw err;
  }
}

// also expose on window for convenience
window.addAmountToUserTerm = addAmountToUserTerm;
window.exportAllTermsCsv = exportAllTermsCsv;

// ---------- start up ----------
ensureUI();
fetchAndShowUsers(); // immediate fetch on load

// optional: attach realtime updates (comment/uncomment if you want live updates)
// const q = query(collection(db, 'users'));
// onSnapshot(q, snap => {
//   console.log('Realtime snapshot received');
//   fetchAndShowUsers(); // re-fetch to keep logic simple
// }, err => {
//   console.warn('Realtime users snapshot error (ignored):', err);
// });

console.log('cart/user.js loaded — attempting to fetch and render users.');


// ----------------- Prefix search with column-aware matching -----------------

// normalize to lowercase letters+digits only
function _normalizeForSearch(str) {
  return String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Apply filter: letter-only -> match Name (col 0) and Email (col 2) prefixes;
// digit-only -> match UserID (col 1) prefix;
// mixed -> match any cell prefix.
// Show row only if the specified column(s) START WITH the query.
function applyUserFilter() {
  const rawQ = window._userFilter || '';
  const q = _normalizeForSearch(rawQ);
  const table = document.querySelector('#container table');
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  if (!q) {
    rows.forEach(r => (r.style.display = ''));
    return;
  }

  const isDigitsOnly = /^[0-9]+$/.test(q);
  const isLettersOnly = /^[a-z]+$/.test(q);

  rows.forEach(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    let matched = false;

    if (isDigitsOnly) {
      // UserID is column index 1 in our table (Name=0, UserID=1, Email=2,...)
      const userIdCell = (cells[1] || {}).textContent || '';
      const norm = _normalizeForSearch(userIdCell);
      matched = norm.startsWith(q);
    } else if (isLettersOnly) {
      // Prefer Name then Email (col 0 and 2)
      const nameCell = (cells[0] || {}).textContent || '';
      const emailCell = (cells[2] || {}).textContent || '';
      const n1 = _normalizeForSearch(nameCell);
      const n2 = _normalizeForSearch(emailCell);
      matched = n1.startsWith(q) || n2.startsWith(q);
    } else {
      // Mixed or other: check any cell's prefix
      for (const cell of cells) {
        const txt = _normalizeForSearch(cell.textContent || '');
        if (txt.startsWith(q)) { matched = true; break; }
      }
    }

    row.style.display = matched ? '' : 'none';
  });
}

// Wire input filter: store raw query and call applyUserFilter on input
(function wireInputFilterPrefixSmart() {
  if (typeof ensureUI === 'function') ensureUI();

  const input = document.getElementById('input');
  if (!input) {
    console.warn('Search input #input not found — prefix filter disabled.');
    return;
  }

  window._userFilter = window._userFilter || '';
  window._userFilterRaw = window._userFilterRaw || '';

  input.addEventListener('input', (ev) => {
    const raw = String(ev.target.value || '');
    window._userFilterRaw = raw;
    window._userFilter = raw;
    applyUserFilter();
  });

  // apply stored filter after small delay (useful if table already exists)
  setTimeout(() => applyUserFilter(), 50);
})();



  applyUserFilter();