(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function readPref() {
    try {
      return localStorage.getItem("jmk-theme");
    } catch (_) {
      return null;
    }
  }

  function savePref(v) {
    try {
      localStorage.setItem("jmk-theme", v);
    } catch (_) {
      /* quota / private mode */
    }
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
    var toggles = doc.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];
      toggle.setAttribute("role", "switch");
      toggle.setAttribute("aria-checked", String(dark));
      toggle.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
      toggle.title = dark ? "Switch to light mode" : "Switch to dark mode";
      var label = toggle.querySelector(".site-toggle-label, .toggle-label");
      if (label) {
        label.textContent = dark ? "Dark" : "Light";
      }
    }
  }

  function toggleTheme() {
    var dark = isDark();
    savePref(dark ? "light" : "dark");
    applyTheme();
  }

  // Apply immediately upon execution (to avoid flash of incorrect theme)
  applyTheme();

  // Listen for system theme changes
  if (systemDark.addEventListener) {
    systemDark.addEventListener("change", applyTheme);
  } else if (systemDark.addListener) {
    systemDark.addListener(applyTheme);
  }

  function bindToggles() {
    applyTheme();
    var toggles = doc.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < toggles.length; i++) {
      var toggle = toggles[i];
      if (!toggle.__themeBound) {
        toggle.__themeBound = true;
        toggle.addEventListener("click", toggleTheme);
      }
    }
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", bindToggles);
  } else {
    bindToggles();
  }
})();
