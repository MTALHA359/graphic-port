/* ==========================================================================
   M SAAD PORTFOLIO — INTERACTIVE ENGINE (UPGRADED)
   Visual Designer & Node.js Developer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initCursor();
    initParticleCanvas();
    initSoundEngine();
    initNavbar();
    initPortfolioSearchAndFilters();
    initCaseStudyModals();
    initEstimatorCalculator();
    init3DTiltEffect();
    initResumeModal();
    initContactForm();
    initCounterAnimations();
    initYear();
});

/* --- 0. Top Scroll Progress Bar --- */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

/* --- 1. Custom Interactive Cursor --- */
function initCursor() {
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    if (!cursorDot || !cursorOutline) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Hover Scaling for Interactive Elements
    const updateInteractables = () => {
        const interactables = document.querySelectorAll('a, button, input, select, textarea, .project-card, .filter-btn, .service-box, .calc-chip');
        interactables.forEach((el) => {
            if (el.getAttribute('data-cursor-bound')) return;
            el.setAttribute('data-cursor-bound', 'true');

            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
                cursorOutline.style.borderColor = 'rgba(245, 158, 11, 0.85)';
                cursorOutline.style.backgroundColor = 'rgba(245, 158, 11, 0.08)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    };
    updateInteractables();
    setInterval(updateInteractables, 2000);
}

/* --- 2. Interactive Background Particle Canvas --- */
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 1,
            color: Math.random() > 0.5 ? 'rgba(245, 158, 11, ' : 'rgba(6, 182, 212, '
        });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + '0.5)';
            ctx.fill();

            // Connect lines between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }

            // Mouse proximity line
            const mdx = p.x - mouseX;
            const mdy = p.y - mouseY;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = p.color + (0.25 * (1 - mdist / 150)) + ')';
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        requestAnimationFrame(draw);
    }
    draw();
}

/* --- 3. Web Audio Synthesized Sound Engine --- */
let soundEnabled = true;
let audioCtx = null;

function playTone(freq, duration = 0.08, type = 'sine') {
    if (!soundEnabled) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        // Audio error silent fallback
    }
}

function initSoundEngine() {
    const toggleBtn = document.getElementById('soundToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            toggleBtn.classList.toggle('active', soundEnabled);
            const statusSpan = toggleBtn.querySelector('.sound-status');
            if (statusSpan) statusSpan.textContent = soundEnabled ? 'ON' : 'OFF';
            if (soundEnabled) playTone(880, 0.1, 'triangle');
        });
    }

    document.querySelectorAll('.btn, .filter-btn, .nav-link, .modal-close').forEach(el => {
        el.addEventListener('click', () => {
            playTone(600, 0.06, 'sine');
        });
    });
}

/* --- 4. Navbar & Mobile Menu --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateScrollSpy();
    });

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-open');
        });

        allLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    function updateScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                allLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* --- 5. Portfolio Search & Category Filters --- */
function initPortfolioSearchAndFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('portfolioSearchInput');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterProjects() {
        projectCards.forEach((card) => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const summary = card.querySelector('.project-summary')?.textContent.toLowerCase() || '';
            const tech = card.querySelector('.project-tech')?.textContent.toLowerCase() || '';

            const matchesCategory = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = !searchQuery || title.includes(searchQuery) || summary.includes(searchQuery) || tech.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 40);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 220);
            }
        });
    }

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterProjects();
        });
    }
}

/* --- 6. Case Study Modal Data & Handlers (All Timelines STRICTLY <= 1 Day) --- */
const caseStudiesData = {
    1: {
        title: "Aurelius — Luxury Executive Identity & Stationery",
        category: "Brand Identity, Typography & Print Production",
        client: "Aurelius London (UK)",
        role: "Lead Visual Designer",
        duration: "24 Hours (1-Day Express)",
        image: "assets/project_branding.jpg",
        tools: ["Adobe Illustrator", "Photoshop", "InDesign", "Print Finishing"],
        overview: "A comprehensive brand identity overhaul for an elite boutique investment firm based in Mayfair, London. The client needed a timeless, authoritative, yet modern aesthetic delivered under tight investor pitch constraints.",
        challenge: "Balancing strict classic luxury minimalism with functional corporate collateral delivered within a rapid 24-hour deadline across letterheads, foil-stamped business cards, investor pitch decks, and digital touchpoints.",
        solution: "Engineered a custom bespoke geometric serif monogram, high-contrast matte black and gold foil color palette, balanced typography hierarchy, and a 42-page brand guidelines master book in an intensive 24-hour sprint.",
        results: "Client closed $4.8M in preliminary funding rounds with elevated brand authority and 100% positive feedback on physical collateral quality."
    },
    2: {
        title: "Apex — Dark-Mode Financial Platform & Mobile UI",
        category: "UI/UX & Product Design",
        client: "Apex Digital Assets",
        role: "Senior UI/UX Designer & Prototyper",
        duration: "18 Hours (1-Day Design Blitz)",
        image: "assets/project_uiux.jpg",
        tools: ["Figma", "Design Systems", "Prototyping", "User Research"],
        overview: "An institutional-grade cryptocurrency and wealth portfolio management dashboard designed to make complex market telemetry and transaction flows instantly readable in high-stress environments.",
        challenge: "Preventing cognitive visual overload while displaying live trading depth charts, multi-currency wallet balances, transaction ledgers, and real-time yield analytics, engineered in an 18-hour sprint.",
        solution: "Implemented an ergonomic glassmorphism dark-slate design system with vibrant cyan/emerald telemetry accents, modular dashboard cards, and a unified companion mobile application for on-the-go asset management.",
        results: "Increased user daily active retention by 34% and reduced transaction execution error rate by 28% during private beta testing."
    },
    3: {
        title: "Noir Éclat — Premium Cosmetic Serum Packaging",
        category: "Product Packaging & 3D Visualization",
        client: "Noir Éclat Paris",
        role: "Graphic & Packaging Designer",
        duration: "12 Hours (1-Day Turnaround)",
        image: "assets/project_packaging.jpg",
        tools: ["Adobe Illustrator", "Photoshop 3D", "Dieline Engineering", "Vector Art"],
        overview: "High-end structural packaging and label engineering for an organic anti-aging serum. The brief requested a luxurious, tactile experience suitable for boutique retail display.",
        challenge: "Creating dielines and print specifications with tight tolerances for metallic gold foil stamping on matte soft-touch dark coating without registration bleeding, executed within 12 hours.",
        solution: "Designed custom art-deco inspired geometric line art, calculated exact dieline clearances for 30ml dropper bottles and rigid folding cartons, and rendered hyper-realistic 3D launch previews for pre-orders.",
        results: "Sold out first batch of 10,000 units within 72 hours of influencer launch campaign."
    },
    4: {
        title: "NexusFlow — Node.js Microservices & Live API Gateway",
        category: "Node.js Backend Engineering & Architecture",
        client: "Nexsoll LLC Enterprise Platform",
        role: "Node.js Backend Developer",
        duration: "24 Hours (1-Day Rapid Build)",
        image: "assets/project_nodejs.jpg",
        tools: ["Node.js", "Express.js", "MongoDB", "Redis", "RabbitMQ", "JWT"],
        overview: "A distributed microservices architecture engineered to handle authentication, real-time media ingestion, product catalog indexing, and webhook event streaming for enterprise clients.",
        challenge: "Managing concurrent high-volume traffic bursts (15,000 req/sec) without API gateway latency spikes or database connection pool exhaustion during a 24-hour system architecture challenge.",
        solution: "Built an asynchronous event-driven system leveraging RabbitMQ message queues, multi-layer Redis caching, JWT token rotation middleware, and MongoDB sharding with optimized indexing.",
        results: "Achieved average API response latency under 35ms with 99.98% uptime across continuous load tests."
    },
    5: {
        title: "Aether + Motion — Global Sportswear Launch Campaign",
        category: "Social Media Strategy & Visual Advertising",
        client: "Aether Athletics",
        role: "Creative Director & Marketing Designer",
        duration: "16 Hours (1-Day Campaign Blitz)",
        image: "assets/project_social.jpg",
        tools: ["Adobe Photoshop", "Illustrator", "Motion Graphics", "Social Grid Strategy"],
        overview: "A high-octane visual campaign across Instagram, digital billboards, and Meta Ads promoting a high-performance running apparel collection.",
        challenge: "Capturing speed, kinetic energy, and modern urban athleticism while ensuring copy readability on rapid-scroll mobile feeds on a tight 16-hour turnaround schedule.",
        solution: "Crafted high-contrast monochrome & kinetic green visuals, dynamic typographic compositions, curated carousel swipe sequences, and interactive Instagram story templates.",
        results: "Generated 2.4M impressions, a 4.6% click-through rate (CTR), and a 3.2x Return on Ad Spend (ROAS)."
    }
};

function initCaseStudyModals() {
    const modal = document.getElementById('caseStudyModal');
    const modalBody = document.getElementById('modalContent');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (!modal || !modalBody) return;

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.open-modal-btn');
        if (!btn) return;

        const projectId = btn.getAttribute('data-id');
        const data = caseStudiesData[projectId];
        if (!data) return;

        modalBody.innerHTML = `
            <div class="modal-hero-container">
                <img src="${data.image}" alt="${data.title}" class="modal-hero-img">
                <div class="modal-hero-badge">⚡ Rapid Delivery: ≤24h Execution</div>
            </div>
            <div class="modal-content-inner">
                <span class="section-tag">${data.category}</span>
                <h2 class="modal-section-title" style="font-size: 1.85rem; margin-top: 10px; line-height: 1.2;">${data.title}</h2>

                <div class="modal-meta-row">
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Client</span>
                        <span class="modal-meta-val">${data.client}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Role</span>
                        <span class="modal-meta-val">${data.role}</span>
                    </div>
                    <div class="modal-meta-item highlight-meta">
                        <span class="modal-meta-label">Timeline</span>
                        <span class="modal-meta-val" style="color: var(--accent-amber); font-weight: 700;">${data.duration}</span>
                    </div>
                </div>

                <div class="modal-tab-headers">
                    <button class="modal-tab-btn active" data-tab="overview">Overview &amp; Impact</button>
                    <button class="modal-tab-btn" data-tab="challenge">Challenge &amp; Solution</button>
                    <button class="modal-tab-btn" data-tab="tech">Tools &amp; Stack</button>
                </div>

                <div class="modal-tab-content active" id="tab-overview">
                    <h3 class="modal-section-title">Project Overview</h3>
                    <p class="modal-text">${data.overview}</p>
                    <h3 class="modal-section-title" style="margin-top: 20px;">Results &amp; Metrics</h3>
                    <p class="modal-text modal-results-box">${data.results}</p>
                </div>

                <div class="modal-tab-content" id="tab-challenge">
                    <h3 class="modal-section-title">The Challenge</h3>
                    <p class="modal-text">${data.challenge}</p>
                    <h3 class="modal-section-title" style="margin-top: 20px;">The Solution</h3>
                    <p class="modal-text">${data.solution}</p>
                </div>

                <div class="modal-tab-content" id="tab-tech">
                    <h3 class="modal-section-title">Technologies &amp; Tools Used</h3>
                    <div class="project-tech" style="margin-top: 14px; gap: 8px;">
                        ${data.tools.map(t => `<span style="padding: 8px 16px; font-size: 0.875rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; color: #fff;">${t}</span>`).join('')}
                    </div>
                </div>

                <div style="margin-top: 36px; display: flex; gap: 14px; flex-wrap: wrap;">
                    <a href="#contact" class="btn btn-primary" onclick="document.getElementById('caseStudyModal').classList.remove('active')">
                        <span>Request 24h Similar Sprint</span>
                    </a>
                    <button class="btn btn-secondary" onclick="document.getElementById('caseStudyModal').classList.remove('active')">Close Case Study</button>
                </div>
            </div>
        `;

        // Tab Switching Logic
        const tabBtns = modalBody.querySelectorAll('.modal-tab-btn');
        const tabContents = modalBody.querySelectorAll('.modal-tab-content');
        tabBtns.forEach(tb => {
            tb.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                tb.classList.add('active');
                const targetId = `tab-${tb.getAttribute('data-tab')}`;
                const targetEl = modalBody.querySelector(`#${targetId}`);
                if (targetEl) targetEl.classList.add('active');
            });
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* --- 7. Interactive 24-Hour Project Calculator Widget --- */
function initEstimatorCalculator() {
    const calcContainer = document.getElementById('estimatorCalculator');
    if (!calcContainer) return;

    const projectSelect = document.getElementById('calcProjectType');
    const urgencySelect = document.getElementById('calcUrgency');
    const outputHours = document.getElementById('calcOutputHours');
    const outputCost = document.getElementById('calcOutputCost');
    const applyBtn = document.getElementById('calcApplyBtn');

    if (!projectSelect || !urgencySelect) return;

    function calculateEstimate() {
        const type = projectSelect.value;
        const speed = urgencySelect.value;

        let baseHours = 24;
        let basePriceMin = 300;
        let basePriceMax = 600;

        if (type === 'branding') {
            baseHours = 24;
            basePriceMin = 400;
            basePriceMax = 800;
        } else if (type === 'uiux') {
            baseHours = 18;
            basePriceMin = 500;
            basePriceMax = 1100;
        } else if (type === 'nodejs') {
            baseHours = 24;
            basePriceMin = 600;
            basePriceMax = 1400;
        } else if (type === 'social') {
            baseHours = 12;
            basePriceMin = 250;
            basePriceMax = 500;
        }

        if (speed === 'hyper') {
            baseHours = Math.max(8, Math.round(baseHours * 0.6));
            basePriceMin = Math.round(basePriceMin * 1.3);
            basePriceMax = Math.round(basePriceMax * 1.3);
        } else if (speed === 'express') {
            baseHours = Math.round(baseHours * 0.8);
            basePriceMin = Math.round(basePriceMin * 1.15);
            basePriceMax = Math.round(basePriceMax * 1.15);
        }

        if (outputHours) outputHours.textContent = `≤ ${baseHours} Hours`;
        if (outputCost) outputCost.textContent = `$${basePriceMin} — $${basePriceMax}`;
    }

    projectSelect.addEventListener('change', calculateEstimate);
    urgencySelect.addEventListener('change', calculateEstimate);
    calculateEstimate();

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const messageBox = document.getElementById('userMessage');
            const serviceSelect = document.getElementById('serviceType');

            if (serviceSelect) {
                if (projectSelect.value === 'branding') serviceSelect.value = 'brand_identity';
                if (projectSelect.value === 'uiux') serviceSelect.value = 'ui_ux';
                if (projectSelect.value === 'nodejs') serviceSelect.value = 'nodejs_backend';
                if (projectSelect.value === 'social') serviceSelect.value = 'social_ads';
            }

            if (messageBox) {
                messageBox.value = `[24h Speed Quote Request]\nProject: ${projectSelect.options[projectSelect.selectedIndex].text}\nRequired Turnaround: ${outputHours.textContent}\nEstimated Range: ${outputCost.textContent}\n\nHi Saad, I need this project delivered within 1 day. Let's discuss!`;
            }

            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            showToast("Calculator selection applied to inquiry form!", "success");
        });
    }
}

/* --- 8. Interactive 3D Card Tilt Effect --- */
function init3DTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .image-glass-card, .feature-card, .service-box');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}

/* --- 9. Resume Modal & CV Generator --- */
function initResumeModal() {
    const resumeBtn = document.getElementById('downloadCvBtn');
    const resumeModal = document.getElementById('resumeModal');
    const resumeContent = document.getElementById('resumeContent');
    const resumeCloseBtn = document.getElementById('resumeCloseBtn');

    if (!resumeBtn || !resumeModal || !resumeContent) return;

    resumeBtn.addEventListener('click', () => {
        resumeContent.innerHTML = `
            <div class="resume-header-box">
                <h2 class="resume-name">M SAAD</h2>
                <div class="resume-subtitle">Graphic Designer &amp; Node.js Backend Developer (3+ Years Experience)</div>
                <p style="margin-top: 8px; font-size: 0.875rem; color: #94a3b8;">
                    Email: contact.msaad.design@gmail.com | Portfolio: ms-saad.dev | Guarantee: 24-Hour Express Sprint Options
                </p>
            </div>

            <h3 class="resume-section-heading">Professional Summary</h3>
            <p style="font-size: 0.9375rem; line-height: 1.65; color: #cbd5e1;">
                Dynamic and multidisciplinary visual designer and Node.js developer with 3+ years of experience transforming brand strategies into high-impact visual identities and robust backend software systems. Specialist in rapid 24-hour turnaround projects for high-stakes corporate launches at Nexsoll LLC and Digital Solutions.
            </p>

            <h3 class="resume-section-heading">Work Experience</h3>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; color: #ffffff; flex-wrap: wrap;">
                    <span>Senior Graphic Designer &amp; Tech Associate — Nexsoll LLC</span>
                    <span style="font-family: var(--font-mono); color: #f59e0b;">2024 — Present</span>
                </div>
                <ul style="margin-left: 20px; margin-top: 8px; font-size: 0.875rem; color: #94a3b8; line-height: 1.6;">
                    <li>Spearheaded executive visual identity systems, promotional digital banners, and investor presentation decks with guaranteed 24h turnaround timelines.</li>
                    <li>Integrated creative assets with custom Node.js and Express backend API portals for automated asset delivery.</li>
                </ul>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; color: #ffffff; flex-wrap: wrap;">
                    <span>Graphic Designer &amp; Visual Strategist — Digital Solutions</span>
                    <span style="font-family: var(--font-mono); color: #06b6d4;">2023 — 2024</span>
                </div>
                <ul style="margin-left: 20px; margin-top: 8px; font-size: 0.875rem; color: #94a3b8; line-height: 1.6;">
                    <li>Created over 80+ marketing campaign graphics, logo concepts, social media packs, and packaging layouts.</li>
                    <li>Collaborated across cross-functional marketing and engineering teams to boost campaign engagement by 40%.</li>
                </ul>
            </div>

            <h3 class="resume-section-heading">Technical &amp; Creative Proficiencies</h3>
            <p style="font-size: 0.875rem; color: #e2e8f0; line-height: 1.7;">
                <strong>Design:</strong> Adobe Photoshop, Adobe Illustrator, Figma, UI/UX Wireframing, Brand Identity Guidelines, Packaging, Social Media Ads.<br>
                <strong>Engineering:</strong> Node.js, Express.js, RESTful APIs, MongoDB, Redis, JWT Authentication, WebSockets, HTML5/CSS3, Git.
            </p>

            <div style="margin-top: 32px; display: flex; gap: 14px;">
                <button class="btn btn-primary" onclick="window.print()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    <span>Print / Save PDF</span>
                </button>
                <button class="btn btn-secondary" onclick="document.getElementById('resumeModal').classList.remove('active')">Close Resume</button>
            </div>
        `;
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeResume() {
        resumeModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (resumeCloseBtn) resumeCloseBtn.addEventListener('click', closeResume);
    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) closeResume();
    });
}

/* --- 10. Contact Form & Toast Notifications --- */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('userName').value.trim();
        const emailInput = document.getElementById('userEmail').value.trim();

        if (!nameInput || !emailInput) {
            showToast("Please complete all required fields.", "error");
            return;
        }

        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Message...</span>`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            contactForm.reset();
            showToast(`Thank you, ${nameInput}! Your inquiry has been received. Saad will respond within 2-4 hours.`, "success");
        }, 1200);
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#10b981' : '#f59e0b'}" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

/* --- 11. Counter Animation on Scroll --- */
function initCounterAnimations() {
    const statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNums.forEach((stat) => {
                    const target = parseInt(stat.getAttribute('data-count'), 10);
                    if (isNaN(target)) return;
                    let count = 0;
                    const duration = 1500;
                    const stepTime = Math.abs(Math.floor(duration / target));
                    const timer = setInterval(() => {
                        count++;
                        stat.textContent = count + '+';
                        if (count >= target) {
                            clearInterval(timer);
                        }
                    }, Math.max(stepTime, 20));
                });
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
}

/* --- 12. Dynamic Year --- */
function initYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
