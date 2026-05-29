// === Data: dynamically generated from files ===
// Hero images (6 files)
const HERO_FILES = [
  'hero-01.jpg', 'hero-02.jpg', 'hero-03.jpg',
  'hero-04.jpg', 'hero-05.jpg', 'hero-06.jpg'
];

// Gallery images (30 files)
const GALLERY_FILES = [];
for (let i = 1; i <= 30; i++) {
  GALLERY_FILES.push(`gallery-${String(i).padStart(2, '0')}.jpg`);
}

// GIF files: 01-08, 10, 11 (skip 09)
const GIF_BASES = [];
for (let i = 1; i <= 8; i++) {
  GIF_BASES.push({ base: `gif-${String(i).padStart(2, '0')}`, large: false });
}
GIF_BASES.push({ base: 'gif-10', large: false });
GIF_BASES.push({ base: 'gif-11', large: true });

// === Hero Carousel ===
(function() {
  const slides = document.getElementById('heroSlides');
  const dots = document.getElementById('heroDots');
  let current = Math.floor(Math.random() * HERO_FILES.length);
  let interval;

  HERO_FILES.forEach((file, i) => {
    const div = document.createElement('div');
    div.className = 'hero-slide' + (i === current ? ' active' : '');
    div.style.backgroundImage = `url(assets/images/hero/${file})`;
    slides.appendChild(div);

    const dot = document.createElement('span');
    dot.className = 'hero-dot' + (i === current ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  function goTo(i) {
    slides.children[current].classList.remove('active');
    dots.children[current].classList.remove('active');
    current = i;
    slides.children[current].classList.add('active');
    dots.children[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % HERO_FILES.length);
  }

  interval = setInterval(next, 4000);

  // Pause on hover
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', () => clearInterval(interval));
  hero.addEventListener('mouseleave', () => { interval = setInterval(next, 4000); });
})();

// === Gallery Grid ===
(function() {
  const grid = document.getElementById('galleryGrid');
  GALLERY_FILES.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="assets/images/gallery/${file}" alt="北科摄影作品 ${i+1}" loading="lazy">`;
    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });
})();

// === GIF Grid ===
(function() {
  const grid = document.getElementById('gifGrid');
  GIF_BASES.forEach(({ base, large }) => {
    const item = document.createElement('div');
    item.className = 'gif-item' + (large ? ' gif-large' : '');
    item.innerHTML = `
      <video src="assets/images/gif/${base}.mp4" autoplay loop muted playsinline
             poster="assets/images/gif/${base}.jpg">
        <img src="assets/images/gif/${base}.gif" alt="动图延时" loading="lazy">
      </video>
    `;
    grid.appendChild(item);
  });
})();

// === Lightbox ===
let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const file = GALLERY_FILES[lightboxIndex];
  document.getElementById('lightboxImg').src = `assets/images/full/${file}`;
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + GALLERY_FILES.length) % GALLERY_FILES.length;
  updateLightbox();
});

document.getElementById('lightboxNext').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % GALLERY_FILES.length;
  updateLightbox();
});

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    lightboxIndex = (lightboxIndex - 1 + GALLERY_FILES.length) % GALLERY_FILES.length;
    updateLightbox();
  }
  if (e.key === 'ArrowRight') {
    lightboxIndex = (lightboxIndex + 1) % GALLERY_FILES.length;
    updateLightbox();
  }
});
