/* Nav active state — marks the pill matching the current page.
   Compares the page only, not the query, so a view switcher such as
   maps.html?view=HazardMap still keeps its nav item lit. */
(function setActiveNavPill() {
  var here = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-pill').forEach(function (pill) {
    var target = pill.getAttribute('href').split(/[?#]/)[0];
    if (target === here) pill.classList.add('active');
  });
})();
