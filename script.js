// ===== PARTICLE BACKGROUND =====
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.3 + 0.05;
            const colors = ['99,102,241', '6,182,212', '16,185,129'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();

// ===== INFO PANEL =====
const infoData = {
    agent: {
        title: '🧠 Agent',
        content: `
            <h3>🧠 Agent</h3>
            <p>Agent adalah entitas utama dalam sistem RL yang bertugas mengambil keputusan. Agent mengobservasi keadaan (state) dari environment, lalu memilih tindakan (action) yang dianggap optimal.</p>
            <div class="info-highlight">
                π(a|s) = P(Aₜ = a | Sₜ = s)
            </div>
            <p><strong>Proses Agent:</strong></p>
            <ul>
                <li>Menerima observasi (state) dari environment</li>
                <li>Menggunakan policy untuk memilih action</li>
                <li>Mengirim action ke environment</li>
                <li>Menerima reward dan state baru</li>
                <li>Memperbarui policy berdasarkan pengalaman</li>
            </ul>
            <p><strong>Contoh:</strong> Robot navigasi, game AI player, self-driving car controller</p>
        `
    },
    environment: {
        title: '🌍 Environment',
        content: `
            <h3>🌍 Environment</h3>
            <p>Environment adalah dunia tempat agent beroperasi. Environment menerima action dari agent dan menghasilkan state baru serta reward sebagai konsekuensi.</p>
            <div class="info-highlight">
                (Sₜ₊₁, Rₜ₊₁) = Env(Sₜ, Aₜ)
            </div>
            <p><strong>Karakteristik Environment:</strong></p>
            <ul>
                <li><strong>Fully Observable</strong> — Agent bisa melihat seluruh state</li>
                <li><strong>Partially Observable</strong> — Agent hanya melihat sebagian</li>
                <li><strong>Deterministic</strong> — Hasil pasti untuk setiap action</li>
                <li><strong>Stochastic</strong> — Hasil mengandung unsur acak</li>
                <li><strong>Episodic</strong> — Interaksi terbagi dalam episode</li>
                <li><strong>Continuous</strong> — Interaksi berjalan terus-menerus</li>
            </ul>
        `
    },
    reward: {
        title: '⭐ State + Reward',
        content: `
            <h3>⭐ State & Reward</h3>
            <p><strong>State (sₜ)</strong> merepresentasikan kondisi environment saat ini. <strong>Reward (rₜ)</strong> adalah sinyal numerik yang menunjukkan seberapa baik action yang dipilih.</p>
            <div class="info-highlight">
                Gₜ = Σ γᵏ · Rₜ₊ₖ₊₁ (k = 0, 1, 2, ...)
            </div>
            <p><strong>Tujuan agent:</strong> Memaksimalkan <em>expected cumulative reward</em> (return) sepanjang waktu.</p>
            <ul>
                <li><strong>Reward positif:</strong> Mendorong agent mengulangi action</li>
                <li><strong>Reward negatif:</strong> Mendorong agent menghindari action</li>
                <li><strong>Sparse reward:</strong> Reward hanya di akhir episode</li>
                <li><strong>Dense reward:</strong> Reward di setiap langkah</li>
                <li><strong>Reward shaping:</strong> Desain reward untuk mempercepat learning</li>
            </ul>
        `
    },
    policy: {
        title: '📋 Policy (π)',
        content: `
            <h3>📋 Policy (π)</h3>
            <p>Policy adalah strategi atau aturan yang digunakan agent untuk memilih action berdasarkan state saat ini. Policy bisa bersifat deterministik atau stokastik.</p>
            <div class="info-highlight">
                π* = argmax_π E[Σ γᵗ rₜ | π]
            </div>
            <p><strong>Jenis Policy:</strong></p>
            <ul>
                <li><strong>Deterministic:</strong> a = π(s) — satu action pasti untuk setiap state</li>
                <li><strong>Stochastic:</strong> π(a|s) — distribusi probabilitas atas action</li>
                <li><strong>ε-Greedy:</strong> Eksplorasi random dengan probabilitas ε</li>
                <li><strong>Softmax:</strong> Probabilitas berdasarkan Q-values</li>
                <li><strong>Optimal Policy (π*):</strong> Policy yang memaksimalkan expected return</li>
            </ul>
        `
    }
};

const infoPanel = document.getElementById('infoPanel');
const infoContent = document.getElementById('infoContent');
const infoClose = document.getElementById('infoClose');

document.querySelectorAll('.node[data-info]').forEach(node => {
    node.addEventListener('click', () => {
        const key = node.getAttribute('data-info');
        const data = infoData[key];
        if (data) {
            infoContent.innerHTML = data.content;
            infoPanel.classList.add('open');
        }
    });
});

infoClose.addEventListener('click', () => infoPanel.classList.remove('open'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') infoPanel.classList.remove('open'); });

// ===== Q-LEARNING GRID WORLD DEMO =====
const GRID_SIZE = 5;
const ACTIONS = [[-1,0],[1,0],[0,-1],[0,1]]; // up, down, left, right
const ACTION_NAMES = ['↑','↓','←','→'];

// Grid layout: 0=empty, 1=wall, 2=obstacle, 3=goal
const gridLayout = [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 2],
    [0, 1, 2, 0, 0],
    [0, 0, 0, 0, 3]
];

const rewards = { 0: -0.1, 1: null, 2: -5, 3: 10 };

let Q = {};
let agentPos = [0, 0];
let episodeCount = 0;
let totalReward = 0;
let stepCount = 0;
let alpha = 0.1;
let gamma = 0.95;
let epsilon = 0.3;

function stateKey(pos) { return `${pos[0]},${pos[1]}`; }

function getQ(state, action) {
    const k = `${state}_${action}`;
    if (!(k in Q)) Q[k] = 0;
    return Q[k];
}

function setQ(state, action, value) {
    Q[`${state}_${action}`] = value;
}

function isValid(r, c) {
    return r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && gridLayout[r][c] !== 1;
}

function chooseAction(state) {
    if (Math.random() < epsilon) {
        return Math.floor(Math.random() * 4);
    }
    let best = 0, bestVal = getQ(state, 0);
    for (let a = 1; a < 4; a++) {
        const val = getQ(state, a);
        if (val > bestVal) { bestVal = val; best = a; }
    }
    return best;
}

function step() {
    const state = stateKey(agentPos);
    const action = chooseAction(state);
    const [dr, dc] = ACTIONS[action];
    let nr = agentPos[0] + dr, nc = agentPos[1] + dc;

    if (!isValid(nr, nc)) { nr = agentPos[0]; nc = agentPos[1]; }

    const cellType = gridLayout[nr][nc];
    const reward = rewards[cellType];
    const newState = stateKey([nr, nc]);

    // Q-learning update
    let maxFutureQ = -Infinity;
    for (let a = 0; a < 4; a++) {
        maxFutureQ = Math.max(maxFutureQ, getQ(newState, a));
    }

    const oldQ = getQ(state, action);
    const newQ = oldQ + alpha * (reward + gamma * maxFutureQ - oldQ);
    setQ(state, action, newQ);

    agentPos = [nr, nc];
    totalReward += reward;
    stepCount++;

    updateDisplay();
    updateQValues();

    // Check terminal
    if (cellType === 3 || cellType === 2) {
        return true; // episode done
    }
    return false;
}

function runEpisode() {
    agentPos = [0, 0];
    let done = false;
    let steps = 0;
    while (!done && steps < 100) {
        const state = stateKey(agentPos);
        const action = chooseAction(state);
        const [dr, dc] = ACTIONS[action];
        let nr = agentPos[0] + dr, nc = agentPos[1] + dc;
        if (!isValid(nr, nc)) { nr = agentPos[0]; nc = agentPos[1]; }
        const cellType = gridLayout[nr][nc];
        const reward = rewards[cellType];
        const newState = stateKey([nr, nc]);

        let maxFQ = -Infinity;
        for (let a = 0; a < 4; a++) maxFQ = Math.max(maxFQ, getQ(newState, a));
        setQ(state, action, getQ(state, action) + alpha * (reward + gamma * maxFQ - getQ(state, action)));

        agentPos = [nr, nc];
        totalReward += reward;
        steps++;
        if (cellType === 3 || cellType === 2) done = true;
    }
    stepCount += steps;
    episodeCount++;
}

function train100() {
    for (let i = 0; i < 100; i++) runEpisode();
    epsilon = Math.max(0.05, epsilon * 0.95);
    agentPos = [0, 0];
    updateDisplay();
    updateQValues();
}

function resetAll() {
    Q = {};
    agentPos = [0, 0];
    episodeCount = 0;
    totalReward = 0;
    stepCount = 0;
    epsilon = 0.3;
    updateDisplay();
    updateQValues();
}

function renderGrid() {
    const grid = document.getElementById('gridWorld');
    grid.innerHTML = '';

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            const type = gridLayout[r][c];

            if (type === 1) {
                cell.classList.add('wall');
                cell.textContent = '🧱';
            } else if (type === 2) {
                cell.classList.add('obstacle');
                cell.textContent = '💀';
            } else if (type === 3) {
                cell.classList.add('goal');
                cell.textContent = '🏆';
            }

            if (agentPos[0] === r && agentPos[1] === c && type !== 1) {
                cell.classList.add('agent');
                if (type === 0) cell.textContent = '🤖';
            }

            // Show best action arrow if Q-values exist
            if (type === 0 || type === 2 || type === 3) {
                const state = stateKey([r, c]);
                let bestA = 0, bestV = getQ(state, 0), hasQ = false;
                for (let a = 0; a < 4; a++) {
                    const v = getQ(state, a);
                    if (v !== 0) hasQ = true;
                    if (v > bestV) { bestV = v; bestA = a; }
                }
                if (hasQ && type === 0 && !(agentPos[0] === r && agentPos[1] === c)) {
                    for (let a = 0; a < 4; a++) {
                        const arrow = document.createElement('span');
                        arrow.className = `q-arrow ${['up','down','left','right'][a]}`;
                        if (a === bestA) arrow.classList.add('best');
                        arrow.textContent = ACTION_NAMES[a];
                        cell.appendChild(arrow);
                    }
                }
            }

            grid.appendChild(cell);
        }
    }
}

function updateDisplay() {
    renderGrid();
    document.getElementById('episodeCount').textContent = episodeCount;
    document.getElementById('totalReward').textContent = totalReward.toFixed(1);
    document.getElementById('stepCount').textContent = stepCount;
}

function updateQValues() {
    const state = stateKey(agentPos);
    document.getElementById('qUp').textContent = getQ(state, 0).toFixed(2);
    document.getElementById('qDown').textContent = getQ(state, 1).toFixed(2);
    document.getElementById('qLeft').textContent = getQ(state, 2).toFixed(2);
    document.getElementById('qRight').textContent = getQ(state, 3).toFixed(2);
}

document.getElementById('btnTrain').addEventListener('click', train100);
document.getElementById('btnStep').addEventListener('click', () => {
    const done = step();
    if (done) {
        episodeCount++;
        agentPos = [0, 0];
        updateDisplay();
    }
});
document.getElementById('btnReset').addEventListener('click', resetAll);

// ===== RL VISUALIZATION CANVAS =====
(function initRLViz() {
    const canvas = document.getElementById('rlVizCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COLS = 14, ROWS = 8;
    let cellW, cellH;
    let vizRunning = false;
    let vizEpisode = 0;
    let vizAnimId = null;

    // Grid: 0=empty, 1=wall, 2=penalty, 3=goal
    const vizGrid = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,1,0,2,0,1,0,0,0,0],
        [0,1,0,0,0,1,0,0,0,0,0,1,0,0],
        [0,1,0,2,0,0,0,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,1,0,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,2,0,0,3],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    const vizQ = {};
    let vizAgent = [0, 0];
    let vizPath = [];
    let visited = new Set();
    const VIZ_ACTIONS = [[-1,0],[1,0],[0,-1],[0,1]];
    let vizAlpha = 0.15, vizGamma = 0.95, vizEps = 0.4;

    function vKey(p) { return `${p[0]},${p[1]}`; }
    function vGetQ(s, a) { return vizQ[`${s}_${a}`] || 0; }
    function vSetQ(s, a, v) { vizQ[`${s}_${a}`] = v; }
    function vValid(r, c) { return r>=0&&r<ROWS&&c>=0&&c<COLS&&vizGrid[r][c]!==1; }
    function vReward(t) { return t===3?10:t===2?-5:-0.1; }

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const w = Math.min(700, rect.width - 56);
        canvas.width = w;
        canvas.height = Math.floor(w * 4 / 7);
        cellW = canvas.width / COLS;
        cellH = canvas.height / ROWS;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawVizGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const x = c * cellW, y = r * cellH;
                const t = vizGrid[r][c];
                if (t === 1) {
                    ctx.fillStyle = '#1e1b4b';
                } else if (t === 2) {
                    ctx.fillStyle = 'rgba(239,68,68,0.15)';
                } else if (t === 3) {
                    ctx.fillStyle = 'rgba(16,185,129,0.2)';
                } else if (visited.has(vKey([r,c]))) {
                    ctx.fillStyle = 'rgba(99,102,241,0.08)';
                } else {
                    ctx.fillStyle = '#0d0d24';
                }
                ctx.fillRect(x+1, y+1, cellW-2, cellH-2);

                // Border
                ctx.strokeStyle = 'rgba(255,255,255,0.04)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(x+1, y+1, cellW-2, cellH-2);

                // Labels
                if (t === 3) {
                    ctx.fillStyle = '#10b981';
                    ctx.font = `${Math.floor(cellW*0.5)}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('🏆', x + cellW/2, y + cellH/2);
                } else if (t === 2) {
                    ctx.fillStyle = '#ef4444';
                    ctx.font = `${Math.floor(cellW*0.4)}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⚡', x + cellW/2, y + cellH/2);
                }

                // Best action arrow for learned cells
                if (t === 0 && visited.has(vKey([r,c]))) {
                    const s = vKey([r,c]);
                    let bestA = 0, bestV = vGetQ(s, 0), hasQ = false;
                    for (let a = 0; a < 4; a++) {
                        const v = vGetQ(s, a);
                        if (v !== 0) hasQ = true;
                        if (v > bestV) { bestV = v; bestA = a; }
                    }
                    if (hasQ) {
                        const arrows = ['↑','↓','←','→'];
                        ctx.fillStyle = 'rgba(16,185,129,0.5)';
                        ctx.font = `bold ${Math.floor(cellW*0.35)}px sans-serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(arrows[bestA], x + cellW/2, y + cellH/2);
                    }
                }
            }
        }

        // Draw path
        if (vizPath.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(99,102,241,0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 3]);
            ctx.moveTo(vizPath[0][1]*cellW + cellW/2, vizPath[0][0]*cellH + cellH/2);
            for (let i = 1; i < vizPath.length; i++) {
                ctx.lineTo(vizPath[i][1]*cellW + cellW/2, vizPath[i][0]*cellH + cellH/2);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw agent
        const ax = vizAgent[1]*cellW + cellW/2, ay = vizAgent[0]*cellH + cellH/2;
        ctx.beginPath();
        ctx.arc(ax, ay, cellW*0.3, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(99,102,241,0.3)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ax, ay, cellW*0.2, 0, Math.PI*2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = `${Math.floor(cellW*0.3)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤖', ax, ay);
    }

    function vizStep() {
        const s = vKey(vizAgent);
        let action;
        if (Math.random() < vizEps) {
            action = Math.floor(Math.random() * 4);
        } else {
            action = 0; let bv = vGetQ(s, 0);
            for (let a = 1; a < 4; a++) { const v = vGetQ(s, a); if (v > bv) { bv = v; action = a; } }
        }
        const [dr, dc] = VIZ_ACTIONS[action];
        let nr = vizAgent[0]+dr, nc = vizAgent[1]+dc;
        if (!vValid(nr, nc)) { nr = vizAgent[0]; nc = vizAgent[1]; }
        const t = vizGrid[nr][nc];
        const r = vReward(t);
        const ns = vKey([nr, nc]);
        let mfq = -Infinity;
        for (let a = 0; a < 4; a++) mfq = Math.max(mfq, vGetQ(ns, a));
        vSetQ(s, action, vGetQ(s, action) + vizAlpha * (r + vizGamma * mfq - vGetQ(s, action)));

        vizAgent = [nr, nc];
        visited.add(ns);
        vizPath.push([nr, nc]);
        return t === 3 || t === 2;
    }

    let stepTimer = 0;
    const STEP_DELAY = 6;

    function vizLoop() {
        if (!vizRunning) return;
        stepTimer++;
        if (stepTimer >= STEP_DELAY) {
            stepTimer = 0;
            const done = vizStep();
            if (done || vizPath.length > 200) {
                vizEpisode++;
                vizEps = Math.max(0.05, vizEps * 0.97);
                vizAgent = [0, 0];
                vizPath = [[0, 0]];
                document.getElementById('vizEp').textContent = vizEpisode;

                if (vizEpisode >= 150) {
                    vizRunning = false;
                    document.getElementById('vizDot').classList.remove('running');
                    document.getElementById('vizStatusText').textContent = 'Selesai ✓';
                    document.getElementById('btnVizStart').textContent = '▶ Mulai Ulang';
                }
            }
        }
        drawVizGrid();
        vizAnimId = requestAnimationFrame(vizLoop);
    }

    document.getElementById('btnVizStart').addEventListener('click', () => {
        if (vizRunning) return;
        vizRunning = true;
        document.getElementById('vizDot').classList.add('running');
        document.getElementById('vizStatusText').textContent = 'Training...';
        document.getElementById('btnVizStart').textContent = '⏳ Training...';
        vizLoop();
    });

    document.getElementById('btnVizReset').addEventListener('click', () => {
        vizRunning = false;
        if (vizAnimId) cancelAnimationFrame(vizAnimId);
        Object.keys(vizQ).forEach(k => delete vizQ[k]);
        vizAgent = [0, 0];
        vizPath = [[0, 0]];
        visited = new Set();
        vizEpisode = 0;
        vizEps = 0.4;
        document.getElementById('vizEp').textContent = '0';
        document.getElementById('vizDot').classList.remove('running');
        document.getElementById('vizStatusText').textContent = 'Siap';
        document.getElementById('btnVizStart').textContent = '▶ Mulai Visualisasi';
        drawVizGrid();
    });

    // Initial draw
    drawVizGrid();
})();

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .algo-card, .equation-card, .demo-container, .proscons-card, .usecase-item, .viz-container, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initial render
renderGrid();
updateQValues();

