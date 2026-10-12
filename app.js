(function () {
  "use strict";

  var EMAIL = "contact.jayasuriya@gmail.com";
  var PAGES = ["home", "work", "about", "contact"];
  var TOPICS = ["A project", "A crate", "Just hello"];

  var DATA = {
    metrics: [
      { value: "55%", label: "faster login", source: "Auth Server" },
      { value: "60%", label: "fewer event failures", source: "Event Server" },
      { value: "30%", label: "faster API responses", source: "ConsoleNxt" },
      { value: "8,500+", label: "crate downloads", source: "editorjs2html" }
    ],
    products: [
      { name: "Spont", url: "https://spont.nl/", host: "spont.nl", desc: "One of the two major products I worked on as a Rust backend developer at Crypton Tech." },
      { name: "Enzo", url: "https://www.enzoplatform.com/", host: "enzoplatform.com", desc: "The second major product I worked on as a Rust backend developer at Crypton Tech." }
    ],
    services: [
      { n: "01", name: "ConsoleNxt", tag: "Platform", metric: "40%", metricLabel: "less manual effort", bullets: ["Automated workflows for project management, tracking and task assignment, cutting manual effort by 40%.", "Optimized data handling, cutting API response time by 30%, with server-side rendering through Sailfish.", "Built role-based access control (RBAC) and multi-factor authentication (MFA)."], stack: ["Rust", "Axum", "Tokio", "PostgreSQL", "Sailfish"] },
      { n: "02", name: "Auth Server", tag: "Security", metric: "55%", metricLabel: "faster login", bullets: ["Built a secure authentication server that reduced login time by 55%.", "Implemented JWT and session-based authentication."], stack: ["Rust", "Axum", "Ditto", "JWT"] },
      { n: "03", name: "Event Server", tag: "Reliability", metric: "60%", metricLabel: "fewer failures", bullets: ["Developed an event server that reduced processing time by 55%.", "Added event filtering, queuing and retry mechanisms, cutting failures by 60%."], stack: ["Rust", "Axum", "Ditto"] }
    ],
    oss: [
      { name: "log_args", tag: "Crate", meta: "3,100+ downloads", desc: "A procedural macro that logs function arguments using the tracing crate.", links: [{ label: "crates.io", url: "https://crates.io/crates/log_args" }, { label: "Source", url: "https://github.com/MKJSM/rs-log-args" }] },
      { name: "editorjs2html", tag: "Crate", meta: "8,500+ downloads", desc: "Converts Editor.js JSON output into clean HTML, with custom converters for different block types.", links: [{ label: "crates.io", url: "https://crates.io/crates/editorjs2html" }, { label: "Source", url: "https://github.com/MKJS57/editorjs2html" }] },
      { name: "File Sharing App", tag: "Live demo", meta: "", desc: "A web app for sharing files, deployed and running online.", links: [{ label: "Open the app", url: "https://share-file-h803.onrender.com/" }] },
      { name: "JSON Formatter", tag: "Dev tool", meta: "Runs in your browser", desc: "Pretty-prints or minifies JSON without rounding large integers or reordering keys. It also reads Rust debug output, key=value log lines and JSON hidden inside strings, with find and replace, code folding and exact error locations.", links: [{ label: "Open the formatter", url: "JSON_Formatter.html" }] },
      { name: "JSON Diff", tag: "Dev tool", meta: "Runs in your browser", desc: "Compares two JSON documents field by field and shows what changed, was added or was removed. Array items can be matched by position, by a key or with order ignored, and the results can be filtered, searched and copied as a report.", links: [{ label: "Open the diff tool", url: "JSON_Diff.html" }] }
    ],
    skills: [
      { title: "Language and data", coreText: "Rust, PostgreSQL", restText: "SQL, HTML" },
      { title: "Web and runtime", coreText: "Axum, server-side rendering, WebSockets", restText: "Tokio, Sailfish" },
      { title: "Security", coreText: "JWT, session auth", restText: "RBAC, MFA" }
    ],
    achievements: [
      "Web Designing, inter-college competition",
      "Debugging, inter-college competition",
      "National level Project Preparation"
    ]
  };

  /* ── Helpers ──────────────────────────────────── */

  var doc = document;
  var root = doc.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function el(tag, cls, attrs) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function txt(parent, s) {
    parent.appendChild(doc.createTextNode(s));
  }

  function $(sel) { return doc.querySelector(sel); }
  function $$(sel) { return doc.querySelectorAll(sel); }

  /* ── Theme ───────────────────────────────────── */

  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function readPref() {
    try { return localStorage.getItem("jmk-theme"); } catch (_) { return null; }
  }

  function savePref(v) {
    try { localStorage.setItem("jmk-theme", v); } catch (_) { /* quota / private */ }
  }

  function isDark() {
    var pref = readPref();
    if (pref === "dark") return true;
    if (pref === "light") return false;
    return systemDark.matches;
  }

  function applyTheme() {
    var dark = isDark();
    var pref = readPref();
    if (pref) {
      root.dataset.theme = pref;
    } else {
      delete root.dataset.theme;
    }
    var toggle = $(".theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-checked", String(dark));
      toggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
      var label = toggle.querySelector(".toggle-label");
      if (label) label.textContent = dark ? "Dark" : "Light";
    }
  }

  function toggleTheme() {
    var dark = isDark();
    savePref(dark ? "light" : "dark");
    applyTheme();
  }

  /* ── Scroll progress + active nav ────────────── */

  var progBar = $(".scroll-progress");
  var navLinks = $$(".nav-link");

  function onScroll() {
    var scrollY = window.scrollY;
    var maxScroll = doc.documentElement.scrollHeight - window.innerHeight;
    if (progBar && maxScroll > 0) {
      progBar.style.transform = "scaleX(" + (scrollY / maxScroll) + ")";
    }

    // Active nav: last section whose top <= 140; at page bottom => contact
    var active = PAGES[0];
    var atBottom = scrollY + window.innerHeight >= doc.documentElement.scrollHeight - 2;
    if (atBottom) {
      active = "contact";
    } else {
      PAGES.forEach(function (id) {
        var sect = doc.getElementById(id);
        if (sect && sect.getBoundingClientRect().top <= 140) {
          active = id;
        }
      });
    }
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + active;
      link.classList.toggle("active", isActive);
    });

    // Portrait parallax
    if (!reducedMotion.matches) {
      var heroImg = $("#home img");
      if (heroImg && scrollY < 1.2 * window.innerHeight) {
        heroImg.style.objectPosition = "50% calc(15% + " + (scrollY * 0.04) + "px)";
      }
    }
  }

  /* ── Reveal (IntersectionObserver) ────────────── */

  function setupReveals() {
    var rvEls = $$("[data-rv]");

    if (reducedMotion.matches) {
      rvEls.forEach(function (el) { el.dataset.in = ""; });
      return;
    }

    rvEls.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.dataset.in = "";
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.dataset.in = "";
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    rvEls.forEach(function (el) { observer.observe(el); });

    setTimeout(function () {
      $$("[data-rv]").forEach(function (el) {
        if (!el.hasAttribute("data-in")) {
          el.dataset.in = "";
        }
      });
      observer.disconnect();
    }, 3000);
  }

  /* ── Hero h1 word-split ──────────────────────── */

  function splitHeroWords() {
    var h1 = $("[data-rv='h1']");
    if (!h1) return;
    var walker = doc.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function (node) {
      var words = node.textContent.split(/(\s+)/);
      var frag = doc.createDocumentFragment();
      var wordIdx = 0;
      words.forEach(function (w) {
        if (/^\s+$/.test(w)) {
          frag.appendChild(doc.createTextNode(w));
        } else {
          var span = el("span", "w");
          span.style.transitionDelay = (180 + wordIdx * 55) + "ms";
          span.textContent = w;
          frag.appendChild(span);
          wordIdx++;
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ── Stagger --rd for reveal groups ──────────── */

  function staggerReveals() {
    var containers = [
      ".metrics-section",
      ".products-grid",
      ".services-section",
      ".oss-grid",
      ".skills-grid",
      ".edu-achieve-grid",
      "#contact"
    ];
    containers.forEach(function (sel) {
      var wrap = $(sel);
      if (!wrap) return;
      var children = wrap.querySelectorAll("[data-rv]");
      children.forEach(function (child, i) {
        child.style.setProperty("--rd", Math.min(i, 5) * 90 + "ms");
      });
    });
  }

  /* ── Render helpers ──────────────────────────── */

  function renderMetrics() {
    var container = $(".metrics-section");
    if (!container) return;
    DATA.metrics.forEach(function (m) {
      var div = el("div", "metric-item");
      div.dataset.rv = "";
      var val = el("span", "metric-value");
      val.textContent = m.value;
      var lab = el("span", "metric-label");
      lab.textContent = m.label;
      var src = el("span", "metric-source");
      src.textContent = m.source;
      div.appendChild(val);
      div.appendChild(lab);
      div.appendChild(src);
      container.appendChild(div);
    });
  }

  function renderProducts() {
    var container = $(".products-grid");
    if (!container) return;
    DATA.products.forEach(function (p) {
      var a = el("a", "product-card", {
        href: p.url,
        target: "_blank",
        rel: "noopener"
      });
      a.dataset.bump = "card";
      a.dataset.rv = "";

      var top = el("span", "product-card-top");
      var t1 = el("span"); t1.textContent = "Major product";
      var t2 = el("span"); t2.textContent = "Production";
      top.appendChild(t1);
      top.appendChild(t2);

      var bot = el("span", "product-card-bottom");
      var name = el("span", "product-name");
      name.textContent = p.name;
      var desc = el("span", "product-desc");
      desc.textContent = p.desc;
      var link = el("span", "product-link");
      link.textContent = "Visit " + p.host + " \u2197";
      bot.appendChild(name);
      bot.appendChild(desc);
      bot.appendChild(link);

      a.appendChild(top);
      a.appendChild(bot);
      container.appendChild(a);
    });
  }

  function renderServices() {
    var container = $(".services-container");
    if (!container) return;
    DATA.services.forEach(function (s) {
      var article = el("article", "service-article");
      article.dataset.rv = "";

      var meta = el("div", "service-meta");
      var nTag = el("span", "service-n-tag");
      nTag.textContent = s.n + " \u2014 " + s.tag;
      var h3 = el("h3", "service-name");
      h3.textContent = s.name;
      var mWrap = el("span", "service-metric-wrap");
      var mVal = el("span", "service-metric-val");
      mVal.textContent = s.metric;
      var mLbl = el("span", "service-metric-lbl");
      mLbl.textContent = s.metricLabel;
      mWrap.appendChild(mVal);
      mWrap.appendChild(mLbl);
      meta.appendChild(nTag);
      meta.appendChild(h3);
      meta.appendChild(mWrap);

      var detail = el("div", "service-detail");
      var ul = el("ul", "service-bullets");
      s.bullets.forEach(function (b) {
        var li = el("li", "service-bullet");
        var dash = el("span", "bullet-dash");
        dash.textContent = "\u2014";
        var text = el("span");
        text.textContent = b;
        li.appendChild(dash);
        li.appendChild(text);
        ul.appendChild(li);
      });
      detail.appendChild(ul);

      var stackDiv = el("div", "service-stack");
      s.stack.forEach(function (t) {
        var chip = el("span", "stack-chip");
        chip.textContent = t;
        stackDiv.appendChild(chip);
      });
      detail.appendChild(stackDiv);

      article.appendChild(meta);
      article.appendChild(detail);
      container.appendChild(article);
    });
  }

  // JSON Tools links open in same tab; other oss links open in new tab
  function isLocalToolLink(url) {
    return url === "JSON_Formatter.html" || url === "JSON_Diff.html";
  }

  function renderOss() {
    var container = $(".oss-grid");
    if (!container) return;
    DATA.oss.forEach(function (o) {
      var article = el("article", "oss-article");
      article.dataset.rv = "";

      var tagLine = el("span", "oss-tag-line");
      var tag = el("span"); tag.textContent = o.tag;
      var meta = el("span", "oss-tag-meta"); meta.textContent = o.meta;
      tagLine.appendChild(tag);
      tagLine.appendChild(meta);

      var h3 = el("h3", "oss-name");
      h3.textContent = o.name;

      var desc = el("p", "oss-desc");
      desc.textContent = o.desc;

      var links = el("div", "oss-links");
      o.links.forEach(function (l) {
        var a = el("a");
        a.href = l.url;
        if (isLocalToolLink(l.url)) {
          // Same-tab navigation for JSON tool pages
          a.textContent = l.label + " \u2192";
        } else {
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = l.label + " \u2197";
        }
        links.appendChild(a);
      });

      article.appendChild(tagLine);
      article.appendChild(h3);
      article.appendChild(desc);
      article.appendChild(links);
      container.appendChild(article);
    });
  }

  function renderSkills() {
    var container = $(".skills-grid");
    if (!container) return;
    DATA.skills.forEach(function (g) {
      var div = el("div", "skill-item");
      div.dataset.rv = "";
      var title = el("h3", "skill-title"); title.textContent = g.title;
      var core = el("p", "skill-core"); core.textContent = g.coreText;
      var rest = el("p", "skill-rest"); rest.textContent = g.restText;
      div.appendChild(title);
      div.appendChild(core);
      div.appendChild(rest);
      container.appendChild(div);
    });
  }

  function renderAchievements() {
    var container = $(".achievements-container");
    if (!container) return;
    DATA.achievements.forEach(function (a) {
      var div = el("div", "achievement-item");
      div.dataset.rv = "";
      var rank = el("span", "achievement-rank");
      rank.textContent = "1st";
      var text = el("span");
      text.textContent = a;
      div.appendChild(rank);
      div.appendChild(text);
      container.appendChild(div);
    });
  }

  /* ── Topics (radiogroup) ─────────────────────── */

  function setupTopics() {
    var group = $("[role='radiogroup']");
    if (!group) return;

    var currentTopic = TOPICS[0];

    function selectRadio(btn) {
      var btns = group.querySelectorAll("[role='radio']");
      btns.forEach(function (b) {
        var isChecked = b === btn;
        b.setAttribute("aria-checked", String(isChecked));
        b.setAttribute("tabindex", isChecked ? "0" : "-1");
      });
      currentTopic = btn.textContent;
    }

    function renderTopics() {
      group.textContent = "";
      TOPICS.forEach(function (label) {
        var isChecked = label === currentTopic;
        var btn = el("button", "topic-btn", {
          type: "button",
          role: "radio",
          "aria-checked": String(isChecked),
          tabindex: isChecked ? "0" : "-1"
        });
        btn.dataset.bump = "";
        btn.textContent = label;
        btn.addEventListener("click", function () {
          selectRadio(btn);
        });
        group.appendChild(btn);
      });
    }

    // Arrow-key navigation per radiogroup pattern
    group.addEventListener("keydown", function (e) {
      var btns = Array.from(group.querySelectorAll("[role='radio']"));
      var idx = btns.indexOf(doc.activeElement);
      if (idx < 0) idx = btns.indexOf(e.target);
      if (idx < 0) return;
      var next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (idx + 1) % btns.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (idx - 1 + btns.length) % btns.length;
      }
      if (next >= 0) {
        e.preventDefault();
        selectRadio(btns[next]);
        btns[next].focus();
      }
    });

    renderTopics();

    // Expose getter for form submit
    return function () { return currentTopic; };
  }

  /* ── Copy email ──────────────────────────────── */

  function setupCopy() {
    var btn = $(".btn-copy");
    if (!btn) return;
    var timer;

    btn.addEventListener("click", function () {
      clearTimeout(timer);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(EMAIL).then(function () {
          btn.textContent = "Copied";
          timer = setTimeout(function () { btn.textContent = "Copy"; }, 1600);
        }, function () {
          btn.textContent = "Select it";
          timer = setTimeout(function () { btn.textContent = "Copy"; }, 1600);
        });
      } else {
        btn.textContent = "Select it";
        timer = setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      }
    });
  }

  /* ── Char counter ────────────────────────────── */

  function setupCounter() {
    var textarea = $("textarea[name='message']");
    var counter = $(".msg-counter");
    if (!textarea || !counter) return;
    function update() {
      counter.textContent = textarea.value.length + " / 1000";
    }
    textarea.addEventListener("input", update);
    update();
  }

  /* ── Contact form ────────────────────────────── */

  function setupForm(getTopic) {
    var form = $(".contact-form");
    if (!form) return;
    var status = form.querySelector("[role='status']");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = "Please fill in your name, email and message.";
        status.style.color = "var(--ink2)";
        return;
      }

      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(email)) {
        status.textContent = "That email address does not look right. Please check it.";
        status.style.color = "var(--ink2)";
        return;
      }

      var topic = getTopic ? getTopic() : TOPICS[0];
      var subject = encodeURIComponent(topic + ": message from " + name);
      var body = encodeURIComponent(message + "\n\n" + name + "\n" + email);
      var href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;

      var a = doc.createElement("a");
      a.href = href;
      a.click();

      status.textContent = "Your email app should open with the draft. If nothing opens, copy my address and paste your message into a new email.";
      status.style.color = "var(--accent)";
    });
  }

  /* ── Portrait fallback ───────────────────────── */

  function setupPortrait() {
    var img = $("#home img");
    if (!img) return;
    img.addEventListener("error", function () {
      var placeholder = el("div", "portrait-placeholder");
      placeholder.textContent = "JMK";
      placeholder.setAttribute("aria-label", "Portrait of Jayasuriya MK");
      placeholder.setAttribute("role", "img");
      img.parentNode.replaceChild(placeholder, img);
    });
  }

  /* ── Init ─────────────────────────────────────── */

  function init() {
    applyTheme();
    systemDark.addEventListener("change", applyTheme);

    var toggle = $(".theme-toggle");
    if (toggle) toggle.addEventListener("click", toggleTheme);

    // Render dynamic sections
    renderMetrics();
    renderProducts();
    renderServices();
    renderOss();
    renderSkills();
    renderAchievements();

    // Hero word-split before reveal observer hooks
    splitHeroWords();

    // Stagger delays
    staggerReveals();

    // Reveals
    setupReveals();

    // Portrait fallback
    setupPortrait();

    // Topics
    var getTopic = setupTopics();

    // Copy
    setupCopy();

    // Counter
    setupCounter();

    // Form
    setupForm(getTopic);

    // Scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
