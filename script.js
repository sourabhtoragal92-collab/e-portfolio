document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation Menu Toggle
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       2. Scroll Effects (Sticky Header & Active Link Highlight)
       ========================================================================== */
    const header = document.querySelector('.navbar-header');

    // Add border/background shadow to navbar when scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(9, 9, 11, 0.85)';
            header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.background = 'rgba(9, 9, 11, 0.5)';
            header.style.boxShadow = 'none';
        }
    });

    // Intersection Observer to highlight active link in navigation
    const sections = document.querySelectorAll('section');
    const navObserverOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle portion
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    /* ==========================================================================
       3. Scroll Reveal & Skills Progress Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const progressBars = document.querySelectorAll('.skill-progress-bar');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // If the revealed section is the skills section, animate progress bars
                if (entry.target.getAttribute('id') === 'skills') {
                    progressBars.forEach(bar => {
                        // The target width is stored in the style attribute inside HTML
                        const targetWidth = bar.getAttribute('style');
                        // Reset to 0 first, then apply target width for animation effect
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.setAttribute('style', targetWidth);
                        }, 100);
                    });
                }

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => revealObserver.observe(element));

    /* ==========================================================================
       4. Text Typing Carousel Effect
       ========================================================================== */
    const typingTextEl = document.getElementById('typing-text');
    const roles = [
        'aspiring Software Engineer',
        'B.Tech CSE Student @ REVA',
        'Fullstack Web Explorer',
        'creative Problem Solver'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove character
            typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // Deleting is faster
        } else {
            // Add character
            typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 100; // Normal typing speed
        }

        // State switching logic
        if (!isDeleting && charIndex === currentRole.length) {
            // Finished typing word, wait before deleting
            isDeleting = true;
            typeDelay = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            // Finished deleting, switch to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeDelay = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typeDelay);
    }

    if (typingTextEl) {
        // Start the typing effect
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       5. Interactive Particle Background Canvas
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Handle sizing
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        window.addEventListener('resize', resizeCanvas);

        // Mouse track
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Particle template
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.baseOpacity = Math.random() * 0.3 + 0.15;
                this.opacity = this.baseOpacity;
            }

            update() {
                // Move particle
                this.x += this.speedX;
                this.y += this.speedY;

                // Screen boundaries bounce
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Interactive mouse repulsion
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;

                        // Push away from mouse
                        this.x -= directionX * force * 1.5;
                        this.y -= directionY * force * 1.5;
                        this.opacity = Math.min(0.7, this.baseOpacity + force * 0.4);
                    } else {
                        if (this.opacity > this.baseOpacity) {
                            this.opacity -= 0.01;
                        }
                    }
                } else {
                    this.opacity = this.baseOpacity;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Adaptive particle quantity based on screen size
            const count = Math.floor((canvas.width * canvas.height) / 11000);
            const maxCount = Math.min(count, 120); // Cap particles for performance

            for (let i = 0; i < maxCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push(new Particle(x, y));
            }
        }

        // Draw connecting lines between close particles
        function connectParticles() {
            const maxDist = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        // Opacity depends on proximity
                        const opacity = (1 - (dist / maxDist)) * 0.12;
                        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        animateParticles();
    }

    /* ==========================================================================
       6. Contact Form Validation & Submission Handling
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard browser reload

            let isValid = true;

            // Get fields
            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');
            const messageEl = document.getElementById('message');

            // Clear prior states
            const inputs = [nameEl, emailEl, messageEl];
            inputs.forEach(input => {
                input.classList.remove('invalid');
                const errEl = document.getElementById(`${input.id}-error`);
                if (errEl) errEl.style.display = 'none';
            });

            // Name check
            if (!nameEl.value.trim()) {
                nameEl.classList.add('invalid');
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            }

            // Email check
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailEl.value.trim() || !emailPattern.test(emailEl.value)) {
                emailEl.classList.add('invalid');
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            }

            // Message check
            if (!messageEl.value.trim()) {
                messageEl.classList.add('invalid');
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                // Mock API success behavior
                console.log('Sending message:', {
                    name: nameEl.value,
                    email: emailEl.value,
                    message: messageEl.value
                });

                // Show modal overlay
                if (successModal) {
                    successModal.classList.add('show');
                }

                // Reset form fields
                contactForm.reset();
            }
        });
    }

    // Modal Close operations
    if (successModal && modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('show');
        });

        // Close by clicking overlay backdrop
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('show');
            }
        });
    }
});
