document.documentElement.classList.add('js');

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;

function glassInner(style, stroke) {
  const a = `stroke="${stroke}" fill="none" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"`;
  switch (style) {
    case 'square':
      return `<rect x="26" y="18" width="58" height="46" rx="12" ${a}/><rect x="116" y="18" width="58" height="46" rx="12" ${a}/><path d="M84 32h32M16 24c-6-1-10 1-12 5M184 24c6-1 10 1 12 5" ${a}/>`;
    case 'cat':
      return `<path d="M22 31c2-9 14-13 32-12 16 1 30 5 30 15 0 9-16 17-34 15S20 40 22 31Z" ${a}/><path d="M116 34c0-10 14-14 30-15 18-1 30 3 32 12 2 9-14 20-28 18s-34-5-34-15Z" ${a}/><path d="M84 33h32" ${a}/>`;
    case 'aviator':
      return `<path d="M20 24h62c0 8-3 40-31 40S20 34 20 24Z" ${a}/><path d="M118 24h62c0 10-4 40-31 40s-31-32-31-40Z" ${a}/><path d="M82 28h36M20 24l-15 4M180 24l15 4" ${a}/>`;
    case 'browline':
      return `<path d="M18 28h66M116 28h66" stroke="${stroke}" fill="none" stroke-width="9" stroke-linecap="round"/><path d="M20 29c3 21 15 31 31 31s28-12 31-31M116 29c3 21 15 31 31 31s28-12 31-31" ${a}/><path d="M83 33h34" ${a}/>`;
    case 'geo':
      return `<path d="M28 40 52 18l30 5 3 27-23 20-32-8Z" ${a}/><path d="M120 40 144 18l30 5 3 27-23 20-32-8Z" ${a}/><path d="M84 38h34" ${a}/>`;
    default:
      return `<circle cx="56" cy="41" r="27" ${a}/><circle cx="144" cy="41" r="27" ${a}/><path d="M83 39h34M17 32c-6-2-10 0-12 4M183 32c6-2 10 0 12 4" ${a}/>`;
  }
}
const glassesMarkup   = (style) => `<svg viewBox="0 0 200 82" role="img" aria-label="${style} frame">${glassInner(style, 'currentColor')}</svg>`;
const glassesDataURI  = (style, stroke) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 82">${glassInner(style, stroke)}</svg>`);

const photo = (id, w = 640, h = 440) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=75&fm=jpg&fit=crop`;

const PRODUCTS = [
  { name: 'The Lafayette',  style: 'square',   img: photo('1572635196237-14b3f281503f'), price: 145, old: 180, rating: 5, tags: ['new', 'top'], deal: true },
  { name: 'The Mercer',     style: 'round',    img: photo('1614715838608-dd527c46231d'), price: 155,           rating: 4, tags: ['new'] },
  { name: 'The Delancey',   style: 'aviator',  img: photo('1567473810954-507d59716c25'), price: 165, old: 210, rating: 4, tags: ['top'], deal: true },
  { name: 'The Mott',       style: 'cat',      img: photo('1508296695146-257a814070b4'), price: 150, old: 185, rating: 5, tags: ['new', 'top'] },
  { name: 'The Canal',      style: 'geo',      img: photo('1577803645773-f96470509666'), price: 175,           rating: 5, tags: ['new'] },
  { name: 'The Ludlow',     style: 'browline', img: photo('1591076482161-42ce6da69f67'), price: 140, old: 170, rating: 4, tags: ['top'] },
  { name: 'The Rivington',  style: 'round',    img: photo('1511499767150-a48a237f0083'), price: 135,           rating: 4, tags: [] },
  { name: 'The Grand',      style: 'geo',      img: photo('1473496169904-658ba7c44d8a'), price: 160, old: 195, rating: 5, tags: ['top'] },
  { name: 'The Orchard',    style: 'cat',      img: photo('1556015048-4d3aa10df74c'),    price: 150,           rating: 4, tags: ['new'] },
  { name: 'The Spring',     style: 'square',   img: photo('1574258495973-f010dfbb5371'), price: 145, old: 175, rating: 4, tags: ['top'], deal: true },
];

const stars  = (n) => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
const money  = (v) => '$' + v.toFixed(2);

function productCard(p) {
  const el = document.createElement('article');
  el.className = 'product';
  el.dataset.tags = p.tags.join(' ');
  el.setAttribute('data-reveal', 'up');
  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  el.innerHTML = `
    ${p.deal ? `<span class="badge">-${off}%</span>` : ''}
    <button class="wish" aria-label="Save for later">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20S4 14 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5C20 14 12 20 12 20Z"/></svg>
    </button>
    <div class="product-media">
      ${glassesMarkup(p.style)}
      ${p.img ? `<img class="product-photo" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()">` : ''}
    </div>
    <p class="product-name">${p.name}</p>
    <div class="product-meta"><span class="stars" aria-hidden="true">${stars(p.rating)}</span><span>(${p.rating}.0)</span></div>
    <p class="product-price">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ''}</p>
    ${p.deal ? `<div class="countdown" data-countdown></div>` : ''}
  `;
  return el;
}

function renderProducts() {
  const t = $('#trending-grid');
  const b = $('#bestseller-grid');
  if (t) PRODUCTS.slice(0, 10).forEach((p) => t.appendChild(productCard(p)));
  if (b) [...PRODUCTS].reverse().slice(0, 8).forEach((p) => b.appendChild(productCard(p)));
}

function initCountdowns() {
  const els = $$('[data-countdown]');
  if (!els.length) return;
  const target = Date.now() + 26 * 36e5 + 17 * 6e4;
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    let d = Math.max(0, target - Date.now());
    const dd = Math.floor(d / 864e5); d -= dd * 864e5;
    const hh = Math.floor(d / 36e5);  d -= hh * 36e5;
    const mm = Math.floor(d / 6e4);   d -= mm * 6e4;
    const ss = Math.floor(d / 1e3);
    const html = `<span>${pad(dd)}d</span><span>${pad(hh)}h</span><span>${pad(mm)}m</span><span>${pad(ss)}s</span>`;
    els.forEach((e) => (e.innerHTML = html));
  };
  tick();
  setInterval(tick, 1000);
}

function initTabs() {
  const tabs = $$('.tab');
  const grid = $('#trending-grid');
  if (!tabs.length || !grid) return;
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => {
      const on = x === t;
      x.classList.toggle('is-active', on);
      x.setAttribute('aria-selected', String(on));
    });
    const f = t.dataset.filter;
    $$('.product', grid).forEach((card) => {
      const show = f === 'all' || card.dataset.tags.split(' ').includes(f);
      card.style.display = show ? '' : 'none';
    });
  }));
}

function initLoader() {
  const el = $('.loader');
  const done = () => document.body.classList.add('ready');
  if (!el) return done();
  if (reduce) { el.remove(); return done(); }

  const num = $('.loader-num', el);
  let p = 0;
  const step = () => {
    p = Math.min(100, p + Math.random() * 22 + 12);
    num.textContent = String(Math.floor(p));
    if (p < 100) return setTimeout(step, 60 + Math.random() * 90);
    setTimeout(() => {
      el.classList.add('done');
      done();
      setTimeout(() => el.remove(), 950);
    }, 180);
  };
  step();
  setTimeout(done, 3500);
  setTimeout(() => el.remove(), 4500);
}

function initHeader() {
  const h = $('.site-header');
  if (!h) return;
  let last = scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = scrollY;
    h.classList.toggle('is-stuck', y > 8);
    if (!h.classList.contains('nav-open')) {
      const goingDown = y > last && y > 320;
      h.classList.toggle('is-hidden', goingDown && !reduce);
    }
    last = y;
  };
  update();
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });

  const mt = $('.menu-toggle', h);
  mt?.addEventListener('click', () => {
    const open = h.classList.toggle('nav-open');
    h.classList.remove('is-hidden');
    mt.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a', h).forEach((a) => a.addEventListener('click', () => {
    h.classList.remove('nav-open');
    mt?.setAttribute('aria-expanded', 'false');
  }));
}

function initChromeHeight() {
  const parts = [$('.announce'), $('.site-header')].filter(Boolean);
  if (!parts.length) return;
  const set = () => {
    const h = parts.reduce((n, el) => n + el.offsetHeight, 0);
    document.documentElement.style.setProperty('--chrome-h', `${h}px`);
  };
  set();
  addEventListener('resize', set);
  addEventListener('load', set);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(set);
    parts.forEach((el) => ro.observe(el));
  }
}

function initProgress() {
  const bar = $('#progress-bar');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;
  };
  update();
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
}

function initSplit() {
  $$('.section-title, .statement-title').forEach((el) => {
    if (el.querySelector('.split')) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="split" style="--wi:${i}"><i>${w}</i></span>`)
      .join(' ');
  });
}

function initSectionReveal() {
  const secs = $$('main > section:not(.hero), .site-footer');
  if (!secs.length) return;

  const play = (s) => {
    if (s.classList.contains('in-view')) return;
    s.classList.add('in-view');
    $$('[data-reveal]', s).forEach((el) => el.classList.add('in'));
  };

  if (reduce || !('IntersectionObserver' in window)) {
    secs.forEach(play);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { play(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -12% 0px' });
  secs.forEach((s) => io.observe(s));

  const near = () => secs.forEach((s) => {
    if (s.getBoundingClientRect().top < innerHeight * 0.95) play(s);
  });
  addEventListener('load', near);
  setTimeout(near, 800);
}

function initMagnetic() {
  if (reduce || matchMedia('(pointer: coarse)').matches) return;
  $$('[data-magnetic]').forEach((el) => {
    const strength = 0.28;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

function initMarquee() {
  const marquee = $('.marquee');
  const track = $('.marquee-track');
  if (!marquee || !track || reduce) return;

  track.style.animation = 'none';
  const seed = $('.marquee-group', track);

  let unit = seed.offsetWidth;
  while (track.scrollWidth < innerWidth + unit * 2) track.appendChild(seed.cloneNode(true));

  const BASE = 46;
  let x = 0, boost = 0, paused = false;
  let lastScroll = scrollY, lastT = performance.now();

  marquee.addEventListener('pointerenter', () => { paused = true; });
  marquee.addEventListener('pointerleave', () => { paused = false; });
  addEventListener('scroll', () => {
    boost = Math.min(520, boost + Math.abs(scrollY - lastScroll) * 5);
    lastScroll = scrollY;
  }, { passive: true });
  addEventListener('resize', () => { unit = seed.offsetWidth; });

  const tick = (now) => {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    boost *= 0.9;
    x -= (paused ? boost : BASE + boost) * dt;
    if (x <= -unit) x += unit;
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  };
  requestAnimationFrame(tick);
}

function initCategorySlider() {
  const vp = $('#cat-viewport');
  if (!vp) return;
  const root  = vp.closest('.cat-slider');
  const slides = $$('.cat-slide', vp);
  const dots  = $('#cat-dots');
  const arrows = $$('.cat-arrow', root);
  if (slides.length < 2) return;

  const DELAY = 4200;
  let page = 0, pages = 1, timer = null;

  const perView = () => Math.max(
    1, Math.round(vp.clientWidth / slides[0].getBoundingClientRect().width)
  );
  const pageCount = () => Math.max(1, Math.ceil(slides.length / perView()));

  const paint = () => {
    if (!dots) return;
    $$('.cat-dot', dots).forEach((d, i) => {
      const on = i === page;
      d.classList.toggle('is-active', on);
      d.setAttribute('aria-selected', String(on));
      d.tabIndex = on ? 0 : -1;
    });
  };

  const buildDots = () => {
    if (!dots) return;
    dots.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cat-dot' + (i === page ? ' is-active' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Category page ${i + 1} of ${pages}`);
      b.addEventListener('click', () => { stop(); go(i); start(); });
      dots.appendChild(b);
    }
  };

  const go = (i, smooth = true) => {
    pages = pageCount();
    page = (i % pages + pages) % pages;
    const max = vp.scrollWidth - vp.clientWidth;
    vp.scrollTo({
      left: Math.min(page * vp.clientWidth, max),
      behavior: smooth && !reduce ? 'smooth' : 'auto',
    });
    paint();
  };

  let onScreen = true, hot = true;
  const start = () => { if (!reduce && !timer && onScreen && hot) timer = setInterval(() => go(page + 1), DELAY); };
  const stop  = () => { clearInterval(timer); timer = null; };
  const setHot = (v) => { hot = v; v ? start() : stop(); };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      onScreen ? start() : stop();
    }, { threshold: 0.2 }).observe(root);
  }

  arrows.forEach((a) => a.addEventListener('click', () => {
    stop(); go(page + Number(a.dataset.dir || 1)); start();
  }));

  let sTick;
  vp.addEventListener('scroll', () => {
    clearTimeout(sTick);
    sTick = setTimeout(() => {
      const p = Math.round(vp.scrollLeft / vp.clientWidth);
      if (p !== page && p >= 0 && p < pages) { page = p; paint(); }
    }, 120);
  }, { passive: true });

  root.addEventListener('pointerenter', () => setHot(false));
  root.addEventListener('pointerleave', () => setHot(true));
  root.addEventListener('focusin',  () => setHot(false));
  root.addEventListener('focusout', () => setHot(true));
  document.addEventListener('visibilitychange', () => setHot(!document.hidden));

  let rTick;
  addEventListener('resize', () => {
    clearTimeout(rTick);
    rTick = setTimeout(() => { pages = pageCount(); buildDots(); go(page, false); }, 150);
  });

  pages = pageCount();
  buildDots();
  paint();
  start();
}

function initGlassArt() {
  $$('.orb[data-shape]').forEach((o) => {
    const stroke = o.classList.contains('orb-lg') ? '#101010' : '#f4f4f2';
    o.style.backgroundImage = `url("${glassesDataURI(o.dataset.shape, stroke)}")`;
  });
  const sg = $('.showcase-glass');
  if (sg) sg.style.backgroundImage = `url("${glassesDataURI('browline', '#f4f4f2')}")`;
}

function initReveals() {
  const els = $$('[data-reveal]');
  els.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute('data-reveal'));
    if (sibs.length > 1) el.style.setProperty('--i', sibs.indexOf(el));
  });

  const targets = new Set(els.filter((e) =>
    !e.closest('.hero') && !e.closest('main > section') && !e.closest('.site-footer')
  ));
  if (!targets.size) return;
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach((e) => e.classList.add('in'));
    return;
  }

  const show = (e) => { e.classList.add('in'); targets.delete(e); io.unobserve(e); };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) show(e.target); });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((e) => io.observe(e));

  let ticking = false;
  const sweep = () => {
    ticking = false;
    targets.forEach((e) => {
      if (e.getBoundingClientRect().top < innerHeight * 0.88) show(e);
    });
    if (!targets.size) {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', sweep);
  setTimeout(sweep, 800);
  setTimeout(() => targets.forEach((e) => e.classList.add('in')), 5000);
}

function initStatement() {
  const el = $('#statement');
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  const spans = $$('.w', el);
  if (reduce) return spans.forEach((s) => s.classList.add('lit'));

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = el.getBoundingClientRect();

    const p = clamp((innerHeight * 0.9 - r.top) / (r.height + innerHeight * 0.3), 0, 1);
    const lit = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('lit', i < lit));
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
}

function initParallax() {
  const els = $$('[data-parallax]');
  if (!els.length || reduce) return;
  const MAX = 60;
  let ticking = false;
  const update = () => {
    ticking = false;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();

      if (r.bottom < -200 || r.top > innerHeight + 200) { el.style.transform = ''; return; }
      const from = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      const amt = parseFloat(el.dataset.parallax);
      const y = clamp(-from * amt * 100, -MAX, MAX);
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  addEventListener('resize', update);
  update();
}

async function initHero() {
  const stage = $('#hero-stage');
  const canvas = $('#scene');
  const hero = $('.hero');
  if (!canvas || !stage) return;

  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
  } catch {
    hero.classList.add('no-3d');
    return;
  }

  let THREE, RoomEnvironment, EffectComposer, RenderPass, UnrealBloomPass, OutputPass;
  let RectAreaLightUniformsLib, mergeGeometries, toCreasedNormals;
  let GLTFLoader, DRACOLoader, MeshoptDecoder;
  try {
    THREE = await import('three');
    ({ RoomEnvironment }  = await import('three/addons/environments/RoomEnvironment.js'));
    ({ EffectComposer }   = await import('three/addons/postprocessing/EffectComposer.js'));
    ({ RenderPass }       = await import('three/addons/postprocessing/RenderPass.js'));
    ({ UnrealBloomPass }  = await import('three/addons/postprocessing/UnrealBloomPass.js'));
    ({ OutputPass }       = await import('three/addons/postprocessing/OutputPass.js'));
    ({ RectAreaLightUniformsLib } = await import('three/addons/lights/RectAreaLightUniformsLib.js'));
    ({ mergeGeometries, toCreasedNormals } = await import('three/addons/utils/BufferGeometryUtils.js'));
    ({ GLTFLoader }     = await import('three/addons/loaders/GLTFLoader.js'));
    ({ DRACOLoader }    = await import('three/addons/loaders/DRACOLoader.js'));
    ({ MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js'));
  } catch (err) {
    console.warn('Three.js unavailable, using static hero:', err);
    hero.classList.add('no-3d');
    return;
  }

  let W = stage.clientWidth, H = stage.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
  camera.position.set(0, 0.1, 8.6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  RectAreaLightUniformsLib.init();

  const boxTop = new THREE.RectAreaLight(0xffffff, 3.8, 5.5, 1.8);
  boxTop.position.set(-2.6, 3.2, 3.2); scene.add(boxTop);

  const boxSide = new THREE.RectAreaLight(0xffffff, 3.4, 1.1, 5);
  boxSide.position.set(3.4, 0.2, 2.4); scene.add(boxSide);

  const key = new THREE.DirectionalLight(0xffffff, 1.1);  key.position.set(3, 4, 5);   scene.add(key);
  const rimLight = new THREE.SpotLight(0xffffff, 45, 24, Math.PI / 5, 0.5); rimLight.position.set(-4.6, 1.6, -3.4); scene.add(rimLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.13));

  const acetate = new THREE.MeshPhysicalMaterial({
    color: 0x08080a, roughness: 0.28, metalness: 0,
    clearcoat: 1, clearcoatRoughness: 0.1,
    envMapIntensity: 0.12,
  });
  const steel = new THREE.MeshStandardMaterial({ color: 0xd6d9dd, metalness: 1, roughness: 0.3, envMapIntensity: 0.9 });

  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.06, metalness: 0,
    transmission: 1, thickness: 0.6, ior: 1.52,
    transparent: false, opacity: 1,
    attenuationColor: 0x8b9aa0, attenuationDistance: 0.7,
    clearcoat: 0, envMapIntensity: 0.35, specularIntensity: 0.6,
  });

  function roundedRect(p, w, h, r, cy = 0) {
    const x = -w / 2, y = cy - h / 2;
    p.moveTo(x + r, y);
    p.lineTo(x + w - r, y);
    p.quadraticCurveTo(x + w, y, x + w, y + r);
    p.lineTo(x + w, y + h - r);
    p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    p.lineTo(x + r, y + h);
    p.quadraticCurveTo(x, y + h, x, y + h - r);
    p.lineTo(x, y + r);
    p.quadraticCurveTo(x, y, x + r, y);
    return p;
  }

  const FACE_R = 7;

  function bend(x, y, z, out = new THREE.Vector3()) {
    const a = x / FACE_R, r = FACE_R + z;
    return out.set(r * Math.sin(a), y, r * Math.cos(a) - FACE_R);
  }

  function formFront(geo) {
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const byY = 1 - 0.26 * clamp((0.55 - y) / 1.5, 0, 1);
      const byX = 1 - 0.2 * clamp((Math.abs(x) - 1.45) / 0.95, 0, 1);
      bend(x, y, pos.getZ(i) * byY * byX, v);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    const out = toCreasedNormals(geo, 0.9);
    if (out !== geo) geo.dispose();
    return out;
  }

  const BAR = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    return [Math.sign(c) * Math.abs(c) ** 0.45, Math.sign(s) * Math.abs(s) ** 0.45];
  });

  function barGeometry(curve, steps, wAt, tAt) {
    const N = BAR.length, UP = new THREE.Vector3(0, 1, 0);
    const pos = [], idx = [];
    const p = new THREE.Vector3(), tan = new THREE.Vector3();
    const side = new THREE.Vector3(), up = new THREE.Vector3(), q = new THREE.Vector3();

    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      curve.getPoint(u, p);
      curve.getTangent(u, tan);
      side.crossVectors(UP, tan).normalize();
      up.crossVectors(tan, side).normalize();
      const w = wAt(u), t = tAt(u);
      for (const [cu, cv] of BAR) {
        q.copy(p).addScaledVector(side, cu * t).addScaledVector(up, cv * w);
        pos.push(q.x, q.y, q.z);
      }
    }
    for (let i = 0; i < steps; i++) for (let j = 0; j < N; j++) {
      const a = i * N + j, b = i * N + (j + 1) % N;
      idx.push(a, b, a + N, b, b + N, a + N);
    }
    const capA = pos.length / 3;
    curve.getPoint(0, p); pos.push(p.x, p.y, p.z);
    curve.getPoint(1, p); pos.push(p.x, p.y, p.z);
    for (let j = 0; j < N; j++) {
      idx.push(capA, (j + 1) % N, j);
      idx.push(capA + 1, steps * N + j, steps * N + (j + 1) % N);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const out = toCreasedNormals(g, 0.9);
    if (out !== g) g.dispose();
    return out;
  }

  const SHAPES = {
    aviator: () => {
      const outer = new THREE.Shape();
      outer.absarc(0, 0, 1.06, 0, Math.PI * 2, false);
      const hole = new THREE.Path();
      hole.absarc(0, 0, 0.88, 0, Math.PI * 2, true);
      outer.holes.push(hole);
      const lens = new THREE.Shape();
      lens.absarc(0, 0, 0.89, 0, Math.PI * 2, false);
      return { outer, lens, halfW: 1.06, holeHalfW: 0.88, hingeY: 0.26,
               bridge: { top: 0.52, side: -0.14, nose: 0.14 } };
    },
    sun: () => {
      const outer = roundedRect(new THREE.Shape(), 2.14, 1.74, 0.34);
      const hole  = roundedRect(new THREE.Path(),  1.82, 1.42, 0.24);
      outer.holes.push(hole);
      const lens  = roundedRect(new THREE.Shape(), 1.83, 1.43, 0.24);
      return { outer, lens, halfW: 1.07, holeHalfW: 0.91, hingeY: 0.22,
               bridge: { top: 0.62, side: -0.08, nose: 0.14 } };
    },
    titanium: () => {

      const outer = roundedRect(new THREE.Shape(), 2.14, 1.7, 0.2);
      const hole  = roundedRect(new THREE.Path(),  1.86, 1.24, 0.26, -0.16);
      outer.holes.push(hole);
      const lens  = roundedRect(new THREE.Shape(), 1.87, 1.25, 0.26, -0.16);
      return { outer, lens, halfW: 1.07, holeHalfW: 0.93, hingeY: 0.28,
               bridge: { top: 0.78, side: 0.12, nose: 0.3 } };
    },
  };

  const EXTRUDE = {
    depth: 0.2, curveSegments: 40,
    bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.05, bevelSegments: 5,
  };
  const LENS_EXTRUDE = {
    depth: 0.09, curveSegments: 40,
    bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2,
  };

  function bridgeShape(cx, holeHalfW, b) {
    const x = cx - holeHalfW - 0.02;
    const p = new THREE.Shape();
    p.moveTo(-x, b.top);
    p.lineTo(x, b.top);
    p.lineTo(x, b.side);
    p.bezierCurveTo(x * 0.78, b.side, x * 0.62, b.nose, 0, b.nose);
    p.bezierCurveTo(-x * 0.62, b.nose, -x * 0.78, b.side, -x, b.side);
    p.closePath();
    return p;
  }

  const rivetGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.05, 14);
  const hingeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.2, 18);

  function buildGlasses(kind = 'aviator') {
    const { outer, lens, halfW, holeHalfW, hingeY, bridge } = (SHAPES[kind] || SHAPES.aviator)();
    const g = new THREE.Group();
    const cx = halfW + 0.16;
    const endX = cx + halfW;

    const rimCut = new THREE.ExtrudeGeometry(outer, EXTRUDE);
    const tabCut = new THREE.ExtrudeGeometry(roundedRect(new THREE.Shape(), 0.3, 0.34, 0.09), EXTRUDE);
    const parts = [
      rimCut.clone().translate(-cx, 0, 0),
      rimCut.clone().translate(cx, 0, 0),
      new THREE.ExtrudeGeometry(bridgeShape(cx, holeHalfW, bridge), EXTRUDE),
      tabCut.clone().translate(-(endX - 0.08), hingeY, 0),
      tabCut.clone().translate(endX - 0.08, hingeY, 0),
    ];
    rimCut.dispose(); tabCut.dispose();

    let frontGeo = mergeGeometries(parts, false);
    parts.forEach((p) => p.dispose());
    frontGeo.translate(0, 0, -EXTRUDE.depth / 2);
    frontGeo = formFront(frontGeo);
    g.add(new THREE.Mesh(frontGeo, acetate));

    const lensCut = new THREE.ExtrudeGeometry(lens, LENS_EXTRUDE);
    const lensParts = [lensCut.clone().translate(-cx, 0, 0), lensCut.clone().translate(cx, 0, 0)];
    lensCut.dispose();
    const lensGeo = mergeGeometries(lensParts, false);
    lensParts.forEach((p) => p.dispose());
    lensGeo.translate(0, 0, -LENS_EXTRUDE.depth / 2);
    const lp = lensGeo.attributes.position, lv = new THREE.Vector3();
    for (let i = 0; i < lp.count; i++) {
      bend(lp.getX(i), lp.getY(i), lp.getZ(i), lv);
      lp.setXYZ(i, lv.x, lv.y, lv.z);
    }
    lp.needsUpdate = true;
    lensGeo.computeVertexNormals();
    g.add(new THREE.Mesh(lensGeo, lensMat));

    const face = EXTRUDE.depth / 2 * 0.86;
    const splay = 0.35 * endX / FACE_R;
    const Y = new THREE.Vector3(0, 1, 0);

    for (const s of [-1, 1]) {
      const theta = s * endX / FACE_R;
      const nrm = new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta));

      for (const k of [-1, 1]) {
        const dot = new THREE.Mesh(rivetGeo, steel);
        bend(s * (endX - 0.09), hingeY + k * 0.075, face, dot.position);
        dot.quaternion.setFromUnitVectors(Y, nrm);
        g.add(dot);
      }

      const hinge = new THREE.Mesh(hingeGeo, steel);
      bend(s * (endX + 0.01), hingeY, -0.03, hinge.position);
      g.add(hinge);

      const h = bend(s * (endX - 0.01), hingeY, -0.02, new THREE.Vector3());
      const back = new THREE.Vector3(s * Math.sin(splay), 0, -Math.cos(splay));
      const lat  = new THREE.Vector3(s * Math.cos(splay), 0, s * Math.sin(splay));
      const at = (d, dy, dl) => h.clone().addScaledVector(back, d).addScaledVector(Y, dy).addScaledVector(lat, dl);
      const arm = new THREE.CatmullRomCurve3([
        at(-0.04, 0, 0), at(0.85, -0.02, 0.01), at(1.85, -0.1, 0),
        at(2.5, -0.44, -0.05), at(2.78, -0.82, -0.13),
      ]);
      g.add(new THREE.Mesh(
        barGeometry(arm, 64, (u) => lerp(0.115, 0.055, u ** 1.5), (u) => lerp(0.055, 0.04, u)),
        acetate,
      ));
    }

    g.rotation.x = -0.13;
    g.userData.procedural = true;
    return g;
  }

  function buildDust() {
    const n = 150;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 13;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.02, transparent: true, opacity: 0.4, depthWrite: false,
    }));
  }

  const pivot = new THREE.Group();
  let glasses = buildGlasses('aviator');
  pivot.add(glasses);
  const dust = buildDust();
  scene.add(pivot, dust);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.16, 0.35, 0.86));
  composer.addPass(new OutputPass());

  const MODELS = {
    aviator:  { url: 'models/aviator_glasses.opt.glb',                        rotation: [0, 0, 0],           scale: 1, lift: [0, 0, 0], materials: 'model' },
    titanium: { url: 'models/titanium_frame_glass.opt.glb',                   rotation: [0, 0, 0],           scale: 1, lift: [0, 0, 0], materials: 'model' },
    sun:      { url: 'models/stylish_modern_high_quality_sunglasses.opt.glb', rotation: [0, 0, 0],           scale: 1, lift: [0, 0, 0], materials: 'ours' },
    round:    { url: 'models/eyewear_specs.opt.glb',                          rotation: [0, Math.PI / 2, 0], scale: 1, lift: [0, 0, 0], materials: 'model' },
  };
  const FRONT_SPAN = 4.3;

  const MAX_RADIUS = 2.6;

  const gltfLoader = new GLTFLoader()
    .setDRACOLoader(new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/draco/'))
    .setMeshoptDecoder(MeshoptDecoder);

  const matsOf = (m) => (Array.isArray(m) ? m : [m]);

  const LENS  = /lens|glass/;
  const METAL = /hinge|screw|metal|steel|rivet|wire|nose.?piece|nosss/;

  function reskin(root) {
    const names = new Set();
    root.traverse((o) => { if (o.isMesh) matsOf(o.material).forEach((m) => names.add(m.name)); });
    const byMaterial = names.size > 1;
    root.traverse((o) => {
      if (!o.isMesh) return;
      const label = (byMaterial
        ? matsOf(o.material).map((m) => m.name).join(' ')
        : o.name.replace(/_[^_]*_\d+$/, '')
      ).toLowerCase();
      if (LENS.test(label)) o.material = lensMat;
      else if (METAL.test(label)) o.material = steel;
      else o.material = acetate;
    });
  }

  function fitModel(root, cfg) {
    const g = new THREE.Group();
    root.rotation.fromArray(cfg.rotation);
    g.add(root);

    const box = new THREE.Box3().setFromObject(g);
    const size = new THREE.Vector3(), mid = new THREE.Vector3();
    box.getSize(size); box.getCenter(mid);
    root.position.sub(mid);

    const reach = box.getBoundingSphere(new THREE.Sphere()).radius;
    g.scale.setScalar(Math.min(FRONT_SPAN / Math.max(size.x, 1e-4), MAX_RADIUS / Math.max(reach, 1e-4)) * cfg.scale);
    g.position.fromArray(cfg.lift);
    g.rotation.x = -0.13;

    if (cfg.materials === 'ours') reskin(g);
    else g.traverse((o) => {
      if (o.isMesh) matsOf(o.material).forEach((m) => { if ('envMapIntensity' in m) m.envMapIntensity = 1; });
    });
    return g;
  }

  const loaded = new Map();
  const inflight = new Map();
  function loadFrame(kind) {
    if (loaded.has(kind)) return Promise.resolve(loaded.get(kind));
    if (!inflight.has(kind)) {
      const cfg = MODELS[kind];
      const p = (!cfg ? Promise.resolve(null) : gltfLoader.loadAsync(cfg.url)
        .then((gltf) => fitModel(gltf.scene, cfg))
        .catch((err) => { console.warn('hero: could not load ' + cfg.url, err); return null; }))
        .then((m) => { loaded.set(kind, m); inflight.delete(kind); return m; });
      inflight.set(kind, p);
    }
    return inflight.get(kind);
  }

  let swapT = 1;
  let current = 'aviator';
  let swapId = 0;

  function disposeGroup(group) {
    if (!group.userData.procedural) return;
    group.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
  }

  function show(next, punch = true) {
    if (!next || next === glasses) return;
    if (punch) swapT = 0;
    pivot.remove(glasses);
    disposeGroup(glasses);
    glasses = next;
    pivot.add(glasses);
  }

  async function setShape(kind) {
    if (kind === current || !MODELS[kind]) return;
    current = kind;
    const mine = ++swapId;
    const model = await loadFrame(kind);
    if (mine !== swapId) return;
    show(model || buildGlasses(kind));
  }

  const warmAll = () => Object.keys(MODELS).forEach(loadFrame);
  $$('.fs').forEach((l) => l.addEventListener('pointerenter', warmAll, { once: true }));

  const RADIO_SHAPE = { 'fs-aviator': 'aviator', 'fs-titanium': 'titanium', 'fs-sun': 'sun', 'fs-round': 'round' };
  $$('.fs-input').forEach((r) => r.addEventListener('change', () => {
    if (r.checked) setShape(RADIO_SHAPE[r.id]);
  }));
  const checked = $('.fs-input:checked');
  if (checked && RADIO_SHAPE[checked.id] !== current) setShape(RADIO_SHAPE[checked.id]);

  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    ptr.tx = (e.clientX / innerWidth) * 2 - 1;
    ptr.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  const stackedHero = () => matchMedia('(max-width: 960px)').matches;
  let camZ = 8.6;

  const resize = () => {
    W = stage.clientWidth; H = stage.clientHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
    composer.setSize(W, H);
    const stacked = stackedHero();

    camZ = stacked ? 7.2 : 8.6;

    pivot.position.x = stacked ? 0 : clamp((W / H) * 0.95, 1.3, 1.9);

    const aim = pivot.position.x;
    boxTop.position.x = aim - 2.6;  boxTop.lookAt(aim, 0, 0);
    boxSide.position.x = aim + 3.4; boxSide.lookAt(aim, 0, 0);
  };
  addEventListener('resize', resize);

  let visible = true;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 }).observe(hero);

  let introT = 0;
  const easeOut = (x) => 1 - Math.pow(1 - x, 4);

  const clock = new THREE.Clock();
  const render = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();
    ptr.x = lerp(ptr.x, ptr.tx, 0.05);
    ptr.y = lerp(ptr.y, ptr.ty, 0.05);
    const sp = clamp(scrollY / innerHeight, 0, 1);

    if (document.body.classList.contains('ready')) introT = Math.min(1, introT + dt / 1.5);
    const intro = easeOut(introT);
    swapT = Math.min(1, swapT + dt / 0.45);
    const swap = easeOut(swapT);

    pivot.rotation.y = Math.sin(t * 0.3) * 0.45 + ptr.x * 0.5 + sp * 1.7 + (1 - intro) * -1.1;
    pivot.rotation.x = -0.02 + Math.cos(t * 0.35) * 0.05 + ptr.y * 0.18;
    pivot.position.y = 0.12 + Math.sin(t * 0.6) * 0.05 - sp * 0.9;
    pivot.position.z = -sp * 1.6;
    pivot.scale.setScalar(0.82 * (0.86 + 0.14 * intro) * (0.9 + 0.1 * swap));

    camera.position.z = camZ + sp * 2.4;
    camera.position.x = ptr.x * 0.3;
    camera.lookAt(0, 0, 0);
    dust.rotation.y = t * 0.02;

    composer.render();
  };

  const loop = () => {
    requestAnimationFrame(loop);
    if (visible) render();
  };

  resize();
  if (reduce) { introT = 1; swapT = 1; render(); }
  else loop();

  loadFrame(current).then((model) => {
    show(model, false);
    requestAnimationFrame(() => {
      canvas.style.opacity = '1';
      hero.classList.add('has-webgl');
      if (window.requestIdleCallback) requestIdleCallback(warmAll, { timeout: 4000 });
      else setTimeout(warmAll, 1500);
    });
  });
}

function boot() {
  initLoader();
  initChromeHeight();
  initHeader();
  initProgress();
  initGlassArt();
  renderProducts();
  initCountdowns();
  initTabs();
  initSplit();
  initStatement();
  initParallax();
  initMagnetic();
  initMarquee();
  initCategorySlider();
  initSectionReveal();
  initReveals();
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
  initHero();
}

if (document.readyState !== 'loading') boot();
else addEventListener('DOMContentLoaded', boot);
