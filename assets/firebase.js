// ─── Firebase Realtime Database — Maintenance Module ────────────────────────
// Uses the Firebase Compat SDK (v9 compat) loaded via CDN <script> tags.
// This file must be loaded AFTER the firebase-app-compat and
// firebase-database-compat scripts.

(function () {
  // ── 1. Configuration ────────────────────────────────────────────────────────

  const firebaseConfig = {
  apiKey: "AIzaSyBd2pUI9SanuiAHc5YhtJ3WLodXp42zU9M",
  authDomain: "cmjcorpsite.firebaseapp.com",
  databaseURL:
  "https://cmjcorpsite-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cmjcorpsite",
  storageBucket: "cmjcorpsite.firebasestorage.app",
  messagingSenderId: "801752320480",
  appId: "1:801752320480:web:b677917554ee6c8f760385",
  measurementId: "G-F6Z8WP6K7B"
};

  // ── 2. Initialize (guard against double-init on hot-reloads) ───────────────
  if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  const maintenanceRef = db.ref("maintenance");

  // ── 3. Write helper — called from the admin panel ──────────────────────────
  /**
   * Persists a maintenance notice to Firebase Realtime Database.
   *
   * @param {string}  message - The announcement text to display site-wide.
   * @param {boolean} active  - Pass `true` to show the banner, `false` to hide it.
   * @returns {Promise<void>}
   */
  function updateMaintenance(message, active) {
	return maintenanceRef.set({ message: message, active: active });
  }

  // ── 4. Real-time listener — updates every open browser tab instantly ────────
  /**
   * Attaches a live listener to the "maintenance" database node.
   * The callback is fired immediately with the current value and again
   * whenever the value changes in Firebase.
   *
   * @param {function({ active: boolean, message: string }|null)} callback
   */
  function onMaintenanceChange(callback) {
	maintenanceRef.on("value", function (snapshot) {
	  callback(snapshot.val());
	});
  }

  // ── 5. Banner logic for public pages (e.g. index.html) ────────────────────
  function initMaintenanceBanner() {
	const banner = document.getElementById("maintenanceBanner");
	const bannerText = document.getElementById("maintenanceBannerText");
	if (!banner || !bannerText) return;

	onMaintenanceChange(function (data) {
	  if (data && data.active && data.message) {
		bannerText.textContent = data.message;
		banner.classList.remove("hidden");
	  } else {
		banner.classList.add("hidden");
	  }
	});
  }

  // ── 6. Admin panel logic ──────────────────────────────────────────────────
  function initMaintenanceAdmin() {
	const form = document.getElementById("maintenanceForm");
	const input = document.getElementById("maintenanceMessage");
	const toggle = document.getElementById("maintenanceActive");
	const msg = document.getElementById("maintenanceMsg");
	if (!form || !input || !toggle) return;

	// Pre-fill the form with the current value from Firebase
	onMaintenanceChange(function (data) {
	  if (data) {
		input.value = data.message || "";
		toggle.checked = !!data.active;
	  }
	});

	form.addEventListener("submit", function (e) {
	  e.preventDefault();
	  const message = input.value.trim();
	  const active = toggle.checked;

	  updateMaintenance(message, active)
		.then(function () {
		  if (msg) {
			msg.textContent = active
			  ? "Maintenance notice is now LIVE on all devices."
			  : "Maintenance notice saved (currently hidden).";
		  }
		})
		.catch(function (err) {
		  if (msg) msg.textContent = "Error saving: " + err.message;
		});
	});
  }

  // ── 7. Auto-boot based on the page ────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
	const page = document.body.dataset.page || "";

	if (page === "home") {
	  initMaintenanceBanner();
	}

	if (page === "admin") {
	  initMaintenanceAdmin();
	}
  });

  // Expose helpers globally in case other scripts need them
  window.CMJFirebase = {
	updateMaintenance: updateMaintenance,
	onMaintenanceChange: onMaintenanceChange,
  };
})();
