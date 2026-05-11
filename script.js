// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadConfig();
    initClock();
    initVisitCounter();
    initBattery();
    initMusicPlayer();
    initTabs();
});

// Load config
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        
        // Update profile
        document.querySelector('.name').textContent = config.profile.name;
        document.querySelector('.location').textContent = '📍 ' + config.profile.location;
        
        // Update LOL data
        if (config.games.lol.enabled) {
            if (config.games.lol.useAPI && config.games.lol.apiKey) {
                // Fetch from Riot API
                await fetchLOLData(config.games.lol);
            } else {
                // Use config data
                updateLOLUI(config.games.lol);
            }
        }
        
        // Update WuWa data
        if (config.games.wuwa.enabled) {
            updateWuWaUI(config.games.wuwa);
        }
        
        // Update music
        if (config.music.url) {
            musicUrl = config.music.url;
            document.getElementById('musicTitle').textContent = config.music.title;
        }
    } catch (error) {
        console.log('Config not found, using default values');
    }
}

function updateLOLUI(data) {
    const lolPanel = document.getElementById('lol');
    lolPanel.querySelector('.detail-row:nth-child(1) .value').textContent = data.gameName;
    lolPanel.querySelector('.detail-row:nth-child(2) .value').textContent = data.rank;
    lolPanel.querySelector('.detail-row:nth-child(3) .value').textContent = data.mainRole;
    lolPanel.querySelector('.detail-row:nth-child(4) .value').textContent = data.champions;
}

function updateWuWaUI(data) {
    const wuwaPanel = document.getElementById('wuwa');
    wuwaPanel.querySelector('.detail-row:nth-child(1) .value').textContent = data.uid;
    wuwaPanel.querySelector('.detail-row:nth-child(2) .value').textContent = data.server;
    wuwaPanel.querySelector('.detail-row:nth-child(3) .value').textContent = data.level;
    wuwaPanel.querySelector('.detail-row:nth-child(4) .value').textContent = data.mainCharacter;
}

// Fetch LOL data from Riot API
async function fetchLOLData(config) {
    try {
        const gameName = config.gameName;
        const tagLine = config.tagLine;
        const apiKey = config.apiKey;
        
        console.log('Fetching LOL data for:', gameName + '#' + tagLine);
        
        // Get account by Riot ID
        const accountUrl = `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${tagLine}?api_key=${apiKey}`;
        const accountResponse = await fetch(accountUrl);
        
        if (!accountResponse.ok) {
            throw new Error('Account not found');
        }
        
        const account = await accountResponse.json();
        console.log('Account found:', account);
        
        // Get summoner by PUUID
        const summonerUrl = `https://vn2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}?api_key=${apiKey}`;
        const summonerResponse = await fetch(summonerUrl);
        
        if (!summonerResponse.ok) {
            throw new Error('Summoner not found');
        }
        
        const summoner = await summonerResponse.json();
        console.log('Summoner found:', summoner);
        
        // Get rank
        const rankUrl = `https://vn2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}?api_key=${apiKey}`;
        const rankResponse = await fetch(rankUrl);
        
        if (!rankResponse.ok) {
            throw new Error('Rank not found');
        }
        
        const ranks = await rankResponse.json();
        console.log('Ranks found:', ranks);
        
        // Find Solo/Duo rank
        const soloRank = ranks.find(r => r.queueType === 'RANKED_SOLO_5x5');
        
        const realData = {
            gameName: gameName + '#' + tagLine,
            rank: soloRank ? `${soloRank.tier} ${soloRank.rank}` : 'Unranked',
            wins: soloRank ? soloRank.wins : 0,
            losses: soloRank ? soloRank.losses : 0,
            mainRole: config.mainRole,
            champions: config.champions,
            level: summoner.summonerLevel
        };
        
        console.log('Real data:', realData);
        updateLOLUI(realData);
        
    } catch (error) {
        console.error('Failed to fetch LOL data:', error);
        // Fallback to config data
        const fallbackData = {
            gameName: config.gameName + '#' + config.tagLine,
            rank: config.rank,
            mainRole: config.mainRole,
            champions: config.champions
        };
        updateLOLUI(fallbackData);
    }
}

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
