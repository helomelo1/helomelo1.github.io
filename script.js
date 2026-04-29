/* Particle Background */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.s = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.o = Math.random() * 0.35 + 0.08;
      this.c = [[100,223,180],[108,180,238],[179,136,245]][Math.floor(Math.random()*3)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (mouse.x) {
        const dx = mouse.x-this.x, dy = mouse.y-this.y, d = Math.hypot(dx,dy);
        if (d < 130) { const f = (130-d)/130; this.vx -= dx/d*f*0.01; this.vy -= dy/d*f*0.01; }
      }
      this.vx *= 0.997; this.vy *= 0.997;
      if (this.x<0||this.x>canvas.width) this.vx *= -1;
      if (this.y<0||this.y>canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x,this.y,this.s,0,Math.PI*2);
      ctx.fillStyle = `rgba(${this.c[0]},${this.c[1]},${this.c[2]},${this.o})`; ctx.fill();
    }
  }

  function init() {
    particles = Array.from({length: Math.min(Math.floor(canvas.width*canvas.height/16000),90)}, ()=>new P());
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for (const p of particles) { p.update(); p.draw(); }
    for (let i=0;i<particles.length;i++)
      for (let j=i+1;j<particles.length;j++) {
        const d = Math.hypot(particles[i].x-particles[j].x, particles[i].y-particles[j].y);
        if (d<100) { ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(100,223,180,${(1-d/100)*0.08})`; ctx.lineWidth=0.5; ctx.stroke(); }
      }
    requestAnimationFrame(draw);
  }

  addEventListener('resize', ()=>{ resize(); init(); });
  addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });
  addEventListener('mouseout', ()=>{ mouse.x=null; mouse.y=null; });
  resize(); init(); draw();
})();

/* Scroll fade-in */
(function() {
  const els = document.querySelectorAll('.fade-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
})();

/* Active nav */
(function() {
  const links = document.querySelectorAll('.nav-links a');
  const secs = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-56px 0px 0px 0px' });
  secs.forEach(s => obs.observe(s));
})();

/* Mobile menu */
(function() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav-links');
  if (!btn) return;
  btn.addEventListener('click', () => { nav.classList.toggle('open'); btn.textContent = nav.classList.contains('open') ? '✕' : '☰'; });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.textContent = '☰'; }));
})();

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { const y = t.getBoundingClientRect().top + scrollY - 60; scrollTo({top:y, behavior:'smooth'}); }
  });
});
