
function toggleMenu(){document.querySelector('.navlinks')?.classList.toggle('open')}
function filterCards(){
  const q=(document.getElementById('siteSearch')?.value||'').toLowerCase().trim();
  document.querySelectorAll('[data-search]').forEach(el=>{
    el.style.display=!q || el.dataset.search.toLowerCase().includes(q)?'':'none';
  });
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('siteSearch')?.addEventListener('input',filterCards);
});
