// ===============================
// الساعة + التاريخ الميلادي + الهجري
// ===============================

function updateClock() {

    const now = new Date();

    // ⏰ نظام 12 ساعة
    let time = now.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const date = now.toLocaleDateString('ar-SA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    document.getElementById("clock").innerText = time;
    document.getElementById("date").innerText = date;
}

setInterval(updateClock, 1000);
updateClock();


// ===============================
// جلب أوقات الصلاة + التاريخ الهجري
// ===============================

const city = "Jeddah";
const country = "Saudi Arabia";

async function loadPrayerTimes() {

    const url =
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        const timings = data.data.timings;
        const hijri = data.data.date.hijri;

        // أوقات الصلاة
        document.getElementById("fajr").innerText = timings.Fajr;
        document.getElementById("sunrise").innerText = timings.Sunrise;
        document.getElementById("dhuhr").innerText = timings.Dhuhr;
        document.getElementById("asr").innerText = timings.Asr;
        document.getElementById("maghrib").innerText = timings.Maghrib;
        document.getElementById("isha").innerText = timings.Isha;

        // 📅 التاريخ الهجري
        document.getElementById("hijriDate").innerText =
            `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

        highlightCurrentPrayer(timings);

    } catch (error) {
        console.log("خطأ في جلب البيانات", error);
    }
}

loadPrayerTimes();


// ===============================
// تحديد الصلاة الحالية
// ===============================

function timeToMinutes(t) {
    const [h, m] = t.split(":");
    return parseInt(h) * 60 + parseInt(m);
}

function highlightCurrentPrayer(timings) {

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { id: "fajr", time: timings.Fajr },
        { id: "dhuhr", time: timings.Dhuhr },
        { id: "asr", time: timings.Asr },
        { id: "maghrib", time: timings.Maghrib },
        { id: "isha", time: timings.Isha }
    ];

    document.querySelectorAll(".prayer")
        .forEach(p => p.classList.remove("active"));

    let current = prayers[0];

    for (let i = 0; i < prayers.length; i++) {
        if (nowMinutes >= timeToMinutes(prayers[i].time)) {
            current = prayers[i];
        }
    }

    document
        .getElementById(current.id)
        .parentElement
        .classList.add("active");
}


// ===============================
// عداد الإقامة
// ===============================

let iqamaSeconds = 600;

function updateIqama() {

    let minutes = Math.floor(iqamaSeconds / 60);
    let seconds = iqamaSeconds % 60;

    document.getElementById("iqamaTimer").innerText =
        `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

    if (iqamaSeconds > 0) iqamaSeconds--;
}

setInterval(updateIqama, 1000);
