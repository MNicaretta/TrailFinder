import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { startGame } from './game';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());

app.mount('#app');

startGame();

function _calculateScrollbarWidth() {
  const width =
    window.innerWidth -
    (document.documentElement.querySelector('#container')?.clientWidth ?? 0);

  document.documentElement.style.setProperty('--scrollbar-width', width + 'px');
}
// recalculate on resize
window.addEventListener('resize', _calculateScrollbarWidth, false);
// recalculate on dom load
document.addEventListener('DOMContentLoaded', _calculateScrollbarWidth, false);
// recalculate on load (assets loaded as well)
window.addEventListener('load', _calculateScrollbarWidth);
