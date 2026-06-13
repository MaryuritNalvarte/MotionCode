// Ghost Cursor Trail
document.addEventListener('mousemove', (e) => {
  const ghost = document.createElement('div');
  ghost.className = 'ghost';
  ghost.style.left = e.clientX - 10 + 'px';
  ghost.style.top = e.clientY - 10 + 'px';
  document.body.appendChild(ghost);

  setTimeout(() => ghost.remove(), 1000);
});
