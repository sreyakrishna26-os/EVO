/* =========================================================
   EVO PORTFOLIO — Shared script
   Dock navigation, details modal, scroll-to-top, reveal
   Each page defines window.DETAILS = { key: {...} } in its own JS.
   ========================================================= */
(function () {
  "use strict";

  var ICONS = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    about: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    skills: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    projects: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    education: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    certs: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    contact: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/>',
    up: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>'
  };

  var NAV = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About", href: "about.html" },
    { id: "skills", label: "Skills", href: "skills.html" },
    { id: "projects", label: "Projects", href: "projects.html" },
    { id: "education", label: "Education", href: "education.html" },
    { id: "certs", label: "Certifications", href: "certifications.html" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  function svg(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---- Dock ---- */
  function buildDock() {
    var holder = document.getElementById("dock");
    if (!holder) return;
    var current = document.body.getAttribute("data-page");
    holder.className = "dock";
    holder.setAttribute("aria-label", "Main navigation");
    holder.innerHTML = NAV.map(function (n) {
      return '<a href="' + n.href + '" data-label="' + n.label + '" aria-label="' + n.label + '"' +
        (n.id === current ? ' class="active" aria-current="page"' : "") + ">" + svg(n.id) + "</a>";
    }).join("");
  }

  /* ---- Modal ---- */
  var backdrop, modalBody, lastFocus;

  function buildModal() {
    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<button class="modal-close" aria-label="Close details">&times;</button>' +
      '<div id="modal-body"></div></div>';
    document.body.appendChild(backdrop);
    modalBody = backdrop.querySelector("#modal-body");

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop || e.target.classList.contains("modal-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  function openModal(key) {
    var d = (window.DETAILS || {})[key];
    if (!d) return;
    var html = '<h3 id="modal-title">' + esc(d.title) + "</h3>";
    if (d.subtitle) html += '<div class="sub">' + esc(d.subtitle) + "</div>";
    if (d.text) html += "<p>" + esc(d.text) + "</p>";
    (d.sections || []).forEach(function (s) {
      html += "<h4>" + esc(s.heading) + "</h4>";
      html += '<ul class="points">' + s.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>";
    });
    if (d.tags && d.tags.length) {
      html += "<h4>Technologies</h4><div class=\"chips\">" +
        d.tags.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>";
    }
    modalBody.innerHTML = html;
    lastFocus = document.activeElement;
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
    backdrop.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (!backdrop || !backdrop.classList.contains("open")) return;
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  function bindDetailButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-detail]");
      if (btn) openModal(btn.getAttribute("data-detail"));
    });
  }

  /* ---- Scroll to top ---- */
  function buildToTop() {
    var b = document.createElement("button");
    b.className = "to-top";
    b.setAttribute("aria-label", "Back to top");
    b.innerHTML = svg("up");
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    document.body.appendChild(b);
    window.addEventListener("scroll", function () {
      b.classList.toggle("show", window.scrollY > 300);
    }, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  function bindReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 60, 360) + "ms";
      io.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildDock();
    buildModal();
    bindDetailButtons();
    buildToTop();
    bindReveal();
  });

  window.Evo = { openModal: openModal, closeModal: closeModal, esc: esc };
})();
