let wakeLock = null;

const wakeBtn = document.getElementById("wakeBtn");

const statusSpan = document.getElementById("status");

const darkModeBtn = document.getElementById("darkModeBtn");

const body = document.body;



// --- WAKE LOCK LOGIC ---

async function requestWakeLock() {

try {

wakeLock = await navigator.wakeLock.request("screen");

wakeLock.addEventListener("release", () => updateWakeUI(false));

updateWakeUI(true);

} catch (err) {

statusSpan.textContent = "Wake Lock not supported or denied.";

updateWakeUI(false);

console.error(`${err.name}, ${err.message}`);

}

}

function releaseWakeLock() {

if (wakeLock !== null) {

wakeLock.release();

wakeLock = null;

updateWakeUI(false);

}

}

function updateWakeUI(active) {

if (active) {

wakeBtn.classList.add('active');

statusSpan.textContent = "Wake Lock active. Screen will stay awake.";

wakeBtn.querySelector('.wake-text').textContent = "Screen will stay awake";

} else {

wakeBtn.classList.remove('active');

statusSpan.textContent = "Wake Lock off. Screen may sleep.";

wakeBtn.querySelector('.wake-text').textContent = "Keep screen on";

}

}



// --- FALLBACK (video hack for unsupported browsers) ---

function setupWakeLockHandler() {

if ("wakeLock" in navigator) {

// Supported: Normal logic

wakeBtn.addEventListener("click", () => {

if (!wakeBtn.classList.contains('active')) {

requestWakeLock();

} else {

releaseWakeLock();

}

});

} else {

// Fallback

const video = document.createElement("video");

video.src = "https://www.w3schools.com/html/mov_bbb.mp4";

video.muted = true;

video.loop = true;

video.style.display = "none";

document.body.appendChild(video);



statusSpan.textContent = "Wake Lock API not supported. Fallback active.";

wakeBtn.addEventListener("click", () => {

if (!wakeBtn.classList.contains('active')) {

video.play();

wakeBtn.classList.add('active');

statusSpan.textContent = "Fallback: Playing background video to keep screen awake.";

wakeBtn.querySelector('.wake-text').textContent = "Screen will stay awake";

} else {

video.pause();

wakeBtn.classList.remove('active');

statusSpan.textContent = "Wake Lock off. Screen may sleep.";

wakeBtn.querySelector('.wake-text').textContent = "Keep screen on";

}

});

}

}

setupWakeLockHandler();



// --- DARK MODE LOGIC ---

function setTheme(mode) {

if (mode === "dark") {

body.classList.add("dark");

body.classList.remove("light");

darkModeBtn.classList.add("active");

} else {

body.classList.remove("dark");

body.classList.add("light");

darkModeBtn.classList.remove("active");

}

localStorage.setItem("theme", mode);

}



// Click event for pretty toggle button

darkModeBtn.addEventListener("click", () => {

const isDark = body.classList.contains("dark");

setTheme(isDark ? "light" : "dark");

});



// On page load, apply theme

(function () {

const theme = localStorage.getItem("theme") || "light";

setTheme(theme);

})();