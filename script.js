// الساعة 12 ساعة
function updateClock(){

const now=new Date();

clock.innerText=now.toLocaleTimeString('ar-SA',{
hour:'2-digit',
minute:'2-digit',
hour12:true
});

date.innerText=now.toLocaleDateString('ar-SA',{
weekday:'long',
day:'numeric',
month:'long',
year:'numeric'
});
}

setInterval(updateClock,1000);
updateClock();


// أوقات الصلاة + التاريخ الهجري
async function load(){

const res=await fetch(
"https://api.aladhan.com/v1/timingsByCity?city=Jeddah&country=Saudi Arabia&method=4"
);

const data=await res.json();

const t=data.data.timings;
const h=data.data.date.hijri;

fajr.innerText=t.Fajr;
sunrise.innerText=t.Sunrise;
dhuhr.innerText=t.Dhuhr;
asr.innerText=t.Asr;
maghrib.innerText=t.Maghrib;
isha.innerText=t.Isha;

hijriDate.innerText=
`${h.day} ${h.month.ar} ${h.year} هـ`;

}

load();


// عداد الإقامة
let sec=600;

setInterval(()=>{
let m=Math.floor(sec/60);
let s=sec%60;

iqamaTimer.innerText=
`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

if(sec>0)sec--;
},1000);
