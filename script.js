// ============================================
// VORTEXX ASSESSORIA SOLAR - SCRIPTS
// Dark theme + Alpha-style interactions
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll Progress Bar ----
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.prepend(scrollProgress);

    // ---- Stagger children setup ----
    document.querySelectorAll('.problem-grid, .metrics-grid, .services-grid, .results-gallery').forEach(grid => {
        grid.classList.add('stagger-children');
    });

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        scrollProgress.style.transform = `scaleX(${progress})`;
    }

    // ---- Parallax orbs ----
    const orbs = document.querySelectorAll('.hero-orb, .cta-orb');
    function updateParallax() {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = 0.03 + (i * 0.015);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateScrollProgress();
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ---- Intersection Observer for fade-up + stagger ----
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.fade-up, .stagger-children').forEach(el => fadeObserver.observe(el));

    // ---- Counter Animation ----
    const metricNumbers = document.querySelectorAll('.metric-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    metricNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    // ---- Metric Bar Animation ----
    const metricBars = document.querySelectorAll('.metric-bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => { entry.target.style.width = entry.target.dataset.width + '%'; }, 300);
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    metricBars.forEach(bar => barObserver.observe(bar));

    // ---- Chart Bar Animation ----
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chartBars.forEach((bar, i) => {
                    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 100);
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const geoChart = document.querySelector('.geo-chart');
    if (geoChart) chartObserver.observe(geoChart);

    // ---- Funis Convergentes — Sentinel Phase Observers ----
    const funnelsStage = document.getElementById('funnelsStage');
    if (funnelsStage) {
        const sentinels = funnelsStage.querySelectorAll('.funnel-sentinel');
        const phaseObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const phase = entry.target.dataset.phase;
                    funnelsStage.classList.add('phase-' + phase);
                    phaseObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });
        sentinels.forEach(s => phaseObserver.observe(s));
    }

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });

            // Toggle current
            if (!isActive) item.classList.add('active');
        });
    });

    // ---- Form submission → WhatsApp ----
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(leadForm);
            const nome = data.get('nome') || '';
            const instagram = data.get('instagram') || '';
            const telefone = data.get('telefone') || '';
            const cidade = data.get('cidade') || '';
            const instalacoes = data.get('instalacoes') || '';
            const faturamento = data.get('faturamento') || '';

            const msg = encodeURIComponent(
                `Olá! Gostaria de receber uma análise gratuita.\n\n` +
                `Nome: ${nome}\n` +
                `Instagram: ${instagram}\n` +
                `Telefone: ${telefone}\n` +
                `Cidade: ${cidade}\n` +
                `Instalações/mês: ${instalacoes}\n` +
                `Faturamento: ${faturamento}`
            );

            window.open(`https://wa.me/5585981992658?text=${msg}`, '_blank');
        });
    }

    // ---- Phone mask ----
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
            else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
            else if (v.length > 0) v = `(${v}`;
            e.target.value = v;
        });
    }

    // ---- Lightbox ----
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('.result-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) closeLightbox(); });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ---- Magnetic hover on buttons ----
    document.querySelectorAll('.btn-accent, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

});
