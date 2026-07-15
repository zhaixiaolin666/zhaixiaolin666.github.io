// ==========================================
// 1. 鼠标跟随光晕
// ==========================================
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ==========================================
// 2. 背景粒子动效 (Canvas)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) { this.reset(); }
    }
    draw() {
        ctx.fillStyle = `rgba(74, 222, 128, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.floor(canvas.width * canvas.height / 15000);
    for (let i = 0; i < count; i++) { particles.push(new Particle()); }
}
initParticles();

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// 3. 氛围时钟 & 年度进度条
// ==========================================
function updateClockAndProgress() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const progress = ((now - start) / (end - start)) * 100;
    document.getElementById('year-progress').style.width = progress.toFixed(2) + '%';
    document.getElementById('year-progress-val').textContent = progress.toFixed(2) + '%';
}
updateClockAndProgress();
setInterval(updateClockAndProgress, 1000);

// ==========================================
// 4. 诗歌生成器 & 真实音乐播放
// ==========================================
const poems = [
    "我们都在阴沟里，但仍有人仰望星空。",
    "万物皆有裂痕，那是光照进来的地方。",
    "你来时冬至，但眉上风止，开口是我。",
    "我见青山多妩媚，料青山见我应如是。",
    "且将新火试新茶，诗酒趁年华。"
];
document.getElementById('new-poem').addEventListener('click', () => {
    const textEl = document.getElementById('poem-text');
    textEl.style.opacity = 0;
    setTimeout(() => {
        textEl.textContent = `"${poems[Math.floor(Math.random() * poems.length)]}"`;
        textEl.style.opacity = 1;
    }, 300);
});

// --- 真实音乐播放控制逻辑 ---
const playPauseBtn = document.getElementById('play-pause');
const audioElement = document.getElementById('bgm-audio');

playPauseBtn.addEventListener('click', function() {
    if (audioElement.paused) {
        audioElement.play().then(() => {
            playPauseBtn.textContent = '⏸';
        }).catch(error => {
            console.log('播放失败，请检查文件路径:', error);
        });
    } else {
        audioElement.pause();
        playPauseBtn.textContent = '▶';
    }
});

// ==========================================
// 5. 3D 卡片倾斜微交互
// ==========================================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// ==========================================
// 6. 雷达图 (Canvas 绘制)
// ==========================================
function drawRadar() {
    const radarCanvas = document.getElementById('radar-chart');
    if (!radarCanvas) return;
    const rCtx = radarCanvas.getContext('2d');
    const w = radarCanvas.width;
    const h = radarCanvas.height;
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) / 2 - 40;

    // 替换为你的技能和对应数值(0-100)
    const skills = ['摄影', '编程', '阅读', '旅行', '音乐', '做饭'];
    const values = [80, 70, 80, 90, 85, 80]; 
    const n = skills.length;

    rCtx.clearRect(0, 0, w, h);
    rCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    rCtx.lineWidth = 1;

    // 绘制背景网格
    for (let level = 1; level <= 4; level++) {
        rCtx.beginPath();
        for (let i = 0; i <= n; i++) {
            const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
            const x = cx + (r * level / 4) * Math.cos(angle);
            const y = cy + (r * level / 4) * Math.sin(angle);
            if (i === 0) rCtx.moveTo(x, y); else rCtx.lineTo(x, y);
        }
        rCtx.stroke();
    }

    // 绘制数据多边形
    rCtx.beginPath();
    values.forEach((val, i) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        const x = cx + (r * val / 100) * Math.cos(angle);
        const y = cy + (r * val / 100) * Math.sin(angle);
        if (i === 0) rCtx.moveTo(x, y); else rCtx.lineTo(x, y);
    });
    rCtx.closePath();
    rCtx.fillStyle = 'rgba(74, 222, 128, 0.3)';
    rCtx.strokeStyle = '#4ade80';
    rCtx.lineWidth = 2;
    rCtx.fill();
    rCtx.stroke();

    // 绘制文字标签
    rCtx.fillStyle = '#e2e8f0';
    rCtx.font = '16px "Ma Shan Zheng", cursive';
    rCtx.textAlign = 'center';
    rCtx.textBaseline = 'middle';
    skills.forEach((skill, i) => {
        const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
        const x = cx + (r + 25) * Math.cos(angle);
        const y = cy + (r + 25) * Math.sin(angle);
        rCtx.fillText(skill, x, y);
    });
}
drawRadar();

// ==========================================
// 7. 弹幕留言系统
// ==========================================
const bulletMsgs = [
    "今天天气真好呀~", "旅行也是一种修行✈️", "刚看完一部超棒的电影！", 
    "想喝冰镇饮料了", "保持热爱，奔赴山海", "晚安，世界 🌙"
];
const bulletinBoard = document.getElementById('bulletin-board');

function createBullet() {
    const msg = document.createElement('div');
    msg.className = 'bullet-msg';
    msg.textContent = bulletMsgs[Math.floor(Math.random() * bulletMsgs.length)];
    msg.style.top = Math.random() * 70 + 'px';
    msg.style.animationDuration = (Math.random() * 5 + 5) + 's';
    bulletinBoard.appendChild(msg);
    setTimeout(() => msg.remove(), 10000);
}
setInterval(createBullet, 2000);

// ==========================================
// 8. 隐藏彩蛋：满屏落叶
// ==========================================
document.getElementById('easter-egg-btn').addEventListener('click', () => {
    for (let i = 0; i < 30; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = '🍃';
        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.animationDuration = (Math.random() * 3 + 2) + 's';
        leaf.style.animationDelay = (Math.random() * 2) + 's';
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), 5000);
    }
});

// ==========================================
// 9. 滚动进入动画 (Intersection Observer)
// ==========================================
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section, .glass-card').forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
});