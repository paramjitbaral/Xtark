    // Force scroll to top on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Mobile Menu JS
    const stage = document.getElementById('stage');
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    const menuLinks = menu.querySelectorAll('a');

    function toggleMenu() {
      const isOpen = stage.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen);
      menu.setAttribute('aria-hidden', !isOpen);
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    burger.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (stage.classList.contains('is-open')) toggleMenu();
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && stage.classList.contains('is-open')) {
        toggleMenu();
      }
    });

    // --- GSAP CANVAS SCRUBBER & INFINITE ZOOM ---
    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 241;
    const currentFrame = index => (
      `assets/frames/frame_${(index + 1).toString().padStart(4, '0')}.jpg`
    );

    const images = [];
    const portal = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = render;

    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[portal.frame];
      if (img && img.complete) {
        // Fill the screen so it's not too small (cover emulation)
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);

        const drawWidth = img.width * ratio + 2; // prevents edge bleeding
        const drawHeight = img.height * ratio + 2;

        const centerShift_x = (canvas.width - drawWidth) / 2;
        const centerShift_y = (canvas.height - drawHeight) / 2;

        context.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, drawWidth, drawHeight);
      }
    }

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    });

    // Set initial scale to full screen
    gsap.set(".plate-video", { scale: 1.0 });

    // Play the image frames continuously so it's not paused
    gsap.to(portal, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
      duration: 10,
      repeat: -1
    });

    // =====================================================================
    // AUTOMATIC SCROLL-BOUND TRANSITION (SMOOTH & CONNECTED)
    // =====================================================================
    let isAnimating = false;
    let onVideoPage = false;

    const zoomTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        isAnimating = false;
        onVideoPage = true;
      },
      onReverseComplete: () => {
        isAnimating = false;
        onVideoPage = false;
        gsap.set('.plate-video', { scale: 1 });
        gsap.set('.sliding-doors', { opacity: 0 });
        gsap.set('.door-left', { x: '0%' });
        gsap.set('.door-right', { x: '0%' });
        gsap.set('.topbar, .hero, .logos', { opacity: 1 });
        document.body.classList.remove('light-theme');
      }
    });

    // 1. Smoothly scroll the window down to the video section
    zoomTimeline.to(window, {
      scrollTo: window.innerHeight,
      ease: 'power3.inOut',
      duration: 0.5
    }, 0);

    // 2. Fade out UI
    zoomTimeline.to('.topbar, .hero, .logos', {
      opacity: 0, ease: 'power1.inOut', duration: 0.2
    }, 0);

    // 3. Zoom the canvas in
    zoomTimeline.to('.plate-video', {
      scale: 30, ease: 'power3.in', duration: 0.5
    }, 0);

    // 4. Apply light theme
    zoomTimeline.call(() => { document.body.classList.add('light-theme'); }, [], 0.5);

    // 5. Slide doors open to reveal the video page
    zoomTimeline.to('.door-left', { x: '-100%', ease: 'power2.inOut', duration: 0.3 }, 0.5);
    zoomTimeline.to('.door-right', { x: '100%', ease: 'power2.inOut', duration: 0.3 }, 0.5);

    function playForward() {
      if (isAnimating || onVideoPage) return;
      isAnimating = true;
      zoomTimeline.timeScale(1).play();
    }

    function playReverse() {
      if (isAnimating || !onVideoPage) return;
      isAnimating = true;
      document.body.style.overflow = 'hidden'; // lock manual scroll

      // Instantly start scrolling back up so it feels instantly responsive!
      gsap.to(window, { scrollTo: 0, ease: 'power2.inOut', duration: 0.8 });
      document.body.classList.remove('light-theme');

      // Close doors immediately, then reverse zoom
      gsap.timeline()
        .to('.door-left', { x: '0%', ease: 'power2.inOut', duration: 0.4 }, 0)
        .to('.door-right', { x: '0%', ease: 'power2.inOut', duration: 0.4 }, 0)
        .call(() => {
          // Now just reverse the zoom (we skip reversing the window scroll since we already did it)
          gsap.to('.plate-video', { scale: 1, ease: 'power3.out', duration: 0.6 });
          gsap.to('.topbar, .hero, .logos', { opacity: 1, ease: 'power1.inOut', duration: 0.4 }, "-=0.2");

          // Reset state
          setTimeout(() => {
            isAnimating = false;
            onVideoPage = false;
            document.body.style.overflow = '';
            zoomTimeline.pause(0); // Reset the main timeline silently
          }, 600);
        });
    }

    // Intercept all wheel/scroll to control transitions
    window.addEventListener('wheel', (e) => {
      if (isAnimating) { e.preventDefault(); return; }

      if (!onVideoPage && e.deltaY > 0) {
        e.preventDefault();
        playForward();
        return;
      }

      if (onVideoPage && e.deltaY < 0) {
        // Go back only if user hasn't scrolled deeper into the video page
        if (window.scrollY <= window.innerHeight + 10) {
          e.preventDefault();
          playReverse();
          return;
        }
      }
    }, { passive: false });

    // Scroll is handled by GSAP ScrollToPlugin smoothly
    // --- SHOWREEL VIDEO POPOVER LOGIC ---
    const thumbContainer = document.getElementById('video-thumbnail-container');
    const hoverPlay = document.getElementById('video-hover-play');
    const popover = document.getElementById('video-popover');
    const popoverBackdrop = document.getElementById('video-popover-backdrop');
    const popoverContent = document.getElementById('video-popover-content');
    const closePopoverBtn = document.getElementById('close-popover');
    const popoverVideo = document.getElementById('popover-video');
    const thumbVideo = document.getElementById('thumbnail-video');
    
    // Set thumbnail video to play at 4.0x speed
    if (thumbVideo) {
      thumbVideo.playbackRate = 4.0;
    }

    // Smooth mouse follower for the Play button
    gsap.set(hoverPlay, { xPercent: -50, yPercent: -50 });
    const xSet = gsap.quickSetter(hoverPlay, "x", "px");
    const ySet = gsap.quickSetter(hoverPlay, "y", "px");

    thumbContainer.addEventListener('mousemove', (e) => {
      const rect = thumbContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(hoverPlay, { opacity: 1, duration: 0.2 });

      // Use GSAP to animate position smoothly (simulating spring)
      gsap.to(hoverPlay, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto"
      });
    });

    thumbContainer.addEventListener('mouseleave', () => {
      gsap.to(hoverPlay, { opacity: 0, duration: 0.2 });
    });

    // Popover Animations
    const openPopover = () => {
      popover.style.visibility = 'visible';
      popover.style.pointerEvents = 'auto';

      const tl = gsap.timeline();
      tl.to(popoverBackdrop, { opacity: 1, duration: 0.2 })
        .fromTo(popoverContent,
          { clipPath: "inset(43.5% 43.5% 33.5% 43.5%)", opacity: 0 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1, ease: "elastic.out(1, 0.5)" },
          "<0.1"
        );

      popoverVideo.play();
    };

    const closePopover = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          popover.style.visibility = 'hidden';
          popover.style.pointerEvents = 'none';
        }
      });

      popoverVideo.pause();

      tl.to(popoverContent, {
        clipPath: "inset(43.5% 43.5% 33.5% 43.5%)",
        opacity: 0,
        duration: 0.6,
        ease: "power3.inOut"
      })
        .to(popoverBackdrop, { opacity: 0, duration: 0.2 }, "-=0.3");
    };

    thumbContainer.addEventListener('click', openPopover);
    popoverBackdrop.addEventListener('click', closePopover);
    closePopoverBtn.addEventListener('click', closePopover);

    // --- DIRECTIONAL CURSOR LOGIC ---
    const dirCursor = document.getElementById('video-directional-cursor');
    const dirArrow = document.getElementById('vdc-arrow');
    const showreelSection = document.querySelector('.video-showreel');

    gsap.set(dirCursor, { xPercent: -50, yPercent: -50 });
    const setDirX = gsap.quickSetter(dirCursor, "x", "px");
    const setDirY = gsap.quickSetter(dirCursor, "y", "px");

    let inShowreel = false;
    let inThumbnail = false;

    showreelSection.addEventListener('mouseenter', () => { inShowreel = true; });
    showreelSection.addEventListener('mouseleave', () => {
      inShowreel = false;
      gsap.to(dirCursor, { opacity: 0, duration: 0.2 });
    });

    thumbContainer.addEventListener('mouseenter', () => {
      inThumbnail = true;
      gsap.to(dirCursor, { opacity: 0, duration: 0.2 });
    });
    thumbContainer.addEventListener('mouseleave', () => {
      inThumbnail = false;
    });

    window.addEventListener('mousemove', (e) => {
      // Only show if inside showreel, outside thumbnail, and popover is closed
      if (inShowreel && !inThumbnail && popover.style.pointerEvents !== 'auto') {
        gsap.to(dirCursor, { opacity: 1, duration: 0.2 });
        setDirX(e.clientX);
        setDirY(e.clientY);

        // Calculate angle from mouse to thumbnail center
        const rect = thumbContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
        angle = angle * (180 / Math.PI); // Convert rad to deg

        dirArrow.style.transform = `rotate(${angle}deg)`;
      } else {
        gsap.to(dirCursor, { opacity: 0, duration: 0.2 });
      }
    });

    // =====================================================================
    // ADVANCED SCROLL ANIMATIONS (NEW SECTIONS)
    // =====================================================================
    
    // 1. Services Stacking Reveal
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 100 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // 2. Portfolio Horizontal Scroll
    const portfolioWrapper = document.querySelector('.portfolio-horizontal-wrapper');
    const portfolioContainer = document.querySelector('.portfolio-container');

    if (portfolioWrapper && portfolioContainer) {
      gsap.to(portfolioContainer, {
        x: () => -(portfolioContainer.scrollWidth - window.innerWidth + window.innerWidth * 0.12),
        ease: "none",
        scrollTrigger: {
          trigger: portfolioWrapper,
          pin: true,
          scrub: 1,
          start: "center center",
          end: () => "+=" + (portfolioContainer.scrollWidth),
          invalidateOnRefresh: true
        }
      });
    }

    // 3. Testimonials Marquee
    const marquee = document.querySelector('.marquee');
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    // 4. Parallax Footer Reveal
    // The CSS already handles the visual parallax (fixed at bottom, behind main).
    // Let's add a subtle scale up effect as it reveals.
    gsap.fromTo('.footer-content', 
      { scale: 0.9, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        ease: "none",
        scrollTrigger: {
          trigger: "#main-content",
          start: "bottom 95%",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // 5. Bento Box Reveal
    gsap.utils.toArray('.bento-item').forEach((item, i) => {
      gsap.to(item, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      });
    });

    // 6. Media Strip Infinite & Skew
    const mediaStrip = document.querySelector('.media-strip');
    if (mediaStrip) {
      gsap.to(mediaStrip, {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });
    }

    // 7. News Hover Image Tracking
    const newsItems = document.querySelectorAll('.news-item');
    const hoverImage = document.querySelector('.news-hover-image');
    
    if (hoverImage) {
      const setHoverX = gsap.quickSetter(hoverImage, "x", "px");
      const setHoverY = gsap.quickSetter(hoverImage, "y", "px");

      window.addEventListener('mousemove', (e) => {
        setHoverX(e.clientX);
        setHoverY(e.clientY);
      });

      newsItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          const imgSrc = item.getAttribute('data-image');
          hoverImage.style.backgroundImage = `url(${imgSrc})`;
          hoverImage.classList.add('active');
        });
        item.addEventListener('mouseleave', () => {
          hoverImage.classList.remove('active');
        });
      });
    }

    // 8. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          gsap.to(otherItem.querySelector('.faq-answer'), { height: 0, opacity: 0, duration: 0.4, ease: "power2.out" });
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          gsap.set(answer, { height: "auto" });
          const fullHeight = answer.offsetHeight;
          gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: fullHeight, opacity: 1, duration: 0.4, ease: "power2.out" });
        }
      });
    });


