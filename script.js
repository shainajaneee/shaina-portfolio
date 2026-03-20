/* ── Theme Logic ── */
const root = document.documentElement;
let dark = localStorage.getItem('sj_theme') === 'dark';

function applyTheme() {
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = dark ? '☀️' : '🌙';
}

window.toggleTheme = function() {
  dark = !dark;
  localStorage.setItem('sj_theme', dark ? 'dark' : 'light');
  applyTheme();
};

applyTheme();

/* ── Scroll Progress & Reveal ── */
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

/* ── Recommendations Slider ── */
const recs = [
  { text: "Shaina consistently shows dedication in her work and creates projects with real functionality and attention to detail.", name: "Mentor", role: "Academic Supervisor" },
  { text: "A proactive developer with a strong focus on clean architecture and data integrity.", name: "Project Lead", role: "Collaborator" }
];

let ri = 0;

function renderRec() {
  const textEl = document.getElementById('recText');
  const nameEl = document.getElementById('recName');
  const dotsEl = document.getElementById('recDots');

  if (textEl && nameEl) {
    textEl.textContent = `"${recs[ri].text}"`;
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

window.nextRec = () => { ri = (ri + 1) % recs.length; renderRec(); };
window.prevRec = () => { ri = (ri - 1 + recs.length) % recs.length; renderRec(); };

renderRec();