/* ==========================================================================
   FOTO Studio — site behaviour
   1 Language switch   5 Scroll reveals & count-up
   2 Navigation        6 Showreel timecode
   3 Mobile menu       7 Media slots (images / video)
   4 Active section    8 Inquiry form      9 Misc
   ========================================================================== */
(function () {
  "use strict";

  var d = document, root = d.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  /* 1 · LANGUAGE SWITCH ---------------------------------------------------- */
  var META = {
    en: {
      title: "FOTO Studio — Creative Production Studio in Vientiane, Laos",
      desc: "FOTO Studio is a multidisciplinary creative studio in Vientiane, Laos — video and media production, photography, advertising, graphic design, digital content and AI-powered creative services."
    },
    lo: {
      title: "FOTO Studio — ສະຕູດິໂອຜະລິດງານສ້າງສັນ · ນະຄອນຫຼວງວຽງຈັນ",
      desc: "FOTO Studio ແມ່ນສະຕູດິໂອສ້າງສັນຄົບວົງຈອນ ໃນນະຄອນຫຼວງວຽງຈັນ — ຜະລິດວິດີໂອ ແລະ ສື່, ຖ່າຍຮູບ, ສື່ໂຄສະນາ, ອອກແບບກາຟິກ, ຄອນເທັນດິຈິຕອນ ແລະ ງານສ້າງສັນດ້ວຍ AI."
    }
  };
  var langBtns = $$(".lang button");
  var metaDesc = $('meta[name="description"]');

  function setLang(l, persist) {
    if (l !== "lo") l = "en";
    root.setAttribute("lang", l);
    langBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === l ? "true" : "false");
    });
    $$("[data-ph-" + l + "]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-ph-" + l));
    });
    $$("option[data-" + l + "]").forEach(function (o) {
      o.textContent = o.getAttribute("data-" + l);
    });
    d.title = META[l].title;
    if (metaDesc) metaDesc.setAttribute("content", META[l].desc);
    if (persist) { try { localStorage.setItem("foto-lang", l); } catch (e) {} }
  }
  langBtns.forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
  });
  (function initLang() {
    var q = /[?&]lang=(en|lo)\b/.exec(location.search);
    var saved = null;
    try { saved = localStorage.getItem("foto-lang"); } catch (e) {}
    var l = q ? q[1] : saved;
    if (l === "lo") setLang("lo", false);
  })();

  /* 2 · NAVIGATION --------------------------------------------------------- */
  var nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 3 · MOBILE MENU -------------------------------------------------------- */
  var burger = $(".burger"), menu = $("#mmenu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    d.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  d.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 980 && menu.classList.contains("open")) setMenu(false);
  });

  /* 4 · ACTIVE SECTION IN NAV --------------------------------------------- */
  var navLinks = $$(".nav-links a");
  if (hasIO && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var link = byId[en.target.id];
        if (!link) return;
        if (en.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) { var s = d.getElementById(id); if (s) spy.observe(s); });
  }

  /* 5 · SCROLL REVEALS & COUNT-UP ----------------------------------------- */
  var reveals = $$(".reveal");
  if (reduced || !hasIO) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var counters = $$("[data-count]");
  if (!reduced && hasIO && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target, target = parseInt(el.getAttribute("data-count"), 10), t0 = null;
        (function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1200, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* 6 · SHOWREEL TIMECODE (25 fps) ---------------------------------------- */
  var tc = $("[data-timecode]");
  if (tc && !reduced) {
    var start = performance.now(), last = -1;
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    (function tick(now) {
      var f = Math.floor((now - start) / 40);           // 40 ms per frame = 25 fps
      if (f !== last) {
        last = f;
        var fr = f % 25, s = Math.floor(f / 25), m = Math.floor(s / 60), h = Math.floor(m / 60);
        tc.textContent = pad(h) + ":" + pad(m % 60) + ":" + pad(s % 60) + ":" + pad(fr);
      }
      requestAnimationFrame(tick);
    })(start);
  }

  /* 7 · MEDIA SLOTS -------------------------------------------------------
     <img>/<video class="media-slot"> sit on top of the branded placeholder.
     If the file exists it is shown; if not, the element is removed quietly. */
  function mediaOk(el) { var f = el.closest(".frame"); if (f) f.classList.add("has-media"); }
  function mediaFail(el) { if (el.parentNode) el.parentNode.removeChild(el); }

  $$("img.media-slot").forEach(function (img) {
    if (img.complete) { img.naturalWidth > 0 ? mediaOk(img) : mediaFail(img); return; }
    img.addEventListener("load", function () { mediaOk(img); });
    img.addEventListener("error", function () { mediaFail(img); });
  });
  $$("video.media-slot").forEach(function (v) {
    var sources = $$("source", v);
    var fail = function () { mediaFail(v); };
    if (sources.length) sources[sources.length - 1].addEventListener("error", fail);
    v.addEventListener("error", fail);
    v.addEventListener("loadeddata", function () { mediaOk(v); });
    if (v.readyState >= 2) mediaOk(v);
    if (v.networkState === 3) fail();                   // NETWORK_NO_SOURCE
    if (reduced) { v.removeAttribute("autoplay"); try { v.pause(); } catch (e) {} }
  });

  /* 8 · INQUIRY FORM ------------------------------------------------------ */
  var form = $("#inquiry");
  if (form) {
    var select = $("#f-service", form);

    // Service cards pre-select the matching option
    $$("[data-service]").forEach(function (a) {
      a.addEventListener("click", function () {
        if (select) select.value = a.getAttribute("data-service");
      });
    });

    var showMsg = function (key) {
      $$(".form-msg", form).forEach(function (m) { m.classList.toggle("show", m.getAttribute("data-msg") === key); });
    };
    var required = $$("[required]", form);
    required.forEach(function (el) {
      el.addEventListener("input", function () {
        if (el.value.trim()) el.closest(".field").classList.remove("invalid");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      required.forEach(function (el) {
        var bad = !el.value.trim();
        el.closest(".field").classList.toggle("invalid", bad);
        el.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) { showMsg("invalid"); firstBad.focus(); return; }

      var val = function (n) { var el = form.elements.namedItem(n); return el ? el.value.trim() : ""; };
      var data = {
        name: val("name"),
        company: val("company"),
        contact: val("contact"),
        service: select ? select.options[select.selectedIndex].getAttribute("data-en") : "",
        date: val("date"),
        message: val("message")
      };
      var endpoint = (form.getAttribute("data-endpoint") || "").trim();
      var btn = $('button[type="submit"]', form);

      if (endpoint) {
        btn.disabled = true;
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset(); showMsg("sent");
        }).catch(function () { showMsg("error"); })
          .then(function () { btn.disabled = false; });
        return;
      }

      // No endpoint configured → hand the inquiry to the visitor's email app
      var to = form.getAttribute("data-mailto") || "info@jarnyod.com";
      var subject = "Project inquiry — " + data.service + (data.company ? " · " + data.company : "");
      var lines = ["Name: " + data.name];
      if (data.company) lines.push("Company: " + data.company);
      lines.push("Contact: " + data.contact, "Service: " + data.service);
      if (data.date) lines.push("Preferred date / deadline: " + data.date);
      lines.push("", data.message);
      var body = lines.join("\n");
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showMsg("mailto");
    });
  }

  /* 9 · MISC -------------------------------------------------------------- */
  // Hide social icons that have no URL yet
  $$(".socials a").forEach(function (a) { if (a.getAttribute("href") === "#") a.remove(); });
  $$(".socials").forEach(function (s) { if (!s.children.length) s.remove(); });

  // Current year in the footer
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
