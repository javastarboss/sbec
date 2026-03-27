


import { cart } from "./cart.js";
import { getfood } from "../food.unit/food.js";
import { deliveryOptions } from "./delivery-option.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
increment,
  
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const stores = getFirestore(app);



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

onAuthStateChanged(auth, async(user)=>{
  if(user){
    Loading()
    const store = doc(stores, 'users', user.uid);
    const togetstore = await getDoc(store)
    if(togetstore.exists()){
      const cart = togetstore.data().cart ;
      display(cart)
      dayjs()
    }
  } else {
    window.location.href='login.html';
  }
})

async function display(cart) {
  const user = auth.currentUser;
  let userName = "Anonymous";
  if (user) {
    const userRef = doc(stores, "users", user.uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      userName = data.name || "Anonymous";
    }
  }

  const all = document.querySelector('.js-orders');
  if (!all) return;
  let sets = "";

  cart.forEach(inner => {
    const matchingfood = getfood(inner.save);
    if (!matchingfood) return;

    const deliveryOption = deliveryOptions.find(o => o.id === inner.deliveryOptionId) || { deliveryDays: 0 };
    const dateString = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd D MMMM YYYY');
    const totalPrice = Number(matchingfood.price || 0) * Number(inner.quantity || 0);

    sets += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date"><img class='img' src = 'media/image.png'><br>
              <div class="order-header-label label">Order Placed: ${dateString}</div>
            </div>
          </div>
        </div>

        <div class="product-details">
          <div class="order-header-right-section">
            <div class="order-header-label">Name: ${userName}</div>
          </div>
            <div class="product-name">Order: ${matchingfood.name}</div>
            <div class="product-delivery-date foodi">Price: D${matchingfood.price}</div>
            <div class="product-quantity "> Ordered: ${inner.quantity}</div>
            <div class="order-total">
              <div class="order-header-label">Total: D${totalPrice.toFixed(2)}</div>
            </div>
        </div>
      </div>
    `;
  });

  all.innerHTML = sets;
}
display(cart);

async function printAllReceipts() {
  try {
    const usersCol = collection(stores, 'users');
    const snapshot = await getDocs(usersCol);

    if (snapshot.empty) {
      alert('No users found.');
      return;
    }

    let receiptsHtml = '';

    snapshot.forEach(userDoc => {
      const userData = userDoc.data();
      const userName = userData.name || 'Anonymous';
      const cart = Array.isArray(userData?.cart) ? userData.cart : [];
      if (!cart.length) return;

      cart.forEach(inner => {
        const matchingfood = getfood(inner.save);
        if (!matchingfood) return;

        const deliveryOption = deliveryOptions.find(o => o.id === inner.deliveryOptionId) || { deliveryDays: 0 };
        const dateString = dayjs().add(deliveryOption.deliveryDays, 'days').format('dddd D MMMM YYYY');
        const totalPrice = Number(matchingfood.price || 0) * Number(inner.quantity || 0);

        receiptsHtml += `
        <div class="order-container" style="width:320px; margin: 20px auto; box-shadow: 0 10px 15px rgba(0,0,0,0.4); font-family: Arial, Helvetica, sans-serif;">
          <div class="order-header" style="background-color:#000; color:#fff; padding:15px; text-align:center;">
            <img src="images1/iconss/sbeclogo.png" style="width:100px; display:block; margin:0 auto 10px;" />
            <div style="font-weight:900;">Order Placed: ${dateString}</div>
          </div>
          <div class="product-details" style="background:#fff; padding:15px; border:1px solid #000; border-top:none;">
            <div style="border-bottom:1px solid #000; padding:10px 0; font-weight:700;">Name: ${escapeHtml(userName)}</div>
            <div style="border-bottom:1px solid #000; padding:20px 0; font-weight:700;">Order: ${escapeHtml(matchingfood.name)}</div>
            <div style="border-bottom:1px solid #000; padding:20px 0; font-weight:700;">Price: D${matchingfood.price}</div>
            <div style="border-bottom:1px solid #000; padding:20px 0; font-weight:700;">Ordered: ${inner.quantity}</div>
            <div style="padding:5px 0; font-weight:900; border-top:1px solid #000;">Total: D${totalPrice.toFixed(2)}</div>
          </div>
        </div>
        <div style="page-break-after:always;"></div>
        `;
      });
    });

    if (!receiptsHtml) {
      alert('No receipts to print.');
      return;
    }

    const fullHtml = `
      <html>
      <head>
        <title>All Receipts</title>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <style>
          body { background:#fff; color:#000; margin:0; padding:0; }
          .order-container { page-break-inside:avoid; }
        </style>
      </head>
      <body>
        ${receiptsHtml}
      </body>
      </html>
    `;

    const w = window.open('', '_blank', 'top=50,left=50,width=420,height=800');
    if (!w) { alert('Popup blocked — allow popups to print.'); return; }
    w.document.open();
    w.document.write(fullHtml);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);

    // deletion only after user confirms post-print
    w.onafterprint = async () => {
      const confirmed = confirm('Have the coupons been printed successfully?\n\nThis will delete the ordered food.');
      if (!confirmed) return;

      try {
        const snapshotAfterPrint = await getDocs(usersCol);
        for (const userDoc of snapshotAfterPrint.docs) {
          const userData = userDoc.data();
          const cart = Array.isArray(userData?.cart) ? userData.cart : [];
          if (cart.length > 0) {
            await updateDoc(userDoc.ref, { cart: [] });
          }
        }
        alert('All printed orders have been deleted from carts.');
      } catch (e) {
        console.error('Delete after print failed:', e);
        alert('Failed to delete cart after printing.');
      }
    };

  } catch (err) {
    console.error(err);
    alert('Failed to fetch or print receipts.');
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"]/g, s =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[s]
  );
}

document.getElementById('print-all-btn')?.addEventListener('click', () => {
  if (!confirm('Print all receipts now?')) return;
  printAllReceipts();
});



(function() {
  let uploadInput = document.querySelector('#bulk-image-input') || document.querySelector('.input');

  if (!uploadInput) {
    uploadInput = document.createElement('input');
    uploadInput.id = 'bulk-image-input';
    document.body.appendChild(uploadInput);
  }

  uploadInput.setAttribute('type', 'file');
  uploadInput.setAttribute('accept', 'image/*');
  uploadInput.setAttribute('multiple', '');
  uploadInput.style.display = '';


  async function ocrFile(file) {
    try {
      if (typeof Tesseract === 'undefined') {
        throw new Error('Tesseract not loaded. Make sure script tag is present in HTML.');
      }

      const worker = Tesseract.createWorker({
        logger: m => console.log('ocr', file.name, m)
      });
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(file);
      await worker.terminate();
      return data?.text || '';
    } catch (err) {
      console.error('ocrFile error', err);
      throw err;
    }
  }


 function parseLinesForIdAmount(text) {
  const results = [];
  if (!text || typeof text !== 'string') return results;

  // normalize OCR noise a bit
  const clean = text
    .replace(/\u00A0/g, ' ')
    .replace(/[,|•·\t]/g, ' ')
    .replace(/[^\S\r\n]+/g, ' ')
    .replace(/\r/g, '\n')
    .trim();

  // STRICT global regex:
  //  - id: 6 to 8 digits, optional trailing single letter (e.g. 2005937H or 15002332)
  //  - allow non-digit separators between id and amount (\D+)
  //  - amount: 3 to 6 digits (so we don't accidentally match '2' from "2ND")
  const globalRegex = /(\d{6,8}[A-Za-z]?)\D+([0-9]{3,6})/g;

  const matches = Array.from(clean.matchAll(globalRegex));
  for (const m of matches) {
    const rawId = m[1].trim();
    const rawAmt = m[2].trim();
    const id = rawId.replace(/\s+/g, '').toUpperCase();
    const amount = Number(rawAmt);
    if (!Number.isNaN(amount)) results.push({ id, amount, raw: m[0] });
  }

  // Debug: print what we parsed (uncomment during testing)
  // console.log('PARSED PAIRS:', results);
  return results;
}


  


  async function processFilesAndUpdateFirestore(files) {
    try {
      if (!files || files.length === 0) {
        alert('No images selected.');
        return;
      }

      const extractedEntries = [];
      for (const f of Array.from(files)) {
        console.log('Starting OCR for', f.name);
        const text = await ocrFile(f);
        console.log('OCR text for', f.name, text.slice(0,200));
        const parsed = parseLinesForIdAmount(text);
        parsed.forEach(p => p.sourceFile = f.name);
        extractedEntries.push(...parsed);
      }

      if (extractedEntries.length === 0) {
        alert('No ID/amount rows found in the uploaded images. Try clearer images or a CSV screenshot.');
        return;
      }

      const agg = {};
extractedEntries.forEach(e => {
  // normalize: remove spaces and uppercase (matches parser above)
  const key = String(e.id).replace(/\s+/g, '').toUpperCase();
  agg[key] = (agg[key] || 0) + Number(e.amount || 0);
});

      let summary = 'Will update these IDs (id: total):\n\n';
      Object.entries(agg).forEach(([id, amount]) => {
        summary += `${id}: ${amount}\n`;
      });
      summary += '\nProceed to update Firestore?';

      if (!confirm(summary)) {
        console.log('User cancelled Firestore update.');
        return;
      }

            // --- DEBUG: show exactly what will be updated
      console.log('Extracted entries (raw):', extractedEntries);
      console.log('Aggregated totals (agg):', agg);

      // Use atomic increment to avoid read->write races and simplify logic
      const updates = [];

     for (const [studentId, totalAmount] of Object.entries(agg)) {
  try {
    console.log('Matching studentId:', studentId, 'totalAmount:', totalAmount);
    const q = query(collection(stores, 'users'), where('id', '==', String(studentId)));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.warn('No user found for id:', studentId);
      continue;
    }

    for (const userDoc of snap.docs) {
      updates.push(updateDoc(userDoc.ref, { money: increment(Number(totalAmount)) }));
      console.log(`Queued update for doc ${userDoc.ref.path} : +${totalAmount}`);
    }
  } catch (err) {
    console.error('Failed matching/updating for id', studentId, err);
  }
}


      // Wait for all updates to complete and log result
      await Promise.all(updates);
      console.log('All queued updates completed.');


      await Promise.all(updates);
      alert('Done — Firestore updated for matched users. Check console for any unmatched IDs.');
      console.log('OCR entries:', extractedEntries);
      console.log('Aggregated:', agg);

    } catch (err) {
      console.error('Processing failed', err);
      alert('An error occurred while processing images. See console for details.');
    }
  }

  // attach handler to the input
  uploadInput.addEventListener('change', (ev) => {
    const files = ev.target.files;
    if (!files || files.length === 0) return;
    processFilesAndUpdateFirestore(files);
  });

  // expose function so your HTML inline onclick can call it
  window.processBulkImageUpload = () => {
    uploadInput.click();
  };

})(); 
// ---- END uploader ----







// ----------------- Export users purchases to CSV -----------------
async function exportUsersPurchasesToCsv() {
  try {
    // fetch all users
    const usersCol = collection(stores, 'users');
    const snap = await getDocs(usersCol);
    if (snap.empty) {
      alert('No users found.');
      return;
    }

    // CSV header
    const header = ['Name','UserID','Email','Food','ordered','UnitPrice','AmountReduced', 'CurrentAmount'];
    const rows = [header];

    // Build rows from each user's cart
    for (const userDoc of snap.docs) {
      const userData = userDoc.data() || {};
      const userName = userData.name || '';
      const userIdField = userData.id 
      const email = userData.email || '';
const money = userData.money || '';
      const cart = Array.isArray(userData.cart) ? userData.cart : [];

      // If user has no cart items, still add a row with empty food (optional)
      if (!cart.length) {
        // Uncomment next line if you want users with no purchases included:
        // rows.push([userName, userIdField, email, '', '', '', '']);
        continue;
      }

      // For each item in cart produce a row
      for (const item of cart) {
        // item.save is your key for the food item; getfood will return the product details if present
        const matching = typeof getfood === 'function' ? getfood(item.save) : null;
        const foodName = matching?.name || item.save || '';
        // Prefer price from foods DB, fallback to item.price or zero
        const unitPrice = Number(matching?.price ?? item.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        const total = (unitPrice * qty) || 0;
const amountReduced = (money - unitPrice) || 0;
        rows.push([
          userName,
          userIdField,
          email,
          foodName,
          String(qty),
          String(unitPrice),
          String(total)
        ]);
      }
    }

    // Convert rows to CSV text, escaping quotes and adding BOM for Excel
    function escapeCsvCell(cell) {
      if (cell == null) return '';
      const str = String(cell);
      // if contains comma, newline or quote, wrap in quotes and escape quotes
      if (/[,"\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    const csvText = '\uFEFF' + rows.map(r => r.map(escapeCsvCell).join(',')).join('\r\n');

    // Download as file
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_purchases.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    alert('CSV exported: users_purchases.csv (check your downloads).');
  } catch (err) {
    console.error('Export CSV failed:', err);
    alert('Failed to export CSV. Check console for details.');
  }
}

// Expose globally so you can call from console or an inline onclick
window.exportUsersCsv = exportUsersPurchasesToCsv;

// If you have a button with id="export-users-csv", attach automatically
const exportBtn = document.getElementById('export-users-csv');
if (exportBtn) exportBtn.addEventListener('click', exportUsersPurchasesToCsv);






