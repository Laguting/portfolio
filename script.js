// Initialize Feather Icons
if (typeof feather !== 'undefined') {
    feather.replace();

    const themeIcon = document.getElementById("theme-icon");
    const themeToggleBtn = document.getElementById("theme-toggle");
    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add("dark-theme");
            if (themeIcon) {
                themeIcon.setAttribute("data-feather", "sun");
            }
        } else {
            document.body.classList.remove("dark-theme");
            if (themeIcon) {
                themeIcon.setAttribute("data-feather", "moon");
            }
        }
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // Check saved preference or default to dark
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultToDark = savedTheme ? savedTheme === "dark" : prefersDark;

    applyTheme(defaultToDark);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", function () {
            const isDark = document.body.classList.toggle("dark-theme");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            applyTheme(isDark);
        });
    }

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = mouseX + "px";
            cursorDot.style.top = mouseY + "px";
        }
    });

    // Smooth interpolation for the outline cursor
    function animateCursor() {
        const ease = 0.15;
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;

        if (cursorOutline) {
            cursorOutline.style.left = outlineX + "px";
            cursorOutline.style.top = outlineY + "px";
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor Hover Effects
    const hoverables = document.querySelectorAll(".hover-link, a, button, .interactive-card, .project-box, .gallery-card");
    hoverables.forEach(item => {
        item.addEventListener("mouseenter", () => {
            if (cursorOutline) cursorOutline.classList.add("cursor-hover");
        });
        item.addEventListener("mouseleave", () => {
            if (cursorOutline) cursorOutline.classList.remove("cursor-hover");
        });
    });

    const revealElements = document.querySelectorAll(".reveal");
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const tiltCards = document.querySelectorAll(".interactive-card, .project-box");

    tiltCards.forEach(card => {
        card.addEventListener("mousemove", handleTilt);
        card.addEventListener("mouseleave", resetTilt);
    });

    function handleTilt(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;

        // Relative coordinates inside the card
        const x = e.clientX - cardRect.left - cardWidth / 2;
        const y = e.clientY - cardRect.top - cardHeight / 2;

        // Max tilt angles (degrees)
        const maxTiltX = 8;
        const maxTiltY = 8;

        const tiltX = (y / (cardHeight / 2)) * -maxTiltX;
        const tiltY = (x / (cardWidth / 2)) * maxTiltY;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        card.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.15)`;
    }

    function resetTilt() {
        const card = this;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        card.style.boxShadow = ``;
    }

    const galleryCards = document.querySelectorAll(".gallery-card");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.querySelector(".lightbox-close");
    const lightboxPrev = document.querySelector(".lightbox-prev");
    const lightboxNext = document.querySelector(".lightbox-next");

    let currentImageIndex = 0;
    const galleryImages = [];

    // Populate gallery images database from DOM elements
    galleryCards.forEach((card, index) => {
        const img = card.querySelector("img");
        galleryImages.push({
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            category: card.querySelector(".gallery-category")?.textContent || ""
        });

        card.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentImageIndex = index;
        if (lightbox) {
            lightbox.classList.add("show");
            document.body.style.overflow = "hidden"; // Disable background scrolling
            updateLightboxImage();
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove("show");
            document.body.style.overflow = ""; // Re-enable scrolling
            if (lightboxImg) lightboxImg.classList.remove("loaded");
        }
    }

    function updateLightboxImage() {
        if (!lightboxImg || !lightboxCaption) return;

        const imgData = galleryImages[currentImageIndex];
        lightboxImg.classList.remove("loaded");

        // Set source and metadata
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.alt;

        lightboxCaption.innerHTML = `<span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; display: block; margin-bottom: 0.3rem;">${imgData.category}</span> ${imgData.alt}`;

        // Smooth transition once image loads
        lightboxImg.onload = () => {
            lightboxImg.classList.add("loaded");
        };
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    // Check if we need to show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    // Lightbox Event Listeners
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener("click", showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener("click", showPrevImage);

    // Close on clicking overlay background
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target.classList.contains("lightbox-content-wrapper")) {
                closeLightbox();
            }
        });
    }

    // Keyboard Navigation
    window.addEventListener("keydown", (e) => {
        if (!lightbox || !lightbox.classList.contains("show")) return;

        if (e.key === "Escape") {
            closeLightbox();
        } else if (e.key === "ArrowRight") {
            showNextImage();
        } else if (e.key === "ArrowLeft") {
            showPrevImage();
        }
    });
}