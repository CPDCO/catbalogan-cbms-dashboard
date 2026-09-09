/* Nav active state — marks the pill matching the current page. */
(function setActiveNavPill() {
  var here = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-pill').forEach(function (pill) {
    var target = pill.getAttribute('href').split(/[?#]/)[0];
    if (target === here) pill.classList.add('active');
  });
})();
