// 1. JAM LOKAL
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock(); 

// 2. LOGIKA KERJA & WEEKEND OTOMATIS
function updateWorkTimer() {
    const now = new Date();
    const day = now.getDay(); 
    const hour = now.getHours();
    const timerElement = document.getElementById('countdown');

    if (day === 0 || (day === 6 && hour >= 12)) {
        timerElement.innerText = "WAKTU WEEKEND 🥂";
        timerElement.style.color = "#D81B60"; 
        return; 
    }

    const end = new Date(); end.setHours(17, 30, 0, 0); 
    const start = new Date(); start.setHours(8, 0, 0, 0); 

    if (now >= start && now <= end) {
        let diff = end - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        timerElement.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        timerElement.style.color = "#4A4A4A"; 
    } 
    else if (now > end) {
        timerElement.innerText = "WAKTUNYA ISTIRAHAT 🌙";
        timerElement.style.color = "#8B7D84"; 
    } 
    else {
        timerElement.innerText = "BELUM JAM KERJA ☕";
        timerElement.style.color = "#8B7D84"; 
    }
}
setInterval(updateWorkTimer, 1000);
updateWorkTimer();

// 3. LOGIKA SMART COMMUTE (GPS)
function setupCommute() {
    const statusText = document.getElementById('gps-status');
    const navBtn = document.getElementById('nav-btn');
    const destination = "https://maps.app.goo.gl/nEyw8f4S1HQ3Rxac6"; 

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                statusText.innerText = "Terkunci 📍";
                statusText.style.color = "#10B981"; // Hijau
                
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                navBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
            },
            function(error) {
                statusText.innerText = "Dinonaktifkan";
                statusText.style.color = "#8B7D84";
            }
        );
    } else {
        statusText.innerText = "Tidak Didukung";
    }
}
setupCommute();

// 4. API BERITA LOKAL (INDONESIA)
async function fetchLocalNews() {
    const container = document.getElementById('newsContainer');
    try {
        const apikey = '330c4524949a323d82659df746a05672'; 
        const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=id&country=id&max=6&apikey=${apikey}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if(data.articles) {
            container.innerHTML = ''; 
            data.articles.forEach(news => {
                const dateObj = new Date(news.publishedAt);
                const dateStr = dateObj.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});

                container.innerHTML += `
                    <div class="news-item">
                        <a href="${news.url}" target="_blank">${news.title}</a>
                        <div class="news-date">${dateStr} • ${news.source.name}</div>
                    </div>
                `;
            });
        } else { container.innerHTML = '<p style="color:#D81B60;">Gagal memuat berita. API Key limit.</p>'; }
    } catch (error) { container.innerHTML = '<p style="color:#D81B60;">Koneksi ke server berita terputus.</p>'; }
}
fetchLocalNews();

// 5. API CUACA BESOK UNTUK REKOMENDASI LARI
async function fetchTomorrowWeather() {
    const hintEl = document.getElementById('run-hint-text');
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&daily=weathercode,temperature_2m_max&timezone=Asia%2FJakarta';
        const response = await fetch(url);
        const data = await response.json();
        
        const tomorrowCode = data.daily.weathercode[1];
        const maxTemp = data.daily.temperature_2m_max[1];
        
        let weatherDesc = "Cerah/Berawan";
        let isGoodForRun = true;

        if (tomorrowCode > 3) {
            weatherDesc = "Gerimis/Hujan";
            isGoodForRun = false;
        }

        if (isGoodForRun) {
            hintEl.innerHTML = `🌤️ Cuaca besok: <b>${weatherDesc} (${maxTemp}°C)</b>.<br><span style="color:#D81B60; font-weight:600;">Kondisi sempurna, jangan lupa setel alarm buat lari pagi! 👟</span>`;
        } else {
            hintEl.innerHTML = `🌧️ Cuaca besok: <b>${weatherDesc} (${maxTemp}°C)</b>.<br><span style="color:#8B7D84; font-weight:600;">Sepertinya kurang mendukung, siapkan opsi lari indoor ya! 👟</span>`;
        }
    } catch (error) {
        hintEl.innerHTML = `Cek cuaca di atas sebelum lari pagi besok ya! 👟`;
    }
}
fetchTomorrowWeather();

// 6. AYAT ALKITAB OF THE DAY (TARIK DARI JSON)
async function fetchRandomVerse() {
    const verseEl = document.getElementById('daily-verse');
    try {
        // Mengambil file JSON ayat Alkitab
        const response = await fetch('alkitab.json');
        const versesList = await response.json();
        
        // Memilih satu ayat secara acak
        const randomIndex = Math.floor(Math.random() * versesList.length);
        
        // Menampilkan ayat ke dalam HTML
        verseEl.innerHTML = `"${versesList[randomIndex]}" ✨`;
    } catch (error) {
        // Fallback jika file gagal dimuat
        verseEl.innerHTML = `"Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku. - Filipi 4:13" ✨`;
    }
}
fetchRandomVerse();