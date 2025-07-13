import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjYPyVv9qC88JGD8N1tnDZLT0hh1sZUtQ",
  authDomain: "locator-66521.firebaseapp.com",
  projectId: "locator-66521",
  storageBucket: "locator-66521.appspot.com",
  messagingSenderId: "322028471975",
  appId: "1:322028471975:web:ee77430c76935588187d82",
  measurementId: "G-S87YVN1RX4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth check on page load
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("body").style.display = "block";
    await loadDashboard();
  } else {
    alert("You must be logged in to view the dashboard.");
    window.location.href = "index.html";
  }
});

// Logout function
window.logout = function () {
  signOut(auth)
    .then(() => (window.location.href = "index.html"))
    .catch((err) => alert("Logout error: " + err.message));
};

// Load dashboard data
window.loadDashboard = async function () {
  const table = document.getElementById("staff-table");
  const search = document.getElementById("search").value.trim().toLowerCase();
  table.innerHTML = ""; // Clear existing rows

  try {
    const snapshot = await getDocs(collection(db, "users"));
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Validate required fields
      if (!data.name || !data.designation) return;
      if (!data.name.toLowerCase().includes(search)) return;

      // Build row
      const row = `
        <tr>
          <td><img src="${data.photoURL || 'https://via.placeholder.com/50'}" alt="PHOTO" class="w-20 h-20 rounded-full mx-auto border border-black"></td>
          <td class="font-bold text-lg">${data.name.toUpperCase()}</td>
          <td class="italic text-base">${data.designation.toUpperCase()}</td>
          <td class="italic">${data.weeklyStatus?.monday || ""}</td>
          <td class="italic">${data.weeklyStatus?.tuesday || ""}</td>
          <td class="italic">${data.weeklyStatus?.wednesday || ""}</td>
          <td class="italic">${data.weeklyStatus?.thursday || ""}</td>
          <td class="italic">${data.weeklyStatus?.friday || ""}</td>
        </tr>`;
      table.innerHTML += row;
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    alert("Could not load dashboard.");
  }
};
