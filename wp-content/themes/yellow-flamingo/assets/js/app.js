document.addEventListener("DOMContentLoaded", () => {
  const caseStudy = document.querySelector("[data-case-study]");

  if (caseStudy) {
    const tracks = [...caseStudy.querySelectorAll("[data-case-study-track]")];
    const previous = caseStudy.querySelector("[data-case-study-previous]");
    const next = caseStudy.querySelector("[data-case-study-next]");
    const slugs = [...(tracks[0]?.querySelectorAll("[data-case-study-slide]") ?? [])].map(
      (slide) => slide.dataset.caseStudySlug
    );
    const slideCount = slugs.length;

    const TRACK_TRANSITION = "transform 300ms ease-out";
    let index = 0;

    const render = () => {
      tracks.forEach((track) => {
        track.style.transition = TRACK_TRANSITION;
        track.style.transform = `translateX(-${index * 100}%)`;
      });
    };

    const goToSlug = (slug, scroll = true) => {
      const targetIndex = slugs.indexOf(slug);
      if (targetIndex === -1) return;
      index = targetIndex;
      render();
      if (scroll) caseStudy.scrollIntoView({ behavior: "smooth" });
    };

    previous?.addEventListener("click", () => {
      index = (index - 1 + slideCount) % slideCount;
      render();
    });

    next?.addEventListener("click", () => {
      index = (index + 1) % slideCount;
      render();
    });

    const initialSlug = window.location.hash.slice(1);
    if (initialSlug) goToSlug(initialSlug, false);

    window.addEventListener("hashchange", () => {
      goToSlug(window.location.hash.slice(1));
    });
  }

  const gallery = document.querySelector("[data-gallery]");

  if (gallery) {
    const slides = [...gallery.querySelectorAll("[data-gallery-slide]")];
    const caption = gallery.querySelector("[data-gallery-caption]");
    const previous = gallery.querySelector("[data-gallery-previous]");
    const next = gallery.querySelector("[data-gallery-next]");

    const SLIDE_TRANSITION = "transform 300ms ease-out";
    let currentSlide = 0;

    const render = (skipTransition = false) => {
      slides.forEach((slide, index) => {
        slide.style.transition = skipTransition ? "none" : SLIDE_TRANSITION;
        slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
      });
      const slide = slides[currentSlide];
      caption.textContent = slide.dataset.caption || "";
      if (slide.dataset.captionUrl) {
        caption.href = slide.dataset.captionUrl;
        caption.target = "_blank";
        caption.rel = "noopener noreferrer";
      } else {
        caption.removeAttribute("href");
        caption.removeAttribute("target");
        caption.removeAttribute("rel");
      }
      if (previous) previous.disabled = currentSlide === 0;
      if (next) next.disabled = currentSlide === slides.length - 1;

      if (skipTransition) {
        // Flush the "no transition" transform before re-enabling transitions.
        void gallery.offsetHeight;
        slides.forEach((slide) => {
          slide.style.transition = SLIDE_TRANSITION;
        });
      }
    };

    const goToSlide = (slideIndex) => {
      if (slideIndex < 0 || slideIndex >= slides.length) return;
      currentSlide = slideIndex;
      render();
    };

    render(true);
    previous?.addEventListener("click", () => goToSlide(currentSlide - 1));
    next?.addEventListener("click", () => goToSlide(currentSlide + 1));
  }

  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const triggers = [...tabs.querySelectorAll("[data-tabs-trigger]")];
    const mobilePanels = [...tabs.querySelectorAll("[data-tabs-panel-mobile]")];
    const panels = [...tabs.parentElement.querySelectorAll("[data-tabs-panel]")];

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => {
        triggers.forEach((otherTrigger, otherIndex) => {
          const isActive = otherIndex === index;
          otherTrigger.setAttribute("aria-expanded", String(isActive));
          otherTrigger.classList.toggle("bg-primary", isActive);
          otherTrigger.classList.toggle("border", !isActive);
          otherTrigger.classList.toggle("border-charcoal/30", !isActive);
          otherTrigger.classList.toggle("bg-snow", !isActive);
        });

        panels.forEach((panel, panelIndex) => {
          panel.classList.toggle("hidden", panelIndex !== index);
        });

        mobilePanels.forEach((panel, panelIndex) => {
          panel.classList.toggle("hidden", panelIndex !== index);
        });
      });
    });
  });

  const accordionItems = document.querySelectorAll("[data-accordion-item]");

  accordionItems.forEach((item) => {
    const trigger = item.querySelector("[data-accordion-trigger]");
    const panel = item.querySelector("[data-accordion-panel]");
    const iconOpen = item.querySelector("[data-accordion-icon-open]");
    const iconClosed = item.querySelector("[data-accordion-icon-closed]");

    trigger?.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", String(!isOpen));
      trigger.classList.toggle("bg-primary", !isOpen);
      panel.style.gridTemplateRows = isOpen ? "0fr" : "1fr";

      iconOpen?.classList.toggle("hidden", isOpen);
      iconOpen?.classList.toggle("flex", !isOpen);
      iconClosed?.classList.toggle("hidden", !isOpen);
      iconClosed?.classList.toggle("flex", isOpen);
    });
  });

  const caseStudies = document.querySelector("[data-case-studies]");

  if (caseStudies) {
    const track = caseStudies.querySelector("[data-case-studies-track]");
    const cards = [...track.querySelectorAll("[data-case-studies-card]")];
    const previous = document.querySelector("[data-case-studies-previous]");
    const next = document.querySelector("[data-case-studies-next]");

    const TRACK_TRANSITION = "transform 300ms ease-out";
    let index = 0;

    const cardsPerView = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };

    const maxIndex = () => Math.max(cards.length - cardsPerView(), 0);

    const render = (skipTransition = false) => {
      index = Math.min(index, maxIndex());
      const card = cards[0];
      if (!card) return;
      track.style.transition = skipTransition ? "none" : TRACK_TRANSITION;
      const gap = parseFloat(getComputedStyle(track).columnGap || "0");
      const offset = index * (card.getBoundingClientRect().width + gap);
      track.style.transform = `translateX(-${offset}px)`;
      if (previous) previous.disabled = index === 0;
      if (next) next.disabled = index >= maxIndex();

      if (skipTransition) {
        // Flush the "no transition" transform before re-enabling transitions.
        void track.offsetHeight;
        track.style.transition = TRACK_TRANSITION;
      }
    };

    previous?.addEventListener("click", () => {
      index = Math.max(index - 1, 0);
      render();
    });

    next?.addEventListener("click", () => {
      index = Math.min(index + 1, maxIndex());
      render();
    });

    window.addEventListener("resize", () => render(true));
    render(true);
    render();
  }

  const menu = document.getElementById("primary-menu");
  const toggle = document.getElementById("menu-toggle");

  if (!menu || !toggle) return;

  const closeButtons = menu.querySelectorAll("[data-menu-close]");
  const firstLink = menu.querySelector("nav a");

  let isOpen = false;

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    menu.classList.remove("pointer-events-none", "opacity-0");
    menu.removeAttribute("inert");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");
    firstLink?.focus();
  };

  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;
    menu.classList.add("pointer-events-none", "opacity-0");
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
    toggle.focus();
  };

  toggle.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
