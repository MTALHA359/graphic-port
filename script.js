/* ==========================================================================
   M SAAD PORTFOLIO — INTERACTIVE ENGINE
   Graphic Designer & Node.js Developer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavbar();
    initPortfolioFilters();
    initCaseStudyModals();
    initResumeModal();
    initContactForm();
    initCounterAnimations();
    initYear();
});

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
    const interactables = document.querySelectorAll('a, button, input, select, textarea, .project-card, .filter-btn');
    interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
            cursorOutline.style.borderColor = 'rgba(245, 158, 11, 0.8)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.45)';
        });
    });
}

/* --- 2. Navbar & Mobile Menu --- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('.nav-link');

    // Sticky Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateScrollSpy();
    });

    // Mobile Toggle
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

    // Scroll Spy
    function updateScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;

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

/* --- 3. Portfolio Filters --- */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(12px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* --- 4. Case Study Modal Data & Handlers --- */
const caseStudiesData = {
    1: {
        title: "Aurelius — Luxury Executive Identity & Stationery",
        category: "Brand Identity, Typography & Print Production",
        client: "Aurelius London (UK)",
        role: "Lead Visual Designer",
        duration: "4 Weeks",
        image: "assets/project_branding.jpg",
        tools: ["Adobe Illustrator", "Photoshop", "InDesign", "Print Finishing"],
        overview: "A comprehensive brand identity overhaul for an elite boutique investment firm based in Mayfair, London. The client needed a timeless, authoritative, yet modern aesthetic that builds instant trust among high-net-worth individuals.",
        challenge: "Balancing strict classic luxury minimalism with functional corporate collateral that scales across letterheads, foil-stamped business cards, investor pitch decks, and digital touchpoints.",
        solution: "Engineered a custom bespoke geometric serif monogram, high-contrast matte black and gold foil color palette, balanced typography hierarchy, and a 42-page brand guidelines master book.",
        results: "Client closed $4.8M in preliminary funding rounds with elevated brand authority and 100% positive feedback on physical collateral quality."
    },
    2: {
        title: "Apex — Dark-Mode Financial Platform & Mobile UI",
        category: "UI/UX & Product Design",
        client: "Apex Digital Assets",
        role: "Senior UI/UX Designer & Prototyper",
        duration: "6 Weeks",
        image: "assets/project_uiux.jpg",
        tools: ["Figma", "Design Systems", "Prototyping", "User Research"],
        overview: "An institutional-grade cryptocurrency and wealth portfolio management dashboard designed to make complex market telemetry and transaction flows instantly readable in high-stress environments.",
        challenge: "Preventing cognitive visual overload while displaying live trading depth charts, multi-currency wallet balances, transaction ledgers, and real-time yield analytics.",
        solution: "Implemented an ergonomic glassmorphism dark-slate design system with vibrant cyan/emerald telemetry accents, modular dashboard cards, and a unified companion mobile application for on-the-go asset management.",
        results: "Increased user daily active retention by 34% and reduced transaction execution error rate by 28% during private beta testing."
    },
    3: {
        title: "Noir Éclat — Premium Cosmetic Serum Packaging",
        category: "Product Packaging & 3D Visualization",
        client: "Noir Éclat Paris",
        role: "Graphic & Packaging Designer",
        duration: "3 Weeks",
        image: "assets/project_packaging.jpg",
        tools: ["Adobe Illustrator", "Photoshop 3D", "Dieline Engineering", "Vector Art"],
        overview: "High-end structural packaging and label engineering for an organic anti-aging serum. The brief requested a luxurious, tactile experience suitable for boutique retail display.",
        challenge: "Creating dielines and print specifications with tight tolerances for metallic gold foil stamping on matte soft-touch dark coating without registration bleeding.",
        solution: "Designed custom art-deco inspired geometric line art, calculated exact dieline clearances for 30ml dropper bottles and rigid folding cartons, and rendered hyper-realistic 3D launch previews for pre-orders.",
        results: "Sold out first batch of 10,000 units within 72 hours of influencer launch campaign."
    },
    4: {
        title: "NexusFlow — Node.js Microservices & Live API Gateway",
        category: "Node.js Backend Engineering & Architecture",
        client: "Nexsoll LLC Enterprise Platform",
        role: "Node.js Backend Developer",
        duration: "8 Weeks",
        image: "assets/project_nodejs.jpg",
        tools: ["Node.js", "Express.js", "MongoDB", "Redis", "RabbitMQ", "JWT"],
        overview: "A distributed microservices architecture engineered to handle authentication, real-time media ingestion, product catalog indexing, and webhook event streaming for enterprise clients.",
        challenge: "Managing concurrent high-volume traffic bursts (15,000 req/sec) without API gateway latency spikes or database connection pool exhaustion.",
        solution: "Built an asynchronous event-driven system leveraging RabbitMQ message queues, multi-layer Redis caching, JWT token rotation middleware, and MongoDB sharding with optimized indexing.",
        results: "Achieved average API response latency under 35ms with 99.98% uptime across continuous load tests."
    },
    5: {
        title: "Aether + Motion — Global Sportswear Launch Campaign",
        category: "Social Media Strategy & Visual Advertising",
        client: "Aether Athletics",
        role: "Creative Director & Marketing Designer",
        duration: "3 Weeks",
        image: "assets/project_social.jpg",
        tools: ["Adobe Photoshop", "Illustrator", "Motion Graphics", "Social Grid Strategy"],
        overview: "A high-octane visual campaign across Instagram, digital billboards, and Meta Ads promoting a high-performance running apparel collection.",
        challenge: "Capturing speed, kinetic energy, and modern urban athleticism while ensuring copy readability on rapid-scroll mobile feeds.",
        solution: "Crafted high-contrast monochrome & kinetic green visuals, dynamic typographic compositions, curated carousel swipe sequences, and interactive Instagram story templates.",
        results: "Generated 2.4M impressions, a 4.6% click-through rate (CTR), and a 3.2x Return on Ad Spend (ROAS)."
    }
};

function initCaseStudyModals() {
    const modal = document.getElementById('caseStudyModal');
    const modalBody = document.getElementById('modalContent');
    const closeBtn = document.getElementById('modalCloseBtn');
    const openBtns = document.querySelectorAll('.open-modal-btn');

    if (!modal || !modalBody) return;

    openBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const projectId = e.currentTarget.getAttribute('data-id');
            const data = caseStudiesData[projectId];
            if (!data) return;

            modalBody.innerHTML = `
                <img src="${data.image}" alt="${data.title}" class="modal-hero-img">
                <div class="modal-content-inner">
                    <span class="section-tag">${data.category}</span>
                    <h2 class="modal-section-title" style="font-size: 1.75rem; margin-top: 10px;">${data.title}</h2>

                    <div class="modal-meta-row">
                        <div class="modal-meta-item">
                            <span class="modal-meta-label">Client</span>
                            <span class="modal-meta-val">${data.client}</span>
                        </div>
                        <div class="modal-meta-item">
                            <span class="modal-meta-label">Role</span>
                            <span class="modal-meta-val">${data.role}</span>
                        </div>
                        <div class="modal-meta-item">
                            <span class="modal-meta-label">Timeline</span>
                            <span class="modal-meta-val">${data.duration}</span>
                        </div>
                    </div>

                    <h3 class="modal-section-title">Project Overview</h3>
                    <p class="modal-text">${data.overview}</p>

                    <h3 class="modal-section-title">The Challenge</h3>
                    <p class="modal-text">${data.challenge}</p>

                    <h3 class="modal-section-title">The Solution & Execution</h3>
                    <p class="modal-text">${data.solution}</p>

                    <h3 class="modal-section-title">Results & Business Impact</h3>
                    <p class="modal-text" style="color: #f1f5f9; font-weight: 500;">${data.results}</p>

                    <h3 class="modal-section-title" style="margin-top: 24px;">Technologies & Tools Used</h3>
                    <div class="project-tech" style="margin-top: 10px;">
                        ${data.tools.map(t => `<span style="padding: 6px 12px; font-size: 0.8125rem;">${t}</span>`).join('')}
                    </div>

                    <div style="margin-top: 36px; display: flex; gap: 14px;">
                        <a href="#contact" class="btn btn-primary" onclick="document.getElementById('caseStudyModal').classList.remove('active')">Start Similar Project</a>
                    </div>
                </div>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
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

/* --- 5. Resume Modal & CV Generator --- */
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
                <div class="resume-subtitle">Graphic Designer & Node.js Backend Developer (3+ Years Experience)</div>
                <p style="margin-top: 8px; font-size: 0.875rem; color: #94a3b8;">
                    Email: contact.msaad.design@gmail.com | Portfolio: ms-saad.dev | Remote / Hybrid (UTC+5)
                </p>
            </div>

            <h3 class="resume-section-heading">Professional Summary</h3>
            <p style="font-size: 0.9375rem; line-height: 1.65; color: #cbd5e1;">
                Dynamic and multidisciplinary visual designer and Node.js developer with 3+ years of experience transforming brand strategies into high-impact visual identities and robust backend software systems. Experienced at Nexsoll LLC and Digital Solutions delivering client-focused design collateral, marketing campaigns, and REST API architectures.
            </p>

            <h3 class="resume-section-heading">Work Experience</h3>
            
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; color: #ffffff;">
                    <span>Senior Graphic Designer & Tech Associate — Nexsoll LLC</span>
                    <span style="font-family: monospace; color: #f59e0b;">2024 — Present</span>
                </div>
                <ul style="margin-left: 20px; margin-top: 8px; font-size: 0.875rem; color: #94a3b8; line-height: 1.6;">
                    <li>Spearheaded visual identity systems, promotional digital banners, and presentation decks for international clients.</li>
                    <li>Integrated creative assets with custom Node.js and Express backend API portals for automated asset delivery.</li>
                </ul>
            </div>

            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700; color: #ffffff;">
                    <span>Graphic Designer & Visual Strategist — Digital Solutions</span>
                    <span style="font-family: monospace; color: #06b6d4;">2023 — 2024</span>
                </div>
                <ul style="margin-left: 20px; margin-top: 8px; font-size: 0.875rem; color: #94a3b8; line-height: 1.6;">
                    <li>Created over 80+ marketing campaign graphics, logo concepts, social media packs, and packaging layouts.</li>
                    <li>Collaborated across cross-functional marketing and engineering teams to boost campaign engagement by 40%.</li>
                </ul>
            </div>

            <h3 class="resume-section-heading">Technical & Creative Proficiencies</h3>
            <p style="font-size: 0.875rem; color: #e2e8f0; line-height: 1.7;">
                <strong>Design:</strong> Adobe Photoshop, Adobe Illustrator, Figma, UI/UX Wireframing, Brand Identity Guidelines, Packaging, Social Media Ads.<br>
                <strong>Engineering:</strong> Node.js, Express.js, RESTful APIs, MongoDB, Redis, JWT Authentication, WebSockets, HTML5/CSS3, Git.
            </p>

            <div style="margin-top: 32px; display: flex; gap: 14px;">
                <button class="btn btn-primary" onclick="window.print()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
                    <span>Print / Save PDF</span>
                </button>
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

/* --- 6. Contact Form & Toast Notifications --- */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('userName').value.trim();
        const emailInput = document.getElementById('userEmail').value.trim();
        const serviceInput = document.getElementById('serviceType').value;
        const messageInput = document.getElementById('userMessage').value.trim();

        if (!nameInput || !emailInput || !messageInput) {
            showToast("Please complete all required fields.", "error");
            return;
        }

        // Simulate Submission
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending Message...</span>`;

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            contactForm.reset();
            showToast(`Thank you, ${nameInput}! Your message has been received. Saad will get back to you shortly.`, "success");
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

/* --- 7. Counter Animation on Scroll --- */
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

/* --- 8. Year Inserter --- */
function initYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
