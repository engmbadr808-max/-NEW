// تحديث الساعة
function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    document.getElementById("clock").innerText =
        `${hours}:${minutes}`;

    document.getElementById("date").innerText =
        now.toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
}

setInterval(updateClock, 1000);
updateClock();


// عداد الإقامة
let iqamaSeconds = 600; // 10 دقائق

function updateIqama() {

    let minutes = Math.floor(iqamaSeconds / 60);
    let seconds = iqamaSeconds % 60;

    document.getElementById("iqamaTimer").innerText =
        `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

    if (iqamaSeconds > 0) {
        iqamaSeconds--;
    }
}

setInterval(updateIqama, 1000);
