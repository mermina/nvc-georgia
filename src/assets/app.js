// Shared mockup script: language switch (remembered across pages), expanders, news rail, mobile menu
const els = [...document.querySelectorAll('[data-ka]')];
els.forEach(e => e.dataset.en = e.innerHTML);
let lang = 'en';
try { lang = localStorage.getItem('nvc-lang') || 'en'; } catch (e) {}

function labelToggle(t) {
  const open = t.getAttribute('aria-expanded') === 'true';
  if (open) t.innerHTML = lang === 'ka' ? (t.dataset.kaAlt || t.dataset.ka) : (t.dataset.enAlt || t.dataset.en);
  else t.innerHTML = lang === 'ka' ? t.dataset.ka : t.dataset.en;
}
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  els.forEach(e => e.innerHTML = l === 'ka' ? e.dataset.ka : e.dataset.en);
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  document.querySelectorAll('.toggle').forEach(labelToggle);
  try { localStorage.setItem('nvc-lang', l); } catch (e) {}
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

document.querySelectorAll('.toggle').forEach(t => {
  t.setAttribute('aria-expanded', 'false');
  t.addEventListener('click', () => {
    const box = document.getElementById(t.dataset.target);
    const open = t.getAttribute('aria-expanded') !== 'true';
    t.setAttribute('aria-expanded', open);
    box.classList.toggle('open', open);
    labelToggle(t);
  });
});

function rail(d) { const r = document.getElementById('rail'); if (r) r.scrollBy({ left: d * 322, behavior: 'smooth' }); }

const menu = document.getElementById('menu');
document.querySelector('.burger')?.addEventListener('click', () => menu.classList.toggle('open'));
document.querySelectorAll('.menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

if (lang !== 'en') setLang(lang);
