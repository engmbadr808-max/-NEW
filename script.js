// =================
// الساعة 12 ساعة
// =================
function updateClock(){

    const now = new Date();

    const time = now.toLocaleTimeString('ar-SA',{
        hour:'2-digit',
        minute:'2-digit',
        hour12:true
    });

    const date = now.toLocaleDateString('ar-SA',{
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
    });

    document.getElementById("clock").innerText=time;
    document.getElementById("date").innerText=date;
}

setInterval(updateClock,1000);
updateClock();


// =================
// جلب أوقات الصلاة + التاريخ الهجري
// =================

const city="Jeddah";
const country="Saudi Arabia";

async function loadPrayerTimes(){

    const res=await fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`);

    const data=await res.json();

    const t=data.data.timings;
    const hijri=data.data.date.hijri;

    fajr.innerText=t.Fajr;
    sunrise.innerText=t.Sunrise;
    dhuhr.innerText=t.Dhuhr;
    asr.innerText=t.Asr;
    maghrib.innerText=t.Maghrib;
    isha.innerText=t.Isha;

    hijriDate.innerText=
    `${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`;

    highlightCurrentPrayer(t);
}

loadPrayerTimes();


// =================
// تمييز الصلاة الحالية
// =================
function toMin(time){
    const [h,m]=time.split(":");
    return h*60+ +m;
}

function highlightCurrentPrayer(t){

    document.querySelectorAll('.prayer')
    .forEach(p=>p.classList.remove("active"));

    const now=new Date();
    const current=now.getHours()*60+now.getMinutes();

    const prayers=[
        {box:"fajrBox",time:t.Fajr},
        {box:"dhuhrBox",time:t.Dhuhr},
        {box:"asrBox",time:t.Asr},
        {box:"maghribBox",time:t.Maghrib},
        {box:"ishaBox",time:t.Isha}
    ];

    let active=prayers[0];

    prayers.forEach(p=>{
        if(current>=toMin(p.time)) active=p;
    });

    document.getElementById(active.box)
    .classList.add("active");
}


// =================
// عداد الإقامة
// =================
let seconds=600;

function iqamaTimer(){

    let m=Math.floor(seconds/60);
    let s=seconds%60;

    iqamaTimerSpan=
    `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    document.getElementById("iqamaTimer").innerText=iqamaTimerSpan;

    if(seconds>0) seconds--;
}

setInterval(iqamaTimer,1000);
