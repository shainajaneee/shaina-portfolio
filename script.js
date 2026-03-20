/* ═══════════════════════════════════════
    THEME LOGIC
   ═══════════════════════════════════════ */
const root = document.documentElement;
let dark = localStorage.getItem('sj_theme') === 'dark';

function applyTheme() {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = dark ? '☀️' : '🌙';
}

// Make globally accessible for the HTML onclick
window.toggleTheme = function() {
    dark = !dark;
    localStorage.setItem('sj_theme', dark ? 'dark' : 'light');
    applyTheme();
};

applyTheme();

/* ═══════════════════════════════════════
    SCROLL EFFECTS
   ═══════════════════════════════════════ */
window.addEventListener('scroll', () => {
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = pct + '%';
    }
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ═══════════════════════════════════════
    RECOMMENDATIONS ENGINE
   ═══════════════════════════════════════ */
const defaultRecs = [
    { 
        text: "Shaina consistently shows dedication in her work and creates projects with real functionality and attention to detail.", 
        name: "Mentor", 
        role: "Academic Supervisor" 
    },
];

// Load data
let recs = (() => {
    try {
        const saved = localStorage.getItem('sj_recs');
        return saved ? JSON.parse(saved) : defaultRecs;
    } catch (e) {
        return defaultRecs;
    }
})();

let ri = 0;

function renderRec() {
    const textEl = document.getElementById('recText');
    const nameEl = document.getElementById('recName');
    const roleEl = document.getElementById('recRole');
    const dotsEl = document.getElementById('recDots');

    if (textEl && nameEl) {
        textEl.textContent = `"${recs[ri].text}"`;
        // Format: Name — Role (if role exists)
        nameEl.textContent = recs[ri].role ? `${recs[ri].name} — ${recs[ri].role}` : recs[ri].name;
    }

    if (dotsEl) {
        dotsEl.innerHTML = '';
        recs.forEach((_, i) => {
            const b = document.createElement('button');
            b.className = 'rec-dot' + (i === ri ? ' on' : '');
            b.onclick = () => { ri = i; renderRec(); };
            dotsEl.appendChild(b);
        });
    }
}

// Global Nav Functions
window.nextRec = () => { ri = (ri + 1) % recs.length; renderRec(); };
window.prevRec = () => { ri = (ri - 1 + recs.length) % recs.length; renderRec(); };

/* ═══════════════════════════════════════
    FEEDBACK FORM HANDLING
   ═══════════════════════════════════════ */
window.submitFeedback = function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('fName');
    const roleInput = document.getElementById('fRole');
    const textInput = document.getElementById('fText');

    if (!nameInput || !textInput) return;

    const newRec = {
        name: nameInput.value.trim(),
        role: roleInput ? roleInput.value.trim() : "",
        text: textInput.value.trim()
    };

    // Add to array and save
    recs.push(newRec);
    try {
        localStorage.setItem('sj_recs', JSON.stringify(recs));
    } catch (err) {
        console.error("Storage failed:", err);
    }

    // Update UI to show the newest recommendation
    ri = recs.length - 1;
    renderRec();

    // Feedback to user
    e.target.reset();
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

// Start the UI
renderRec();