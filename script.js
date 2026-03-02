let prayerTimes = {};
let nextPrayer = null;
let iqamaTime = null;

const iqamaOffsets = {
  Fajr: 20,
  Dhuhr: 10,
  Asr: 10,
  Maghrib: 5,
  Isha: 10
};

/* ---------------- CLOCK ---------------- */
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    now.toLocaleTimeString("ar-SA");
}
setInterval(updateClock, 1000);
updateClock();

/* ---------------- LOCATION ---------------- */
function initLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude),
      () => {
        // fallback: الرياض
        fetchPrayerTimes(24.7136, 46.6753);
      }
    );
  } else {
    fetchPrayerTimes(24.7136, 46.6753);
  }
}

/* ---------------- FETCH PRAYERS ---------------- */
async function fetchPrayerTimes(lat, lon) {
  const today = new Date();
  const date = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;

  const res = await fetch(
    `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=4`
  );

  const data = await res.json();
  prayerTimes = data.data.timings;

  document.getElementById("hijriDate").innerText =
    `${data.data.date.hijri.weekday.ar} - 
     ${data.data.date.hijri.day} 
     ${data.data.date.hijri.month.ar} 
     ${data.data.date.hijri.year} هـ`;

  renderPrayers();
  calculateNextPrayer();
}

/* ---------------- RENDER ---------------- */
function renderPrayers() {
  const grid = document.getElementById("prayerGrid");
  grid.innerHTML = "";

  const prayers = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

  prayers.forEach(p => {
    const card = document.createElement("div");
    card.className = "prayer-card";
    card.id = p;
    card.innerHTML = `
      ${translate(p)}
      <span>${formatTime(prayerTimes[p])}</span>
    `;
    grid.appendChild(card);
  });
}

/* ---------------- NEXT PRAYER ---------------- */
function calculateNextPrayer() {
  const now = new Date();
  const prayers = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

  for (let p of prayers) {
    const time = createDateFromTime(prayerTimes[p]);
    if (time > now) {
      nextPrayer = p;
      iqamaTime = new Date(time.getTime() + iqamaOffsets[p]*60000);
      highlightPrayer();
      startCountdown();
      return;
    }
  }

  // بعد العشاء -> فجر الغد
  const fajrTomorrow = createDateFromTime(prayerTimes["Fajr"]);
  fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
  nextPrayer = "Fajr";
  iqamaTime = new Date(fajrTomorrow.getTime() + iqamaOffsets["Fajr"]*60000);
  highlightPrayer();
  startCountdown();
}

function createDateFromTime(timeStr) {
  const [h,m] = timeStr.split(":");
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

/* ---------------- COUNTDOWN ---------------- */
function startCountdown() {
  setInterval(() => {
    const now = new Date();
    const diff = iqamaTime - now;

    if (diff <= 0) {
      document.getElementById("iqamaTimer").innerText = "أقيمت الصلاة";
      calculateNextPrayer(); // إعادة الحساب للصلاة التالية
      return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById("iqamaTimer").innerText =
      minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

  }, 1000);
}

/* ---------------- HELPERS ---------------- */
function translate(p) {
  return {
    Fajr: "الفجر",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  }[p];
}

function formatTime(t) {
  return t.substring(0,5);
}

function highlightPrayer() {
  document.querySelectorAll(".prayer-card")
    .forEach(el => el.classList.remove("active"));

  if (nextPrayer)
    document.getElementById(nextPrayer).classList.add("active");
}

/* ---------------- INIT ---------------- */
initLocation();
