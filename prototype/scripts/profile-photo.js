'use strict';
(() => {
  function update(){try{const photo=JSON.parse(localStorage.getItem('chabak-profile-v1'))?.photo;if(typeof photo==='string'&&/^data:image\/(jpeg|png|webp);base64,/.test(photo))document.querySelectorAll('.bottom-nav__avatar').forEach(img=>img.src=photo);}catch{}}
  update();window.addEventListener('storage',update);window.addEventListener('profile-updated',update);window.addEventListener('pageshow',update);
})();
