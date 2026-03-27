/*
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getFirestore,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"; 
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const store = getFirestore(app)
function setmessage(alert, err = false) {
const message = document.getElementById('sendMsg')
if(!message) return;
message.style.color = err ? "#ff7b7b" : "#9cff9c";
message.textContent = alert
}
 document.getElementById('send').addEventListener('click',async ()=>{
  const recieverName = document.getElementById('email').value.trim().toLowerCase();
const amount = Number( document.getElementById('money').value);

if(!recieverName ||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recieverName)){
setmessage('Invalid Name', true);

}
if(!amount || amount <= 0 || !Number.isFinite(amount)){
  setmessage('Invalid amount', true)

}
setmessage('processing.....');
try{
  const user = auth.currentUser;
  if(!user) Error('Try logging in first');
  const libery = collection(store, 'users')
const shelf = query(libery, where("name", "==", recieverName))
  const books = await getDocs(shelf);
  if(books.empty()){
    setmessage(`${recieverName} not found`)
    return
  }
  const recieverDoc = books.docs[0];
  const recieverUid = recieverDoc.id;
  if(recieverUid === user.uid ){
    setmessage('You cant send money to yourself', true)
    return
  }
   const useref = doc(store, 'users', user.uid)
   const receiver = doc(store, 'users', recieverUid);

runTransaction(store, transaction =>{
  const getUser = transaction.get(useref);
  const getReciever = transaction.get(receiver)

   if(getUser.exists()){
const userMoney = Number(getUser.data().money || 0);
  transaction.update(useref,{money: userMoney - amount})

  }
  if(getReciever.exists()){
    const recieverMoney = Number(getReciever.data().money || 0);
      transaction.update(useref,{money: recieverMoney + amount})
  }
      if (userMoney < amount) {
        throw new Error("Insufficient funds.");
      }

   
})
setmessage(`sent D${amount} to ${recieverName}`)
 }catch(err){
  setmessage(err.message,`Failed to send money to ${recieverName}`, true)
 }
})


/*if(getUser.exists()){
const userMoney = Number(getUser.data().money || 0);
  transaction.update(useref,{money: userMoney - amount})

  }
  if(getReciever.exists()){
    const recieverMoney = Number(getReciever.data().money || 0);
      transaction.update(useref,{money: recieverMoney + amount})

  }*/


      import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  getFirestore,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js"; 
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAgcibxEec8dwJb4TZuQrmeoUM3pjylrBk",
  authDomain: "food-canteen-app-77e31.firebaseapp.com",
  projectId: "food-canteen-app-77e31"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const store = getFirestore(app);

function setmessage(text, err = false) {
  const message = document.getElementById('sendMsg');
  if (!message) return;
  message.style.color = err ? "#ff7b7b" : "#9cff9c";
  message.textContent = text;
}

let useruid = 'Loading...'; 
const user = auth.currentUser;
if (user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // 2. Update the variable
      useruid = data.id || "Anonymous";
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    useruid = "Error";
  }
}




const sendBtn = document.getElementById('send');
if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
  
    const recieverName = document.getElementById('email').value.trim();
    const amount = Number(document.getElementById('money').value);

    if (!recieverName || !/^(?!\s*$).+/.test(recieverName)) {
      setmessage('Invalid id', true);
      return;
    }
    if (!amount || amount <= 0 || !Number.isFinite(amount)) {
      setmessage('Invalid amount', true);
      return;
    }

    setmessage('Processing...');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Try logging in first');

    
      const usersCol = collection(store, 'users');
      const q = query(usersCol, where('id', '==', recieverName));
      const books = await getDocs(q);

      if (books.empty) {
        setmessage(`${recieverName} not found`, true);
        return;
      }

      const recieverDoc = books.docs[0];
      const recieverUid = recieverDoc.id;

      if (recieverUid === user.uid) {
        setmessage("You can't send money to yourself", true);
        return;
      }

      const senderRef = doc(store, 'users', user.uid);
      const recipientRef = doc(store, 'users', recieverUid);

     
      await runTransaction(store, async (transaction) => {
        const senderSnap = await transaction.get(senderRef);
        const recipientSnap = await transaction.get(recipientRef);

        const senderMoney = (senderSnap.exists() && Number(senderSnap.data().money)) || 0;
        if (senderMoney < amount) {
          throw new Error("Insufficient funds.");
        }

        const recipientMoney = (recipientSnap.exists() && Number(recipientSnap.data().money)) || 0;

    
        transaction.update(senderRef, { money: senderMoney - amount });
        transaction.update(recipientRef, { money: recipientMoney + amount });

       
        const txRef = doc(collection(store, "transactions")); // auto-id
        transaction.set(txRef, {
          from: user.uid,
          to: recieverUid,
          amount,
          timestamp: serverTimestamp(),
          fromName: senderSnap.exists() ? senderSnap.data().id|| null : null,
          toName: recipientSnap.exists() ? recipientSnap.data().id || null : null
        });
      });

      setmessage(`Sent D${amount} to user: ${recieverName}`);
    } catch (err) {
      console.error(err);
      setmessage(err.message || "Failed to send money", true);
    }
  });
} else {
  console.warn("send button (#send) not found in DOM — listener not attached.");
}

