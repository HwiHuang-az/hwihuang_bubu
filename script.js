// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initVisitCounter();
    initBattery();
    initMusicPlayer();
    initTabs();
});

// Clock
function initClock() {
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString('vi-VN', { hour12: false });
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = days[now.getDay()];
        const date = now.toLocaleDateString('vi-VN');
        
        document.getElementById('time').textContent = time;
        document.getElementById('date').textContent = `${dayName}, ${date}`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Visit Counter
function initVisitCounter() {
    let visits = localStorage.getItem('visitCount') || 0;
    visits = parseInt(visits) + 1;
    localStorage.setItem('visitCount', visits);
    document.getElementById('visits').textContent = visits;
}

// Battery
function initBattery() {
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            function updateBattery() {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging;
                
                document.getElementById('battery').textContent = level + '%';
                document.getElementById('batteryStatus').textContent = charging ? 'Đang sạc' : 'Không sạc';
            }
            
            updateBattery();
            battery.addEventListener('levelchange', updateBattery);
            battery.addEventListener('chargingchange', updateBattery);
        });
    } else {
        document.getElementById('battery').textContent = 'N/A';
        document.getElementById('batteryStatus').textContent = 'Không hỗ trợ';
    }
}

// Music Player
let audio = null;
let isPlaying = false;

function initMusicPlayer() {
    const musicBtn = document.getElementById('musicBtn');
    
    musicBtn.addEventListener('click', function() {
        if (!audio) {
            audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
            audio.loop = true;
        }
        
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            musicBtn.querySelector('.text').textContent = 'Bật nhạc';
            musicBtn.querySelector('.icon').textContent = '🎵';
            document.getElementById('musicTitle').textContent = 'Nhạc đã tắt';
        } else {
            audio.play().then(() => {
                isPlaying = true;
                musicBtn.querySelector('.text').textContent = 'Tắt nhạc';
                musicBtn.querySelector('.icon').textContent = '🔊';
                document.getElementById('musicTitle').textContent = 'Đang phát nhạc...';
            }).catch(err => {
                console.error('Cannot play audio:', err);
            });
        }
    });
}

// Tabs
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Copy Text
function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(event.target);
        }).catch(err => {
            console.error('Copy failed:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(event.target);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Đã sao chép: ' + text);
    }
    
    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span>✓</span><span>Đã sao chép!</span>';
    button.style.background = 'rgba(16, 185, 129, 0.3)';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}
