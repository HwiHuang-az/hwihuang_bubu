// Biến toàn cục
let audio = null;
let isPlaying = false;

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    initVisitCounter();
    initBattery();
    initMusicPlayer();
    initCopyButtons();
    generateQRCode();
});

// Đồng hồ thời gian thực
function initClock() {
    function updateClock() {
        const now = new Date();
        
        // Định dạng giờ
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        
        // Định dạng ngày
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = days[now.getDay()];
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateString = `${dayName}, ${day}/${month}/${year}`;
        
        // Cập nhật DOM
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = dateString;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Đếm lượt truy cập
function initVisitCounter() {
    const counterKey = 'pageVisitCount';
    
    // Lấy số lượt truy cập từ localStorage
    let count = localStorage.getItem(counterKey);
    
    if (count === null) {
        count = 0;
    } else {
        count = parseInt(count);
    }
    
    // Tăng số lượt truy cập
    count++;
    localStorage.setItem(counterKey, count);
    
    // Cập nhật hiển thị
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.innerHTML = `<span style="color: #10b981;">Online</span>`;
    }
    
    const visitElement = document.getElementById('visit-count');
    if (visitElement) {
        visitElement.textContent = `${count} lượt ghé`;
    }
}

// Hiển thị pin thiết bị
function initBattery() {
    const batteryLevel = document.getElementById('battery-level');
    const batteryStatus = document.getElementById('battery-status');
    
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            function updateBattery() {
                const level = Math.round(battery.level * 100);
                const charging = battery.charging;
                
                if (batteryLevel) {
                    batteryLevel.textContent = `${level}%`;
                }
                
                if (batteryStatus) {
                    batteryStatus.textContent = charging ? 'Đang sạc' : 'Không sạc';
                }
            }
            
            updateBattery();
            
            battery.addEventListener('levelchange', updateBattery);
            battery.addEventListener('chargingchange', updateBattery);
        });
    } else {
        if (batteryLevel) {
            batteryLevel.textContent = 'N/A';
        }
        if (batteryStatus) {
            batteryStatus.textContent = 'Không hỗ trợ';
        }
    }
}

// Trình phát nhạc
function initMusicPlayer() {
    const musicBtn = document.getElementById('music-btn');
    
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }
}

function toggleMusic() {
    const musicBtn = document.getElementById('music-btn');
    const musicTitle = document.getElementById('music-title');
    const btnText = musicBtn.querySelector('.text');
    const btnIcon = musicBtn.querySelector('.icon');
    
    if (!audio) {
        // Tạo audio element
        audio = new Audio();
        
        // Link nhạc mẫu - Thay đổi link này thành nhạc của bạn
        audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        audio.loop = true;
        
        audio.addEventListener('loadeddata', function() {
            if (musicTitle) {
                musicTitle.textContent = 'Đang phát nhạc...';
            }
        });
        
        audio.addEventListener('error', function() {
            if (musicTitle) {
                musicTitle.textContent = 'Không thể tải nhạc';
            }
            if (btnText) btnText.textContent = 'Lỗi nhạc';
            if (btnIcon) btnIcon.textContent = '🔇';
        });
    }
    
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        if (btnText) btnText.textContent = 'Bật nhạc';
        if (btnIcon) btnIcon.textContent = '🎵';
        if (musicTitle) musicTitle.textContent = 'Nhạc đã tắt';
    } else {
        audio.play().then(() => {
            isPlaying = true;
            if (btnText) btnText.textContent = 'Tắt nhạc';
            if (btnIcon) btnIcon.textContent = '🔊';
            if (musicTitle) musicTitle.textContent = 'Đang phát nhạc...';
        }).catch(error => {
            console.error('Không thể phát nhạc:', error);
            if (musicTitle) musicTitle.textContent = 'Không thể phát';
        });
    }
}

// Sao chép thông tin
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showCopyNotification(this);
                }).catch(err => {
                    console.error('Không thể sao chép:', err);
                    fallbackCopy(textToCopy, this);
                });
            } else {
                fallbackCopy(textToCopy, this);
            }
        });
    });
}

function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(button);
    } catch (err) {
        console.error('Không thể sao chép:', err);
        alert('Đã sao chép: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '✓ Đã sao chép!';
    button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 2000);
}

// Tạo QR Code
function generateQRCode() {
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;
    
    // Thông tin ngân hàng
    const bankInfo = {
        bank: 'Techcombank',
        account: '3037373684',
        name: 'NGUYEN HOANG THICH'
    };
    
    // Tạo QR Code sử dụng API miễn phí
    const qrData = encodeURIComponent(`Bank: ${bankInfo.bank}\nSTK: ${bankInfo.account}\nName: ${bankInfo.name}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
    
    const img = document.createElement('img');
    img.src = qrUrl;
    img.alt = 'QR Code';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    
    // Xóa loading và thêm ảnh
    qrContainer.innerHTML = '';
    qrContainer.appendChild(img);
}
