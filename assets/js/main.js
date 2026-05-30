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

// GIF files: small ones shuffled, large ones in a row at the end
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SHUFFLED_GIFS = shuffle(['gif-02', 'gif-03', 'gif-05', 'gif-06', 'gif-07', 'gif-10']);
const FIXED_GIFS = ['gif-16', 'gif-14', 'gif-15', 'gif-11', 'gif-12', 'gif-13'];

const GIF_ITEMS = [
  ...SHUFFLED_GIFS.map(base => ({ base })),
  ...FIXED_GIFS.map(base => ({ base }))
];

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

  function prev() {
    goTo((current - 1 + HERO_FILES.length) % HERO_FILES.length);
  }

  document.getElementById('heroPrev').addEventListener('click', prev);
  document.getElementById('heroNext').addEventListener('click', next);

  interval = setInterval(next, 3000);
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

// === GIF Grid (lazy-loaded) ===
(function() {
  const grid = document.getElementById('gifGrid');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const video = entry.target.querySelector('video');
      if (!video || video.src) return;
      video.src = video.dataset.src;
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '200px' });

  GIF_ITEMS.forEach(({ base }) => {
    const item = document.createElement('div');
    item.className = 'gif-item';
    item.innerHTML = `
      <video data-src="assets/images/gif/${base}.mp4" autoplay loop muted playsinline
             poster="assets/images/gif/${base}.jpg">
        <img src="assets/images/gif/${base}.gif" alt="动图延时" loading="lazy">
      </video>
    `;
    observer.observe(item);
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

// === Scroll Spy ===
(function() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.sidebar-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// === Sidebar Toggle (mobile) ===
(function() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
  });
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('visible');
    });
  });
})();

// === Share ===
const SHARE_URL = 'https://wmz-ustb-photography.pages.dev';
const QR_API = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(SHARE_URL);

function showQR(title) {
  document.getElementById('qrTitle').textContent = title;
  document.getElementById('qrImg').src = QR_API;
  document.getElementById('qrModal').classList.add('active');
}

document.getElementById('qrClose').addEventListener('click', () => {
  document.getElementById('qrModal').classList.remove('active');
});
document.getElementById('qrModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) document.getElementById('qrModal').classList.remove('active');
});

function copyLink(msg) {
  navigator.clipboard.writeText(SHARE_URL).then(() => {
    const tip = document.getElementById('shareTip');
    tip.textContent = msg || '链接已复制，快去分享吧！';
    setTimeout(() => { tip.textContent = ''; }, 2000);
  }).catch(() => {
    const input = document.createElement('input');
    input.value = SHARE_URL;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    const tip = document.getElementById('shareTip');
    tip.textContent = msg || '链接已复制，快去分享吧！';
    setTimeout(() => { tip.textContent = ''; }, 2000);
  });
}

document.getElementById('shareCopy').addEventListener('click', () => copyLink());
document.getElementById('shareWechat').addEventListener('click', () => showQR('微信扫一扫访问网站'));
document.getElementById('shareMoments').addEventListener('click', () => { copyLink('链接已复制，打开微信粘贴到朋友圈即可'); showQR('保存二维码发朋友圈'); });
document.getElementById('shareRednote').addEventListener('click', () => copyLink('链接已复制，打开小红书粘贴即可分享'));

// === Dark Mode Toggle ===
(function() {
  const toggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check saved preference or system preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.setAttribute('data-theme', 'dark');
    toggle.textContent = '☀️ 浅色模式';
  }

  toggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      toggle.textContent = '🌙 深色模式';
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️ 浅色模式';
      localStorage.setItem('theme', 'dark');
    }
  });
})();
