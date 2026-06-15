// Spotlight Cursor
const spotlight = document.querySelector('.spotlight');

document.addEventListener('mousemove', (e) => {
  spotlight.style.left = e.clientX + 'px';
  spotlight.style.top = e.clientY + 'px';
});
