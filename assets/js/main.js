/* Shared chrome behaviour: nav active state and the phone menu. */
(function () {
  "use strict";

  var nav = document.querySelector(".head-nav");
  if (!nav) return;

  /* Active state. Matches the page only, not the query, so a view switcher
     such as maps.html?view=HazardMap keeps its nav item lit. */
  var here = window.location.pathname.split("/").pop() || "index.html";
  nav.querySelectorAll(".nav-pill").forEach(function (pill) {
    var target = pill.getAttribute("href").split(/[?#]/)[0];
    if (target === here) pill.classList.add("active");
  });

  /* Phone menu. Built here rather than in the markup so the navigation still
     shows in full when scripting is unavailable. */
  var toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "site-menu");
  toggle.innerHTML = '<span class="nav-toggle-bars"><span></span></span><span class="nav-toggle-label">Menu</span>';
  nav.id = "site-menu";
  nav.parentNode.insertBefore(toggle, nav);

  var label = toggle.querySelector(".nav-toggle-label");

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    label.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Leaving phone width should not strand the menu in its open state.
  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) setOpen(false);
  });
})();
