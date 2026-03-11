/**
 * IMPERIUM — Creative Interactions
 * Custom cursor, parallax, animations, and transitions
 */

// ==============================================
// CUSTOM CURSOR
// ==============================================



class StatCounter {
    constructor() {
        this.stats = document.querySelectorAll('.stat-v2[data-count]');
        if (!this.stats.length) return;
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    this.animateCount(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.stats.forEach(stat => {
            observer.observe(stat);
            // Fallback: trigger animation after 1s if not triggered
            setTimeout(() => {
                if (!stat.classList.contains('counted')) {
                    stat.classList.add('counted');
                    this.animateCount(stat);
                }
            }, 1000);
        });
    }

    animateCount(stat) {
        const target = parseInt(stat.dataset.count);
        const numberEl = stat.querySelector('.stat-v2-number');
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            numberEl.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                numberEl.textContent = target;
            }
        };

        requestAnimationFrame(animate);
    }
}

// ==============================================
// PAGE TRANSITION — Enhanced Multi-Panel Curtain
// ==============================================

class PageTransition {
    constructor() {

        this.curtain = this.createCurtain();
        this.isAnimating = false;
        this.init();
    }


    createCurtain() {
        let curtain = document.querySelector('.page-transition-curtain');
        if (!curtain) {
            curtain = document.createElement('div');
            curtain.className = 'page-transition-curtain';

            // Create 3 panels
            for (let i = 1; i <= 3; i++) {
                const panel = document.createElement('div');
                panel.className = `curtain-panel curtain-panel-${i}`;
                curtain.appendChild(panel);
            }

            // Create label
            const label = document.createElement('div');
            label.className = 'curtain-label';
            label.textContent = 'EL ZINY';
            curtain.appendChild(label);

            document.body.appendChild(curtain);

            // Trigger exit animation on page load
            requestAnimationFrame(() => {
                curtain.classList.add('exit');
            });
        }
        return curtain;
    }

    init() {
        // Intercept links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const rawHref = link.getAttribute('href');
            if (!rawHref ||
                link.target === '_blank' ||
                link.hasAttribute('download') ||
                rawHref.startsWith('#') ||
                rawHref.startsWith('mailto:') ||
                rawHref.startsWith('tel:') ||
                rawHref.startsWith('javascript:')) {
                return;
            }

            // Resolve the href relative to the current page, preserving .html extension
            const href = new URL(rawHref, window.location.href).href;

            if (new URL(href).hostname !== window.location.hostname) return;

            e.preventDefault();

            if (this.isAnimating) return;
            this.navigate(href);
        });

        // Handle Back/Forward Cache
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                this.curtain.classList.remove('active');
                this.curtain.classList.add('exit');
            }
        });
    }

    navigate(href) {
        this.isAnimating = true;

        // Reset curtain
        this.curtain.classList.remove('exit');
        this.curtain.classList.remove('active');

        // Force reflow
        this.curtain.offsetHeight;

        // Trigger cover animation
        requestAnimationFrame(() => {
            this.curtain.classList.add('active');
        });

        // Navigate after animation (accounting for stagger)
        setTimeout(() => {
            window.location.href = href;
        }, 1100);
    }
}
window.PageTransition = PageTransition;


// ==============================================
// CUSTOM CURSOR
// ==============================================

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorTrail = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.trailX = 0;
        this.trailY = 0;
        this.init();
    }

    init() {
        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';

        this.cursorTrail = document.createElement('div');
        this.cursorTrail.className = 'custom-cursor-trail';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorTrail);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Hover states for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-item, input');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorTrail.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorTrail.classList.remove('cursor-hover');
            });
        });

        // Hide on mouse leave
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorTrail.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorTrail.style.opacity = '1';
        });

        this.animate();
    }

    animate() {
        // Smooth follow for cursor
        this.cursorX += (this.mouseX - this.cursorX) * 0.2;
        this.cursorY += (this.mouseY - this.cursorY) * 0.2;

        // Even smoother for trail
        this.trailX += (this.mouseX - this.trailX) * 0.08;
        this.trailY += (this.mouseY - this.trailY) * 0.08;

        this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;
        this.cursorTrail.style.transform = `translate(${this.trailX}px, ${this.trailY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// ==============================================
// HERO PARALLAX
// ==============================================

class HeroParallax {
    constructor() {
        this.hero = document.querySelector('.hero-background img');
        if (!this.hero) return;

        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        this.animate();
    }

    animate() {
        this.currentX += (this.mouseX - this.currentX) * 0.05;
        this.currentY += (this.mouseY - this.currentY) * 0.05;

        const moveX = this.currentX * 15;
        const moveY = this.currentY * 10;

        this.hero.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;

        requestAnimationFrame(() => this.animate());
    }
}

// ==============================================
// LETTER-BY-LETTER LOGO REVEAL
// ==============================================

class LogoReveal {
    constructor() {
        this.logo = document.querySelector('.brand-name');
        if (!this.logo) return;

        this.init();
    }

    init() {
        const text = this.logo.textContent;
        this.logo.textContent = '';
        this.logo.style.opacity = '1';

        // Create span for each letter
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'logo-letter';
            span.textContent = char;
            span.style.animationDelay = `${0.8 + i * 0.08}s`;
            this.logo.appendChild(span);
        });
    }
}

// ==============================================
// FLOATING GEOMETRIC ELEMENTS
// ==============================================

class FloatingElements {
    constructor() {
        this.container = document.querySelector('.hero');
        if (!this.container) return;

        this.init();
    }

    init() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';

        // Create geometric shapes
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                left: ${10 + Math.random() * 80}%;
                top: ${10 + Math.random() * 80}%;
                animation-delay: ${Math.random() * 5}s;
                animation-duration: ${15 + Math.random() * 10}s;
            `;
            floatingContainer.appendChild(shape);
        }

        this.container.appendChild(floatingContainer);
    }
}

// ==============================================
// STAGGERED LIST ANIMATIONS
// ==============================================

class StaggeredAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Project list items
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach((item, i) => {
            item.style.animationDelay = `${0.1 + i * 0.05}s`;
            item.classList.add('animate-in');
        });

        // Contact elements
        const contactLines = document.querySelectorAll('.contact-headline .line');
        contactLines.forEach((line, i) => {
            line.style.animationDelay = `${0.3 + i * 0.15}s`;
            line.classList.add('animate-slide-up');
        });

        const contactGroups = document.querySelectorAll('.contact-group, .office');
        contactGroups.forEach((group, i) => {
            group.style.animationDelay = `${0.8 + i * 0.1}s`;
            group.classList.add('animate-fade-in');
        });
    }
}

// ==============================================
// PROJECT SEARCH
// ==============================================

class ProjectSearch {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.projectItems = document.querySelectorAll('.project-item');

        if (!this.searchInput || !this.projectItems.length) return;

        this.init();
    }

    init() {
        // Real-time search on input
        this.searchInput.addEventListener('input', (e) => {
            this.filterProjects(e.target.value);
        });

        // Clear search on Escape
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchInput.value = '';
                this.filterProjects('');
                this.searchInput.blur();
            }
        });
    }

    filterProjects(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;
        let firstVisible = null;

        this.projectItems.forEach(item => {
            const name = item.querySelector('.project-name')?.textContent.toLowerCase() || '';
            const location = item.querySelector('.project-location')?.textContent.toLowerCase() || '';

            const matches = name.includes(searchTerm) || location.includes(searchTerm);

            if (matches) {
                item.style.display = '';
                item.style.opacity = '';
                item.classList.remove('search-hidden');
                visibleCount++;
                if (!firstVisible) firstVisible = item;
            } else {
                item.style.display = 'none';
                item.classList.add('search-hidden');
            }
        });

        // If no active project is visible, select the first visible one
        const activeItem = document.querySelector('.project-item.active');
        if (activeItem && activeItem.classList.contains('search-hidden') && firstVisible) {
            firstVisible.click();
        }

        // Add "no results" feedback if needed
        this.updateNoResults(visibleCount === 0 && searchTerm.length > 0);
    }

    updateNoResults(show) {
        let noResults = document.querySelector('.no-results');

        if (show) {
            if (!noResults) {
                noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'No vehicles found';
                const projectList = document.querySelector('.project-list');
                if (projectList) {
                    projectList.appendChild(noResults);
                }
            }
            noResults.style.display = 'block';
        } else if (noResults) {
            noResults.style.display = 'none';
        }
    }
}

// ==============================================
// ARCHIVE IMAGE TRANSITIONS
// ==============================================

class ArchiveTransitions {
    constructor() {
        this.projectItems = document.querySelectorAll('.project-item');
        this.viewImage = document.querySelector('.view-image img');
        this.viewTitle = document.querySelector('.view-title');
        this.viewMeta = document.querySelector('.view-meta');
        this.viewStatement = document.querySelector('.view-statement');

        if (!this.projectItems.length || !this.viewImage) return;

        this.projectData = {
            'lambo-huracan': {
                image: 'assets/images/huracan_spyder_rear.jpg',
                title: 'Lamborghini Huracán EVO Spyder',
                meta: 'V10 · 640 HP · Spyder · 2024',
                statement: 'The open-air evolution of Lamborghini\'s iconic V10 — 640 naturally aspirated horsepower, pearl white exterior, and a stunning blue Alcantara interior. 0–60 in 3.1 seconds of pure, roofless Italian fury.',
                link: 'project-desert-horizon.html'
            },
            'ferrari-812-gts': {
                image: 'assets/images/ferrari_812_gts_front.jpg',
                title: 'Ferrari 812 GTS',
                meta: 'V12 · 789 HP · Spider · 2020–Present',
                statement: 'Ferrari\'s most powerful open-top grand tourer — a naturally aspirated 6.5L V12 producing 789 HP at 8,500 rpm, wrapped in a bespoke Nero Daytona body with bespoke teal interior. 0–60 in 3.0 seconds. 211 mph flat out.',
                link: 'project-ferrari-812-gts.html'
            },
            'mercedes-g63': {
                image: 'assets/images/g63_side_showroom.jpg',
                title: 'Mercedes-AMG G63',
                meta: 'V8 Biturbo · 577 HP · SUV · 2024',
                statement: 'The legend, reimagined. A hand-built 4.0L V8 biturbo producing 577 HP wrapped in obsidian black — with a bespoke cognac and black quilted leather interior. 0–60 in 4.5 seconds. Pure AMG brutality dressed in luxury.',
                link: 'project-mercedes-g63.html'
            },
            'ferrari-purosangue': {
                image: 'assets/images/purosangue_side_showroom.jpg',
                title: 'Ferrari Purosangue',
                meta: 'V12 · 725 HP · SUV · 2024',
                statement: 'Ferrari\'s first-ever SUV — a naturally aspirated 6.5L V12 screaming to 8,250 rpm, producing 725 HP. Rosso Ferrari exterior, full carbon interior with red stitching. 0–60 in 3.3 seconds. Pure thoroughbred in four-door form.',
                link: 'project-ferrari-purosangue.html'
            },
            'mclaren-artura': {
                image: 'assets/images/mclaren_artura.jpg',
                title: 'McLaren Artura',
                meta: 'V6 Twin-Turbo Hybrid · 671 HP · Coupe · 2024',
                statement: 'The full force of McLaren. A High-Performance Hybrid powertrain bringing electrified intensity to a lightweight supercar. 0–60 mph in 3.0 seconds, wrapped in a striking blue exterior.',
                link: 'project-mclaren-artura.html'
            },
            'rr-cullinan': {
                image: 'assets/images/cullinan_exterior.png',
                title: 'Rolls-Royce Cullinan Black Badge',
                meta: 'V12 · 600 HP · SUV · 2024',
                statement: 'The Black Badge is Rolls-Royce at its most uncompromising. Obsidian black exterior, twin-turbo V12 producing 600 HP, and a full crimson leather interior that redefines what luxury means.',
                link: 'project-rr-cullinan.html'
            },
            'placeholder-3': {
                image: 'assets/images/car_rolls_royce.png',
                title: 'Placeholder Car 3',
                meta: 'TBD · TBD · TBD · TBD',
                statement: 'Details coming soon...',
                link: '#'
            },
            'placeholder-4': {
                image: 'assets/images/car_rolls_royce.png',
                title: 'Placeholder Car 4',
                meta: 'TBD · TBD · TBD · TBD',
                statement: 'Details coming soon...',
                link: '#'
            },
            'placeholder-5': {
                image: 'assets/images/car_rolls_royce.png',
                title: 'Placeholder Car 5',
                meta: 'TBD · TBD · TBD · TBD',
                statement: 'Details coming soon...',
                link: '#'
            },
            'placeholder-6': {
                image: 'assets/images/car_rolls_royce.png',
                title: 'Placeholder Car 6',
                meta: 'TBD · TBD · TBD · TBD',
                statement: 'Details coming soon...',
                link: '#'
            }
        };

        this.init();
    }

    init() {
        this.projectItems.forEach(item => {
            item.addEventListener('click', () => this.switchProject(item));
        });
    }

    switchProject(item) {
        // Update active state
        this.projectItems.forEach(p => p.classList.remove('active'));
        item.classList.add('active');

        const projectId = item.dataset.project;
        const data = this.projectData[projectId];
        if (!data) return;

        // Add transition class
        const viewImage = document.querySelector('.view-image');
        const viewCaption = document.querySelector('.view-caption');

        viewImage.classList.add('transitioning');
        viewCaption.classList.add('transitioning');

        setTimeout(() => {
            this.viewImage.src = data.image;
            this.viewTitle.textContent = data.title;
            this.viewMeta.textContent = data.meta;
            this.viewStatement.textContent = data.statement;

            const viewLink = document.querySelector('#view-project-link');
            if (viewLink && data.link) {
                viewLink.href = data.link;
            }

            setTimeout(() => {
                viewImage.classList.remove('transitioning');
                viewCaption.classList.remove('transitioning');
            }, 50);
        }, 300);
    }
}

// ==============================================
// MAGNETIC HOVER EFFECT
// ==============================================

class MagneticHover {
    constructor() {
        this.elements = document.querySelectorAll('.global-nav a');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ==============================================
// FILM GRAIN OVERLAY
// ==============================================

class FilmGrain {
    constructor() {
        this.init();
    }

    init() {
        const grain = document.createElement('div');
        grain.className = 'film-grain';
        document.body.appendChild(grain);
    }
}

// ==============================================
// MOUSE GLOW EFFECT (About Page)
// ==============================================

class MouseGlow {
    constructor() {
        this.glow = document.querySelector('.mouse-glow');
        if (!this.glow) return;
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            const root = document.querySelector('.about-root');
            if (!root) return;
            const rect = root.getBoundingClientRect();
            root.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            root.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }, { passive: true });
    }
}

// ==============================================
// SCROLL MANAGER (Smooth Scroll & Parallax)
// ==============================================

class ScrollManager {
    constructor() {
        this.html = document.documentElement;
        this.body = document.body;
        this.scroller = {
            target: 0,
            current: 0,
            ease: 0.08
        };

        this.parallaxElements = document.querySelectorAll('[data-speed]');
        this.rafId = null;

        // Only enable custom smooth scroll on desktop if requested, 
        // effectively we are just using this for parallax updates for now
        // to keep it native-feeling but enhanced.

        this.init();
    }

    init() {
        this.animate();
    }

    animate() {
        this.scroller.target = window.scrollY;

        // Linear interpolation for smooth feeling values
        this.scroller.current = this.lerp(this.scroller.current, this.scroller.target, this.scroller.ease);

        // Update parallax elements
        this.parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 0;
            const yPos = -(this.scroller.current * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}

// ==============================================
// TEXT & ELEMENT REVEAL
// ==============================================

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text');
        this.options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-inview');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, this.options);

        this.elements.forEach(el => observer.observe(el));
    }
}


// ==============================================
// MOBILE HAMBURGER NAVIGATION
// ==============================================

class MobileNav {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // ── Build the full-screen overlay ──────────────────────────────
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <nav>
                <ul>
                    <li><a href="index.html" ${currentPage === 'index.html' || currentPage === '' ? 'class="active"' : ''}>Home</a></li>
                    <li><a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}>About</a></li>
                    <li><a href="archive.html" ${currentPage === 'archive.html' ? 'class="active"' : ''}>Showroom</a></li>
                    <li><a href="configurator.html" ${currentPage === 'configurator.html' ? 'class="active"' : ''}>Configure</a></li>
                    <li><a href="contact.html" ${currentPage === 'contact.html' ? 'class="active"' : ''}>Contact</a></li>
                </ul>
            </nav>
            <span class="mobile-nav-footer">Exotic Automobiles</span>
        `;

        // ── Build the hamburger button ──────────────────────────────────
        const btn = document.createElement('button');
        btn.className = 'hamburger-btn';
        btn.setAttribute('aria-label', 'Toggle navigation menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';

        // ── Build the top bar (always visible on mobile) ───────────────
        const topBar = document.createElement('div');
        topBar.className = 'mobile-top-bar';
        topBar.innerHTML = `<a href="index.html" class="mobile-logo">EL ZINY</a>`;
        topBar.appendChild(btn);

        // Inject into DOM
        document.body.appendChild(overlay);
        document.body.appendChild(topBar);

        this.btn = btn;
        this.overlay = overlay;

        // Toggle on hamburger click
        btn.addEventListener('click', () => this.toggle());

        // Close when any overlay link is clicked
        overlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.btn.classList.add('is-open');
        this.btn.setAttribute('aria-expanded', 'true');
        this.overlay.classList.add('is-open');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.btn.classList.remove('is-open');
        this.btn.setAttribute('aria-expanded', 'false');
        this.overlay.classList.remove('is-open');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// ==============================================
// INITIALIZE ALL
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize cursor on non-touch devices
    if (!('ontouchstart' in window)) {
        new CustomCursor();
    }

    new HeroParallax();
    new LogoReveal();
    new FloatingElements();
    new StaggeredAnimations();
    new ProjectSearch();
    new ArchiveTransitions();
    new MagneticHover();

    // Mobile navigation (hamburger)
    new MobileNav();

    // New Creative Enrichments
    try { new StatCounter(); } catch (e) { console.error('StatCounter failed:', e); }
    try { new ScrollManager(); } catch (e) { console.error('ScrollManager failed:', e); }
    try { new ScrollReveal(); } catch (e) { console.error('ScrollReveal failed:', e); }
    try { new MouseGlow(); } catch (e) { console.error('MouseGlow failed:', e); }
    try { new PageTransition(); } catch (e) { console.error('PageTransition failed:', e); }
});

// ==============================================
// END OF SCRIPTS
// ==============================================
