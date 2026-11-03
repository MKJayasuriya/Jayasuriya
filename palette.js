(function () {
  "use strict";

  var KEY = "jmk-palette";
  var DEFAULT = "green";
  var PALETTES = [
    { id: "green", name: "Green", l: "#1f6b4a", d: "#6fc79c" },
    { id: "ink", name: "Ink Blue", l: "#1f4e8c", d: "#7aa9e6" },
    { id: "terracotta", name: "Terracotta", l: "#b4492a", d: "#e8906f" },
    { id: "plum", name: "Plum", l: "#7a2e6b", d: "#d89acb" },
    { id: "slate", name: "Mono Slate", l: "#3e4a56", d: "#a9b6c3" },
    { id: "teal", name: "Ocean Teal", l: "#0e6f78", d: "#5ccfd6" },
    { id: "saffron", name: "Saffron", l: "#a45f00", d: "#f0b84a" }
  ];

  var doc = document;
  var root = doc.documentElement;

  function find(id) {
    for (var i = 0; i < PALETTES.length; i++) if (PALETTES[i].id === id) return PALETTES[i];
    return null;
  }

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      return find(v) ? v : DEFAULT;
    } catch (_) {
      return DEFAULT;
    }
  }

  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (_) { /* private mode / quota */ }
  }

  var current = read();
  // Apply immediately (script runs in <head>) to avoid a flash of the wrong accent.
  root.dataset.palette = current;

  function swatch(p) {
    var s = doc.createElement("span");
    s.className = "pal-sw";
    s.setAttribute("aria-hidden", "true");
    s.style.setProperty("--sw-l", p.l);
    s.style.setProperty("--sw-d", p.d);
    return s;
  }

  function build(anchor) {
    var wrap = doc.createElement("div");
    wrap.className = "pal";

    var btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "pal-btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Tweaks: accent colour");
    btn.title = "Tweaks: accent colour";
    var btnSw = swatch(find(current));
    var lbl = doc.createElement("span");
    lbl.className = "pal-lbl";
    lbl.textContent = "Tweaks";
    btn.appendChild(btnSw);
    btn.appendChild(lbl);

    var menu = doc.createElement("div");
    menu.className = "pal-menu";
    menu.hidden = true;
    menu.id = "pal-menu-" + Math.random().toString(36).slice(2, 8);
    btn.setAttribute("aria-controls", menu.id);
    var head = doc.createElement("div");
    head.className = "pal-head";
    head.id = menu.id + "-h";
    head.textContent = "Accent";
    menu.appendChild(head);
    var group = doc.createElement("div");
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-labelledby", head.id);
    menu.appendChild(group);

    var opts = [];
    PALETTES.forEach(function (p) {
      var o = doc.createElement("button");
      o.type = "button";
      o.className = "pal-opt";
      o.setAttribute("role", "radio");
      o.dataset.id = p.id;
      o.appendChild(swatch(p));
      var t = doc.createElement("span");
      t.textContent = p.name;
      o.appendChild(t);
      group.appendChild(o);
      opts.push(o);
    });

    function sync() {
      var p = find(current);
      root.dataset.palette = current;
      btnSw.style.setProperty("--sw-l", p.l);
      btnSw.style.setProperty("--sw-d", p.d);
      opts.forEach(function (o) {
        var on = o.dataset.id === current;
        o.setAttribute("aria-checked", String(on));
        o.tabIndex = on ? 0 : -1;
      });
    }

    function open() {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      var on = group.querySelector('[aria-checked="true"]');
      if (on) on.focus();
    }

    function close(refocus) {
      if (menu.hidden) return;
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (refocus) btn.focus();
    }

    btn.addEventListener("click", function () {
      if (menu.hidden) open(); else close(true);
    });

    group.addEventListener("click", function (e) {
      var o = e.target.closest ? e.target.closest(".pal-opt") : null;
      if (!o) return;
      current = o.dataset.id;
      save(current);
      sync();
      close(true);
    });

    menu.addEventListener("keydown", function (e) {
      var i = opts.indexOf(doc.activeElement);
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        opts[(i + 1) % opts.length].focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        opts[(i - 1 + opts.length) % opts.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        opts[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        opts[opts.length - 1].focus();
      }
    });

    doc.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) close(false);
    });

    // Keep multiple tabs in sync.
    window.addEventListener("storage", function (e) {
      if (e.key === KEY) {
        current = read();
        sync();
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    anchor.parentNode.insertBefore(wrap, anchor);
    sync();
  }

  function mount() {
    var anchor = doc.querySelector("[data-theme-toggle], .theme-toggle");
    if (anchor && !doc.querySelector(".pal")) build(anchor);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
